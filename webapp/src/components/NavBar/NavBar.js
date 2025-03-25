// src/components/NavigationBar.js
import React from 'react';
import { useNavigate } from 'react-router';
import { AppBar, Tabs, Tab, Tooltip } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import IconWichat from "./logo.jpg";

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

  const tabsStyle = {
    display: 'flex',
    justifyContent: 'space-between',
  };

  const tabStyle = {
    color: '#DDFFE7',
    fontWeight: 'bold',
    backgroundColor: '#167D7F',
    fontSize: 26,
    flex: '0 0 auto',
    paddingTop: 0,
    paddingBottom: 0,
    minWidth: 0,
  };

  return (
    <div>
      <AppBar position="absolute">
        <Tabs aria-label="navigation tabs" value={false} variant="fullWidth" sx={tabsStyle}>
          <Tab aria-label="Logo"
            data-testid="logo-tab"
            icon={
            <Tooltip title="Home">
              <img src={IconWichat} alt="Icono" />
            </Tooltip>}
            sx={tabStyle}
            onClick={showHome} />
          <Tab label="WiChat"
            data-testid="wichat-tab"
            sx={tabStyle}
            onClick={showHome} />
          <div style={{ flex: 5, background: '#167D7F' }} />
          <Tab aria-label="Profile"
            data-testid="profile-tab"
            id='profileId'
            icon={<Tooltip title="Profile">
              <AccountCircle sx={tabStyle} />
            </Tooltip>}
            sx={tabStyle}
            onClick={showProfile} />
          <Tab aria-label="History"
            data-testid="history-tab"
            icon={<Tooltip title="History">
              <AccountCircle sx={tabStyle} />
            </Tooltip>}
            sx={tabStyle}
            onClick={showHistory} />
          <Tab aria-label="Credits"
            data-testid="credits-tab"
            icon={<Tooltip title="Credits">
              <AccountCircle sx={tabStyle} />
            </Tooltip>}
            sx={tabStyle}
            onClick={showCredits} />
          <Tab aria-label="Log out"
            data-testid="logout-tab"
            icon={<Tooltip title="Log out">
              <LogoutIcon sx={tabStyle} />
            </Tooltip>}
            sx={tabStyle}
            onClick={logOut} />
        </Tabs>
      </AppBar>
    </div>
  );
};

export default NavigationBar;