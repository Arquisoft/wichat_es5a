import React, { useState } from 'react';
import axios from 'axios';
import { Container, TextField, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router';
import '../Components.css';
import LargeButton from '../ReactComponents/LargeButton';
import CustomH1 from '../ReactComponents/CustomH1';
import NavBar from "../NavBar/NavBar";
import { useTranslation } from "react-i18next";

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

const AddUser = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation();

  const addUser = async () => {
    try {
      const response = await axios.post(`${apiEndpoint}/adduser`, { username, password });

      const { token } = response.data;

      localStorage.setItem('token', token);
      navigate('/home');

    } catch (error) {
      setError(error.response.data.error);
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
          onChange={(e) => setUsername(e.target.value)}
          sx={{ width: '20%'}}
        />
        <br></br>
        <TextField
          name="password"
          margin="normal"
          label={t("password")}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ width: '20%'}}
        />
        <br></br>
        <LargeButton onClick={addUser}>
          {t("signup")}
        </LargeButton>
        <br></br>
        {error && (
          <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')} message={`Error: ${error}`} />
        )}
      </Container>
    </div>
  );
};

export default AddUser;
