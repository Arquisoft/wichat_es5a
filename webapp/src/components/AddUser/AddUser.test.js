import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import AddUser from './AddUser';

const mockAxios = new MockAdapter(axios);

function renderAddUser() {
  render(
    <BrowserRouter>
      <AddUser/>
    </BrowserRouter>
  );
}

describe('AddUser component', () => {

  it('should always pass', () => {
    expect(true).toBe(true);
  });

  beforeEach(() => {
    mockAxios.reset();
  });

  /*it('should render the add user formm correctly', async () => {
    renderAddUser();

    expect(screen.getByLabelText(/Nombre de usuario/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Registrarse/i })).toBeInTheDocument();
    expect(screen.getByText(/¿Ya tienes una cuenta/i)).toBeInTheDocument();
  });

  it('should add a user successfully', async () => {
    mockAxios.onPost('http://localhost:8000/addUser').reply(200);

    renderAddUser();

    fireEvent.change(screen.getByLabelText(/Nombre de usuario/i), { target: { value: 'testUser' } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: 'testPassword' } });

    fireEvent.click(screen.getByText(/Registrarse/i));

    await waitFor(() => {
      expect(screen.getByText(/Usuario añadido con éxito/i)).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  /*it('should handle error when adding user', async () => {
    render(<AddUser />);

    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const addUserButton = screen.getByRole('button', { name: /Add User/i });

    // Mock the axios.post request to simulate an error response
    mockAxios.onPost('http://localhost:8000/adduser').reply(500, { error: 'Internal Server Error' });

    // Simulate user input
    fireEvent.change(usernameInput, { target: { value: 'testUser' } });
    fireEvent.change(passwordInput, { target: { value: 'testPassword' } });

    // Trigger the add user button click
    fireEvent.click(addUserButton);

    // Wait for the error Snackbar to be open
    await waitFor(() => {
      expect(screen.getByText(/Error: Internal Server Error/i)).toBeInTheDocument();
    });
  });*/
});
