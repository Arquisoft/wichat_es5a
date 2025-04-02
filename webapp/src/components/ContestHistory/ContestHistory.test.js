import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import axios from 'axios';
import ContestHistory from './ContestHistory';

jest.mock('axios');

// Simula useNavigate fuera del bloque describe
const mockNavigate = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: '123' }),
}));

// Datos de prueba y textos esperados
const mockData = {
  questions: [
    {
      question: '¿Cuál es la capital de Francia?',
      image: 'image_url',
      wrongAnswers: ['Madrid', 'Londres', 'Berlín', 'Roma'],
      answer: 'París',
      createdAt: '2025-04-01T12:00:00Z',
    },
  ],
  times: [15],
  clues: [1],
  correctAnswers: [1],
};

const expectedTexts = {
  title: 'Historial de preguntas',
  exitButton: 'Salir',
  question: 'Pregunta: ¿Cuál es la capital de Francia?',
  wrongAnswers: 'Respuestas mostradas: Madrid, Londres, Berlín, Roma',
  correctAnswer: 'Respuesta correcta: París',
  correct: 'Acertada: ✅',
  time: 'Tiempo en responder: 15 segundos',
  clues: 'Número de pistas usadas: 1',
  date: /Fecha de generación de la pregunta: 01\/04\/2025/,
};

// Función auxiliar para renderizar el componente
const renderComponent = () => {
  render(
    <BrowserRouter>
      <ContestHistory />
    </BrowserRouter>
  );
};

describe('ContestHistory Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the initial UI correctly', () => {
    renderComponent();

    expect(screen.getByText(expectedTexts.title)).toBeInTheDocument();
    expect(screen.getByText(expectedTexts.exitButton)).toBeInTheDocument();
  });

  it('should fetch and display data from the API', async () => {
    axios.get.mockResolvedValueOnce({ data: mockData });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(expectedTexts.question)).toBeInTheDocument();
      expect(screen.getByText(expectedTexts.wrongAnswers)).toBeInTheDocument();
      expect(screen.getByText(expectedTexts.correctAnswer)).toBeInTheDocument();
      expect(screen.getByText(expectedTexts.correct)).toBeInTheDocument();
      expect(screen.getByText(expectedTexts.time)).toBeInTheDocument();
      expect(screen.getByText(expectedTexts.clues)).toBeInTheDocument();
      expect(screen.getByText(expectedTexts.date)).toBeInTheDocument();
    });
  });

  it('should handle API errors gracefully', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    axios.get.mockRejectedValueOnce(new Error('API Error'));

    renderComponent();

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error al obtener el número de usuarios:',
        expect.any(Error)
      );
    });

    consoleErrorSpy.mockRestore();
  });

  it('should navigate to the history page when "Salir" is clicked', () => {
    renderComponent();

    const exitButton = screen.getByText(expectedTexts.exitButton);
    fireEvent.click(exitButton);

    expect(mockNavigate).toHaveBeenCalledWith('/history');
  });
});