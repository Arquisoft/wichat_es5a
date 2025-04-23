import React, { useEffect } from 'react';

import {Box} from '@mui/material';
import { useNavigate, useLocation } from 'react-router';
import LargeButton from '../ReactComponents/LargeButton';
import CustomH1 from '../ReactComponents/CustomH1';
import NavBar from "../NavBar/NavBar";
import { useTranslation } from "react-i18next";

const Points = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { numRespuestasCorrectas, numPreguntas, difficulty } = location.state || { numRespuestasCorrectas: 0, numPreguntas: 0 };

  useEffect(() => {
    // Generar un número aleatorio entre 0 y 20
    // Cuando se implemente el juego, cambiar por la puntuación conseguida por el usuario.
    //const randomScore = Math.floor(Math.random() * 21);
  }, []);

  const playAgain = () => {
    // Una vez implementado el servicio de preguntas, se podria inicializar desde aquí la llamada a el servicio
    navigate('/gamemode'); 
  }

  const exit = () => {
    navigate('/home');
  }

  return (
    <div>
          <NavBar/>
          <CustomH1>
          {numRespuestasCorrectas} {difficulty === "survival" ? ("/" + numPreguntas) : " "} {t("points-correct")}
          </CustomH1>
          <CustomH1 size="h2">
            {t("good-job")}
          </CustomH1>
          <Box display="flex" justifyContent="center" mt={2}>
            <LargeButton onClick={playAgain} >
              {t("play-again")}
            </LargeButton>
          </Box>
          <Box display="flex" justifyContent="center" mt={2}>
            <LargeButton onClick={exit} >
              {t("exit")}
            </LargeButton>
          </Box>
    </div>
  );
};

export default Points;