import React from 'react';
import { render, fireEvent, screen, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Login from './Login';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n'; 

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
    expect(screen.getByRole('button', { name: /Entrar/i })).toBeInTheDocument();
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
      fireEvent.click(screen.getByRole('button', { name: /Entrar/i }));
    });

    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe('mocked_token');
    });
  });

  it('should show an error message if login fails', async () => {
    mockAxios.onPost('http://localhost:8000/login').reply(401, { error: 'Invalid credentials' });

    render(
      <BrowserRouter>
        <I18nextProvider i18n={i18n}>
          <Login />
        </I18nextProvider>
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/Nombre de usuario/i), { target: { value: 'wronguser' } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: 'wrongpass' } });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Entrar/i }));
    });

    await waitFor(() => {
      expect(screen.getByText(/Credenciales inválidas/i)).toBeInTheDocument();
    });
  });
});