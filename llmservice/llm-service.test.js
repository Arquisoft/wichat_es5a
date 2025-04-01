// Set a fake api key
process.env.LLM_API_KEY = 'test-api-key';

const request = require('supertest');
const axios = require('axios');
const app = require('./llm-service'); 

afterAll(async () => {
  app.close();
});

jest.mock('axios');

describe('LLM Service', () => {
  // Mock responses from external services
  axios.post.mockImplementation((url, data) => {
    if (url.startsWith('https://generativelanguage')) {
      return Promise.resolve({
        data: {
          candidates: [{ content: { parts: [{ text: 'llmanswer' }] } }]
        }
      });
    }
    return Promise.reject(new Error('Model not found'));
  });

  it('should reply with gemini model', async () => {
    const response = await request(app)
      .post('/ask')
      .send({ question: 'a question', model: 'gemini' });

    expect(response.statusCode).toBe(200);
    expect(response.body.answer).toBe('llmanswer');
  });

  it('should return an error if API key is missing', async () => {
    delete process.env.LLM_API_KEY;

    const response = await request(app)
      .post('/ask')
      .send({ question: 'a question', model: 'gemini' });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('API key is missing');
  });

  it('should return an error if required fields are missing', async () => {
    const response = await request(app)
      .post('/ask')
      .send({ question: 'a question' });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Missing required field: model');
  });

  it('should return an error if the "question" field is missing', async () => {
    const response = await request(app)
      .post('/ask')
      .send({ model: 'gemini' });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Missing required field: question');
  });

  it('should return an error if the "model" field is missing', async () => {
    const response = await request(app)
      .post('/ask')
      .send({ question: 'a question' });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Missing required field: model');
  });

  it('should return an error if the model is unsupported', async () => {
    const response = await request(app)
      .post('/ask')
      .send({ question: 'a question', model: 'unsupportedModel' });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Model "unsupportedModel" is not supported.');
  });

  it('should handle errors from the external API', async () => {
    axios.post.mockImplementationOnce(() => Promise.reject(new Error('External API error')));

    const response = await request(app)
      .post('/ask')
      .send({ question: 'a question', model: 'gemini' });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Error sending question to gemini: External API error');
  });

  it('should return an error if the request body is empty', async () => {
    const response = await request(app)
      .post('/ask')
      .send({});

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Missing required field: question');
  });

  it('should return OK for the /health endpoint', async () => {
    const response = await request(app).get('/health');

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('OK');
  });
});
