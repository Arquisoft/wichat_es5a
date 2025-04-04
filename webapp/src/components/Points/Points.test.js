import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import Points from './Points';
import "../../i18n.js"

// Mock global de useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockNavigate,
}));

describe('Points Component', () => {
  const renderPoints = (state = { numRespuestasCorrectas: 0, numPreguntas: 0 }) => {
    return render(
      <MemoryRouter initialEntries={[{ pathname: '/points', state }]}>
        <Routes>
          <Route path="/points" element={<Points />} />
        </Routes>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks(); 
  });

  it('should display the correct score passed from Game.js', () => {
    renderPoints({ numRespuestasCorrectas: 7, numPreguntas: 10 });

    // Verificar que el puntaje se muestra correctamente
    expect(screen.getByText('7/10 acertadas')).toBeInTheDocument();
    expect(screen.getByText('¡Bien hecho!')).toBeInTheDocument();
  });

  it('should navigate to /gamemode when "Jugar otra vez" is clicked', () => {
    renderPoints({ numRespuestasCorrectas: 7, numPreguntas: 10 });

    // Hacer clic en el botón "Jugar otra vez"
    fireEvent.click(screen.getByText('Jugar otra vez'));

    // Verificar que se navega a /gamemode
    expect(mockNavigate).toHaveBeenCalledWith('/gamemode');
  });

  it('should navigate to /home when "Salir" is clicked', () => {
    renderPoints({ numRespuestasCorrectas: 7, numPreguntas: 10 });

    // Hacer clic en el botón "Salir"
    fireEvent.click(screen.getByText('Salir'));

    // Verificar que se navega a /home
    expect(mockNavigate).toHaveBeenCalledWith('/home');
  });

  it('should show 0/0 Acertadas if no state is provided', () => {
    renderPoints();

    // Verificar que muestra 0/0 Acertadas por defecto
    expect(screen.getByText('0/0 acertadas')).toBeInTheDocument();
  });
});