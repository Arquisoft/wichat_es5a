import React from 'react';
import { Container } from '@mui/material';
import image from './404.png';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

const AddUser = () => {

  return (
    <Container component="main" maxWidth="m" sx={{ justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column', marginTop: 4 }}>
        <img src={ image } alt="Error 404" />
        <h1>Página no encontrada</h1>
    </Container>
  );
};

export default AddUser;
