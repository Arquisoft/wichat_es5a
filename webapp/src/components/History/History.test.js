import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import axios from 'axios';
import { BrowserRouter } from 'react-router';
import History from './History';
import "../../i18n.js";

jest.mock('axios');

const mockNavigate = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockNavigate,
}));

jest.spyOn(console, 'error').mockImplementation(() => {}); // Suprime los warnings de console.error en los tests

// Datos de prueba y textos esperados
const mockResponse = {
  data: {
    userCount: 5,
    questionCount: 10,
    contests: [
      {
        _id: '1',
        difficulty: 'easy',
        mode: 'flag',
        points: 100,
        date: '2025-04-01T12:00:00Z',
        tiempos: [15, 5],
        pistas: [2, 1],
        rightAnswers: [1, 0],
      },
    ],
  },
};

const emptyContestsResponse = {
  data: {
    userCount: 5,
    questionCount: 10,
    contests: [],
  },
};

const expectedTexts = {
  totalUsers: 'Jugadores totales: 5',
  totalQuestions: 'Preguntas generadas: 10',
  difficulty: 'Fácil',
  mode: 'Bandera',
  correctAnswers: '1',
  points: '100',
  totalTime: '20"',
  totalClues: '3',
  contestDate: /01\/04\/2025 \d{2}:\d{2}:\d{2}/,
  detailsButton: 'Detalles',
  exitButton: 'Salir',
};

// Función auxiliar para renderizar el componente
const renderComponent = () => {
  render(
    <BrowserRouter>
      <History />
    </BrowserRouter>
  );
};

describe('History Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch and display data from the API', async () => {
    axios.get.mockResolvedValueOnce(mockResponse);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(expectedTexts.totalUsers)).toBeInTheDocument();
      expect(screen.getByText(expectedTexts.totalQuestions)).toBeInTheDocument();
      expect(screen.getByText(expectedTexts.difficulty)).toBeInTheDocument();
      expect(screen.getByText(expectedTexts.mode)).toBeInTheDocument();
      expect(screen.getByText(expectedTexts.correctAnswers)).toBeInTheDocument();
      expect(screen.getByText(expectedTexts.points)).toBeInTheDocument();
      expect(screen.getByText(expectedTexts.totalTime)).toBeInTheDocument();
      expect(screen.getByText(expectedTexts.totalClues)).toBeInTheDocument();
      expect(screen.getByText(expectedTexts.detailsButton)).toBeInTheDocument();
    });
  });

  it('should navigate to the contest details page when "Detalles" is clicked', async () => {
    axios.get.mockResolvedValueOnce(mockResponse);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(expectedTexts.detailsButton)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(expectedTexts.detailsButton));
    expect(mockNavigate).toHaveBeenCalledWith('/contest/1');
  });

  it('should handle API errors gracefully', async () => {
    axios.get.mockRejectedValueOnce(new Error('API Error'));

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Jugadores totales: 0')).toBeInTheDocument();
      expect(screen.getByText('Preguntas generadas: 0')).toBeInTheDocument();
    });

    expect(console.error).toHaveBeenCalledWith(
      'Error al obtener el número de usuarios:',
      expect.any(Error)
    );
  });

  it('should display a message when there are no contests', async () => {
    axios.get.mockResolvedValueOnce(emptyContestsResponse);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(expectedTexts.totalUsers)).toBeInTheDocument();
      expect(screen.getByText(expectedTexts.totalQuestions)).toBeInTheDocument();
      expect(screen.queryByText(expectedTexts.difficulty)).not.toBeInTheDocument();
    });
  });
});