import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router';  
import GameMode from './GameMode';  
import "../../i18n.js"

describe('GameMode component', () => {

  it('should render the component correctly', () => {
    render(
      <BrowserRouter>
        <GameMode />
      </BrowserRouter>
    );

    // Verificar que los textos de los botones de los modos de juego están presentes
    expect(screen.getByText(/Selecciona el modo de juego/i)).toBeInTheDocument();
    expect(screen.getByText(/Ciudades/i)).toBeInTheDocument();
    expect(screen.getByText(/Banderas/i)).toBeInTheDocument();
    expect(screen.getByText(/Música/i)).toBeInTheDocument();
    expect(screen.getByText(/Fútbol/i)).toBeInTheDocument();
    expect(screen.getByText(/Comida/i)).toBeInTheDocument();

    // Verificar los botones de dificultad
    expect(screen.getByText(/Selecciona la dificultad/i)).toBeInTheDocument();
    expect(screen.getByText(/Fácil/i)).toBeInTheDocument();
    expect(screen.getByText(/Media/i)).toBeInTheDocument();
    expect(screen.getByText(/Difícil/i)).toBeInTheDocument();
  });

  it('should change button state when a mode is selected', () => {
    render(
      <BrowserRouter>
        <GameMode />
      </BrowserRouter>
    );

    const ciudadesButton = screen.getByText(/Ciudades/i);
    const banderasButton = screen.getByText(/Banderas/i);

    // Al hacer click en el botón "Ciudades", debería activarse el estilo "contained"
    fireEvent.click(ciudadesButton);
    expect(ciudadesButton).toHaveClass('selected');

    // Al hacer click en "Banderas", se debería desactivar el estilo "contained" en el botón anterior
    fireEvent.click(banderasButton);
    expect(banderasButton).toHaveClass('selected');
    expect(ciudadesButton).not.toHaveClass('selected');
  });

  it('should change button state when a difficulty is selected', () => {
    render(
      <BrowserRouter>
        <GameMode />
      </BrowserRouter>
    );

    const facilButton = screen.getByText(/Fácil/i);
    const medioButton = screen.getByText(/Media/i);

    // Al hacer click en "Fácil", debería activarse el estilo "contained"
    fireEvent.click(facilButton);
    expect(facilButton).toHaveClass('selected');

    // Al hacer click en "Media", se debería desactivar el estilo "contained" en el botón anterior
    fireEvent.click(medioButton);
    expect(medioButton).toHaveClass('selected');
    expect(facilButton).not.toHaveClass('selected');
  });

  it('should enable the start game button when both mode and difficulty are selected', () => {
    render(
      <BrowserRouter>
        <GameMode />
      </BrowserRouter>
    );

    const startButton = screen.getByRole('button', { name: /Jugar/i });
    const ciudadesButton = screen.getByText(/Ciudades/i);
    const facilButton = screen.getByText(/Fácil/i);

    // El botón de empezar juego debería estar deshabilitado inicialmente
    expect(startButton).toBeDisabled();

    // Seleccionamos el modo y la dificultad
    fireEvent.click(ciudadesButton);
    fireEvent.click(facilButton);

    // El botón debería habilitarse
    expect(startButton).toBeEnabled();
  });

  it('should navigate to the game screen when "Empezar juego" is clicked', async () => {
    render(
      <BrowserRouter initialEntries={['/gamemode']}>
        <GameMode />
      </BrowserRouter>
    );

    const ciudadesButton = screen.getByText(/Ciudades/i);
    const facilButton = screen.getByText(/Fácil/i);
    const startButton = screen.getByRole('button', { name: /Jugar/i });

    // Seleccionamos el modo y la dificultad
    fireEvent.click(ciudadesButton);
    fireEvent.click(facilButton);

    // Simulamos el clic en el botón "Empezar juego"
    fireEvent.click(startButton);

    // Esperamos que la navegación haya ocurrido (esto verifica que la URL cambie)
    await waitFor(() => expect(window.location.pathname).toBe('/game'));
  });

});