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
      //email: 'testuser@example.com',
      password: 'testpassword',
    };

    const response = await request(app).post('/adduser').send(newUser);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body.user).toHaveProperty('username', 'testuser');
    // Descomentar cuando estén implementados los tests.
    //expect(response.body.user).toHaveProperty('email', 'testuser@example.com');

    // Check if the user is inserted into the database
    const userInDb = await User.findOne({ username: 'testuser' });

    // Assert that the user exists in the database
    expect(userInDb).not.toBeNull();
    expect(userInDb.username).toBe('testuser');
    // Descomentar cuando estén implementados los tests.
    //expect(userInDb.email).toBe('testuser@example.com');

    // Assert that the password is encrypted
    const isPasswordValid = await bcrypt.compare('testpassword', userInDb.password);
    expect(isPasswordValid).toBe(true);
  });

  it('should return 400 if required fields are missing in /adduser', async () => {
    const response = await request(app).post('/adduser').send({ username: 'testuser' });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('should return 400 if user already exists in /adduser', async () => {
    await request(app)
      .post('/adduser')
      .send({ username: 'testuser', password: 'password123' });

    const response = await request(app)
      .post('/adduser')
      .send({ username: 'testuser', password: 'password123' });

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
