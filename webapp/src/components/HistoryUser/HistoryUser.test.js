import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import axios from 'axios';
import { BrowserRouter } from 'react-router';
import HistoryUser from './HistoryUser';
import "../../i18n.js";

jest.mock('axios');

const mockNavigate = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockNavigate,
  useParams: () => ({ username: 'testuser' }), // Simula el parámetro de la URL
}));

jest.spyOn(console, 'error').mockImplementation(() => {}); // Suprime los warnings de console.error en los tests

// Datos de prueba y textos esperados
const mockResponse = {
  data: {
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
    contests: [],
  },
};

const expectedTexts = {
  difficulty: 'easy',
  mode: 'flag',
  correctAnswers: '1',
  points: '100',
  totalTime: '20"',
  totalClues: '3',
  gameDate: /01\/04\/2025 \d{2}:\d{2}:\d{2}/,
  detailsButton: 'Detalles',
  exitButton: 'Salir',
};

// Función auxiliar para renderizar el componente
const renderComponent = () => {
  render(
    <BrowserRouter>
      <HistoryUser />
    </BrowserRouter>
  );
};

describe('HistoryUser Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the initial UI correctly', () => {
    renderComponent();

    expect(screen.getByText('Salir')).toBeInTheDocument();
  });

  it('should fetch and display data from the API', async () => {
    axios.get.mockResolvedValueOnce(mockResponse);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(expectedTexts.difficulty)).toBeInTheDocument();
      expect(screen.getByText(expectedTexts.mode)).toBeInTheDocument();
      expect(screen.getByText(expectedTexts.correctAnswers)).toBeInTheDocument();
      expect(screen.getByText(expectedTexts.points)).toBeInTheDocument();
      expect(screen.getByText(expectedTexts.totalTime)).toBeInTheDocument();
      expect(screen.getByText(expectedTexts.totalClues)).toBeInTheDocument();
      expect(screen.getByText(expectedTexts.gameDate)).toBeInTheDocument();
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

  it('should navigate to the profile page when "Salir" is clicked', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(expectedTexts.exitButton)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(expectedTexts.exitButton));
    expect(mockNavigate).toHaveBeenCalledWith('/profile');
  });

  it('should handle API errors gracefully', async () => {
    axios.get.mockRejectedValueOnce(new Error('API Error'));

    renderComponent();

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        'Error al obtener el número de usuarios:',
        expect.any(Error)
      );
    });
  });

  it('should display a message when there are no contests', async () => {
    axios.get.mockResolvedValueOnce(emptyContestsResponse);

    renderComponent();

    await waitFor(() => {
      expect(screen.queryByText(expectedTexts.difficulty)).not.toBeInTheDocument();
    });
  });
});