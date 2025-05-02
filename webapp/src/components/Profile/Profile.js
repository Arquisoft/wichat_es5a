import React, { useState, useEffect } from 'react';

import { useNavigate } from 'react-router';
import LargeButton from '../ReactComponents/LargeButton';
import CustomH1 from '../ReactComponents/CustomH1';
import NavBar from "../NavBar/NavBar";
import axios from 'axios';
import { Container, Typography, Grid, Card, CardContent } from '@mui/material';
import './Profile.css';
import { useTranslation } from "react-i18next";

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

const Profile = () => {

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

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
  }, [token]);

  const enterHistory = () => {
    navigate('/history', {
      state: {
        user: profileData.username,
      }
    });
  }

  const goToEditProfile = () => {
    navigate(`/profile/edit/${profileData.username}`);
  }

  if (error) {
    return (
      <div>
        <NavBar />
        <Container component="main">
          <Typography color="error">{error}</Typography>
        </Container>
      </div>
    );
  }

  return (
    <div>
      <NavBar />
      <Container component="main" className="profile-container">
        <CustomH1>{t("user-profile")}</CustomH1>
        {profileData && (
          <Grid container justifyContent="center">
            <Grid item xs={12} sm={8} md={6}>
              <Card className="profile-card">
                <CardContent>
                  <Typography variant="h6" className="profile-title">
                    {t("profile-info")}
                  </Typography>
                  <Typography className="profile-info">
                    <strong>{t("user")}:</strong> {profileData.username}
                  </Typography>
                  <Typography className="profile-info">
                    <strong>{t("email")}:</strong> {profileData.email}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
        <div id="button-container">
          <LargeButton marginRight={2} onClick={enterHistory}>{t("history")}</LargeButton>
          <LargeButton onClick={goToEditProfile}>{t("edit-profile-button")}</LargeButton>
        </div>
      </Container>
    </div>
  );
};

export default Profile;