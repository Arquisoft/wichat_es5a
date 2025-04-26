import React from 'react';
import Grid from '@mui/material/Grid';
import HistoryText from './HistoryText';
import LargeButton from './LargeButton';

const ContestRow = ({ contest, index, numCorrect, totalTime, totalClues, formatDate, enterContest, t, isHeader }) => (
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
        {isHeader ? <b>{t("difficulty")}</b> : `${contest.difficulty}`}
      </HistoryText>
    </Grid>
    <Grid item xs={1}>
      <HistoryText color="#00493A" size="h6">
        {isHeader ? <b>{t("mode")}</b> : `${contest.mode}`}
      </HistoryText>
    </Grid>
    <Grid item xs={2}>
      <HistoryText color="#00493A" size="h6">
        {isHeader ? <b>{t("correct-answers")}</b> : `${numCorrect[index]}`}
      </HistoryText>
    </Grid>
    <Grid item xs={1}>
      <HistoryText color="#00493A" size="h6">
        {isHeader ? <b>{t("points")}</b> : `${contest.points}`}
      </HistoryText>
    </Grid>
    <Grid item xs={1}>
      <HistoryText color="#00493A" size="h6">
        {isHeader ? <b>{t("total-time")}</b> : `${totalTime[index]}"`}
      </HistoryText>
    </Grid>
    <Grid item xs={2}>
      <HistoryText color="#00493A" size="h6">
        {isHeader ? <b>{t("number-of-clues")}</b> : `${totalClues[index]}`}
      </HistoryText>
    </Grid>
    <Grid item xs={2}>
      <HistoryText color="#00493A" size="h6">
        {isHeader ? <b>{t("game-date")}</b> : `${formatDate(contest.date)}`}
      </HistoryText>
    </Grid>
    <Grid item xs={2}>
      {isHeader ? null : (
        <LargeButton
          width="50%"
          left="25%"
          key={contest._id || index}
          onClick={() => enterContest(contest._id)}
        >
          {t("details")}
        </LargeButton>
      )}
    </Grid>
  </Grid>
);

export default ContestRow;