import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import Juego from './Game';
import MockAdapter from 'axios-mock-adapter';
import { BrowserRouter } from 'react-router-dom';

const mockAxios = new MockAdapter(axios);

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

describe('Juego component', () => {
    it('should always pass', () => {
        expect(true).toBe(true);
    });

    it('renderiza el componente Juego correctamente', () => {
        render(
            <BrowserRouter>
                <Juego />
            </BrowserRouter>
        );
        expect(true).toBe(true);
    });

    it('renderiza los elementos iniciales correctamente', () => {
        // Renderiza el componente Juego dentro de un BrowserRouter para simular el enrutamiento.
        render(
            <BrowserRouter>
                <Juego />
            </BrowserRouter>
        );
    
        // Verifica que el texto de la pregunta se renderiza correctamente.
        // /pregunta/i es una expresión regular que busca "pregunta" sin distinguir mayúsculas/minúsculas.
        expect(screen.getByText(/pregunta/i)).toBeInTheDocument();
    
        // Verifica que el texto del temporizador se renderiza correctamente.
        expect(screen.getByText(/Tiempo restante/i)).toBeInTheDocument();
    
        // Verifica que la puntuación inicial se renderiza correctamente (Puntuación: 0).
        expect(screen.getByText(/Puntuación: 0/i)).toBeInTheDocument();
    
        // Verifica que el botón "¿Necesitas una pista?" se renderiza correctamente.
        // getByRole busca un elemento por su rol (button) y su nombre accesible.
        expect(screen.getByRole('button', { name: /¿Necesitas una pista?/i })).toBeInTheDocument();
    
        // Verifica que el botón "Siguiente pregunta" se renderiza correctamente.
        expect(screen.getByRole('button', { name: /Siguiente pregunta/i })).toBeInTheDocument();
    });

    it('actualiza la puntuación al seleccionar la respuesta correcta', async () => {
        // Simula la respuesta de la API para obtener una pregunta y sus respuestas.
        mockAxios.onPost(`${apiEndpoint}/questions/flag`).reply(200, {
            question: '¿De qué país es esta bandera?',
            answer: 'España',
            wrongAnswers: ['Francia', 'Italia', 'Alemania'],
            image: null,
        });
    
        // Renderiza el componente Juego dentro de BrowserRouter.
        render(
            <BrowserRouter>
                <Juego />
            </BrowserRouter>
        );
    
        // Espera a que la pregunta y las respuestas se rendericen.
        await waitFor(() => expect(screen.getByText('España')).toBeInTheDocument());
    
        // Simula el clic en el botón de la respuesta correcta.
        fireEvent.click(screen.getByText('España'));
    
        // Verifica que la puntuación se actualiza a 100.
        expect(screen.getByText(/Puntuación: 100/i)).toBeInTheDocument();
    
        // Verifica que el botón de la respuesta correcta se pone en verde.
        expect(screen.getByText('España')).toHaveStyle('background-color: #05B92B');
    });

    it('muestra la pista del LLM al hacer clic en el botón de pista', async () => {
        // Simula la respuesta del LLM.
        mockAxios.onPost('http://localhost:8003/ask').reply(200, {
            answer: 'Una pista sobre la bandera.',
        });
    
        // Renderiza el componente Juego dentro de BrowserRouter.
        render(
            <BrowserRouter>
                <Juego />
            </BrowserRouter>
        );
    
        // Simula el clic en el botón de pista.
        fireEvent.click(screen.getByRole('button', { name: /¿Necesitas una pista?/i }));
    
        // Espera a que la respuesta del LLM se muestre en el DOM.
        await waitFor(() => expect(screen.getByText(/Respuesta del LLM:/i)).toBeInTheDocument());
    });

    it('carga la siguiente pregunta al hacer clic en el botón "Siguiente pregunta"', async () => {
        // Simula la respuesta de la API para obtener dos preguntas.
        mockAxios.onPost(`${apiEndpoint}/questions/flag`).reply(200, {
            question: '¿De qué país es esta bandera?',
            answer: 'España',
            wrongAnswers: ['Francia', 'Italia', 'Alemania'],
            image: null,
        }).reply(200, {
            question: '¿De qué país es esta bandera?',
            answer: 'Francia',
            wrongAnswers: ['España', 'Italia', 'Alemania'],
            image: null,
        });
    
        // Renderiza el componente Juego dentro de BrowserRouter.
        render(
            <BrowserRouter>
                <Juego />
            </BrowserRouter>
        );
    
        // Espera a que la primera pregunta y las respuestas se rendericen.
        await waitFor(() => expect(screen.getByText('España')).toBeInTheDocument());
    
        // Simula el clic en el botón "Siguiente pregunta".
        fireEvent.click(screen.getByRole('button', { name: /Siguiente pregunta/i }));
    
        // Espera a que la segunda pregunta y las respuestas se rendericen.
        await waitFor(() => expect(screen.getByText('Francia')).toBeInTheDocument());
    
        // Verifica que la nueva pregunta se ha cargado correctamente.
        expect(screen.getByText('¿De qué país es esta bandera?')).toBeInTheDocument();
    });
});
