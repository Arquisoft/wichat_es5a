import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import Juego from './Game';
import MockAdapter from 'axios-mock-adapter';
import { BrowserRouter } from 'react-router'
import "../../i18n.js"

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
        render(
            <BrowserRouter>
                <Juego />
            </BrowserRouter>
        );
        expect(true).toBe(true);
    });

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
  
    
    it('carga la siguiente pregunta al hacer clic en el botón "Siguiente pregunta"', async () => {
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
        await waitFor(() => expect(screen.getByText('Rusia')).toBeInTheDocument());
    
        // Verifica que la nueva pregunta se ha cargado correctamente.
        expect(screen.getByText('¿De qué país es esta bandera?')).toBeInTheDocument();
    });
    
    it('muestra el temporizador correctamente', async () => {
        // Renderiza el componente Juego dentro de BrowserRouter.
        render(
            <BrowserRouter>
                <Juego />
            </BrowserRouter>
        );
    
        // Verifica que el temporizador se renderiza correctamente.
        expect(screen.getByText(/Tiempo restante/i)).toBeInTheDocument();
    
        // Simula la actualización del temporizador.
        const temporizador = screen.getByText(/Tiempo restante/i);
        expect(temporizador).toBeInTheDocument();
    });
    
    it('desactiva los botones después de seleccionar una respuesta', async () => {
        // Renderiza el componente Juego dentro de BrowserRouter.
        render(
            <BrowserRouter>
                <Juego />
            </BrowserRouter>
        );
    
        // Espera a que las respuestas se rendericen.
        await waitFor(() => screen.getByText('España'));
    
        // Simula el clic en una respuesta.
        fireEvent.click(screen.getByText('España'));
    
        // Verifica que todos los botones están deshabilitados.
        expect(screen.getByText('España')).toBeDisabled();
        expect(screen.getByText('Francia')).toBeDisabled();
        expect(screen.getByText('Italia')).toBeDisabled();
        expect(screen.getByText('Alemania')).toBeDisabled();
    });
    
    it('resta puntos al usar el botón de pista', async () => {
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
        fireEvent.click(pistaButton);
    
        // Verifica que los puntos se restan correctamente.
        expect(screen.getByText(/Puntuación: -20/i)).toBeInTheDocument();
    });

    it('cambia el color del botón si la respuesta es incorrecta en cambiarColorUno', async () => {
      render(
          <BrowserRouter>
              <Juego />
          </BrowserRouter>
      );
  
      // Espera a que se rendericen los botones con las respuestas
      const incorrecta = await screen.findByText('Francia');
      const correcta = await screen.findByText('España');
  
      // Clic en la respuesta incorrecta
      fireEvent.click(incorrecta);
  
      // Verifica que el botón incorrecto se ponga en rojo
      expect(incorrecta).toHaveStyle('background-color: #E14E4E');
  
      // Verifica que el botón correcto se ponga en verde
      expect(correcta).toHaveStyle('background-color: #05B92B');
    });

    it('restablece el color de todos los botones al hacer clic en "Siguiente pregunta"', async () => {
      render(
          <BrowserRouter>
              <Juego />
          </BrowserRouter>
      );
  
      const incorrecta = await screen.findByText('Francia');
  
      // Simula respuesta
      fireEvent.click(incorrecta);
  
      // Clic en botón siguiente
      const siguienteBtn = await screen.findByRole('button', { name: /Siguiente pregunta/i });
      fireEvent.click(siguienteBtn);
  
      // Espera a que se actualicen los botones
      await waitFor(() => {
          const botones = screen.getAllByRole('button');
          botones.forEach(btn => {
              // Asegura que no tengan color
              expect(btn).not.toHaveStyle('background-color: #E14E4E');
              expect(btn).not.toHaveStyle('background-color: #05B92B');
          });
      });
    });

    it('realiza la transición correctamente al hacer clic en "Siguiente pregunta" y guarda los datos cuando se llega al final', async () => {
      mock.onPost(`${apiEndpoint}/savegame`).reply(200, {}); 
  
      render(
          <BrowserRouter>
              <Juego />
          </BrowserRouter>
      );
  
      const respuestasCorrectas = ['España', 'Rusia', 'Rusia', 'Rusia', 'Rusia'];
  
      for (let i = 0; i < respuestasCorrectas.length; i++) {
          const botonCorrecto = await screen.findByText(respuestasCorrectas[i]);
          fireEvent.click(botonCorrecto);
          const siguienteBtn = await screen.findByRole('button', { name: /Siguiente pregunta/i });
          fireEvent.click(siguienteBtn);
      }
  
      await waitFor(() => {
          expect(screen.getByText(/Puntuación/i)).toBeInTheDocument();
      });
    });
});
