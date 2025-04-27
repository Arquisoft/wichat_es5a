import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import Home from './Home';
import "../../i18n.js"

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

  const testCases = [
    { buttonText: 'Jugar', expectedPath: '/gamemode' },
    { buttonText: 'Perfil', expectedPath: '/profile' },
    { buttonText: 'Histórico', expectedPath: '/history' },
    { buttonText: 'Créditos', expectedPath: '/credits' },
    { buttonText: 'Clasificación', expectedPath: '/ranking' }, // Nuevo caso para el botón Ranking
  ];

  testCases.forEach(({ buttonText, expectedPath }) => {
    it(`should navigate to ${expectedPath} when "${buttonText}" is clicked`, () => {
      render(
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      );
      const button = screen.getByText(buttonText);
      fireEvent.click(button);

      // Verificar que se navega a la ruta esperada
      expect(mockNavigate).toHaveBeenCalledWith(expectedPath);
    });
  });

  it('should navigate to /login and remove token when "Cerrar sesión" is clicked', () => {
    // Simular que hay un token en localStorage
    localStorage.setItem('token', 'mockToken');

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    // Hacer clic en el botón "Cerrar sesión"
    fireEvent.click(screen.getByText('Cerrar sesión'));

    // Verificar que el token fue eliminado
    expect(localStorage.getItem('token')).toBeNull();

    // Verificar que se navega a /login
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});