const request = require('supertest');
const axios = require('axios');
const app = require('./gateway-service');

afterAll(async () => {
  app.close();
});

jest.mock('axios');

describe('Gateway Service', () => {
  // Mock responses from external services
  axios.post.mockImplementation((url, data) => {
    if (url.endsWith('/login')) {
      return Promise.resolve({ data: { token: 'mockedToken' } });
    } else if (url.endsWith('/adduser')) {
      return Promise.resolve({ data: { userId: 'mockedUserId' } });
    } else if (url.endsWith('/ask')) {
      return Promise.resolve({ data: { answer: 'llmanswer' } });
    } else if (url.endsWith('/questions/city')) {
      return Promise.resolve({ data: { answer: 'questions' } });
    }
  });

  axios.get.mockImplementation((url) => {
    if (url.endsWith('/gethistory')) {
      return Promise.resolve({ data: { userCount: 10, questionCount: 5 } });
    }
  });

  // Test /login endpoint
  it('should forward login request to auth service', async () => {
    const response = await request(app)
      .post('/login')
      .send({ username: 'testuser', password: 'testpassword' });

    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBe('mockedToken');
  });

  // Test /adduser endpoint
  it('should forward add user request to user service', async () => {
    const response = await request(app)
      .post('/adduser')
      .send({ username: 'newuser', password: 'newpassword' });

    expect(response.statusCode).toBe(200);
    expect(response.body.userId).toBe('mockedUserId');
  });

  // Test /askllm endpoint
  it('should forward askllm request to the llm service', async () => {
    const response = await request(app)
      .post('/askllm')
      .send({ question: 'question', apiKey: 'apiKey', model: 'gemini' });

    expect(response.statusCode).toBe(200);
    expect(response.body.answer).toBe('llmanswer');
  });

  // Test /questions endpoint
  it('should forward questions request to the wiki service', async () => {
    const response = await request(app)
      .post('/questions/city');

    expect(response.statusCode).toBe(200);
    expect(response.body.answer).toBe('questions');
  });

  // Test /history endpoint
  it('should forward history request to the history service', async () => {
    const response = await request(app)
      .get('/gethistory');

      expect(response.statusCode).toBe(200);
      expect(response.body.userCount).toBe(10);
      expect(response.body.questionCount).toBe(5);
  });

  // Test /health endpoint
  it('should return 200 and a health status message', async () => {
    const response = await request(app)
      .get('/health');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: 'OK' });
  });

  // Test /profile endpoint
  it('should forward profile request to the user service', async () => {
    axios.get.mockResolvedValueOnce({ data: { username: 'testuser', email: 'testuser@example.com' } });
  
    const response = await request(app)
      .get('/profile')
      .set('Authorization', 'Bearer mockedToken');
  
    expect(response.statusCode).toBe(200);
    expect(response.body.username).toBe('testuser');
    expect(response.body.email).toBe('testuser@example.com');
    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/profile'), expect.objectContaining({
      headers: expect.objectContaining({
        authorization: 'Bearer mockedToken',
      }),
    }));
  });

  // Test /savegame endpoint
  it('should forward savegame request to the history service', async () => {
    axios.post.mockResolvedValueOnce({ data: { gameId: 'mockedGameId' } });

    const response = await request(app)
      .post('/savegame')
      .send({ userId: 'testuser', score: 100 });

    expect(response.statusCode).toBe(200);
    expect(response.body.gameId).toBe('mockedGameId');
    expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/savegame'), { userId: 'testuser', score: 100 });
  });

  // Test /getquestions endpoint
  it('should forward getquestions request to the history service', async () => {
    axios.get.mockResolvedValueOnce({ data: { questions: ['question1', 'question2'] } });

    const response = await request(app)
      .get('/getquestions/123');

    expect(response.statusCode).toBe(200);
    expect(response.body.questions).toEqual(['question1', 'question2']);
    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/getquestions/123'));
  });
});