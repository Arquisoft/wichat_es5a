import React, { useEffect } from 'react';

import { Typography, Box, Button } from '@mui/material';
import { useNavigate, useLocation } from 'react-router';

const Points = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const { numRespuestasCorrectas, numPreguntas } = location.state || { numRespuestasCorrectas: 0, numPreguntas: 0 };

  useEffect(() => {
    // Generar un número aleatorio entre 0 y 20
    // Cuando se implemente el juego, cambiar por la puntuación conseguida por el usuario.
    const randomScore = Math.floor(Math.random() * 21);
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
            <Button
            onClick={playAgain} 
            sx={{ 
              backgroundColor: "#167D7F", 
              color: "white", '&:hover': { backgroundColor: "#29A0B1" },
              marginTop: 2,
              width: '15%'
              }} >
              Jugar otra vez
            </Button>
          </Box>
          <Box display="flex" justifyContent="center" mt={2}>
            <Button 
            onClick={exit} 
            sx={{ 
              backgroundColor: "#167D7F", 
              color: "white", '&:hover': { backgroundColor: "#29A0B1" },
              marginTop: 2,
              width: '15%'
            }} >
              Salir
            </Button>
          </Box>
    </div>
  );
};

export default Points;