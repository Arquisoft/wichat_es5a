// src/components/NavigationBar.js
import React from 'react';
import { useNavigate } from 'react-router';
import { AppBar, Tabs, Tab, Tooltip } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import IconWichat from "./logo.jpg";
import Internationalization from '../Internationalization/Internationalization';
import { useTranslation } from "react-i18next";
import './NavBar.css';

const NavigationBar = () => {

  const navigate = useNavigate();
  const { t } = useTranslation();

  const showHome = () => {
    navigate("/home");
  };

  const showProfile = () => {
    navigate("/profile");
  };

  const showHistory = () => {
    navigate("/history");
  };

  const showCredits = () => {
    navigate("/credits");
  };

  const logOut = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div id="navbar">
      <AppBar id="appbar" position="absolute">
        <Tabs id="tabsContainer" aria-label="navigation tabs" value={false} variant="fullWidth">
          <Tab id="logo" aria-label="Logo" data-testid="logo-tab" icon={<Tooltip title="Home"><img src={IconWichat} alt="Icono" /></Tooltip>} onClick={showHome}/>
          <Tab id="wichat" label={t("title")} data-testid="wichat-tab" onClick={showHome} />
          <div style={{ flex: 7 }} />
          <Tab id='profile' label={t("profile")} data-testid="profile-tab" onClick={showProfile} />
          <Tab id="history" label={t("history")} data-testid="history-tab" onClick={showHistory} />
          <Tab id="credits" label={t("credits")} data-testid="credits-tab" onClick={showCredits} />
          <Internationalization/>
          <Tab id="logout" aria-label="Log out" data-testid="logout-tab" icon={<Tooltip title={t("logout")}><LogoutIcon/></Tooltip>} onClick={logOut} />
        </Tabs>
      </AppBar>
    </div>
  );
};

export default NavigationBar;