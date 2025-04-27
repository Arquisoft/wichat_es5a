import React from 'react';
import Grid from '@mui/material/Grid';
import HistoryText from '../ReactComponents/HistoryText';

const HistoryTableHeader = ({ t }) => {
  // Configuración de las columnas
  const columns = [
    { key: 'difficulty', xs: 2 },
    { key: 'mode', xs: 1 },
    { key: 'correct-answers', xs: 1.5 },
    { key: 'points', xs: 1 },
    { key: 'total-time', xs: 1 },
    { key: 'number-of-clues', xs: 2 },
    { key: 'game-date', xs: 1.5 },
  ];

  return (
    <Grid
      container
      spacing={2}
      sx={{
        marginTop: 2,
        marginBottom: 2,
        display: 'flex',
        flexWrap: 'wrap',
        direction: 'row',
      }}
    >
      {columns.map((column) => (
        <Grid item xs={column.xs} key={column.key}>
          <HistoryText color="#00493A" size="h6">
            <b>{t(column.key)}</b>
          </HistoryText>
        </Grid>
      ))}
      <Grid item xs={1}></Grid> {/* Espacio adicional */}
    </Grid>
  );
};

export default HistoryTableHeader;