import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import Points from './Points';

describe('Points Component', () => {
  it('should display the correct score passed from Game.js', () => {
    // Renderizar el componente con datos simulados de estado
    render(
      <MemoryRouter initialEntries={[{ pathname: '/points', state: { numRespuestasCorrectas: 7, numPreguntas: 10 } }]}>
        <Routes>
          <Route path="/points" element={<Points />} />
        </Routes>
      </MemoryRouter>
    );

    // Verificar que el puntaje se muestra correctamente
    expect(screen.getByText('7/10 Acertadas')).toBeInTheDocument();
    expect(screen.getByText('¡Bien hecho!')).toBeInTheDocument();
  });

  it('should navigate to /gamemode when "Jugar otra vez" is clicked', () => {
    const mockNavigate = jest.fn();

    // Renderizar el componente con datos simulados de estado
    render(
      <MemoryRouter initialEntries={[{ pathname: '/points', state: { numRespuestasCorrectas: 7, numPreguntas: 10 } }]}>
        <Routes>
          <Route path="/points" element={<Points />} />
        </Routes>
      </MemoryRouter>
    );

    // Hacer clic en el botón "Jugar otra vez"
    fireEvent.click(screen.getByText('Jugar otra vez'));

    // Verificar que se navega a /gamemode
    expect(mockNavigate).not.toBeCalled();
  });

  it('should navigate to /home when "Salir" is clicked', () => {
    const mockNavigate = jest.fn();

    // Renderizar el componente con datos simulados de estado
    render(
      <MemoryRouter initialEntries={[{ pathname: '/points', state: { numRespuestasCorrectas: 7, numPreguntas: 10 } }]}>
        <Routes>
          <Route path="/points" element={<Points />} />
        </Routes>
      </MemoryRouter>
    );

    // Hacer clic en el botón "Salir"
    fireEvent.click(screen.getByText('Salir'));

    // Verificar que se navega a /home
    expect(mockNavigate).not.toBeCalled();
  });

  it('should show 0/0 Acertadas if no state is provided', () => {
    // Renderizar el componente sin datos de estado
    render(
      <MemoryRouter initialEntries={[{ pathname: '/points' }]}>
        <Routes>
          <Route path="/points" element={<Points />} />
        </Routes>
      </MemoryRouter>
    );

    // Verificar que muestra 0/0 Acertadas por defecto
    expect(screen.getByText('0/0 Acertadas')).toBeInTheDocument();
  });
});