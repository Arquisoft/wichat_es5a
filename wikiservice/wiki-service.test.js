const request = require('supertest');
const mongoose = require('mongoose');
const app = require('./wiki-service');
const Question = require('./question-model');
const { MongoMemoryServer } = require('mongodb-memory-server');
const WikiQuery = require('./wiki-query');

const wikiQuery = new WikiQuery(); // Crear una instancia de WikiQuery

let mongoServer;

jest.setTimeout(30000); 

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    await mongoose.disconnect();
    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

afterEach(async () => {
    await Question.deleteMany(); // Limpiar la base de datos después de cada test
});

afterAll(async () => {
    await mongoose.connection.close();
    await mongoServer.stop();
    app.close();
});

describe('GET /health', () => {
    it('should return status OK', async () => {
        const response = await request(app).get('/health');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ status: 'OK' });
    });
});

describe('POST /questions/:kind', () => {
    const endpoints = [
        { kind: 'flag', question: 'question-flag' },
        { kind: 'city', question: 'question-city' },
        { kind: 'album', question: 'question-album' },
        { kind: 'football', question: 'question-football' },
        { kind: 'music', question: 'question-music' },
        { kind: 'food', question: 'question-food' },
    ];

    endpoints.forEach(({ kind, question }) => {
        it(`should create a new ${kind} question and return the correct format`, async () => {
            const requestBody = {
                language: 'es',
                numQuestions: 3,
            };

            const response = await request(app)
                .post(`/questions/${kind}`)
                .send(requestBody);

            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveLength(requestBody.numQuestions); // Verifica que se generen el número correcto de preguntas
            response.body.forEach((questionData) => {
                expect(questionData).toHaveProperty('question', question);
                expect(questionData).toHaveProperty('image');
                expect(questionData).toHaveProperty('answer');
                expect(questionData).toHaveProperty('wrongAnswers');
                expect(Array.isArray(questionData.wrongAnswers)).toBe(true);
                expect(questionData.wrongAnswers.length).toBe(3);
            });
        });

        it(`should save the ${kind} question in the database`, async () => {
            const requestBody = {
                language: 'es',
                numQuestions: 1,
            };

            const response = await request(app)
                .post(`/questions/${kind}`)
                .send(requestBody);

            const savedQuestion = await Question.findOne({ question });
            expect(savedQuestion).toBeTruthy();
            expect(savedQuestion.answer).toBe(response.body[0].answer);
        });
    });
});