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

  // Test /health endpoint
  it('should return 200 and a health status message', async () => {
    const response = await request(app).get('/health');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: 'OK' });
  });

  // Test /savegame endpoint
  it('should save a game and return success', async () => {
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

    const response = await request(app).post('/savegame').send(mockRequest);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ success: true });

    // Verifica que las preguntas y el concurso se hayan guardado
    const questions = await Question.find();
    const contests = await Contest.find();
    expect(questions.length).toBe(1);
    expect(contests.length).toBe(1);
    expect(contests[0].difficulty).toBe('easy');
  });

  // Test /gethistory endpoint
  it('should return user, question, and contest counts', async () => {
    // Crea datos simulados
    await User.create({ username: 'testuser', email: 'test@example.com' });
    await Question.create({ question: 'What is 2+2?', answer: '4', wrongAnswers: ['3', '5', '6'] });
    await Contest.create({ difficulty: 'easy', mode: 'single', points: 10 });

    const response = await request(app).get('/gethistory');

    expect(response.statusCode).toBe(200);
    expect(response.body.userCount).toBe(1);
    expect(response.body.questionCount).toBe(1);
    expect(response.body.contests.length).toBe(1);
  });

  // Test /getquestions/:id endpoint
  it('should return questions and contest details for a given contest ID', async () => {
    // Crea datos simulados
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

    const response = await request(app).get(`/getquestions/${contest._id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.questions.length).toBe(1);
    expect(response.body.questions[0].question).toBe('What is 2+2?');
    expect(response.body.correctAnswers).toEqual([1]);
    expect(response.body.times).toEqual([30]);
    expect(response.body.clues).toEqual([0]);
  });
});