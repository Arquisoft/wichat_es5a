import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import axios from 'axios';
import { BrowserRouter } from 'react-router';
import ContestHistory from './ContestHistory';

jest.mock('axios');

const mockNavigate = jest.fn();
jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: '1' }),
}));

describe('ContestHistory Component', () => {
    beforeEach(() => {
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
        const mockResponse = {
            data: {
                questions: [
                    {
                        question: '¿Cuál es la capital de Francia?',
                        answer: 'París',
                        wrongAnswers: ['Madrid', 'Londres', 'Berlín', 'Roma'],
                        image: 'image_url',
                        createdAt: '2025-04-01T12:00:00Z',
                    },
                ],
                times: [15],
                clues: [1],
                correctAnswers: [1],
            },
        };

        axios.get.mockResolvedValueOnce(mockResponse);

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
            expect(screen.getByText('Fecha de generación de la pregunta: 01/04/2025 12:00:00')).toBeInTheDocument();
        });
    });

    it('should navigate to the history page when "Salir" is clicked', async () => {
        render(
            <BrowserRouter>
                <ContestHistory />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Salir')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('Salir'));
        expect(mockNavigate).toHaveBeenCalledWith('/history');
    });

    it('should handle API errors gracefully', async () => {
        axios.get.mockRejectedValueOnce(new Error('API Error'));

        render(
            <BrowserRouter>
                <ContestHistory />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Historial de preguntas')).toBeInTheDocument();
        });

        expect(console.error).toHaveBeenCalledWith(
            'Error al obtener el número de usuarios:',
            expect.any(Error)
        );
    });
});