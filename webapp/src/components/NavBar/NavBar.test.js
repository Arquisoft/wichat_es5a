import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import NavBar from './NavBar';
import { BrowserRouter } from 'react-router'

describe('NavBar component', () => {
    
    beforeEach(() => {
        renderNavBar();
    });

    it('should always pass', () => {
        expect(true).toBe(true);
    });

    const testCases = [
        { tab: 'logo-tab', expectedPath: '/home' },
        { tab: 'wichat-tab', expectedPath: '/home' },
        { tab: 'profile-tab', expectedPath: '/profile' },
        { tab: 'history-tab', expectedPath: '/history' },
        { tab: 'credits-tab', expectedPath: '/credits' },
        { tab: 'logout-tab', expectedPath: '/login' },
    ];

    testCases.forEach(({ tab, expectedPath }) => {
        it(`should redirect to ${expectedPath} when clicking on ${tab}`, () => {
            clickOn(tab);
            expect(window.location.pathname).toBe(expectedPath);
        });
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