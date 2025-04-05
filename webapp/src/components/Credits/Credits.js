import React from 'react';

import LargeButton from '../ReactComponents/LargeButton';
import { useNavigate } from 'react-router';
import CustomH1 from '../ReactComponents/CustomH1';
import Container from '@mui/material/Container';
import NavBar from "../NavBar/NavBar";
import { useTranslation } from "react-i18next";

const Credits = () => {

  const navigate = useNavigate();
  const { t } = useTranslation();

  const exitCredits = () => {
    navigate('/home');
  }

  return (
    <div>
      <NavBar/>
      <Container
      component="main"
      sx={{
        marginTop: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      >
        <CustomH1>
          {t("colaborators")}
        </CustomH1>
        <CustomH1 size="h5">
          UO288104@uniovi.es - Miguel Morís Gómez
        </CustomH1>
        <CustomH1 size="h5">
          UO287694@uniovi.es - Pablo López Tamargo
        </CustomH1>
        <CustomH1 size="h5">
          UO295432@uniovi.es - Óscar Cervero Luiña
        </CustomH1>
        <CustomH1 size="h5">
          gaelhorta04@gmail.com - Gael Horta Calzada
        </CustomH1>
        <CustomH1 size="h5">
          UO295029@uniovi.es - Marcos Argüelles Rivera
        </CustomH1>
        <LargeButton onClick={exitCredits}>
          {t("exit")}
        </ LargeButton>
      </Container>
    </div>
  );
};

export default Credits;