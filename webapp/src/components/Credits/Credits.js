import React from 'react';

import { Typography} from '@mui/material';
import LargeButton from '../ReactComponents/LargeButton/LargeButton';
import { useNavigate } from 'react-router';

const Credits = () => {

  const navigate = useNavigate();
  
  const exitCredits = () => {
    navigate('/home');
  }

  return (
    <div>
          <Typography component="h1" variant="h1" sx={{ textAlign: 'center', marginTop: 2, color: "#167D7F" }}>
          Participantes
          </Typography>
          <Typography component="h1" variant="h5" sx={{ textAlign: 'center', marginTop: 2, color: "#167D7F" }}>
            UO288104@uniovi.es - Miguel Morís Gómez
          </Typography>
          <Typography component="h1" variant="h5" sx={{ textAlign: 'center', marginTop: 2, color: "#167D7F" }}>
          UO287694@uniovi.es - Pablo López Tamargo
          </Typography>
          <Typography component="h1" variant="h5" sx={{ textAlign: 'center', marginTop: 2, color: "#167D7F" }}>
          UO295432@uniovi.es - Óscar Cervero Luiña
          </Typography>
          <Typography component="h1" variant="h5" sx={{ textAlign: 'center', marginTop: 2, color: "#167D7F" }}>
          UO285412@uniovi.es - Néstor Fernández García
          </Typography>
          <Typography component="h1" variant="h5" sx={{ textAlign: 'center', marginTop: 2, color: "#167D7F" }}>
          gaelhorta04@gmail.com - Gael Horta Calzada
          </Typography>
          <Typography component="h1" variant="h5" sx={{ textAlign: 'center', marginTop: 2, color: "#167D7F" }}>
          UO295029@uniovi.es - Marcos Argüelles Rivera
          </Typography>
          <LargeButton onClick={exitCredits}>
            Salir 
          </ LargeButton>
    </div>
  );
};

export default Credits;