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

  // Datos comunes para los tests
  const mockQuestionData = {
    question: '¿De qué país es esta bandera?',
    image: 'image_url',
    answer: 'España',
    wrongAnswers: ['Francia', 'Italia', 'Portugal'],
  };

  const createMockQuestion = async () => {
    return await Question.create(mockQuestionData);
  };

  // Función auxiliar para verificar respuestas de endpoints
  const verifyResponse = (response, statusCode, expectedBody) => {
    expect(response.statusCode).toBe(statusCode);
    expect(response.body).toEqual(expectedBody);
  };

  it('should return 200 and a health status message', async () => {
    const response = await request(app).get('/health');
    verifyResponse(response, 200, { status: 'OK' });
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
        const response = await request(app).post(`/questions/${kind}`).send();

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('question');
        expect(response.body).toHaveProperty('image');
        expect(response.body).toHaveProperty('answer');
        expect(response.body).toHaveProperty('wrongAnswers');
        expect(Array.isArray(response.body.wrongAnswers)).toBe(true);
        expect(response.body.wrongAnswers.length).toBe(3);
      });

      it(`should save the ${kind} question in the database`, async () => {
        const response = await request(app).post(`/questions/${kind}`).send();

        const savedQuestion = await Question.findOne({ question: response.body.question });
        expect(savedQuestion).toBeTruthy();
        expect(savedQuestion.answer).toBe(response.body.answer);
      });
    });
  });
});