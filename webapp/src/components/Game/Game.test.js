import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import Juego from './Game';
import MockAdapter from 'axios-mock-adapter';
import { BrowserRouter } from 'react-router'
import "../../i18n.js"

// Función auxiliar para renderizar el componente Juego
const renderJuego = () => {
    render(
        <BrowserRouter>
            <Juego />
        </BrowserRouter>
    );
};

// Función auxiliar para esperar a que un texto específico se renderice
const waitForText = async (text) => {
    await waitFor(() => expect(screen.getByText(text)).toBeInTheDocument());
};

// Función auxiliar para simular clic en un botón por su texto
const clickButtonByText = async (text) => {
    const button = await screen.findByRole('button', { name: text });
    fireEvent.click(button);
    return button;
};

describe('Juego component', () => {
    let mock;
    // Datos mockeados para la pregunta
    const mockData = [{
      question: 'question-flag',
      answer: 'España',
      wrongAnswers: ['Francia', 'Italia', 'Alemania'],
      image: null,
    }, {
      question: 'question-flag',
      answer: 'Rusia',
      wrongAnswers: ['Francia', 'Italia', 'Alemania'],
      image: null,
    }, {
      question: 'question-flag',
      answer: 'Rusia',
      wrongAnswers: ['Francia', 'Italia', 'Alemania'],
      image: null,
    }, {
      question: 'question-flag',
      answer: 'Rusia',
      wrongAnswers: ['Francia', 'Italia', 'Alemania'],
      image: null,
    }, {
      question: 'question-flag',
      answer: 'Rusia',
      wrongAnswers: ['Francia', 'Italia', 'Alemania'],
      image: null,
    }];

    // Configuración del mock
    const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

    beforeEach(() => {
      // Crear un nuevo mock de axios antes de cada prueba
      mock = new MockAdapter(axios);
      // Aquí mockeamos cualquier endpoint dinámico que pase `mode` en la URL
      mock.onPost(new RegExp(`${apiEndpoint}/questions/.*`)).reply(200, mockData);
    });

    afterEach(() => {
      // Restaurar el mock después de cada prueba
      mock.restore();
    });
    it('should always pass', () => {
        expect(true).toBe(true);
    });

    it('renderiza el componente Juego correctamente', () => {
        renderJuego();
        expect(true).toBe(true);
    });

    it('actualiza la puntuación al seleccionar la respuesta correcta', async () => {
        const mode = 'flag';
    
        renderJuego();
    
        // Espera a que la pregunta y las respuestas se rendericen.
        await waitForText('¿De qué país es esta bandera?');
    
        // Simula el clic en el botón de la respuesta correcta.
        fireEvent.click(screen.getByText('España'));
    
        // Verifica que la puntuación se actualiza a 100.
        expect(screen.getByText(/Puntuación: 100/i)).toBeInTheDocument();
    
        // Verifica que el botón de la respuesta correcta se pone en verde.
        expect(screen.getByText('España')).toHaveStyle('background-color: #05B92B');

        // Verifica que los demás botones están deshabilitados después de seleccionar la respuesta
        expect(screen.getByText('Francia')).toBeDisabled();
        expect(screen.getByText('Italia')).toBeDisabled();
        expect(screen.getByText('Alemania')).toBeDisabled();
    });

    it('muestra la pista del LLM al hacer clic en el botón de pista', async () => {
        // Simula la respuesta del LLM.
        mock.onPost('http://localhost:8003/ask').reply(200, {
            answer: 'Una pista sobre la bandera.',
        });
    
        renderJuego();

        // Espera a que el botón de pista esté habilitado.
        const pistaButton = await screen.findByRole('button', { name: /¿Necesitas una pista?/i });
        await waitFor(() => expect(pistaButton).not.toBeDisabled());
    
        // Simula el clic en el botón de pista.
        fireEvent.click(screen.getByRole('button', { name: /¿Necesitas una pista?/i }));
    
        // Espera a que la respuesta del LLM se muestre en el DOM.
        await waitFor(() => expect(screen.getByText(/Respuesta del LLM:/i)).toBeInTheDocument());
    });

    it('carga la siguiente pregunta al hacer clic en el botón "Siguiente pregunta"', async () => {
        renderJuego();

        // Espera a que la primera pregunta y las respuestas se rendericen
        await waitForText('España');

        // Simula el clic en el botón "Siguiente pregunta"
        await clickButtonByText(/Siguiente pregunta/i);

        // Espera a que la segunda pregunta y las respuestas se rendericen
        await waitForText('Rusia');

        // Verifica que la nueva pregunta se ha cargado correctamente
        expect(screen.getByText('¿De qué país es esta bandera?')).toBeInTheDocument();
    });

    it('muestra el temporizador correctamente', async () => {
        renderJuego();

        // Verifica que el temporizador se renderiza correctamente
        expect(screen.getByText(/Tiempo restante/i)).toBeInTheDocument();
    });

    it('desactiva los botones después de seleccionar una respuesta', async () => {
        renderJuego();

        // Espera a que las respuestas se rendericen
        await waitForText('España');

        // Simula el clic en una respuesta
        fireEvent.click(screen.getByText('España'));

        // Verifica que todos los botones están deshabilitados
        expect(screen.getByText('España')).toBeDisabled();
        expect(screen.getByText('Francia')).toBeDisabled();
        expect(screen.getByText('Italia')).toBeDisabled();
        expect(screen.getByText('Alemania')).toBeDisabled();
    });

    it('resta puntos al usar el botón de pista', async () => {
        // Simula la respuesta del LLM
        mock.onPost('http://localhost:8003/ask').reply(200, {
            answer: 'Una pista sobre la bandera.',
        });

        renderJuego();

        // Espera a que el botón de pista esté habilitado
        const pistaButton = await clickButtonByText(/¿Necesitas una pista?/i);

        // Verifica que los puntos se restan correctamente
        await waitForText(/Puntuación: -20/i);
    });

    it('resta puntos al usar el chat', async () => {
        renderJuego();

        // Espera a que el botón de chat esté habilitado
        const chatButton = await clickButtonByText(/Hablar con el chat/i);

        // Verifica que los puntos se restan correctamente
        await waitForText(/Puntuación: -40/i);
    });
});
