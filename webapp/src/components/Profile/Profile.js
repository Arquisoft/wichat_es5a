import React from 'react';

import { Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import LargeButton from '../ReactComponents/LargeButton/LargeButton';

const Profile = () => {

  const navigate = useNavigate();
  
  const exitProfile = () => {
    navigate('/home');
  }

  return (
    <div>
          <Typography component="h1" variant="h1" sx={{ textAlign: 'center', marginTop: 2, color: "#167D7F" }}>
           AAAAAAAAAAAA
          </Typography>
          <LargeButton onClick={exitProfile}>
            Salir
          </LargeButton>
    </div>
  );
};

export default Profile;