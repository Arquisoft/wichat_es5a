import React from 'react';
import Grid from '@mui/material/Grid';
import HistoryText from '../ReactComponents/HistoryText';

const HistoryTableHeader = ({ t }) => {
  return (
    <Grid container spacing={2}
      sx={{
        marginTop: 2,
        marginBottom: 2,
        display: "flex",
        flexWrap: "wrap",
        direction: "row"
      }}
    >
      <Grid item xs={1}>
        <HistoryText color="#00493A" size="h6">
          <b>{t("difficulty")}</b>
        </HistoryText>
      </Grid>
      <Grid item xs={1}>
        <HistoryText color="#00493A" size="h6">
          <b>{t("mode")}</b>
        </HistoryText>
      </Grid>
      <Grid item xs={2}>
        <HistoryText color="#00493A" size="h6">
          <b>{t("correct-answers")}</b>
        </HistoryText>
      </Grid>
      <Grid item xs={1}>
        <HistoryText color="#00493A" size="h6">
          <b>{t("points")}</b>
        </HistoryText>
      </Grid>
      <Grid item xs={1}>
        <HistoryText color="#00493A" size="h6">
          <b>{t("total-time")}</b>
        </HistoryText>
      </Grid>
      <Grid item xs={2}>
        <HistoryText color="#00493A" size="h6">
          <b>{t("number-of-clues")}</b>
        </HistoryText>
      </Grid>
      <Grid item xs={2}>
        <HistoryText color="#00493A" size="h6">
          <b>{t("game-date")}</b>
        </HistoryText>
      </Grid>
      <Grid item xs={1}></Grid>
    </Grid>
  );
};

export default HistoryTableHeader;