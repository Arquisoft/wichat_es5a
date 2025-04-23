const request = require('supertest');
const bcrypt = require('bcrypt');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('./user-model');

let mongoServer;
let app;

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
    const newUser = {
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'Testpass1',
      confirmPassword: 'Testpass1'
    };

    const response = await request(app).post('/adduser').send(newUser);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body.user).toHaveProperty('username', 'testuser');
    expect(response.body.user).toHaveProperty('email', 'testuser@example.com');

    // Check if the user is inserted into the database
    const userInDb = await User.findOne({ username: 'testuser' });

    // Assert that the user exists in the database
    expect(userInDb).not.toBeNull();
    expect(userInDb.username).toBe('testuser');
    expect(userInDb.email).toBe('testuser@example.com');

    // Assert that the password is encrypted
    const isPasswordValid = await bcrypt.compare('Testpass1', userInDb.password);
    expect(isPasswordValid).toBe(true);
  });

  it('should return 400 if required fields are missing in /adduser', async () => {
    const response = await request(app).post('/adduser').send({ username: 'testuser' });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('should return 400 if passwords do not match in /adduser', async () => {
    const response = await request(app)
      .post('/adduser')
      .send({
        username: 'usernomatch',
        email: 'usernomatch@example.com',
        password: 'Pass1234',
        confirmPassword: 'diff1234'
      });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Las contraseñas no coinciden');
  });

  it('should return 400 if username is too short', async () => {
    const response = await request(app).post('/adduser').send({
      username: 'abc',
      email: 'abc@example.com',
      password: 'valid123',
      confirmPassword: 'valid123'
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('should return 400 if password is too weak', async () => {
    const response = await request(app).post('/adduser').send({
      username: 'stronguser',
      email: 'stronguser@example.com',
      password: 'abcdefg', // No contiene el número
      confirmPassword: 'abcdefg'
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('should return 400 if email is invalid', async () => {
    const response = await request(app).post('/adduser').send({
      username: 'bademailuser',
      email: 'not-an-email',
      password: 'testpass1',
      confirmPassword: 'testpass1'
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Formato de email inválido');
  });


  it('should return 400 if user already exists in /adduser', async () => {
    const user = {
      username: 'existinguser',
      email: 'existing@example.com',
      password: 'testpass1',
      confirmPassword: 'testpass1'
    };

    await request(app).post('/adduser').send(user);

    const response = await request(app).post('/adduser').send(user);
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
