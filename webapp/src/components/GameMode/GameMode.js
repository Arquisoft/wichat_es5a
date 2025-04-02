import React, { useState } from 'react';
import { Box, Button, Grid } from '@mui/material';
import { useNavigate } from 'react-router';
import NavBar from "../NavBar/NavBar";
import CustomH1 from '../ReactComponents/CustomH1';
import "./GameMode.css";

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
              <Button className={selectedMode === mode.value ? "selected" : "unselected"} onClick={() => setSelectedMode(mode.value)}>
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
              <Button className={selectedDifficulty === level ? "selected" : "unselected"} onClick={() => setSelectedDifficulty(level)}>
                {level}
              </Button>
            </Grid>
          ))}
        </Grid>

        <Box mt={4}>
        <Button variant="contained" disabled={!selectedMode || !selectedDifficulty} onClick={startGame} id="button-start">
          Empezar juego
        </Button>
        </Box>
      </Box>
    </div>
  );
};

export default GameMode;