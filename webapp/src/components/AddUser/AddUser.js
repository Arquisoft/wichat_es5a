import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Snackbar } from '@mui/material';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import '../Components.css';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

const AddUser = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();

  const addUser = async () => {
    try {
      await axios.post(`${apiEndpoint}/adduser`, { username, password });
      setOpenSnackbar(true);
      navigate('/home');
    } catch (error) {
      setError(error.response.data.error);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container component="main" maxWidth={false}  sx={{ marginTop: 4, textAlign: 'center' }} >
      <Typography component="h1" variant="h1" sx={{ color: "#167D7F", marginTop: 2 }}>
        Crea una cuenta
      </Typography>
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
      <Button 
        sx={{ 
          backgroundColor: "#167D7F", 
          color: "white", '&:hover': { backgroundColor: "#29A0B1" },
          marginTop: 2,
          width: '15%'
        }} 
        onClick={addUser}>
        Registrarse
      </Button>
      <br></br>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar} message="User added successfully" />
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
