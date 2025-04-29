const request = require('supertest');
const bcrypt = require('bcrypt');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('./user-model');
const mongoose = require('mongoose'); // Asegúrate de importar mongoose

let mongoServer;
let app;

jest.setTimeout(10000);

const sendAddUserRequest = (payload) => request(app).post('/adduser').send(payload);

const validUser = {
  username: 'testuser',
  email: 'testuser@example.com',
  password: 'Testpass1',
  confirmPassword: 'Testpass1',
};

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  process.env.MONGODB_URI = mongoUri;
  app = require('./user-service');
});

afterAll(async () => {
  await User.deleteMany();
});

afterAll(async () => {
  app.close();
  await mongoServer.stop();
});

describe('User Service', () => {
  beforeEach(async () => {
    await User.deleteMany(); // Limpia la base de datos antes de cada test
  });

  it('should add a new user on POST /adduser', async () => {
    const response = await sendAddUserRequest(validUser);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body.user).toHaveProperty('username', validUser.username);
    expect(response.body.user).toHaveProperty('email', validUser.email);

    const userInDb = await User.findOne({ username: validUser.username });
    expect(userInDb).not.toBeNull();
    expect(userInDb.username).toBe(validUser.username);
    expect(userInDb.email).toBe(validUser.email);

    const isPasswordValid = await bcrypt.compare(validUser.password, userInDb.password);
    expect(isPasswordValid).toBe(true);
  });

  it('should return 400 if required fields are missing in /adduser', async () => {
    const response = await sendAddUserRequest({ username: 'testuser' });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('should return 400 if passwords do not match in /adduser', async () => {
    const response = await sendAddUserRequest({
      ...validUser,
      confirmPassword: 'DifferentPass1',
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Las contraseñas no coinciden');
  });

  it('should return 400 if username is too short', async () => {
    const response = await sendAddUserRequest({
      ...validUser,
      username: 'abc',
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'El nombre de usuario debe tener al menos 4 caracteres');
  });

  it('should return 400 if password is too weak', async () => {
    const response = await sendAddUserRequest({
      ...validUser,
      password: 'weakpass',
      confirmPassword: 'weakpass',
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'La contraseña debe tener al menos 7 caracteres, uno de ellos mayúscula y otro un número');
  });

  it('should return 400 if email is invalid', async () => {
    const response = await sendAddUserRequest({
      ...validUser,
      email: 'invalid-email',
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Formato de email inválido');
  });

  it('should return 400 if user already exists in /adduser', async () => {
    await sendAddUserRequest(validUser);

    const response = await sendAddUserRequest(validUser);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Ya se ha registrado un usuario con ese email o nombre de usuario');
  });

  it('should return user history on GET /getUserHistory/:username', async () => {
    const user = new User({
      username: validUser.username,
      email: validUser.email,
      password: await bcrypt.hash(validUser.password, 10),
      contests: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()], // Convierte los valores a ObjectId
    });
    await user.save();

    const response = await request(app).get(`/getUserHistory/${validUser.username}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('contests');
    expect(response.body.contests.length).toBe(2); // Verifica que hay 2 concursos
  });

  it('should return 404 if user is not found in /getUserHistory/:username', async () => {
    const response = await request(app).get('/getUserHistory/nonexistentuser');
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'User not found');
  });

  it('should return ranking on GET /getranking', async () => {
    const users = [
      { username: 'user1', email: 'user1@example.com', password: 'Testpass1', points: 100 },
      { username: 'user2', email: 'user2@example.com', password: 'Testpass2', points: 200 },
    ];
    await User.insertMany(users);

    const response = await request(app).get('/getranking');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('users');
    expect(response.body.users.length).toBe(2);
    expect(response.body.users[0].username).toBe('user2'); // Ordenado por puntos
    expect(response.body.users[1].username).toBe('user1');
  });

  it('should return health status OK', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'OK' });
  });

  it('should update user points and add contest ID on POST /savegame', async () => {
    // Crear un usuario de prueba
    const user = new User({
      username: validUser.username,
      email: validUser.email,
      password: await bcrypt.hash(validUser.password, 10),
      points: 100,
      contests: [],
    });
    await user.save();

    // Datos de prueba para la solicitud
    const saveGamePayload = {
      username: validUser.username,
      points: 50,
      id: new mongoose.Types.ObjectId().toString(), // ID del concurso
    };

    // Realizar la solicitud POST a /savegame
    const response = await request(app).post('/savegame').send(saveGamePayload);

    // Verificar que la respuesta sea correcta
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Game saved successfully');

    // Verificar que los puntos del usuario se hayan actualizado
    const updatedUser = await User.findOne({ username: validUser.username });
    expect(updatedUser).not.toBeNull();
    expect(updatedUser.points).toBe(150); // 100 puntos iniciales + 50 puntos nuevos

    // Verificar que el ID del concurso se haya agregado a la lista de concursos
    expect(updatedUser.contests.map(String)).toContain(saveGamePayload.id);
  });

  it('should update an existing user on PUT /profile/edit/:username', async () => {
    // Crear un usuario inicial en la base de datos
    const user = new User({
      username: validUser.username,
      email: validUser.email,
      password: await bcrypt.hash(validUser.password, 10),
      contests: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()],
    });
    await user.save();

    const updatedData = { email: 'updated@example.com', username: 'updateduser' };
    const response = await request(app)
      .put(`/profile/edit/${user.username}`)
      .send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Perfil actualizado exitosamente.');

    const userInDb = await User.findOne({ username: updatedData.username });
    expect(userInDb).not.toBeNull();
    expect(userInDb.email).toBe(updatedData.email);
    expect(userInDb.username).toBe(updatedData.username);
  });

  it('should return 404 if the user to update is not found', async () => {
    const updatedData = { email: 'updated@example.com', username: 'nonexistentuser' };
    const response = await request(app)
        .put(`/profile/edit/${updatedData.username}`)
        .send(updatedData);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Usuario no encontrado.');
  });

  it('should return 400 if trying to update with an already existing email', async () => {
    const user1 = new User(validUser);
    await user1.save();
    const user2 = new User({ ...validUser, username: 'existinguser', email: 'existing@example.com' });
    await user2.save();

    const updatedData = { email: 'existing@example.com', username: 'newuser'};
    const response = await request(app)
        .put(`/profile/edit/${user1.username}`)
        .send(updatedData);

    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty('error', 'El correo electrónico ya está en uso.');
  });

  it('should allow updating only the email', async () => {
    const initialUser = new User(validUser);
    await initialUser.save();

    const updatedData = { email: 'onlyemailupdated@example.com', username: initialUser.username };
    const response = await request(app)
      .put(`/profile/edit/${initialUser.username}`)
      .send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Perfil actualizado exitosamente.');

    const userInDb = await User.findOne({ username: validUser.username });
    expect(userInDb).not.toBeNull();
    expect(userInDb.email).toBe(updatedData.email);
    expect(userInDb.username).toBe(validUser.username); // El username no debería cambiar
  });

  it('should allow updating only the username', async () => {
    const initialUser = new User(validUser);
    await initialUser.save();

    const updatedData = { email: initialUser.email, username: 'onlyusernameupdated' };
    const response = await request(app)
      .put(`/profile/edit/${validUser.username}`)
      .send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Perfil actualizado exitosamente.');

    const userInDb = await User.findOne({ username: updatedData.username });
    expect(userInDb).not.toBeNull();
    expect(userInDb.email).toBe(validUser.email); // El email no debería cambiar
  });

});

describe('PUT /profile/changePassword/:username', () => {
  let testUser;
  const endpoint = (username) => `/profile/changePassword/${username}`;

  beforeEach(async () => {
    await User.deleteMany();
    testUser = new User({
      username: 'testchange',
      email: 'testchange@example.com',
      password: await bcrypt.hash('OldPass1', 10),
    });
    await testUser.save();
  });

  const sendRequest = (username, body) => request(app).put(endpoint(username)).send(body);

  it('should successfully change the password', async () => {
    const response = await sendRequest(testUser.username, {
      currentPassword: 'OldPass1',
      newPassword: 'NewPass2!',
      repeatPassword: 'NewPass2!',
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Contraseña modificada exitosamente.', modifiedCount: 1 });

    const updatedUser = await User.findOne({ username: testUser.username });
    expect(await bcrypt.compare('NewPass2!', updatedUser.password)).toBe(true);
    expect(await bcrypt.compare('OldPass1', updatedUser.password)).toBe(false);
  });

  it('should return 404 if the user is not found', async () => {
    const response = await sendRequest('nonexistentuser', {
      currentPassword: 'OldPass1',
      newPassword: 'NewPass2!',
      repeatPassword: 'NewPass2!',
    });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Usuario no encontrado' });
  });

  it('should return 409 if the current password is incorrect', async () => {
    const response = await sendRequest(testUser.username, {
      currentPassword: 'WrongPassword',
      newPassword: 'NewPass2!',
      repeatPassword: 'NewPass2!',
    });

    expect(response.status).toBe(409);
    expect(response.body).toEqual({ error: 'Contraseña actual errónea' });
  });

  it('should return 409 if the new password format is invalid', async () => {
    const response = await sendRequest(testUser.username, {
      currentPassword: 'OldPass1',
      newPassword: 'weak',
      repeatPassword: 'weak',
    });

    expect(response.status).toBe(409);
    expect(response.body).toEqual({ error: 'Formato inválido' });
  });

  it('should return 409 if the new and repeated passwords do not match', async () => {
    const response = await sendRequest(testUser.username, {
      currentPassword: 'OldPass1',
      newPassword: 'NewPass2!',
      repeatPassword: 'DifferentPass!',
    });

    expect(response.status).toBe(409);
    expect(response.body).toEqual({ error: 'Las contraseñas deben ser iguales' });
  });

  describe('should return 500 if required fields are missing', () => {
    const requiredFields = ['newPassword', 'repeatPassword', 'currentPassword'];

    it.each(requiredFields)('missing %s', async (field) => {
      const payload = {
        currentPassword: 'OldPass1',
        newPassword: 'NewPass2!',
        repeatPassword: 'NewPass2!',
      };
      delete payload[field];

      const response = await sendRequest(testUser.username, payload);
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: `Missing required field: ${field}` });
    });
  });
});