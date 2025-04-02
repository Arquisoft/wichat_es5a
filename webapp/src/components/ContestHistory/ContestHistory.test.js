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

describe('ContestHistory Component', () => {
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

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the initial UI correctly', () => {
    render(
      <BrowserRouter>
        <ContestHistory />
      </BrowserRouter>
    );

    expect(screen.getByText('Historial de preguntas')).toBeInTheDocument();
    expect(screen.getByText('Salir')).toBeInTheDocument();
  });

  it('should fetch and display data from the API', async () => {
    axios.get.mockResolvedValueOnce({ data: mockData });

    render(
      <BrowserRouter>
        <ContestHistory />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Pregunta: ¿Cuál es la capital de Francia?')).toBeInTheDocument();
      expect(screen.getByText('Respuestas mostradas: Madrid, Londres, Berlín, Roma')).toBeInTheDocument();
      expect(screen.getByText('Respuesta correcta: París')).toBeInTheDocument();
      expect(screen.getByText('Acertada: ✅')).toBeInTheDocument();
      expect(screen.getByText('Tiempo en responder: 15 segundos')).toBeInTheDocument();
      expect(screen.getByText('Número de pistas usadas: 1')).toBeInTheDocument();
      expect(screen.getByText(/Fecha de generación de la pregunta: 01\/04\/2025/)).toBeInTheDocument();
    });
  });

  it('should handle API errors gracefully', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    axios.get.mockRejectedValueOnce(new Error('API Error'));

    render(
      <BrowserRouter>
        <ContestHistory />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error al obtener el número de usuarios:',
        expect.any(Error)
      );
    });

    consoleErrorSpy.mockRestore();
  });

  it('should navigate to the history page when "Salir" is clicked', () => {
    render(
      <BrowserRouter>
        <ContestHistory />
      </BrowserRouter>
    );

    const exitButton = screen.getByText('Salir');
    fireEvent.click(exitButton);

    expect(mockNavigate).toHaveBeenCalledWith('/history');
  });
});