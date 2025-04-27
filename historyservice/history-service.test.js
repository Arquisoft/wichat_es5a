const request = require('supertest');
const mongoose = require('mongoose');
const app = require('./history-service');
const Question = require('./history-questionModel');
const Contest = require('./history-contestModel');
const User = require('./history-userModel');

afterAll(async () => {
  await mongoose.connection.close();
  app.close();
});

describe('History Service', () => {
  beforeEach(async () => {
    // Limpia las colecciones antes de cada test
    await Question.deleteMany({});
    await Contest.deleteMany({});
    await User.deleteMany({});
  });

  // Datos comunes para los tests
  const mockRequest = {
    arPreg: [
      {
        pregunta: 'What is 2+2?',
        imagen: 'image_url',
        resCorr: '4',
        resFalse: ['3', '5', '6'],
      },
    ],
    difficulty: 'easy',
    mode: 'single',
    arCorrect: [1],
    points: 10,
    arTiempo: [30],
    arPistas: [0],
  };

  const createMockData = async () => {
    const question = await Question.create({ question: 'What is 2+2?', answer: '4', wrongAnswers: ['3', '5', '6'] });
    const contest = await Contest.create({
      difficulty: 'easy',
      mode: 'single',
      rightAnswers: [1],
      points: 10,
      preguntas: [question._id],
      tiempos: [30],
      pistas: [0],
    });
    await User.create({ username: 'testuser', email: 'test@example.com' });
    return { question, contest };
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

  it('should save a game and return success', async () => {
    const response = await request(app).post('/savegame').send(mockRequest);

    verifyResponse(response, 200, { success: true, id: response.body.id });

    // Verifica que las preguntas y el concurso se hayan guardado
    const questions = await Question.find();
    const contests = await Contest.find();
    expect(questions.length).toBe(1);
    expect(contests.length).toBe(1);
    expect(contests[0].difficulty).toBe('easy');
  });

  it('should return user, question, and contest counts', async () => {
    await createMockData();

    const response = await request(app).get('/gethistory');

    verifyResponse(response, 200, expect.any(Object));
    expect(response.body.userCount).toBe(1);
    expect(response.body.questionCount).toBe(1);
    expect(response.body.contests.length).toBe(1);
  });

  it('should return questions and contest details for a given contest ID', async () => {
    const { contest } = await createMockData();

    const response = await request(app).get(`/getquestions/${contest._id}`);

    verifyResponse(response, 200, expect.any(Object));
    expect(response.body.questions.length).toBe(1);
    expect(response.body.questions[0].question).toBe('What is 2+2?');
    expect(response.body.correctAnswers).toEqual([1]);
    expect(response.body.times).toEqual([30]);
    expect(response.body.clues).toEqual([0]);
  });
});