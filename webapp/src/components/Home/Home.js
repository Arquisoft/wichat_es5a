import React from 'react';
import { Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router';
import LargeButton from '../ReactComponents/LargeButton/LargeButton';

const Home = () => {

  const navigate = useNavigate();

  const enterGame = () => {
    // Una vez implementado el servicio de preguntas, se podria inicializar desde aquí la llamada a el servicio
    navigate('/game'); // Cambiar a la ventana de juego cuanto este hecha
  }

  const enterProfile = () => {
    navigate('/profile');
  }

  const enterCredits = () => {
    navigate('/credits');
  }

  const logOut = () => {
    localStorage.removeItem('token');
    navigate('/login');
  }

  return (
    <div>
      <Typography component="h1" variant="h3" sx={{ color: "#167D7F", marginTop: 2, textAlign: 'center' }}>
        Bienvenido a
      </Typography>
      <Typography component="h1" variant="h1" sx={{ color: "#167D7F", marginTop: 2, textAlign: 'center' }}>
        WICHAT
      </Typography>
      <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
        <Typography component="h1" variant="h6" sx={{ color: "#167D7F", marginTop: 2, textAlign: 'center' }}>
          ¿Quieres echarte una partida?
        </Typography>
        <LargeButton onClick={enterGame}>
          Jugar
        </LargeButton>
      </Box>
      <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
      <Typography component="h1" variant="h6" sx={{ color: "#167D7F", marginTop: 2, textAlign: 'center' }}>
          ¡Edita tu perfil o consulta tus datos históricos!
        </Typography>
        <LargeButton onClick={enterProfile}>
          Perfil
        </LargeButton>
      </Box>
      <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
      <Typography component="h1" variant="h6" sx={{ color: "#167D7F", marginTop: 2, textAlign: 'center' }}>
          ¡Apoya a los desarrolladores!
        </Typography>
        <LargeButton onClick={enterCredits}>
          Créditos
        </LargeButton>
      </Box>
      <Box display="flex" justifyContent="center" mt={2}>
        <LargeButton onClick={logOut}>
          Salir de sesión
        </LargeButton>
      </Box>
    </div>
  );
};

export default Home;