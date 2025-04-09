import React from 'react';
import { render, fireEvent, screen, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import AddUser from "./AddUser";

const mockAxios = new MockAdapter(axios);

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

    expect(screen.getByLabelText(/Nombre de usuario/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Registrarse/i })).toBeInTheDocument();
    expect(screen.getByText(/¿Ya tienes una cuenta/i)).toBeInTheDocument();
  });

  it('should add a user successfully', async () => {
      mockAxios.onPost('http://localhost:8000/adduser').reply(200, { token: 'mocked_token' });
  
      render(
        <BrowserRouter>
          <AddUser/>
        </BrowserRouter>
      );
  
      fireEvent.change(screen.getByLabelText(/Nombre de usuario/i), { target: { value: 'testadduser' } });
      fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: 'testadduserpass' } });
  
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /Registrarse/i }));
      });
  
      await waitFor(() => {
        expect(localStorage.getItem('token')).toBe('mocked_token');
      });

      await waitFor(() => {
        expect(screen.getAllByText(/Usuario añadido con éxito/i)[0]).toBeInTheDocument();
      })
  });

  it('should handle error when adding user', async () => {
    mockAxios.onPost('http://localhost:8000/adduser').reply(500, { error: 'Internal Server Error' });
  
    render(
      <BrowserRouter>
        <AddUser/>
      </BrowserRouter>
    );


    fireEvent.change(screen.getByLabelText(/Nombre de usuario/i), { target: { value: 'testadduser' } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: 'testadduserpass' } });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Registrarse/i }));
    });

    // Wait for the error Snackbar to be open
    await waitFor(() => {
      expect(screen.getByText(/Error: Internal Server Error/i)).toBeInTheDocument();
    });
  });
});
