import React, { useState } from 'react';
import { Box, Button, Grid, Modal, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import NavBar from "../NavBar/NavBar";
import CustomH1 from '../ReactComponents/CustomH1';
import { useTranslation } from "react-i18next";
import ReactMarkdown from 'react-markdown';
import "./GameMode.css";
import Container from '@mui/material/Container';
import LargeButton from '../ReactComponents/LargeButton';

const GameMode = () => {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  const { t } = useTranslation();

  const exitGameMode = () => {
    navigate('/home');
  }

  const gameModes = [
    { label: "cities", value: 'city' },
    { label: 'flags', value: 'flag' },
    { label: 'football', value: 'football' },
    { label: 'music', value: 'music' },
    { label: 'food', value: 'food' }
  ];

  const difficulties = ['easy', 'medium', 'difficult', 'survival'];

  const startGame = () => {
    if (!selectedMode || !selectedDifficulty) return;

    navigate('/game', {
      state: {
        mode: selectedMode,
        difficulty: selectedDifficulty,
      },
    });
  };

  return (
    <div>
      <NavBar />
      <Container>
        <LargeButton onClick={exitGameMode}>
          {t("exit")}
        </LargeButton>
      </Container>
      <Box mt={4} textAlign="center" position="relative">
        { }
        <Button
          variant="outlined"
          color="primary"
          onClick={() => setShowHelp(true)}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '8rem',
            padding: '0.9rem 1.8rem',
            fontSize: '1.2rem',
          }}
        >
          {t("help")}
        </Button>

        <CustomH1 size="h4">{t("select-mode")}</CustomH1>
        <br />
        <Grid container spacing={2} justifyContent="center">
          {gameModes.map((mode) => (
            <Grid item key={mode.value}>
              <Button
                className={selectedMode === mode.value ? "selected" : "unselected"}
                onClick={() => setSelectedMode(mode.value)}
                data-testid={mode.value}
              >
                {t(mode.label)}
              </Button>
            </Grid>
          ))}
        </Grid>
        <br />

        <CustomH1 size="h4">{t("select-difficulty")}</CustomH1>
        <br />
        <Grid container spacing={2} justifyContent="center">
          {difficulties.map((level) => (
            <Grid item key={level}>
              <Button
                className={selectedDifficulty === level ? "selected" : "unselected"}
                onClick={() => setSelectedDifficulty(level)}
                data-testid={level}
              >
                {t(level)}
              </Button>
            </Grid>
          ))}
        </Grid>

        <Box mt={4}>
          <Button variant="contained" disabled={!selectedMode || !selectedDifficulty} onClick={startGame} id="button-start">
            {t("play")}
          </Button>
        </Box>

        { }
        <Modal
          open={showHelp}
          onClose={() => setShowHelp(false)}
          aria-labelledby="help-modal-title"
          aria-describedby="help-modal-description"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '80%',
              maxWidth: '600px',
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
              borderRadius: '10px',
            }}
          >
            <Typography id="help-modal-title" variant="h6" component="h2" mb={2}>
              {t("help")}
            </Typography>
            <Box id="help-modal-description">
              <ReactMarkdown>
                {t("help-text")}
              </ReactMarkdown>
            </Box>
            <Box mt={3} textAlign="center">
              <Button variant="contained" color="primary" onClick={() => setShowHelp(false)}>
                {t("close")}
              </Button>
            </Box>
          </Box>
        </Modal>
      </Box>
    </div>
  );
};

export default GameMode;