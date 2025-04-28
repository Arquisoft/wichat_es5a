import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter, useNavigate } from 'react-router';
import EditProfile from './EditProfile';
import axios from 'axios';
import "../../i18n.js"

jest.mock('axios');
jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: jest.fn(),
}));

describe('EditProfile Component', () => {
    const mockProfileData = {
        username: 'testuser',
        email: 'test@example.com',
    };

    const mockToken = 'testtoken';
    let mockNavigate;

    beforeEach(() => {
        localStorage.setItem('token', mockToken);
        mockNavigate = jest.fn();
        useNavigate.mockReturnValue(mockNavigate);
        axios.get.mockResolvedValueOnce({ data: mockProfileData });
    });

    afterEach(() => {
        localStorage.removeItem('token');
        jest.clearAllMocks();
    });

    it('renders the username and email input fields with initial values', async () => {
        render(
            <BrowserRouter>
                <EditProfile />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId('username-input')).toBeInTheDocument();
            expect(screen.getByTestId('username-field')).toHaveValue(mockProfileData.username);
            expect(screen.getByTestId('email-input')).toBeInTheDocument();
            expect(screen.getByTestId('email-field')).toHaveValue(mockProfileData.email);
        });
    });

    it('renders the save and delete buttons', async () => {
        render(
            <BrowserRouter>
                <EditProfile />
            </BrowserRouter>
        );
        await waitFor(() => {
            expect(screen.getByTestId('save-button')).toBeInTheDocument();
            expect(screen.getByTestId('cancel-button')).toBeInTheDocument();
            expect(screen.getByTestId('change-button')).toBeInTheDocument();
        });
    });

    it('updates input values when changed', async () => {
        render(
            <BrowserRouter>
                <EditProfile />
            </BrowserRouter>
        );

        await waitFor(() => {
            const usernameInput = screen.getByTestId('username-field');
            const emailInput = screen.getByTestId('email-field');
            const currentInput = screen.getByTestId('current-field');
            const newInput = screen.getByTestId('new-field');
            const repeatInput = screen.getByTestId("repeat-field");

            fireEvent.change(usernameInput, { target: { value: 'newuser' } });
            fireEvent.change(emailInput, { target: { value: 'new@example.com' } });
            fireEvent.change(currentInput, { target: { value: 'currentPassword1' } });
            fireEvent.change(newInput, { target: { value: 'newPassword1' } });
            fireEvent.change(repeatInput, { target: { value: 'newPassword1' } });
        

            expect(usernameInput).toHaveValue('newuser');
            expect(emailInput).toHaveValue('new@example.com');
            expect(currentInput).toHaveValue('currentPassword1');
            expect(newInput).toHaveValue('newPassword1');
            expect(repeatInput).toHaveValue('newPassword1');
        });
    });

    it('navigates to login page on successful save', async () => {
        axios.put.mockResolvedValueOnce({ data: { message: 'Profile updated successfully' } });
        render(
            <BrowserRouter>
                <EditProfile />
            </BrowserRouter>
        );

        await waitFor(() => {
            const saveButton = screen.getByTestId('save-button');
            fireEvent.click(saveButton);
        });

        await waitFor(() => {
            expect(axios.put).toHaveBeenCalledWith(
                'http://localhost:8000/profile/edit/testuser',
                { username: mockProfileData.username, email: mockProfileData.email },
                { headers: { Authorization: `Bearer ${mockToken}` } }
            );
            expect(mockNavigate).toHaveBeenCalledWith('/login');
        });
    });

    it('displays error message on failed save', async () => {
        axios.put.mockRejectedValueOnce({ response: { data: { error: 'Update failed' } } });
        render(
            <BrowserRouter>
                <EditProfile />
            </BrowserRouter>
        );

        await waitFor(() => {
            const saveButton = screen.getByTestId('save-button');
            fireEvent.click(saveButton);
        });

        await waitFor(() => {
            expect(screen.getByText(/update failed/i)).toBeInTheDocument();
        });
    });

    it('navigates to profile page on cancel', async () => {
        render(
            <BrowserRouter>
                <EditProfile />
            </BrowserRouter>
        );
        await waitFor(() => {
            const cancelButton = screen.getByTestId('cancel-button');
            fireEvent.click(cancelButton);
            expect(mockNavigate).toHaveBeenCalledWith('/profile');
        });
    });

    it('displays error message if username is already taken on save', async () => {
        axios.put.mockRejectedValueOnce({
            response: {
                data: { error: 'El nombre de usuario ya está en uso.' },
                status: 409,
            },
        });
        render(
            <BrowserRouter>
                <EditProfile />
            </BrowserRouter>
        );

        await waitFor(() => {
            const saveButton = screen.getByTestId('save-button');
            fireEvent.click(saveButton);
        });

        await waitFor(() => {
            expect(screen.getByText(/el nombre de usuario ya está en uso/i)).toBeInTheDocument();
        });
    });

    it('displays generic error message if user is not found on save (updateOne returns 0 matched)', async () => {
        axios.put.mockRejectedValueOnce({
            response: {
                data: { error: 'Usuario no encontrado.' },
                status: 404,
            },
        });
        render(
            <BrowserRouter>
                <EditProfile />
            </BrowserRouter>
        );

        await waitFor(() => {
            const saveButton = screen.getByTestId('save-button');
            fireEvent.click(saveButton);
        });

        await waitFor(() => {
            expect(screen.getByText(/usuario no encontrado/i)).toBeInTheDocument();
        });
    });

    it('displays generic internal server error on 500 error during save', async () => {
        axios.put.mockRejectedValueOnce({ 
            response: { 
                status: 500, 
                data: { error: 'Error interno del servidor al actualizar el perfil.' } 
            } 
        });
        render(
            <BrowserRouter>
                <EditProfile />
            </BrowserRouter>
        );

        await waitFor(() => {
            const saveButton = screen.getByTestId('save-button');
            fireEvent.click(saveButton);
        });

        await waitFor(() => {
            expect(screen.getByText(/error interno del servidor al actualizar el perfil/i)).toBeInTheDocument();
        });
    });
});