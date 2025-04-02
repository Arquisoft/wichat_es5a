const request = require('supertest');
const axios = require('axios');
const app = require('./gateway-service');

afterAll(async () => {
  app.close();
});

jest.mock('axios');

// Datos comunes para las respuestas simuladas
const mockResponses = {
  login: { token: 'mockedToken' },
  adduser: { userId: 'mockedUserId' },
  ask: { answer: 'llmanswer' },
  questions: { answer: 'questions' },
  savegame: { id: 'mockedGameId' },
  gethistory: { userCount: 10, questionCount: 5 },
  getquestions: { question: 'mockedQuestion' },
  profile: { username: 'mockedUser', email: 'mockedEmail' },
  health: { status: 'OK' },
};

// Función auxiliar para simular respuestas de POST
const mockPost = (url, data) => {
  if (url.endsWith('/login')) return Promise.resolve({ data: mockResponses.login });
  if (url.endsWith('/adduser')) return Promise.resolve({ data: mockResponses.adduser });
  if (url.endsWith('/ask')) return Promise.resolve({ data: mockResponses.ask });
  if (url.endsWith('/questions/city')) return Promise.resolve({ data: mockResponses.questions });
  if (url.endsWith('/savegame')) return Promise.resolve({ data: mockResponses.savegame });
};

// Función auxiliar para simular respuestas de GET
const mockGet = (url) => {
  if (url.endsWith('/gethistory')) return Promise.resolve({ data: mockResponses.gethistory });
  if (url.includes('/getquestions/')) return Promise.resolve({ data: mockResponses.getquestions });
  if (url.endsWith('/profile')) return Promise.resolve({ data: mockResponses.profile });
};

axios.post.mockImplementation(mockPost);
axios.get.mockImplementation(mockGet);

describe('Gateway Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const testPostEndpoint = async (endpoint, payload, expectedResponse) => {
    const response = await request(app).post(endpoint).send(payload);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expectedResponse);
  };

  const testGetEndpoint = async (endpoint, expectedResponse, headers = {}) => {
    const response = await request(app).get(endpoint).set(headers);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expectedResponse);
  };

  it('should forward login request to auth service', async () => {
    await testPostEndpoint('/login', { username: 'testuser', password: 'testpassword' }, mockResponses.login);
  });

  it('should forward add user request to user service', async () => {
    await testPostEndpoint('/adduser', { username: 'newuser', password: 'newpassword' }, mockResponses.adduser);
  });

  it('should forward askllm request to the llm service', async () => {
    await testPostEndpoint('/askllm', { question: 'question', apiKey: 'apiKey', model: 'gemini' }, mockResponses.ask);
  });

  it('should forward questions request to the wiki service', async () => {
    await testPostEndpoint('/questions/city', {}, mockResponses.questions);
  });

  it('should forward savegame request to the history service', async () => {
    await testPostEndpoint('/savegame', { gameData: 'mockedGameData' }, mockResponses.savegame);
  });

  it('should forward history request to the history service', async () => {
    await testGetEndpoint('/gethistory', mockResponses.gethistory);
  });

  it('should forward getquestions request to the history service', async () => {
    await testGetEndpoint('/getquestions/123', mockResponses.getquestions);
  });

  it('should forward profile request to the user service', async () => {
    await testGetEndpoint('/profile', mockResponses.profile, { Authorization: 'Bearer mockedToken' });
  });

  it('should return 200 and a health status message', async () => {
    await testGetEndpoint('/health', mockResponses.health);
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