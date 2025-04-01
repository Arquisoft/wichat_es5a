import React from 'react';
import { render, fireEvent, screen, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Login from './Login';

const mockAxios = new MockAdapter(axios);

describe('Login component', () => {
  beforeEach(() => {
    mockAxios.reset();
    localStorage.clear();
  });

  it('should render the login form correctly', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    expect(screen.getByLabelText(/Nombre de usuario/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
    expect(screen.getByText(/¿No tienes una cuenta/i)).toBeInTheDocument();
  });

  it('should log in successfully and redirect to /home', async () => {
    mockAxios.onPost('http://localhost:8000/login').reply(200, { token: 'mocked_token' });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/Nombre de usuario/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: 'testpass' } });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Login/i }));
    });

    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe('mocked_token');
    });
  });

  it('should show an error message if login fails', async () => {
    mockAxios.onPost('http://localhost:8000/login').reply(401, { error: 'Credenciales incorrectas' });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/Nombre de usuario/i), { target: { value: 'wronguser' } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: 'wrongpass' } });

    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    await waitFor(() => {
      expect(screen.getByText(/Error: Credenciales incorrectas/i)).toBeInTheDocument();
    });
  });
});