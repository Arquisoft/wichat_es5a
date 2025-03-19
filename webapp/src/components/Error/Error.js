import React from 'react';
import { Container } from '@mui/material';
import image from './404.png';
import CustomH1 from '../ReactComponents/CustomH1';

const AddUser = () => {

  return (
    <Container component="main" maxWidth="m" sx={{ justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column', marginTop: 4 }}>
        <img src={ image } alt="Error 404" />
        <CustomH1>Página no encontrada</CustomH1>
    </Container>
  );
};

export default AddUser;
