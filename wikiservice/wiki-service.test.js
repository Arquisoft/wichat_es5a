const request = require('supertest');
const mongoose = require('mongoose');
const app = require('./wiki-service');
const Question = require('./question-model');
const { MongoMemoryServer } = require('mongodb-memory-server');
const WikiQuery = require('./wiki-query');

const wikiQuery = new WikiQuery(); // Crear una instancia de WikiQuery

let mongoServer;

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
        { kind: 'flag', question: '¿De qué país es esta bandera?' },
        { kind: 'city', question: '¿Qué ciudad es esta?' },
        { kind: 'album', question: '¿Cuál es el nombre de este álbum?' },
        { kind: 'football', question: '¿Qué equipo de fútbol es este?' },
        { kind: 'music', question: '¿Qué grupo es?' },
        { kind: 'food', question: '¿Qué plato de comida es?' },
    ];

    endpoints.forEach(({ kind, question }) => {
        it(`should create a new ${kind} question and return the correct format`, async () => {
            const response = await request(app)
                .post(`/questions/${kind}`)
                .send();

            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('question', question);
            expect(response.body).toHaveProperty('image');
            expect(response.body).toHaveProperty('answer');
            expect(response.body).toHaveProperty('wrongAnswers');
            expect(Array.isArray(response.body.wrongAnswers)).toBe(true);
            expect(response.body.wrongAnswers.length).toBe(3);
        });

        it(`should save the ${kind} question in the database`, async () => {
            const response = await request(app)
                .post(`/questions/${kind}`)
                .send();

            const savedQuestion = await Question.findOne({ question });
            expect(savedQuestion).toBeTruthy();
            expect(savedQuestion.answer).toBe(response.body.answer);
        });
    });
});
