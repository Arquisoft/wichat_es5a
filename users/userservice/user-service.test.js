const request = require('supertest');
const bcrypt = require('bcrypt');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('./user-model');

let mongoServer;
let app;

const sendAddUserRequest = (payload) => request(app).post('/adduser').send(payload);

const validUser = {
  username: 'testuser',
  email: 'testuser@example.com',
  password: 'Testpass1',
  confirmPassword: 'Testpass1'
};

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  process.env.MONGODB_URI = mongoUri;
  app = require('./user-service'); 
});

afterAll(async () => {
    app.close();
    await mongoServer.stop();
});

describe('User Service', () => {
  it('should add a new user on POST /adduser', async () => {
    const response = await sendAddUserRequest(validUser);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body.user).toHaveProperty('username', validUser.username);
    expect(response.body.user).toHaveProperty('email', validUser.email);

    // Check if the user is inserted into the database
    const userInDb = await User.findOne({username: validUser.username });

    // Assert that the user exists in the database
    expect(userInDb).not.toBeNull();
    expect(userInDb.username).toBe(validUser.username);
    expect(userInDb.email).toBe(validUser.email);

    // Assert that the password is encrypted
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
      username: 'usernomatch',
      email: 'usernomatch@example.com',
      confirmPassword: 'diffpass1'
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Las contraseñas no coinciden');
  });

  it('should return 400 if username is too short', async () => {
    const response = await sendAddUserRequest({
      ...validUser,
      username: 'abc'
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('should return 400 if password is too weak', async () => {
    const response = await sendAddUserRequest({
      ...validUser,
      username: 'weakuser',
      password: 'abcdefg',
      confirmPassword: 'abcdefg'
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('should return 400 if email is invalid', async () => {
    const response = await sendAddUserRequest({
      ...validUser,
      email: 'not-an-email'
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Formato de email inválido');
  });


  it('should return 400 if user already exists in /adduser', async () => {
    await sendAddUserRequest({
      ...validUser,
      username: 'existinguser',
      email: 'existing@example.com'
    });

    const response = await sendAddUserRequest({
      ...validUser,
      username: 'existinguser',
      email: 'existing@example.com'
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('should return 403 with invalid token', async () => {
    const response = await request(app)
      .get('/profile')
      .set('Authorization', 'Bearer invalidtoken');

    expect(response.status).toBe(403);
  });

  it('should return 401 with missing token', async () => {
    const response = await request(app)
      .get('/profile');

    expect(response.status).toBe(401);
  });

  it('should return health status OK', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'OK' });
  });
});
