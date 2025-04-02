import React from 'react';
import { render, screen, act } from '@testing-library/react';
import Temporizador from './Temporizador';

jest.useFakeTimers();

describe('Temporizador Component', () => {
  it('should start with the initial time and count down', () => {
    const tiempoInicial = 10;
    const tiempoAcabadoMock = jest.fn();
    const onTimeUpdateMock = jest.fn(); // Mock para onTimeUpdate

    render(
      <Temporizador
        restart={false}
        tiempoInicial={tiempoInicial}
        tiempoAcabado={tiempoAcabadoMock}
        pausa={false}
        handleRestart={jest.fn()}
        onTimeUpdate={onTimeUpdateMock} // Pasar el mock
      />
    );

    // Verificar que el temporizador comienza con el tiempo inicial
    expect(screen.getByText('10')).toBeInTheDocument();

    // Avanzar el tiempo en 3 segundos
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    // Verificar que el temporizador ha contado hacia abajo
    expect(screen.getByText('7')).toBeInTheDocument();
  });

  it('should call tiempoAcabado when the timer reaches 0', () => {
    const tiempoInicial = 5;
    const tiempoAcabadoMock = jest.fn();
    const onTimeUpdateMock = jest.fn(); // Mock para onTimeUpdate

    render(
      <Temporizador
        restart={false}
        tiempoInicial={tiempoInicial}
        tiempoAcabado={tiempoAcabadoMock}
        pausa={false}
        handleRestart={jest.fn()}
        onTimeUpdate={onTimeUpdateMock} // Pasar el mock
      />
    );

    // Avanzar el tiempo hasta que llegue a 0
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    // Verificar que tiempoAcabado se ha llamado
    expect(tiempoAcabadoMock).toHaveBeenCalled();
  });

  it('should pause the timer when pausa is true', () => {
    const tiempoInicial = 10;
    const tiempoAcabadoMock = jest.fn();
    const onTimeUpdateMock = jest.fn(); // Mock para onTimeUpdate

    const { rerender } = render(
      <Temporizador
        restart={false}
        tiempoInicial={tiempoInicial}
        tiempoAcabado={tiempoAcabadoMock}
        pausa={false}
        handleRestart={jest.fn()}
        onTimeUpdate={onTimeUpdateMock} // Pasar el mock
      />
    );

    // Avanzar el tiempo en 3 segundos
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    // Verificar que el temporizador ha contado hacia abajo
    expect(screen.getByText('7')).toBeInTheDocument();

    // Pausar el temporizador
    rerender(
      <Temporizador
        restart={false}
        tiempoInicial={tiempoInicial}
        tiempoAcabado={tiempoAcabadoMock}
        pausa={true}
        handleRestart={jest.fn()}
        onTimeUpdate={onTimeUpdateMock} // Pasar el mock
      />
    );

    // Avanzar el tiempo en 3 segundos más
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    // Verificar que el temporizador no ha cambiado
    expect(screen.getByText('7')).toBeInTheDocument();
  });

  it('should restart the timer when restart is true', () => {
    const tiempoInicial = 10;
    const tiempoAcabadoMock = jest.fn();
    const handleRestartMock = jest.fn();
    const onTimeUpdateMock = jest.fn(); // Mock para onTimeUpdate

    const { rerender } = render(
      <Temporizador
        restart={false}
        tiempoInicial={tiempoInicial}
        tiempoAcabado={tiempoAcabadoMock}
        pausa={false}
        handleRestart={handleRestartMock}
        onTimeUpdate={onTimeUpdateMock} // Pasar el mock
      />
    );

    // Avanzar el tiempo en 5 segundos
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    // Verificar que el temporizador ha contado hacia abajo
    expect(screen.getByText('5')).toBeInTheDocument();

    // Reiniciar el temporizador
    rerender(
      <Temporizador
        restart={true}
        tiempoInicial={tiempoInicial}
        tiempoAcabado={tiempoAcabadoMock}
        pausa={false}
        handleRestart={handleRestartMock}
        onTimeUpdate={onTimeUpdateMock} // Pasar el mock
      />
    );

    // Verificar que el temporizador se reinicia
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(handleRestartMock).toHaveBeenCalled();
  });
});