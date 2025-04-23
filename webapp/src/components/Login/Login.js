import React, { useState } from 'react';
import axios from 'axios';
import { Container, TextField, Box } from '@mui/material';
import { useNavigate, Navigate } from 'react-router';
import '../Components.css';
import LargeButton from '../ReactComponents/LargeButton';
import CustomH1 from '../ReactComponents/CustomH1';
import NavBar from "../NavBar/NavBar";
import { useTranslation } from "react-i18next";

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loginSuccess, setLoginSuccess] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

  const clearFieldError = (field) => {
    setFieldErrors((prev) => ({ ...prev, [field]: null }));
  };

  const loginUser = async () => {
    try {
      const response = await axios.post(`${apiEndpoint}/login`, { username, password });

      const { token } = response.data;

      localStorage.setItem('token', token);

      setLoginSuccess(true);
      navigate('/home'); // Redirige a la ruta /home después de un login exitoso
    } catch (error) {
      setFieldErrors({ general: t('errors.invalidCredentials') });
    }
  };

  return (
    <div>
      <NavBar/>
      <Container 
        component="main" 
        maxWidth={false} >
        {loginSuccess ? (
          <Navigate to="/home" replace />
        ) : (
          <Box sx={{ width: '100%', textAlign: 'center', marginTop: 4 }}>
            <CustomH1>
              {t("login")}
            </CustomH1>
            <TextField
              margin="normal"
              label={t("username")}
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                clearFieldError('username');
              }}
              error={!!fieldErrors.username}
              helperText={fieldErrors.username}
              sx={{ width: '20%'}}
            />
            <br></br>
            <TextField
              margin="normal"
              label={t("password")}
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                clearFieldError('password');
              }}
              error={!!fieldErrors.password}
              helperText={fieldErrors.password}
              sx={{ width: '20%'}}
            />
            <br></br>
            <LargeButton  onClick={loginUser}>
              {t("enter")}
            </LargeButton>
            <br></br>
            {fieldErrors.general && (
              <p style={{ color: 'red', marginTop: '1rem' }}>{fieldErrors.general}</p>
            )}
          </Box>
          
        )}
      </Container>
    </div>
  );
};

export default Login;