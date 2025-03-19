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
    } else if (url.endsWith('https://empathyai')) {
      return Promise.resolve({
        data: { choices: [{ message: { content: 'llmanswer' } }] }
      });
    }
    return Promise.reject(new Error('Model not found'));
  });

  // Test /ask endpoint with gemini model
  it('should reply with gemini model', async () => {
    const response = await request(app)
      .post('/ask')
      .send({ question: 'a question', model: 'gemini' });

    expect(response.statusCode).toBe(200);
    expect(response.body.answer).toBe('llmanswer');
  });

  // Test /ask endpoint with missing API key
  it('should return an error if API key is missing', async () => {
    delete process.env.LLM_API_KEY; // Remove API key for this test

    const response = await request(app)
      .post('/ask')
      .send({ question: 'a question', model: 'gemini' });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('API key is missing');
  });

  // Test /ask endpoint with missing required fields
  it('should return an error if required fields are missing', async () => {
    const response = await request(app)
      .post('/ask')
      .send({ question: 'a question' }); // Missing 'model'

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Missing required field: model');
  });


  // Test missing 'question' field (model exists)
  it('should return an error if the "question" field is missing', async () => {
    const response = await request(app)
      .post('/ask')
      .send({ model: 'gemini' }); // Missing 'question'

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Missing required field: question');
  });

  // Test missing 'model' field (question exists)
  it('should return an error if the "model" field is missing', async () => {
    const response = await request(app)
      .post('/ask')
      .send({ question: 'a question' }); // Missing 'model'

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Missing required field: model');
  });
});
