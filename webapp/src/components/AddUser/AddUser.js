import React, { useState } from 'react';
import axios from 'axios';
import { Container, TextField, Snackbar } from '@mui/material';
import { /*useNavigate,*/ Link } from 'react-router';

import '../Components.css';
import LargeButton from '../ReactComponents/LargeButton';
import CustomH1 from '../ReactComponents/CustomH1';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

const AddUser = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  //const navigate = useNavigate();

  const addUser = async () => {
    try {
      const response = await axios.post(`${apiEndpoint}/adduser`, { username, password });

      const { token } = response.data;

      localStorage.setItem('token', token);

      setOpenSnackbar(true);
      //navigate('/home');
    } catch (error) {
      setError(error.response.data.error);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container component="main" maxWidth={false}  sx={{ marginTop: 4, textAlign: 'center' }} >
      <CustomH1>
        Crea una cuenta
      </CustomH1>
      <TextField
        name="username"
        margin="normal"
        label="Nombre de usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        sx={{ width: '20%'}}
      />
      <br></br>
      <TextField
        name="password"
        margin="normal"
        label="Contraseña"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={{ width: '20%'}}
      />
      <br></br>
      <LargeButton onClick={addUser}>
        Registrarse
      </LargeButton>
      <br></br>
      {openSnackbar && <p>Usuario añadido con éxito</p>}
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar} message="Usuario añadido con éxito" />
      {error && (
        <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')} message={`Error: ${error}`} />
      )}
      <Link component="button" variant="body2" to={"/login"}>
            ¿Ya tienes una cuenta? ¡Inicia sesión aquí!
      </Link>
    </Container>
  );
};

export default AddUser;
