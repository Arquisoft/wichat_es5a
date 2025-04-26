const request = require('supertest');
const Question = require('./question-model');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose'); // Importa mongoose

let mongoServer;
let app;

jest.setTimeout(30000); 

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    process.env.MONGODB_URI = mongoUri;
    app = require('./wiki-service'); 
});

afterEach(async () => {
    await Question.deleteMany(); // Limpia la base de datos después de cada test
});

afterAll(async () => {
    await mongoose.connection.close(); // Cierra la conexión de Mongoose
    await mongoServer.stop(); // Detiene el servidor en memoria
    app.close(); // Cierra el servidor Express
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
