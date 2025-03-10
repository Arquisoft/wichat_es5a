import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Snackbar, Box } from '@mui/material';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import '../Components.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();

  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

  const loginUser = async () => {
    try {
      const response = await axios.post(`${apiEndpoint}/login`, { username, password });

      setLoginSuccess(true);
      setOpenSnackbar(true);
      navigate('/home'); // Redirige a la ruta /home después de un login exitoso
    } catch (error) {
      setError(error.response.data.error);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container 
      component="main" 
      maxWidth={false} 
      justifyContent="center">
      {loginSuccess ? (
        <Navigate to="/home" replace />
      ) : (
        <Box sx={{ width: '100%', textAlign: 'center', marginTop: 4 }}>
          <Typography component="h1" variant="h1" sx={{ color: "#167D7F", marginTop: 2 }}>
            Inicia sesión
          </Typography>
          <TextField
            margin="normal"
            label="Nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ width: '20%'}}
          />
          <br></br>
          <TextField
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
            onClick={loginUser}
          >
            Login
          </Button>
          <br></br>
          <Link 
            name="gotoaddUser"
            component="button"
            to={"/addUser"}
            sx={{ color: "#167D7F", '&:hover': { color: "#29A0B1" }, marginTop: 2 }}
          >
            ¿No tienes una cuenta todavía? ¡Regístrate aquí!
          </Link>
          <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar} message="Login successful" />
          {error && (
            <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')} message={`Error: ${error}`} />
          )}
        </Box>
        
      )}
    </Container>
  );
};

export default Login;