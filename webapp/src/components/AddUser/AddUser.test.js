import React from 'react';
import { render, fireEvent, screen, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import AddUser from "./AddUser";
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n'; 

const mockAxios = new MockAdapter(axios);

const fillForm = (username, email, password, confirmPassword) => {
  fireEvent.change(screen.getByTestId('username-input'), { target: { value: username } });
  fireEvent.change(screen.getByTestId('email-input'), { target: { value: email } });
  fireEvent.change(screen.getByTestId('password-input'), { target: { value: password } });
  fireEvent.change(screen.getByTestId('confirm-password-input'), { target: { value: confirmPassword } });
};

describe('AddUser component', () => {

  beforeEach(() => {
      mockAxios.reset();
      localStorage.clear();
  });

  it('should always pass', () => {
    expect(true).toBe(true);
  });
  
  it('should render the add user form correctly', () => {
    render(
      <BrowserRouter>
        <AddUser/>
      </BrowserRouter>
    );

    expect(screen.getByTestId('username-input')).toBeInTheDocument();
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
    expect(screen.getByTestId('confirm-password-input')).toBeInTheDocument();
    expect(screen.getByTestId('signup-button')).toBeInTheDocument();
  });

  it('should add a user successfully', async () => {
      mockAxios.onPost('http://localhost:8000/login').reply(200, { token: 'mocked_token' });
      mockAxios.onPost('http://localhost:8000/adduser').reply(200, { token: 'mocked_token' });
  
      render(
        <BrowserRouter>
          <AddUser/>
        </BrowserRouter>
      );

      fillForm('testuser', 'test@example.com', 'Testpass1', 'Testpass1');
  
      await act(async () => {
        fireEvent.click(screen.getByTestId('signup-button'));
      });
  
      await waitFor(() => {
        expect(localStorage.getItem('token')).toBe('mocked_token');
      });
  });

  it('should show error if username is already taken', async () => {
    mockAxios.onPost('http://localhost:8000/adduser').reply(400, {
      error: 'El nombre de usuario ya está en uso',
    });

    render(
      <BrowserRouter>
        <I18nextProvider i18n={i18n}>
          <AddUser />
        </I18nextProvider>
      </BrowserRouter>
    );

    fillForm('existinguser', 'test@example.com', 'Testpass1', 'Testpass1');

    await act(async () => {
      fireEvent.click(screen.getByTestId('signup-button'));
    });

    await waitFor(() => {
      expect(screen.getByText(/El nombre de usuario ya está en uso/i)).toBeInTheDocument();
    });
  });

  it('should show error if email is already used', async () => {
    mockAxios.onPost('http://localhost:8000/adduser').reply(400, {
      error: 'Ya hay un usuario registrado con ese email',
    });
  
    render(
      <BrowserRouter>
        <I18nextProvider i18n={i18n}>
          <AddUser />
        </I18nextProvider>
      </BrowserRouter>
    );
  
    fillForm('newuser', 'usedemail@example.com', 'Testpass1', 'Testpass1');
  
    await act(async () => {
      fireEvent.click(screen.getByTestId('signup-button'));
    });
  
    await waitFor(() => {
      expect(screen.getByText(/Ya hay un usuario registrado con ese email/i)).toBeInTheDocument();
    });
  });

  it('should show error if passwords do not match', async () => {
    mockAxios.onPost('http://localhost:8000/adduser').reply(400, {
      error: 'Las contraseñas no coinciden',
    });
  
    render(
      <BrowserRouter>
        <I18nextProvider i18n={i18n}>
          <AddUser />
        </I18nextProvider>
      </BrowserRouter>
    );
  
    fillForm('newuser', 'test@example.com', 'Testpass1', 'differentpass');
  
    await act(async () => {
      fireEvent.click(screen.getByTestId('signup-button'));
    });
  
    await waitFor(() => {
      expect(screen.getByText(/Las contraseñas no coinciden/i)).toBeInTheDocument();
    });
  });

  it('should show error if password is weak', async () => {
    mockAxios.onPost('http://localhost:8000/adduser').reply(400, {
      error: 'La contraseña debe tener al menos 7 caracteres y un número',
    });
  
    render(
      <BrowserRouter>
        <I18nextProvider i18n={i18n}>
          <AddUser />
        </I18nextProvider>
      </BrowserRouter>
    );
  
    fillForm('newuser', 'test@example.com', 'abcdefg', 'abcdefg');
  
    await act(async () => {
      fireEvent.click(screen.getByTestId('signup-button'));
    });
  
    await waitFor(() => {
      expect(screen.getByText(/La contraseña debe tener al menos 7 caracteres, uno de ellos mayúscula y otro un número/i)).toBeInTheDocument();
    });
  });

  it('should show unknown error if response is unexpected', async () => {
    mockAxios.onPost('http://localhost:8000/adduser').reply(500, {
      error: 'Error inesperado del servidor',
    });
  
    render(
      <BrowserRouter>
        <I18nextProvider i18n={i18n}>
          <AddUser />
        </I18nextProvider>
      </BrowserRouter>
    );
  
    fillForm('anyuser', 'test@example.com', 'Testpass1', 'Testpass1');
  
    await act(async () => {
      fireEvent.click(screen.getByTestId('signup-button'));
    });
  
    await waitFor(() => {
      expect(screen.getByText(/Ha ocurrido un error inesperado/i)).toBeInTheDocument();
    });
  });

  it('should show error if email format is invalid', async () => {
    mockAxios.onPost('http://localhost:8000/adduser').reply(400, {
      error: 'Formato de email inválido',
    });
  
    render(
      <BrowserRouter>
        <I18nextProvider i18n={i18n}>
          <AddUser />
        </I18nextProvider>
      </BrowserRouter>
    );
  
    fillForm('newuser', 'invalid-email', 'Testpass1', 'Testpass1');
  
    await act(async () => {
      fireEvent.click(screen.getByTestId('signup-button'));
    });
  
    await waitFor(() => {
      expect(screen.getByText(/Formato de email inválido/i)).toBeInTheDocument();
    });
  });

  it('should show error if username is too short', async () => {
    mockAxios.onPost('http://localhost:8000/adduser').reply(400, {
      error: 'El nombre de usuario debe tener al menos 4 caracteres',
    });
  
    render(
      <BrowserRouter>
        <I18nextProvider i18n={i18n}>
          <AddUser />
        </I18nextProvider>
      </BrowserRouter>
    );
  
    fillForm('usr', 'short@example.com', 'Testpass1', 'Testpass1');
  
    await act(async () => {
      fireEvent.click(screen.getByTestId('signup-button'));
    });
  
    await waitFor(() => {
      expect(screen.getByText(/al menos 4 caracteres/i)).toBeInTheDocument();
    });
  });
});
