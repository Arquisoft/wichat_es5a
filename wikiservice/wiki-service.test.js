const request = require('supertest');
const mongoose = require('mongoose');
const Question = require('./question-model');
const { MongoMemoryServer } = require('mongodb-memory-server');
const WikiQuery = require('./wiki-query');

jest.mock('./wiki-query');
const mockSPARQLQuery = jest.fn();
WikiQuery.prototype.SPARQLQuery = mockSPARQLQuery;

let mongoServer;
let app;

jest.setTimeout(30000); 

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    process.env.MONGODB_URI = mongoUri;
    
    mockSPARQLQuery.mockResolvedValue({
        results: {
            bindings: [
                { image: { value: 'http://example.com/image1.jpg' }, answerLabel: { value: 'Answer1' } },
                { image: { value: 'http://example.com/image2.jpg' }, answerLabel: { value: 'Answer2' } },
                { image: { value: 'http://example.com/image3.jpg' }, answerLabel: { value: 'Answer3' } },
                { image: { value: 'http://example.com/image4.jpg' }, answerLabel: { value: 'Answer4' } },
                { image: { value: 'http://example.com/image5.jpg' }, answerLabel: { value: 'Answer5' } },
                { image: { value: 'http://example.com/image6.jpg' }, answerLabel: { value: 'Answer6' } }
            ]
        }
    });
    
    await mongoose.disconnect();
    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    
    app = require('./wiki-service');
});

afterEach(async () => {
    await Question.deleteMany();
    jest.clearAllMocks();
});

afterAll(async () => {
    await mongoose.disconnect();
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
        { kind: 'flag', questionText: 'question-flag' },
        { kind: 'city', questionText: 'question-city' },
        { kind: 'football', questionText: 'question-football' },
        { kind: 'album', questionText: 'question-album' },
        { kind: 'music', questionText: 'question-music' },
        { kind: 'food', questionText: 'question-food' },
    ];
    
    endpoints.forEach(({ kind, questionText }) => {
        it(`should create new ${kind} questions and return them in the correct format`, async () => {
            const response = await request(app)
                .post(`/questions/${kind}`)
                .send({ language: "es", numQuestions: 1 });
                
            expect(response.statusCode).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(1);
            
            const question = response.body[0];
            expect(question).toHaveProperty('question', questionText);
            expect(question).toHaveProperty('image');
            expect(question).toHaveProperty('answer');
            expect(question).toHaveProperty('wrongAnswers');
            expect(Array.isArray(question.wrongAnswers)).toBe(true);
            expect(question.wrongAnswers.length).toBe(3);
        });
        
        it(`should save the ${kind} question in the database`, async () => {
            const response = await request(app)
                .post(`/questions/${kind}`)
                .send({ language: "es", numQuestions: 1 });
                
            const question = response.body[0];
            const savedQuestion = await Question.findOne({ 
                question: questionText, 
                answer: question.answer 
            });
            
            expect(savedQuestion).toBeTruthy();
            expect(savedQuestion.image).toBe(question.image);
            expect(savedQuestion.wrongAnswers.length).toBe(3);
        });
    });
    
    it('should handle errors properly', async () => {
        mockSPARQLQuery.mockRejectedValueOnce(new Error('SPARQL query failed'));
        
        const response = await request(app)
            .post('/questions/flag')
            .send({ language: "es", numQuestions: 1 });
            
        expect(response.statusCode).toBe(500);
    });
});