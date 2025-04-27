const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const Question = require('./question-model');
const WikiQuery = require('./wiki-query');

jest.mock('./wiki-query');

let mongoServer;
let server;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  process.env.MONGODB_URI = mongoUri;
  
  await mongoose.connect(mongoUri);
  
  WikiQuery.prototype.SPARQLQuery = jest.fn().mockResolvedValue({
    results: {
      bindings: [
        { 
          image: { value: 'http://example.com/image1.jpg' }, 
          answerLabel: { value: 'Answer1' } 
        },
        { 
          image: { value: 'http://example.com/image2.jpg' }, 
          answerLabel: { value: 'Answer2' } 
        },
        { 
          image: { value: 'http://example.com/image3.jpg' }, 
          answerLabel: { value: 'Answer3' } 
        },
        { 
          image: { value: 'http://example.com/image4.jpg' }, 
          answerLabel: { value: 'Answer4' } 
        }
      ]
    }
  });
  server = require('./wiki-service');
});

afterEach(async () => {
  await Question.deleteMany({});
  jest.clearAllMocks();
});

afterAll(async () => {
  await mongoose.connection.close();
  await server.close();
  await mongoServer.stop();
});

describe('Wiki Service', () => {
  it('should return health status OK', async () => {
    const response = await request(server).get('/health');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: 'OK' });
  });

  describe('POST /questions/:kind', () => {
    const endpoints = [
      { kind: 'flag', questionText: 'question-flag' },
      { kind: 'city', questionText: 'question-city' },
      { kind: 'football', questionText: 'question-football' },
      { kind: 'album', questionText: 'question-album' },
      { kind: 'music', questionText: 'question-music' },
      { kind: 'food', questionText: 'question-food' },
    ];

    endpoints.forEach(({ kind, questionText }) => {
      it(`should create new ${kind} questions and return them in the correct format`, async () => {
        const numQuestions = 2;
        const response = await request(server)
          .post(`/questions/${kind}`)
          .send({ language: "es", numQuestions });

        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(numQuestions);
    
        response.body.forEach(question => {
          expect(question).toHaveProperty('question', questionText);
          expect(question).toHaveProperty('image');
          expect(question).toHaveProperty('answer');
          expect(question).toHaveProperty('wrongAnswers');
          expect(Array.isArray(question.wrongAnswers)).toBe(true);
          expect(question.wrongAnswers.length).toBe(3);
        });
      });

      it(`should save the ${kind} questions in the database`, async () => {
        const numQuestions = 2;
        const response = await request(server)
          .post(`/questions/${kind}`)
          .send({ language: "es", numQuestions });

        const savedQuestions = await Question.find({ question: questionText });
        expect(savedQuestions.length).toBe(numQuestions);

        expect(matchingQuestion).toBeTruthy();
        expect(matchingQuestion.question).toBe(firstResponseQuestion.question);
        expect(matchingQuestion.wrongAnswers.length).toBe(3);
      });
    });

    it('should handle errors properly', async () => {
      WikiQuery.prototype.SPARQLQuery.mockRejectedValueOnce(new Error('SPARQL query failed'));
      
      const response = await request(server)
        .post('/questions/flag')
        .send({ language: "es", numQuestions: 1 });
      
      expect(response.statusCode).toBe(500);
    });
  });
});