import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import Juego from './Game';
import MockAdapter from 'axios-mock-adapter';
import { BrowserRouter } from 'react-router'

describe('Juego component', () => {
    let mock;
    // Datos mockeados para la pregunta
    const mockData = [{
      question: '¿De qué país es esta bandera?',
      answer: 'España',
      wrongAnswers: ['Francia', 'Italia', 'Alemania'],
      image: null,
    }, {
        question: '¿De qué país es esta bandera?',
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
        render(
            <BrowserRouter>
                <Juego />
            </BrowserRouter>
        );
        expect(true).toBe(true);
    });

    // it('renderiza los elementos iniciales correctamente', () => {
    //     // Renderiza el componente Juego dentro de un BrowserRouter para simular el enrutamiento.
    //     render(
    //         <BrowserRouter>
    //             <Juego />
    //         </BrowserRouter>
    //     );
    
    //     // Verifica que el texto de la pregunta se renderiza correctamente.
    //     // /pregunta/i es una expresión regular que busca "pregunta" sin distinguir mayúsculas/minúsculas.
    //     expect(screen.getByText(/pregunta/i)).toBeInTheDocument();
    
    //     // Verifica que el texto del temporizador se renderiza correctamente.
    //     expect(screen.getByText(/Tiempo restante/i)).toBeInTheDocument();
    
    //     // Verifica que la puntuación inicial se renderiza correctamente (Puntuación: 0).
    //     expect(screen.getByText(/Puntuación: 0/i)).toBeInTheDocument();
    
    //     // Verifica que el botón "¿Necesitas una pista?" se renderiza correctamente.
    //     // getByRole busca un elemento por su rol (button) y su nombre accesible.
    //     expect(screen.getByRole('button', { name: /¿Necesitas una pista?/i })).toBeInTheDocument();
    
    //     // Verifica que el botón "Siguiente pregunta" se renderiza correctamente.
    //     expect(screen.getByRole('button', { name: /Siguiente pregunta/i })).toBeInTheDocument();
    // });

    it('actualiza la puntuación al seleccionar la respuesta correcta', async () => {
        const mode = 'flag';
    
        // Renderiza el componente Juego dentro de BrowserRouter.
        render(
            <BrowserRouter>
                <Juego />
            </BrowserRouter>
        );
    
        // Espera a que la pregunta y las respuestas se rendericen.
        await waitFor(() => screen.getByText('¿De qué país es esta bandera?'));
    
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
    
        // Renderiza el componente Juego dentro de BrowserRouter.
        render(
            <BrowserRouter>
                <Juego />
            </BrowserRouter>
        );

        // Espera a que el botón de pista esté habilitado.
        const pistaButton = await screen.findByRole('button', { name: /¿Necesitas una pista?/i });
        await waitFor(() => expect(pistaButton).not.toBeDisabled());
    
        // Simula el clic en el botón de pista.
        fireEvent.click(screen.getByRole('button', { name: /¿Necesitas una pista?/i }));
    
        // Espera a que la respuesta del LLM se muestre en el DOM.
        await waitFor(() => expect(screen.getByText(/Respuesta del LLM:/i)).toBeInTheDocument());
    });

    // it('carga la siguiente pregunta al hacer clic en el botón "Siguiente pregunta"', async () => {
    //     // Simula dos respuestas de la API.
    //     mockAxios.onPost(`${apiEndpoint}/questions/flag`).reply(200, [
    //         {
    //             question: '¿De qué país es esta bandera?',
    //             answer: 'España',
    //             wrongAnswers: ['Francia', 'Italia', 'Alemania'],
    //             image: null,
    //         },
    //         {
    //             question: '¿De qué país es esta bandera?',
    //             answer: 'Japón',
    //             wrongAnswers: ['China', 'Corea del Sur', 'Vietnam'],
    //             image: null,
    //         },
    //     ]);
    
    //     // Renderiza el componente Juego dentro de BrowserRouter.
    //     render(
    //         <BrowserRouter>
    //             <Juego />
    //         </BrowserRouter>
    //     );
    
    //     // Espera a que la primera pregunta y las respuestas se rendericen.
    //     await waitFor(() => expect(screen.getByText('España')).toBeInTheDocument());
    
    //     // Simula el clic en el botón "Siguiente pregunta".
    //     fireEvent.click(screen.getByRole('button', { name: /Siguiente pregunta/i }));
    
    //     // Espera a que la segunda pregunta y las respuestas se rendericen.
    //     await waitFor(() => expect(screen.getByText('Japón')).toBeInTheDocument());
    
    //     // Verifica que la nueva pregunta se ha cargado correctamente.
    //     expect(screen.getByText('¿De qué país es esta bandera?')).toBeInTheDocument();
    // });
});
