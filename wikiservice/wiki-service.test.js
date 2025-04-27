const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const Question = require('./question-model'); // Modelo de preguntas
const WikiQuery = require('./wiki-query');

// Mock the WikiQuery class to avoid actual API calls during tests
jest.mock('./wiki-query');

let mongoServer;
let server;

beforeAll(async () => {
  // Inicia MongoMemoryServer
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  process.env.MONGODB_URI = mongoUri;
  
  // Conectar a la base de datos antes de importar la app
  await mongoose.connect(mongoUri);
  
  // Mock implementation for SPARQLQuery
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
  
  // Import app after setting up mocks and environment
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
        // Check if response is an array
        expect(Array.isArray(response.body)).toBe(true);
        // Check if the correct number of questions was returned
        expect(response.body.length).toBe(numQuestions);
        
        // Check each question's structure
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

        // Check if questions were saved in the database
        const savedQuestions = await Question.find({ question: questionText });
        expect(savedQuestions.length).toBe(numQuestions);
        
        // Check if one of the saved questions matches the response
        const firstResponseQuestion = response.body[0];
        const matchingQuestion = savedQuestions.find(q => 
          q.answer === firstResponseQuestion.answer &&
          q.image === firstResponseQuestion.image
        );
        
        expect(matchingQuestion).toBeTruthy();
        expect(matchingQuestion.question).toBe(firstResponseQuestion.question);
        expect(matchingQuestion.wrongAnswers.length).toBe(3);
      });
    });

    it('should handle errors properly', async () => {
      // Mock implementation to simulate an error
      WikiQuery.prototype.SPARQLQuery.mockRejectedValueOnce(new Error('SPARQL query failed'));
      
      const response = await request(server)
        .post('/questions/flag')
        .send({ language: "es", numQuestions: 1 });
      
      expect(response.statusCode).toBe(500);
    });
  });
});