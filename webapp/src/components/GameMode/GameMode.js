import React, { useState } from 'react';
import { Box, Button, Grid } from '@mui/material';
import { useNavigate } from 'react-router';
import NavBar from "../NavBar/NavBar";
import LargeButton from '../ReactComponents/LargeButton';
import CustomH1 from '../ReactComponents/CustomH1';

const GameMode = () => {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);

  const gameModes = [
    { label: 'Ciudades', value: 'city' },
    { label: 'Banderas', value: 'flag' },
    { label: 'Fútbol', value: 'football' },
    { label: 'Música', value: 'music'},
    { label: 'Comida', value: 'food'}
  ];

  const difficulties = ['Fácil', 'Media', 'Difícil'];

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
        <CustomH1 size="h4">Selecciona el modo de juego</CustomH1>
        <br/>
        <Grid container spacing={2} justifyContent="center">
          {gameModes.map((mode) => (
            <Grid item key={mode.value}>
              <Button
                variant={selectedMode === mode.value ? 'contained' : 'outlined'}
                onClick={() => setSelectedMode(mode.value)}
                sx={{
                  backgroundColor: selectedMode === mode.value ? "#606462" : "transparent",
                  color: selectedMode === mode.value ? "white" : "#606462",
                  borderColor: "#606462",
                  "&:hover": {
                    backgroundColor: selectedMode === mode.value ? "darkgray" : "rgba(128, 128, 128, 0.1)",
                    borderColor: "darkgray"
                  },
                }}
              >
                {mode.label}
              </Button>
            </Grid>
          ))}
        </Grid>
        <br/>

        <CustomH1 size="h4">Selecciona la dificultad</CustomH1>
        <br/>
        <Grid container spacing={2} justifyContent="center">
          {difficulties.map((level) => (
            <Grid item key={level}>
              <Button
                variant={selectedDifficulty === level ? 'contained' : 'outlined'}
                onClick={() => setSelectedDifficulty(level)}
                sx={{
                  backgroundColor: selectedDifficulty === level ? "#606462" : "transparent",
                  color: selectedDifficulty === level ? "white" : "#606462",
                  borderColor: "#606462",
                  "&:hover": {
                    backgroundColor: selectedDifficulty === level ? "darkgray" : "rgba(128, 128, 128, 0.1)",
                    borderColor: "darkgray"
                  },
                }}
              >
                {level}
              </Button>
            </Grid>
          ))}
        </Grid>

        <Box mt={4}>
          <LargeButton
            variant="contained"
            disabled={!selectedMode || !selectedDifficulty}
            onClick={startGame}
          >
            Empezar juego
          </LargeButton>
        </Box>
      </Box>
    </div>
  );
};

export default GameMode;