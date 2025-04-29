const request = require('supertest');
const axios = require('axios');
const app = require('./gateway-service');

afterAll(async () => {
  app.close();
});

jest.mock('axios');

// Respuestas simuladas
const mockResponses = {
  login: { token: 'mockedToken' },
  adduser: { userId: 'mockedUserId' },
  ask: { answer: 'llmanswer' },
  questions: { answer: 'questions' },
  savegame: { id: 'mockedGameId' },
  gethistory: { userCount: 10, questionCount: 5 },
  getquestions: { questions: ['question1', 'question2'] },
  profile: { username: 'mockedUser', email: 'mockedEmail' },
  health: { status: 'OK' },
  ranking: { ranking: [{ username: 'user1', points: 100 }] },
  userHistory: { contests: ['contest1', 'contest2'] },
  historyDetails: { history: ['history1', 'history2'] },
  editProfile: { matchedCount: 1 },
  changePassword: { matchedCount: 1},
};

// Mock de POST
const mockPost = (url, data) => {
  if (url.endsWith('/login')) return Promise.resolve({ data: mockResponses.login });
  if (url.endsWith('/adduser')) return Promise.resolve({ data: mockResponses.adduser });
  if (url.endsWith('/ask')) return Promise.resolve({ data: mockResponses.ask });
  if (url.endsWith('/questions/city')) return Promise.resolve({ data: mockResponses.questions });
  if (url.endsWith('/savegame')) return Promise.resolve({ data: mockResponses.savegame });
  if (url.endsWith('/getUserhistory')) return Promise.resolve({ data: mockResponses.historyDetails });
};

// Mock de GET
const mockGet = (url) => {
  if (url.endsWith('/gethistory')) return Promise.resolve({ data: mockResponses.gethistory });
  if (url.includes('/getquestions/')) return Promise.resolve({ data: mockResponses.getquestions });
  if (url.endsWith('/profile')) return Promise.resolve({ data: mockResponses.profile });
  if (url.endsWith('/getranking')) return Promise.resolve({ data: mockResponses.ranking });
  if (url.includes('/getUserhistory/')) return Promise.resolve({ data: mockResponses.userHistory });
};

const mockPut = (url) => {
  if(url.includes("/profile/edit/")) return Promise.resolve({ data: mockResponses.editProfile });
  if(url.includes("/profile/changePassword/")) return Promise.resolve({ data: mockResponses.changePassword });
}

axios.post.mockImplementation(mockPost);
axios.get.mockImplementation(mockGet);
axios.put.mockImplementation(mockPut);

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

  const testPutEndpoint = async (endpoint, payload, expectedResponse) => {
    const response = await request(app).put(endpoint).send(payload);
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

  it('should forward change password request to the user service', async () => {
    await testPutEndpoint('/profile/changePassword/123', mockResponses.changePassword, { matchedCount: 1 });
  });

  it('should forward change password request to the user service', async () => {
    await testPutEndpoint('/profile/edit/123', mockResponses.editProfile, { matchedCount: 1 });
  });

  it('should return 200 and a health status message', async () => {
    await testGetEndpoint('/health', mockResponses.health);
  });

  it('should forward getUserHistory request to the user and history services', async () => {
    const response = await request(app).get('/gethistory/testuser');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockResponses.historyDetails);
    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/getUserhistory/testuser'));
  });

  it('should forward getRanking request to the user service', async () => {
    const response = await request(app).get('/getranking');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockResponses.ranking);
    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/getranking'));
  });
});