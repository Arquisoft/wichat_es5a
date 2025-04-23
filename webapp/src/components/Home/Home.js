import React from 'react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router';
import LargeButton from '../ReactComponents/LargeButton';
import CustomH1 from '../ReactComponents/CustomH1';
import NavBar from "../NavBar/NavBar";
import { useTranslation } from "react-i18next";

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
      <NavBar/>
      <CustomH1>
        {t("title")}
      </CustomH1>
      <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
        <CustomH1 size="h6">
          {t("wanna-play")}
        </CustomH1>
        <LargeButton onClick={enterGame}>
          {t("play")}
        </LargeButton>
      </Box>
      <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
      <CustomH1 size="h6">
          {t("home-profile")}
        </CustomH1>
        <LargeButton onClick={enterProfile}>
          {t("profile")}
        </LargeButton>
      </Box>
      <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
      <CustomH1 size="h6">
          {t("ranking")}
        </CustomH1>
        <LargeButton onClick={enterRanking}>
          {t("ranking")}
        </LargeButton>
      </Box>
      <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
      <CustomH1 size="h6">
          {t("home-history")}
        </CustomH1>
        <LargeButton onClick={enterHistory}>
          {t("history")}
        </LargeButton>
      </Box>
      <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
      <CustomH1 size="h6">
          {t("home-credits")}
        </CustomH1>
        <LargeButton onClick={enterCredits}>
          {t("credits")}
        </LargeButton>
      </Box>
      <Box display="flex" justifyContent="center" mt={2}>
        <LargeButton onClick={logOut}>
          {t("logout")}
        </LargeButton>
      </Box>
    </div>
  );
};

export default Home;