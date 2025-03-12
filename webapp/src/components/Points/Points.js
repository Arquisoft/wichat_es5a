import React, { useEffect } from 'react';

import { Typography, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router';
import LargeButton from '../ReactComponents/LargeButton/LargeButton';

const Points = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const { numRespuestasCorrectas, numPreguntas } = location.state || { numRespuestasCorrectas: 0, numPreguntas: 0 };

  useEffect(() => {
    // Generar un número aleatorio entre 0 y 20
    // Cuando se implemente el juego, cambiar por la puntuación conseguida por el usuario.
    //const randomScore = Math.floor(Math.random() * 21);
  }, []);

  const playAgain = () => {
    // Una vez implementado el servicio de preguntas, se podria inicializar desde aquí la llamada a el servicio
    navigate('/game'); // Cambiar a la ventana de juego cuanto este hecha
  }

  const exit = () => {
    navigate('/home');
  }

  return (
    <div>
          <Typography component="h1" variant="h1" sx={{ color: "#167D7F", marginTop: 2, textAlign: 'center' }}>
          {numRespuestasCorrectas}/{numPreguntas} Acertadas
          </Typography>
          <Typography component="h1" variant="h2" sx={{ color: "#167D7F", marginTop: 2, textAlign: 'center' }}>
            ¡Bien hecho!
          </Typography>
          <Box display="flex" justifyContent="center" mt={2}>
            <LargeButton onClick={playAgain} >
              Jugar otra vez
            </LargeButton>
          </Box>
          <Box display="flex" justifyContent="center" mt={2}>
            <LargeButton onClick={exit} >
              Salir
            </LargeButton>
          </Box>
    </div>
  );
};

export default Points;