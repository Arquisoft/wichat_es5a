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

});
