// src/components/NavigationBar.js
import React from 'react';
import { useNavigate } from 'react-router';
import { AppBar, Tabs, Tab, Tooltip } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import IconWichat from "./logo.jpg";
import './NavBar.css';

const NavigationBar = () => {

  const navigate = useNavigate();

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

  const tabStyle = {/*
    color: '#DDFFE7',
    fontWeight: 'bold',
    backgroundColor: '#167D7F',
    fontSize: 26,
    flex: '0 0 auto',
    paddingTop: 0,
    paddingBottom: 0,
    minWidth: 0,*/
  };

  return (
    <div id="navbar">
      <AppBar id="appbar" position="absolute">
        <Tabs id="tabsContainer" aria-label="navigation tabs" value={false} variant="fullWidth">
          <Tab id="logo" aria-label="Logo" data-testid="logo-tab" icon={<Tooltip title="Home"><img src={IconWichat} alt="Icono" /></Tooltip>} onClick={showHome}/>
          <Tab id="wichat" label="WiChat" data-testid="wichat-tab" sx={tabStyle} onClick={showHome} />
          <div style={{ flex: 7 }} />
          <Tab id='profile' label="Profile" data-testid="profile-tab" onClick={showProfile} />
          <Tab id="history" label="History" data-testid="history-tab" onClick={showHistory} />
          <Tab id="credits" label="Credits" data-testid="credits-tab" onClick={showCredits} />
          <Tab id="logout" aria-label="Log out" data-testid="logout-tab" icon={<Tooltip title="Log out"><LogoutIcon/></Tooltip>} onClick={logOut} />
        </Tabs>
      </AppBar>
    </div>
  );
};

export default NavigationBar;