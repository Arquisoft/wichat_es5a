import React from 'react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router';
import LargeButton from '../ReactComponents/LargeButton';
import CustomH1 from '../ReactComponents/CustomH1';
import NavBar from "../NavBar/NavBar";

const Home = () => {

  const navigate = useNavigate();

  const enterGame = () => {
    navigate('/gamemode'); 
  }

  const enterProfile = () => {
    navigate('/profile');
  }

  const enterCredits = () => {
    navigate('/credits');
  }

  const enterHistory = () => {
    navigate('/history');
  }

  const logOut = () => {
    localStorage.removeItem('token');
    navigate('/login');
  }

  return (
    <div id="body-container">
      <NavBar/>
      <CustomH1>
        WICHAT
      </CustomH1>
      <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
        <CustomH1 size="h6">
          ¿Quieres echarte una partida?
        </CustomH1>
        <LargeButton onClick={enterGame}>
          Jugar
        </LargeButton>
      </Box>
      <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
      <CustomH1 size="h6">
          ¡Edita tu perfil o consulta tus datos históricos!
        </CustomH1>
        <LargeButton onClick={enterProfile}>
          Perfil
        </LargeButton>
      </Box>
      <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
      <CustomH1 size="h6">
          ¡Consulta datos de otros usuarios y preguntas generadas!
        </CustomH1>
        <LargeButton onClick={enterHistory}>
          Histórico
        </LargeButton>
      </Box>
      <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
      <CustomH1 size="h6">
          ¡Apoya a los desarrolladores!
        </CustomH1>
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