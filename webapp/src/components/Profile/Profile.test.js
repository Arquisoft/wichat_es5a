import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import Profile from './Profile';
import axios from 'axios';

jest.mock('axios');

describe('Profile Component', () => {
  const mockProfileData = {
    username: 'testuser',
    email: 'test@example.com',
  };

  const mockToken = 'testtoken';

  beforeEach(() => {
    localStorage.setItem('token', mockToken);
  });

  afterEach(() => {
    localStorage.removeItem('token');
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    axios.get.mockResolvedValueOnce({ data: mockProfileData });
    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );
  });

  it('fetches and displays profile data', async () => {
    axios.get.mockResolvedValueOnce({ data: mockProfileData });
    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    console.log(mockProfileData.username)
    console.log(mockProfileData.email)

    await waitFor(() => {
        expect(screen.getByText(new RegExp(mockProfileData.username))).toBeInTheDocument();
        expect(screen.getByText(new RegExp(mockProfileData.email))).toBeInTheDocument();
      });
  });

  it('displays error message when fetch fails', async () => {
    axios.get.mockRejectedValueOnce({ response: { data: { error: 'Fetch error' } } });
    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Fetch error')).toBeInTheDocument();
    });
  });

  it('displays error message when token is not found', async () => {
    localStorage.removeItem('token');
    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('No se encontró el token.')).toBeInTheDocument();
    });
  });
});