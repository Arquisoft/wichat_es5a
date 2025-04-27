import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import axios from 'axios';
import { BrowserRouter } from 'react-router';
import Ranking from './Ranking';
import '../../i18n.js';

jest.mock('axios');

const mockNavigate = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockNavigate,
}));

jest.spyOn(console, 'error').mockImplementation(() => {}); // Suprime los warnings de console.error en los tests

// Datos de prueba
const mockResponse = {
  data: {
    users: [
      { username: 'user1', points: 100 },
      { username: 'user2', points: 80 },
      { username: 'user3', points: 60 },
    ],
  },
};

describe('Ranking Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the initial UI correctly', () => {
    render(
      <BrowserRouter>
        <Ranking />
      </BrowserRouter>
    );

    expect(screen.getByText('Ranking')).toBeInTheDocument();
    expect(screen.getByText('Salir')).toBeInTheDocument();
  });

  it('should fetch and display data from the API', async () => {
    axios.get.mockResolvedValueOnce(mockResponse);

    render(
      <BrowserRouter>
        <Ranking />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('user1')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();

      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('user2')).toBeInTheDocument();
      expect(screen.getByText('80')).toBeInTheDocument();

      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('user3')).toBeInTheDocument();
      expect(screen.getByText('60')).toBeInTheDocument();
    });
  });

  it('should navigate to the user history when "Historial" is clicked', async () => {
    axios.get.mockResolvedValueOnce(mockResponse);

    render(
      <BrowserRouter>
        <Ranking />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getAllByText('Historial')[0]).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByText('Historial')[0]); // Haz clic en el botón "Historial" del primer usuario
    expect(mockNavigate).toHaveBeenCalledWith('/history', {"state": {"user": "user1"}});
  });

  it('should navigate to the home page when "Salir" is clicked', () => {
    render(
      <BrowserRouter>
        <Ranking />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText('Salir'));
    expect(mockNavigate).toHaveBeenCalledWith('/home');
  });

  it('should handle API errors gracefully', async () => {
    axios.get.mockRejectedValueOnce(new Error('API Error'));

    render(
      <BrowserRouter>
        <Ranking />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        'Error al obtener el número de usuarios:',
        expect.any(Error)
      );
    });
  });
});