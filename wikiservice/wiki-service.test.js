const request = require('supertest');
const mongoose = require('mongoose');
const app = require('./wiki-service'); 
const Question = require('./question-model');

beforeAll(async () => {
  const mongoUri = 'mongodb://localhost:27017/testdb';
  if (mongoose.connection.readyState === 0) { 
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  }
});

afterEach(async () => {
  await Question.deleteMany(); 
});

afterAll(async () => {
  await mongoose.disconnect();  
});

describe('POST /questions', () => {
  it('should create a new question and return the correct format', async () => {
    const response = await request(app)
      .post('/questions')
      .send({});

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('question');
    expect(response.body).toHaveProperty('image');
    expect(response.body).toHaveProperty('answer');
    expect(response.body).toHaveProperty('wrongAnswers');
    expect(response.body.wrongAnswers.length).toBe(3);
  });

  it('should save the question in the database', async () => {
    const response = await request(app)
      .post('/questions')
      .send({});

    const savedQuestion = await Question.findOne({ question: response.body.question });
    expect(savedQuestion).toBeTruthy(); 
    expect(savedQuestion.answer).toBe(response.body.answer);  
  });

  it('should handle errors properly', async () => {
    const response = await request(app)
      .post('/questions')
      .send({});
    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty('message');
  });
});
