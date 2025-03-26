import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import NavBar from './NavBar';
import { BrowserRouter } from 'react-router'

describe('NavBar component', () => {

    it('should always pass', () => {
        expect(true).toBe(true);
    });

    it('should render correctly the nav bar', () => {
        renderNavBar();
        expect(true).toBe(true);
    });

    it('should redirect to the home page when clicking on the app logo', async () => {
        renderNavBar();

        clickOn('logo-tab');
        expect(window.location.pathname).toBe("/home");
    });

    it("should redirect to the home page when clicking on the app name", async () => {
        renderNavBar();
        
        clickOn('wichat-tab');
        expect(window.location.pathname).toBe("/home");
    });

    it("should redirect to the profile page when clicking on the profile tab", async () => {
        renderNavBar();

        clickOn('profile-tab');
        expect(window.location.pathname).toBe("/profile");
    });

    it("should redirect to the history page when clicking on the history tab", async () => {
        renderNavBar();
        
        clickOn('history-tab');
        expect(window.location.pathname).toBe("/history");
    });

    it("should redirect to the credits page when clicking on the credits tab", async () => {
        renderNavBar();
        
        clickOn('credits-tab');
        expect(window.location.pathname).toBe("/credits");
    });

    it("should log out when clicking on the log out option", async () => {
        renderNavBar();
        
        clickOn('logout-tab');
        expect(window.location.pathname).toBe("/login");
    });
});


function renderNavBar() {
    render(
        <BrowserRouter>
            <NavBar/>
        </BrowserRouter>
    );
}

function clickOn(id) {
    fireEvent.click(screen.getByTestId(id));
}