import React, { useState } from 'react';
import { Box, Button, Grid } from '@mui/material';
import { useNavigate } from 'react-router';
import NavBar from "../NavBar/NavBar";
import CustomH1 from '../ReactComponents/CustomH1';
import { useTranslation } from "react-i18next";
import "./GameMode.css";

const GameMode = () => {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const { t } = useTranslation();

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
      <Box mt={4} textAlign="center">
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
      </Box>
    </div>
  );
};

export default GameMode;