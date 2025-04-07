import React, { useState } from 'react';
import axios from 'axios';
import { Container, TextField, Snackbar, Box } from '@mui/material';
import { useNavigate, Navigate, Link } from 'react-router';
import '../Components.css';
import LargeButton from '../ReactComponents/LargeButton';
import CustomH1 from '../ReactComponents/CustomH1';
import NavBar from "../NavBar/NavBar";

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

      const { token } = response.data;

      localStorage.setItem('token', token);

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
    <div>
      <NavBar/>
      <Container 
        component="main" 
        maxWidth={false} 
        justifyContent="center">
        {loginSuccess ? (
          <Navigate to="/home" replace />
        ) : (
          <Box sx={{ width: '100%', textAlign: 'center', marginTop: 4 }}>
            <CustomH1>
              Inicia sesión
            </CustomH1>
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
            <LargeButton  onClick={loginUser}>
              Login
            </LargeButton>
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
    </div>
  );
};

export default Login;