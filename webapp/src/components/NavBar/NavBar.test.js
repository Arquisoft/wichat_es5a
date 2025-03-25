import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import NavBar from './NavBar';
import { BrowserRouter } from 'react-router'

describe('NavBar component', () => {

    it('should always pass', () => {
        expect(true).toBe(true);
    });

    it('should render correctly the nav bar', () => {
        render(
            <BrowserRouter>
                <NavBar/>
            </BrowserRouter>
        );
        expect(true).toBe(true);
    });

    it('should redirect to the home page when clicking on the app logo', async () => {
        render(
            <BrowserRouter>
                <NavBar/>
            </BrowserRouter>
        );
        
        fireEvent.click(screen.getByTestId('logo-tab'));
        expect(window.location.pathname).toBe("/home");
    });

    it("should redirect to the home page when clicking on the app name", async () => {
        render(
            <BrowserRouter>
                <NavBar/>
            </BrowserRouter>
        );
        
        fireEvent.click(screen.getByTestId('wichat-tab'));
        expect(window.location.pathname).toBe("/home");
    });

    it("should redirect to the profile page when clicking on the profile tab", async () => {
        render(
            <BrowserRouter>
                <NavBar/>
            </BrowserRouter>
        );
        
        fireEvent.click(screen.getByTestId('profile-tab'));
        expect(window.location.pathname).toBe("/profile");
    });

    it("should redirect to the history page when clicking on the history tab", async () => {
        render(
            <BrowserRouter>
                <NavBar/>
            </BrowserRouter>
        );
        
        fireEvent.click(screen.getByTestId('history-tab'));
        expect(window.location.pathname).toBe("/history");
    });

    it("should redirect to the credits page when clicking on the credits tab", async () => {
        render(
            <BrowserRouter>
                <NavBar/>
            </BrowserRouter>
        );
        
        fireEvent.click(screen.getByTestId('credits-tab'));
        expect(window.location.pathname).toBe("/credits");
    });

    it("should log out when clicking on the log out option", async () => {
        render(
            <BrowserRouter>
                <NavBar/>
            </BrowserRouter>
        );
        
        fireEvent.click(screen.getByTestId('logout-tab'));
        expect(window.location.pathname).toBe("/login");
    });
});
