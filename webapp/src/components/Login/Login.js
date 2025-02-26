// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Snackbar, Box, Fab } from '@mui/material';
import { Typewriter } from "react-simple-typewriter";
import AddIcon from '@mui/icons-material/Add'; // Importa un icono para el botón
import { Octicons } from '@primer/octicons-react'; // Importa Octicons si es de @primer/octicons-react
import { TouchableOpacity } from 'react-native';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';
  const apiKey = process.env.REACT_APP_LLM_API_KEY || 'None';

  const loginUser = async () => {
    try {
      const response = await axios.post(`${apiEndpoint}/login`, { username, password });

      // Extract data from the response
      const { createdAt: userCreatedAt } = response.data;

      setLoginSuccess(true);

      setOpenSnackbar(true);
    } catch (error) {
      setError(error.response.data.error);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ marginTop: 4 }}>
      {loginSuccess ? (
        <div>
          <Typography component="h1" variant="h1" sx={{ textAlign: 'center', marginTop: 2 }}>
            WICHAT
          </Typography>
          <Box display="flex" justifyContent="center" mt={2}>
            <Button variant="contained" color="primary" >
              Jugar
            </Button>
          </Box>
          <Box display="flex" justifyContent="center" mt={2}>
            <Button variant="contained" color="primary" >
              Perfil
            </Button>
          </Box>
          <Box display="flex" justifyContent="center" mt={2}>
            <Button variant="contained" color="primary" >
              Créditos
            </Button>
          </Box>
        </div>
      ) : (
        <div>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <TextField
            margin="normal"
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={loginUser}>
            Login
          </Button>
          <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar} message="Login successful" />
          {error && (
            <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')} message={`Error: ${error}`} />
          )}
        </div>
      )}
    </Container>
  );
};

export default Login;
