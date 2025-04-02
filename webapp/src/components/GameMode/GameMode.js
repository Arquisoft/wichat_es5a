import React, { useState } from 'react';
import { Box, Button, Typography, Grid } from '@mui/material';
import { useNavigate } from 'react-router';

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
    <Box mt={4} textAlign="center">
      <Typography variant="h4" gutterBottom>Selecciona el modo de juego</Typography>
      <Grid container spacing={2} justifyContent="center">
        {gameModes.map((mode) => (
          <Grid item key={mode.value}>
            <Button
              variant={selectedMode === mode.value ? 'contained' : 'outlined'}
              onClick={() => setSelectedMode(mode.value)}
            >
              {mode.label}
            </Button>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h5" mt={4} gutterBottom>Selecciona la dificultad</Typography>
      <Grid container spacing={2} justifyContent="center">
        {difficulties.map((level) => (
          <Grid item key={level}>
            <Button
              variant={selectedDifficulty === level ? 'contained' : 'outlined'}
              onClick={() => setSelectedDifficulty(level)}
            >
              {level}
            </Button>
          </Grid>
        ))}
      </Grid>

      <Box mt={4}>
        <Button
          variant="contained"
          disabled={!selectedMode || !selectedDifficulty}
          onClick={startGame}
        >
          Empezar juego
        </Button>
      </Box>
    </Box>
  );
};

export default GameMode;