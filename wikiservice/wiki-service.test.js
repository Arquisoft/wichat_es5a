const request = require('supertest');
const mongoose = require('mongoose');
const app = require('./wiki-service');
const Question = require('./question-model');

// Establece un timeout global de 10,000 ms
jest.setTimeout(10000);

afterAll(async () => {
  await mongoose.connection.close(); // Cierra la conexión de Mongoose
  app.close(); // Cierra el servidor Express
});

describe('Wiki Service', () => {
  beforeEach(async () => {
    // Limpia la colección de preguntas antes de cada test
    await Question.deleteMany({});
  });

  // Función auxiliar para verificar respuestas de endpoints
  const verifyResponse = (response, statusCode, expectedBody) => {
    expect(response.statusCode).toBe(statusCode);
    expect(response.body).toEqual(expectedBody);
  };

  it('should return 200 and a health status message', async () => {
    const response = await request(app).get('/health');
    verifyResponse(response, 200, { status: 'OK' });
  });

  /*describe('POST /questions/:kind', () => {
    const endpoints = [
      { kind: 'flag', },
      { kind: 'city', },
      { kind: 'football', },
      { kind: 'music' },
      { kind: 'food' },
    ];

    endpoints.forEach(({ kind }) => {
      it(`should create a new ${kind} question and return the correct format`, async () => {
        const response = await request(app)
          .post(`/questions/${kind}`)
          .send({
            language: 'es',
            numQuestions: 3
          });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(3); // Verifica que se generen 3 preguntas
        response.body.forEach((question) => {
          expect(question).toHaveProperty('question');
          expect(question).toHaveProperty('image');
          expect(question).toHaveProperty('answer');
          expect(question).toHaveProperty('wrongAnswers');
          expect(Array.isArray(question.wrongAnswers)).toBe(true);
          expect(question.wrongAnswers.length).toBe(3);
        });
      });

      it(`should save the ${kind} question in the database`, async () => {
        const response = await request(app)
          .post(`/questions/${kind}`)
          .send({
            language: 'es',
            numQuestions: 1
          });

        const savedQuestion = await Question.findOne({ question: response.body[0].question });
        expect(savedQuestion).toBeTruthy();
        expect(savedQuestion.answer).toBe(response.body[0].answer);
      });
    });
  });*/
});