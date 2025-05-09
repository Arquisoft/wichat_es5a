import React, { version } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import ChatBot from './ChatBot';
import "../../i18n.js"

jest.mock('axios');

describe('ChatBot Component', () => {
  const mockRespuestaCorrecta = "Mock correct answer";

  beforeEach(() => {
    jest.clearAllMocks();
    axios.post.mockResolvedValue({ data: { answer: 'Default response' } });
  });

  it('renders initial bot message', () => {
    render(<ChatBot respuestaCorrecta={mockRespuestaCorrecta} />);
    expect(screen.getByText(/¡Hola! Soy tu asistente. ¿En qué puedo ayudarte?/i)).toBeInTheDocument();
  });

  it('displays user message when sent', async () => {
    render(<ChatBot respuestaCorrecta={mockRespuestaCorrecta} />);
    
    const input = screen.getByPlaceholderText(/Escribe un mensaje.../i);
    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.click(screen.getByText(/Enviar/i));
    
    await waitFor(() => {
      expect(screen.getByText('Test message')).toBeInTheDocument();
      expect(screen.getByText('Default response')).toBeInTheDocument();
    });
  });

  it('calls API with correct parameters', async () => {
    const mockResponse = { data: { answer: 'Mock API response' } };
    axios.post.mockResolvedValue(mockResponse);

    render(<ChatBot respuestaCorrecta={mockRespuestaCorrecta} />);
    
    const input = screen.getByPlaceholderText(/Escribe un mensaje.../i);
    fireEvent.change(input, { target: { value: 'Test question' } });
    fireEvent.click(screen.getByText(/Enviar/i));
    
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:8000/askllm',
        {
          question: 'Test question',
          model: 'gemini',
          resCorr: mockRespuestaCorrecta,
          language: "es",
          mode: undefined,
          version: "chat",
        }
      );
    });
  });

  it('handles API errors gracefully', async () => {
    axios.post.mockRejectedValue(new Error('API Error'));

    render(<ChatBot respuestaCorrecta={mockRespuestaCorrecta} />);
    
    const input = screen.getByPlaceholderText(/Escribe un mensaje.../i);
    fireEvent.change(input, { target: { value: 'Test error' } });
    fireEvent.click(screen.getByText(/Enviar/i));
    
    await waitFor(() => {
      expect(screen.getByText(/Ocurrió un error al procesar tu pregunta./i)).toBeInTheDocument();
    });
  });

  it('clears input after message is sent', async () => {
    render(<ChatBot respuestaCorrecta={mockRespuestaCorrecta} />);
    
    const input = screen.getByPlaceholderText(/Escribe un mensaje.../i);
    fireEvent.change(input, { target: { value: 'Test clear' } });
    fireEvent.click(screen.getByText(/Enviar/i));
    
    await waitFor(() => {
      expect(input).toHaveValue('');
    });
  });
  it('closes the chat when the close button is clicked', () => {
    render(<ChatBot respuestaCorrecta={mockRespuestaCorrecta} />);

    expect(screen.getByText(/¡Hola! Soy tu asistente. ¿En qué puedo ayudarte?/i)).toBeInTheDocument();

    const closeButton = screen.getByText('X');
    fireEvent.click(closeButton);

    expect(screen.queryByText(/¡Hola! Soy tu asistente. ¿En qué puedo ayudarte?/i)).not.toBeInTheDocument();
});
});