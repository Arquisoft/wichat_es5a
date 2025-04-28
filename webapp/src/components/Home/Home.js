import React from 'react';
import { Box, Grid } from '@mui/material';
import { useNavigate } from 'react-router';
import LargeButton from '../ReactComponents/LargeButton';
import CustomH1 from '../ReactComponents/CustomH1';
import NavBar from "../NavBar/NavBar";
import { useTranslation } from "react-i18next";
import Container from '@mui/material/Container';

const Home = () => {

  const { t } = useTranslation();
  const navigate = useNavigate();

  const enterGame = () => {
    navigate('/gamemode');
  }

  const enterProfile = () => {
    navigate('/profile');
  }

  const enterCredits = () => {
    navigate('/credits');
  }

  const enterHistory = () => {
    navigate('/history');
  }

  const enterRanking = () => {
    navigate('/ranking');
  }

  const logOut = () => {
    localStorage.removeItem('token');
    navigate('/login');
  }

  return (
    <div id="body-container">
      <NavBar />
      <img src={"/logo.png"} alt="Logo" height={200} width={200} />
      <CustomH1 size="h2">
        {t("title")}
      </CustomH1>
      <Container>
      <Grid container sx={{ marginTop: 2 }}>
        <Grid item xs={6}>
          <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
            <CustomH1 size="h6">
              {t("wanna-play")}
            </CustomH1>
            <LargeButton width="50%" onClick={enterGame}>
              {t("play")}
            </LargeButton>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
            <CustomH1 size="h6">
              {t("home-profile")}
            </CustomH1>
            <LargeButton width="50%" onClick={enterProfile}>
              {t("profile")}
            </LargeButton>
          </Box>
        </Grid>
      </Grid>
      <Grid container spacing={2} sx={{ marginTop: 2 }}>
        <Grid item xs={6}>
      <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
        <CustomH1 size="h6">
          {t("ranking-home")}
        </CustomH1>
        <LargeButton width="50%" onClick={enterRanking}>
          {t("ranking")}
        </LargeButton>
      </Box>
        </Grid>
        <Grid item xs={6}>
      <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
        <CustomH1 size="h6">
          {t("home-history")}
        </CustomH1>
        <LargeButton width="50%" onClick={enterHistory}>
          {t("history")}
        </LargeButton>
      </Box>
        </Grid>
      </Grid>
      <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
        <CustomH1 size="h6">
          {t("home-credits")}
        </CustomH1>
        <LargeButton width="25%" onClick={enterCredits}>
          {t("credits")}
        </LargeButton>
      </Box>
      </Container>
      <Box display="flex" justifyContent="center" mt={2} mb={2}>
        <LargeButton onClick={logOut}>
          {t("logout")}
        </LargeButton>
      </Box>
    </div>
  );
};

export default Home;