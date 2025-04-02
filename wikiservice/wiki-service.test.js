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

describe('POST /questions', () => {
    jest.setTimeout(20000);

    it('should create a new question and return the correct format', async () => {
        const response = await request(app)
            .post('/questions')
            .send();

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('question', '¿Que ciudad es esta?');
        expect(response.body).toHaveProperty('image');
        expect(response.body).toHaveProperty('answer');
        expect(response.body).toHaveProperty('wrongAnswers');
        expect(Array.isArray(response.body.wrongAnswers)).toBe(true);
        expect(response.body.wrongAnswers.length).toBe(3);
    });

    it('should save the question in the database', async () => {
        const response = await request(app)
            .post('/questions')
            .send();

        const savedQuestion = await Question.findOne({ question: "¿Que ciudad es esta?" });
        expect(savedQuestion).toBeTruthy();
        expect(savedQuestion.answer).toBe(response.body.answer);
        await Question.deleteOne({ question: "¿Que ciudad es esta?" });
    });
});
