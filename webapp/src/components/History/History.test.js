import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import axios from 'axios';
import { BrowserRouter } from 'react-router';
import History from './History';

jest.mock('axios');

const mockNavigate = jest.fn();
jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: () => mockNavigate,
}));

jest.spyOn(console, 'error').mockImplementation(() => { }); // Suppress console.error warnings in tests

describe('History Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render the initial UI correctly', () => {
        render(
            <BrowserRouter>
                <History />
            </BrowserRouter>
        );

        expect(screen.getByText('Jugadores totales: 0')).toBeInTheDocument();
        expect(screen.getByText('Preguntas generadas: 0')).toBeInTheDocument();
        expect(screen.getByText('Salir')).toBeInTheDocument();
    });

    it('should fetch and display data from the API', async () => {
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

        axios.get.mockResolvedValueOnce(mockResponse);

        render(
            <BrowserRouter>
                <History />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Jugadores totales: 5')).toBeInTheDocument();
            expect(screen.getByText('Preguntas generadas: 10')).toBeInTheDocument();
            expect(screen.getByText('Dificultad: easy')).toBeInTheDocument();
            expect(screen.getByText('Modo: single')).toBeInTheDocument();
            expect(screen.getByText('Preguntas acertadas: 1')).toBeInTheDocument();
            expect(screen.getByText('Puntos: 100')).toBeInTheDocument();
            expect(screen.getByText('Tiempo total: 70 segundos')).toBeInTheDocument();
            expect(screen.getByText('Número de pistas usadas: 3 segundos')).toBeInTheDocument();
            expect(screen.getByText(/Fecha del concurso: 01\/04\/2025 \d{2}:\d{2}:\d{2}/)).toBeInTheDocument();
        });
    });

    it('should navigate to the contest details page when "Detalles" is clicked', async () => {
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

        axios.get.mockResolvedValueOnce(mockResponse);

        render(
            <BrowserRouter>
                <History />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Detalles')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('Detalles'));
        expect(mockNavigate).toHaveBeenCalledWith('/contest/1');
    });

    it('should navigate to the home page when "Salir" is clicked', async () => {
        render(
            <BrowserRouter initialEntries={['/history']}>
                <History />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Salir')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('Salir'));
        // Esperamos que la navegación haya ocurrido (esto verifica que la URL cambie)
        expect(mockNavigate).toHaveBeenCalledWith('/home');
    });

    it('should handle API errors gracefully', async () => {
        axios.get.mockRejectedValueOnce(new Error('API Error'));

        render(
            <BrowserRouter>
                <History />
            </BrowserRouter>
        );

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
        const mockResponse = {
            data: {
                userCount: 5,
                questionCount: 10,
                contests: [],
            },
        };

        axios.get.mockResolvedValueOnce(mockResponse);

        render(
            <BrowserRouter>
                <History />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Jugadores totales: 5')).toBeInTheDocument();
            expect(screen.getByText('Preguntas generadas: 10')).toBeInTheDocument();
            expect(screen.queryByText('Dificultad:')).not.toBeInTheDocument();
        });
    });
});