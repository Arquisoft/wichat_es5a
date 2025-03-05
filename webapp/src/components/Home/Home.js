import React from 'react';
import { Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {

  const navigate = useNavigate();

  const enterGame = () => {
    // Una vez implementado el servicio de preguntas, se podria inicializar desde aquí la llamada a el servicio
    navigate('/points'); // Cambiar a la ventana de juego cuanto este hecha
  }

  const enterProfile = () => {
    navigate('/profile');
  }

  const enterCredits = () => {
    navigate('/credits');
  }

  const logOut = () => {
    navigate('/login'); // Solo navega a la página de login, cuando se tenga el token de user hay que pasarlo a null
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
        <Button
          onClick={enterGame}
          sx={{ 
            backgroundColor: "#167D7F", 
            color: "white", '&:hover': { backgroundColor: "#29A0B1" },
            marginTop: 2,
            width: '15%'
          }}
        >
          Jugar
        </Button>
      </Box>
      <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
      <Typography component="h1" variant="h6" sx={{ color: "#167D7F", marginTop: 2, textAlign: 'center' }}>
          ¡Edita tu perfil o consulta tus datos históricos!
        </Typography>
        <Button
          onClick={enterProfile}
          sx={{ 
            backgroundColor: "#167D7F", 
            color: "white", '&:hover': { backgroundColor: "#29A0B1" },
            marginTop: 2,
            width: '15%'
          }}
        >
          Perfil
        </Button>
      </Box>
      <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
      <Typography component="h1" variant="h6" sx={{ color: "#167D7F", marginTop: 2, textAlign: 'center' }}>
          ¡Apoya a los desarrolladores!
        </Typography>
        <Button
        onClick={enterCredits}
          sx={{ 
            backgroundColor: "#167D7F", 
            color: "white", '&:hover': { backgroundColor: "#29A0B1" },
            marginTop: 2,
            width: '15%'
          }}
        >
          Créditos
        </Button>
      </Box>
      <Box display="flex" justifyContent="center" mt={2}>
        <Button
        onClick={logOut}
          sx={{ 
            backgroundColor: "#167D7F", 
            color: "white", '&:hover': { backgroundColor: "#29A0B1" },
            marginTop: 2,
            width: '15%'
          }}
        >
          Salir de sesión
        </Button>
      </Box>
    </div>
  );
};

export default Home;