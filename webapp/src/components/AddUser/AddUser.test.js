import React from 'react';
import { render, fireEvent, screen, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import AddUser from "./AddUser";

const mockAxios = new MockAdapter(axios);

const fillForm = (username, password, confirmPassword) => {
  fireEvent.change(screen.getByTestId('username-input'), { target: { value: username } });
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

      fillForm('testadduser', 'testadduserpass', 'testadduserpass');
  
      await act(async () => {
        fireEvent.click(screen.getByTestId('signup-button'));
      });
  
      await waitFor(() => {
        expect(localStorage.getItem('token')).toBe('mocked_token');
      });

      // await waitFor(() => {
      //   expect(screen.getAllByText(/Usuario añadido con éxito/i)[0]).toBeInTheDocument();
      // })
  });

  it('should handle error when adding user', async () => {
    mockAxios.onPost('http://localhost:8000/adduser').reply(500, { error: 'Internal Server Error' });
  
    render(
      <BrowserRouter>
        <AddUser/>
      </BrowserRouter>
    );


    fillForm('testadduser', 'testadduserpass', 'testadduserpass');

    await act(async () => {
      fireEvent.click(screen.getByTestId('signup-button'));
    });

    // Wait for the error Snackbar to be open
    await waitFor(() => {
      expect(screen.getByText(/Error: Internal Server Error/i)).toBeInTheDocument();
    });
  });
});
