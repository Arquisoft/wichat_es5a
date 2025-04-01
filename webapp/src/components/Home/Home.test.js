import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import Home from './Home';

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: jest.fn(),
}));

describe('Home Component', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(require('react-router').useNavigate).mockReturnValue(mockNavigate);
  });

  it('should navigate to /gamemode when "Jugar" is clicked', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    // Hacer clic en el botón "Jugar"
    fireEvent.click(screen.getByText('Jugar'));

    // Verificar que se navega a /gamemode
    expect(mockNavigate).toHaveBeenCalledWith('/gamemode');
  });

  it('should navigate to /profile when "Perfil" is clicked', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    // Hacer clic en el botón "Perfil"
    fireEvent.click(screen.getByText('Perfil'));

    // Verificar que se navega a /profile
    expect(mockNavigate).toHaveBeenCalledWith('/profile');
  });

  it('should navigate to /history when "Histórico" is clicked', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    // Hacer clic en el botón "Histórico"
    fireEvent.click(screen.getByText('Histórico'));

    // Verificar que se navega a /history
    expect(mockNavigate).toHaveBeenCalledWith('/history');
  });

  it('should navigate to /credits when "Créditos" is clicked', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    // Hacer clic en el botón "Créditos"
    fireEvent.click(screen.getByText('Créditos'));

    // Verificar que se navega a /credits
    expect(mockNavigate).toHaveBeenCalledWith('/credits');
  });

  it('should navigate to /login and remove token when "Salir de sesión" is clicked', () => {
    // Simular que hay un token en localStorage
    localStorage.setItem('token', 'mockToken');

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    // Hacer clic en el botón "Salir de sesión"
    fireEvent.click(screen.getByText('Salir de sesión'));

    // Verificar que el token fue eliminado
    expect(localStorage.getItem('token')).toBeNull();

    // Verificar que se navega a /login
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});