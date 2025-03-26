import React from 'react';

import { useNavigate } from 'react-router';
import LargeButton from '../ReactComponents/LargeButton';
import CustomH1 from '../ReactComponents/CustomH1';
import Container from '@mui/material/Container';
import NavBar from "../NavBar/NavBar";

const ContestHistory = () => {

  const navigate = useNavigate();
  
  const exitProfile = () => {
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
              AAAAAAAAAAAA
            </CustomH1>
            <LargeButton onClick={exitProfile}>
              Salir
            </LargeButton>
      </Container>
    </div>
  );
};

export default ContestHistory;