const request = require('supertest');
const mongoose = require('mongoose');
const app = require('./wiki-service'); 
const Question = require('./question-model');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    await mongoose.disconnect();
    await mongoose.connect(mongoUri);
});

afterEach(async () => {
    await Question.deleteMany(); 
});

afterAll(async () => {
    await mongoose.connection.close(); 
    await mongoServer.stop(); 
    app.close(); 
});

describe('POST /questions/flag', () => {
    jest.setTimeout(20000);

    it('should create a new flag question and return the correct format', async () => {
        const response = await request(app)
            .post('/questions/flag')
            .send();

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('question', '¿De qué país es esta bandera?');
        expect(response.body).toHaveProperty('image');
        expect(response.body).toHaveProperty('answer');
        expect(response.body).toHaveProperty('wrongAnswers');
        expect(Array.isArray(response.body.wrongAnswers)).toBe(true);
        expect(response.body.wrongAnswers.length).toBe(3);
    });

    it('should save the flag question in the database', async () => {
        const response = await request(app)
            .post('/questions/flag')
            .send();

        const savedQuestion = await Question.findOne({ question: "¿De qué país es esta bandera?" });
        expect(savedQuestion).toBeTruthy();
        expect(savedQuestion.answer).toBe(response.body.answer);
        await Question.deleteOne({ question: "¿Qué bandera es esta?" });
    });
});
