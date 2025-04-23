import React from 'react';
import { useNavigate } from 'react-router';
import { AppBar, Tabs, Tab, Tooltip } from '@mui/material';
import { Login, Logout, AccountCircle, PersonAdd, BarChart, SportsEsports, People } from '@mui/icons-material';
import IconWichat from "./logo.jpg";
import Internationalization from '../Internationalization/Internationalization';
import { useTranslation } from "react-i18next";
import './NavBar.css';

const NavigationBar = () => {

  const navigate = useNavigate();
  const { t } = useTranslation();
  const token = localStorage.getItem('token');

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

  const play = () => {
    navigate("/gamemode");
  }

  const logOut = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const logIn = () => {
    navigate("/login");
  }

  const signUp = () => {
    navigate("/adduser");
  }

  return (
    <div id="navbar">
      <AppBar id="appbar" position="absolute">
        <Tabs id="tabsContainer" aria-label="navigation tabs" variant="fullWidth" value={false}>
          <Tab id="logo" aria-label="Logo" data-testid="logo-tab" icon={<Tooltip title="Home"><img src={IconWichat} alt="Icono" draggable="false"/></Tooltip>} onClick={showHome}/>
          <Tab id="wichat" label={t("title")} data-testid="wichat-tab" onClick={showHome} />
          <div style={{ flex: 6 }} />
          {token && (
            <Tab id='play' label={t("play")} data-testid="play-tab" icon={<SportsEsports/>} iconPosition="start" onClick={play} />
          )}
          {token && (
            <Tab id='profile' label={t("profile")} data-testid="profile-tab" icon={<AccountCircle/>} iconPosition="start" onClick={showProfile} />
          )}
          {token && (
            <Tab id="history" label={t("history")} data-testid="history-tab" icon={<BarChart/>} iconPosition="start"onClick={showHistory} />
          )}
          {token && (
            <Tab id="credits" label={t("credits")} data-testid="credits-tab" icon={<People/>} iconPosition="start" onClick={showCredits} />
          )}
          <Internationalization/>
          {token && (
            <Tab id="logout" aria-label="Log out" data-testid="logout-tab" icon={<Tooltip title={t("logout")}><Logout/></Tooltip>} onClick={logOut} />
          )}
          {!token && (
            <Tab id="login" label={t("login")} data-testid="login-tab" icon={<Login/>} iconPosition="end" onClick={logIn} />
          )}
          {!token && (
            <Tab id="signup" label={t("signup")} data-testid="signup-tab" icon={<PersonAdd/>} iconPosition="end" onClick={signUp} />
          )}
        </Tabs>
      </AppBar>
    </div>
  );
};

export default NavigationBar;