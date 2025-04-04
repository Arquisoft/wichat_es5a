import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router';  
import Internationalization from './Internationalization.js';  
import "../../i18n.js"

describe('Internationalization component', () => {

  it('should render the component correctly', () => {
    render(
      <BrowserRouter>
        <Internationalization />
      </BrowserRouter>
    );

    expect(screen.getByText(/Idioma/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Idioma/i));
    expect(screen.getByText(/Español/i)).toBeInTheDocument();
    expect(screen.getByText(/English/i)).toBeInTheDocument();
  });

  it('should change the language when english button is clicked', () => {
    render(
      <BrowserRouter>
        <Internationalization />
      </BrowserRouter>
    );
    fireEvent.click(screen.getByText(/Idioma/i));
    fireEvent.click(screen.getByText(/English/i));
    expect(screen.getByText(/Language/i)).toBeInTheDocument();
  });
});