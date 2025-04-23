import React, { useState } from 'react';
import axios from 'axios';
import { Container, TextField} from '@mui/material';
import { useNavigate } from 'react-router';
import '../Components.css';
import LargeButton from '../ReactComponents/LargeButton';
import CustomH1 from '../ReactComponents/CustomH1';
import NavBar from "../NavBar/NavBar";
import { useTranslation } from "react-i18next";

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

const AddUser = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();
  const { t } = useTranslation();

  const clearFieldError = (field) => {
    setFieldErrors((prev) => ({ ...prev, [field]: null }));
  };

  const addUser = async () => {
    try {
      await axios.post(`${apiEndpoint}/adduser`, {
        username,
        email,
        password,
        confirmPassword
      });

      const response = await axios.post(`${apiEndpoint}/login`, { username, password });
      const { token } = response.data;

      localStorage.setItem('token', token);
      navigate('/home');

    } catch (error) {
      const err = error.response?.data?.error || '';

      if (err.includes('nombre de usuario ya está en uso')) {
        setFieldErrors({ username: t('errors.usernameTaken') });
      } else if (err.includes('email') && err.includes('registrado')) {
        setFieldErrors({ email: t('errors.emailTaken') });
      } else if (err.includes('contraseñas no coinciden')) {
        setFieldErrors({ confirmPassword: t('errors.passwordsNoMatch') });
      } else if (err.includes('contraseña') && err.includes('caracteres')) {
        setFieldErrors({ password: t('errors.weakPassword') });
      } else if (err.includes('nombre de usuario') && err.includes('al menos 4 caracteres')) {
        setFieldErrors({ username: t('errors.usernameTooShort') });
      } else if (err.includes('Formato de email inválido')) {
        setFieldErrors({ email: t('errors.invalidEmail') });
      } else if (err.includes('Missing required field')) {
        setFieldErrors({ general: t('errors.missingField') });
      } else {
        setFieldErrors({ general: t('errors.unknown') });
      }
    }
  };

  return (
    <div>
      <NavBar/>
      <Container component="main" maxWidth={false}  sx={{ marginTop: 4, textAlign: 'center' }} >
        <CustomH1>
          {t("signup")}
        </CustomH1>
        <TextField
          name="username"
          margin="normal"
          label={t("username")}
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            clearFieldError('username');
          }}
          error={!!fieldErrors.username}
          helperText={fieldErrors.username}
          inputProps={{ "data-testid": "username-input" }}
          sx={{ width: '20%'}}
        />
        <br></br>
        <TextField
          name="email"
          margin="normal"
          label={t("email")}
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            clearFieldError('email');
          }}
          error={!!fieldErrors.email}
          helperText={fieldErrors.email}
          inputProps={{ "data-testid": "email-input" }}
          sx={{ width: '20%' }}
        />
        <br />
        <TextField
          name="password"
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
          inputProps={{ "data-testid": "password-input" }}
          sx={{ width: '20%'}}
        />
        <br></br>
        <TextField
          name="confirmPassword"
          margin="normal"
          label={t("confirmPassword")}
          type="password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            clearFieldError('confirmPassword');
          }}
          error={!!fieldErrors.confirmPassword}
          helperText={fieldErrors.confirmPassword}
          inputProps={{ "data-testid": "confirm-password-input" }}
          sx={{ width: '20%' }}
        />
        <br></br>
        <LargeButton data-testid="signup-button" onClick={addUser}>
          {t("signup")}
        </LargeButton>
        <br></br>
        {fieldErrors.general && (
          <p style={{ color: 'red', marginTop: '1rem' }}>{fieldErrors.general}</p>
        )}
      </Container>
    </div>
  );
};

export default AddUser;
