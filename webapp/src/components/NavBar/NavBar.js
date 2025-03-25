// src/components/NavigationBar.js
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import axios from 'axios';
import { AppBar, Tabs, Tab, Tooltip, Menu, MenuItem, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import IconWichat from "./logo.webp";

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

const NavigationBar = () => {

  const navigate = useNavigate();

  const location = useLocation();
  const { username } = location.state || {};
  const { date } = location.state || {};
  const [openDialog, setOpenDialog] = useState(false);
  const [anchorElInfoMenu, setAnchorElInfoMenu] = React.useState(null);

  const showHome = () => {
    if (username !== undefined) {
      navigate("/home", { state: { username, date } });
    }
  };

  const showProfile = () => {
    if (username !== undefined) {
      navigate("/profile", { state: { username, date } });
    }
  };

  const showHistory = () => {
    if (username !== undefined) {
      navigate("/history", { state: { username, date } });
    }
  };

  const showCredits = () => {
    if (username !== undefined) {
      navigate("/credits", { state: { username, date } });
    }
  };

  const showDBData = async () => {
    if (username !== undefined) {
      setOpenDialog(true);
    }
  }

  const showApiDoc = () => {
    window.location.href = 'http://20.26.114.153:8000/api-doc/'; //NOSONAR
  };

  const logOut = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('userProfileUsername');
    navigate('/');
  };

  const closeMenu = () => {
    setAnchorElInfoMenu(null);
  };

  const tabsStyle = {
    display: 'flex',
    justifyContent: 'space-between',
  };

  const tabStyle = {
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: '#209cee',
    fontSize: 26,
    flex: '0 0 auto',
    paddingTop: 0,
    paddingBottom: 0,
    minWidth: 0,
  };

  const menuStyle = {
    padding: 0,
  };

  const menuItemStyle = {
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: '#209cee',
    '&:hover': {
      backgroundColor: '#209cee',
    },
  };

  const buttonStyle = {
    color: 'white',
    backgroundColor: '#209cee',
    '&:hover': {
      backgroundColor: '#1f89cf',
    },
  };

  const handleCloseDialogDownload = async () => {
    setOpenDialog(false);

    await axios({
      url: `${apiEndpoint}/getAllQuestions`,
      method: 'GET',
      responseType: 'blob',
    }).then((response) => {
      const href = URL.createObjectURL(response.data);

      const link = document.createElement('a');
      link.href = href;
      link.setAttribute('download', 'questions.json');
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(href);
    }).catch((error) => {
      console.error('Error en la solicitud:', error); // Aquí se imprimirá el error en la consola
      // Aquí puedes manejar el error de la solicitud de otra manera si lo necesitas
    });


    await axios({
      url: `${apiEndpoint}/getAllUsers`,
      method: 'GET',
      responseType: 'blob',
    }).then((response) => {
      const href = URL.createObjectURL(response.data);

      const link = document.createElement('a');
      link.href = href;
      link.setAttribute('download', 'users.json');
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(href);
    });


    showHome();
  }

  const cancelDialog = () => {
    setOpenDialog(false);
  }

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
          <div style={{ flex: 5, background: '#209cee' }} />
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
      <Menu aria-label="Info menu"
        anchorEl={anchorElInfoMenu}
        open={Boolean(anchorElInfoMenu)}
        onClose={closeMenu}
        MenuListProps={{
          sx: menuStyle
        }}
      >
        <MenuItem aria-label="About us"
          data-testid="about-us-item"
          sx={menuItemStyle}
          onClick={showCredits} >
          About us
        </MenuItem>
        <MenuItem aria-label="Get DB data"
          data-testid="get-db-data-item"
          sx={menuItemStyle}
          onClick={showDBData} >
          Get DB data
        </MenuItem>
        <MenuItem aria-label="API DOC"
          data-testid="api-doc-item"
          sx={menuItemStyle}
          onClick={showApiDoc} >
          API DOC
        </MenuItem>
      </Menu>
      <Dialog open={openDialog} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">Database data</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You will download all questions and users in database.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogDownload} sx={buttonStyle} autoFocus>
            Download
          </Button>
          <Button onClick={cancelDialog} sx={buttonStyle}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default NavigationBar;