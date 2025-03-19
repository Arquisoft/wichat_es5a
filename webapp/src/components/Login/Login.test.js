import React from 'react';
import { render, fireEvent, screen, waitFor, act } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { MemoryRouter } from 'react-router';
import Login from './Login';

const mockAxios = new MockAdapter(axios);

describe('Login component', () => {

  beforeEach(() => {
    mockAxios.reset();
  });

  afterEach(() => {
    mockAxios.restore();
  });

  it('should log in successfully', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const usernameInput = screen.getByLabelText(/Nombre de usuario/i);
    const passwordInput = screen.getByLabelText(/Contraseña/i);
    const loginButton = screen.getByRole('button', { name: /Login/i });

    // Simular respuesta exitosa del servidor
    mockAxios.onPost('http://localhost:8000/login').reply(200, { createdAt: '2024-01-01T12:34:56Z' });

    // Simular interacción del usuario
    await act(async () => {
        fireEvent.change(usernameInput, { target: { value: 'testUser' } });
        fireEvent.change(passwordInput, { target: { value: 'testPassword' } });
        fireEvent.click(loginButton);
      });

      // Verificar que el token se ha guardado en localStorage
    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe('mockToken');
    });

    // Verificar redirección al home
    await waitFor(() => {
      expect(screen.queryByText(/Inicia sesión/i)).not.toBeInTheDocument();
    });
  });

  it('should handle error when logging in', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const usernameInput = screen.getByLabelText(/Nombre de usuario/i);
    const passwordInput = screen.getByLabelText(/Contraseña/i);
    const loginButton = screen.getByRole('button', { name: /Login/i });

    // Simular error en el login
    mockAxios.onPost('http://localhost:8000/login').reply(401, { error: 'Unauthorized' });

    // Simular interacción del usuario
    fireEvent.change(usernameInput, { target: { value: 'testUser' } });
    fireEvent.change(passwordInput, { target: { value: 'testPassword' } });
    fireEvent.click(loginButton);

    // Esperar a que aparezca el mensaje de error
    await waitFor(() => {
      expect(screen.getByText(/Error: Unauthorized/i)).toBeInTheDocument();
    });

    // Verificar que el usuario NO se ha logueado
    expect(localStorage.getItem('token')).toBeNull();
  });
});
