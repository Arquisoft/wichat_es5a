import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import axios from 'axios';
import { BrowserRouter } from 'react-router';
import History from './History';
import "../../i18n.js"

jest.mock('axios');

const mockNavigate = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockNavigate,
}));

jest.spyOn(console, 'error').mockImplementation(() => {}); // Suppress console.error warnings in tests

// Datos de prueba y textos esperados
const mockResponse = {
  data: {
    userCount: 5,
    questionCount: 10,
    contests: [
      {
        _id: '1',
        difficulty: 'easy',
        mode: 'single',
        points: 100,
        date: '2025-04-01T12:00:00Z',
        tiempos: [30, 40],
        pistas: [1, 2],
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
  totalPlayers: 'Jugadores totales: 5',
  totalQuestions: 'Preguntas generadas: 10',
  difficulty: 'Dificultad: easy',
  mode: 'Modo: single',
  correctAnswers: 'Preguntas acertadas: 1',
  points: 'Puntos: 100',
  totalTime: 'Tiempo total: 70 segundos',
  totalClues: 'Número de pistas usadas: 3 segundos',
  contestDate: /Fecha del concurso: 01\/04\/2025 \d{2}:\d{2}:\d{2}/,
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

  it('should render the initial UI correctly', () => {
    renderComponent();

    expect(screen.getByText('Jugadores totales: 0')).toBeInTheDocument();
    expect(screen.getByText('Preguntas generadas: 0')).toBeInTheDocument();
    expect(screen.getByText(expectedTexts.exitButton)).toBeInTheDocument();
  });

  it('should fetch and display data from the API', async () => {
    axios.get.mockResolvedValueOnce(mockResponse);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(expectedTexts.totalPlayers)).toBeInTheDocument();
      expect(screen.getByText(expectedTexts.totalQuestions)).toBeInTheDocument();
      expect(screen.getByText(expectedTexts.difficulty)).toBeInTheDocument();
      expect(screen.getByText(expectedTexts.mode)).toBeInTheDocument();
      expect(screen.getByText(expectedTexts.correctAnswers)).toBeInTheDocument();
      expect(screen.getByText(expectedTexts.points)).toBeInTheDocument();
      expect(screen.getByText(expectedTexts.totalTime)).toBeInTheDocument();
      expect(screen.getByText(expectedTexts.totalClues)).toBeInTheDocument();
      expect(screen.getByText(expectedTexts.contestDate)).toBeInTheDocument();
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

  it('should navigate to the home page when "Salir" is clicked', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(expectedTexts.exitButton)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(expectedTexts.exitButton));
    expect(mockNavigate).toHaveBeenCalledWith('/home');
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
      expect(screen.getByText(expectedTexts.totalPlayers)).toBeInTheDocument();
      expect(screen.getByText(expectedTexts.totalQuestions)).toBeInTheDocument();
      expect(screen.queryByText(expectedTexts.difficulty)).not.toBeInTheDocument();
    });
  });
});