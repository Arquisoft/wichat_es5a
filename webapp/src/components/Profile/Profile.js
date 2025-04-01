import React, {useState, useEffect} from 'react';

import { useNavigate } from 'react-router';
import LargeButton from '../ReactComponents/LargeButton';
import CustomH1 from '../ReactComponents/CustomH1';
import Container from '@mui/material/Container';
import NavBar from "../NavBar/NavBar";
import Typography from '@mui/material/Typography';
import axios from 'axios';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

const Profile = () => {

  const navigate = useNavigate();
  const token = localStorage.getItem("token") // Obtiene el token de localStorage
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${apiEndpoint}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`, // Envía el token en la cabecera Authorization
          },
        });
        setProfileData(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Error fetching profile');
      }
    };

    if (token) {
      fetchProfile();
    } else {
      setError('No se encontró el token.');
    }
  }, [token, apiEndpoint]);

  const exitProfile = () => {
    navigate('/home');
  }

  if (error) {
    return (
      <div>
        <NavBar />
        <Container
          component="main"
          sx={{
            marginTop: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography color="error">{error}</Typography>
          <LargeButton onClick={exitProfile}>Salir</LargeButton>
        </Container>
      </div>
    );
  }

  return (
    <div>
      <NavBar />
      <Container
        component="main"
        sx={{
          marginTop: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CustomH1>Perfil de Usuario</CustomH1> {/* Cambia el texto */}
        {profileData && (
          <div>
            <Typography>Username: {profileData.username}</Typography>
            <Typography>Email: {profileData.email}</Typography>
          </div>
        )}
        <LargeButton onClick={exitProfile}>Salir</LargeButton>
      </Container>
    </div>
  );
};

export default Profile;