import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Container from '@mui/material/Container';
import { useNavigate, useLocation } from 'react-router';
import LargeButton from '../ReactComponents/LargeButton';
import NavBar from "../NavBar/NavBar";
import { useTranslation } from "react-i18next";
import HistoryHeader from '../ReactComponents/HistoryHeader';
import HistoryTableHeader from '../ReactComponents/HistoryTableHeader';
import Grid from '@mui/material/Grid';
import HistoryText from '../ReactComponents/HistoryText';

const History = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = location.state || { user: null };

  const [userCount, setUserCount] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [contests, setContests] = useState([]);
  const [totalTime, setTotalTime] = useState([]);
  const [totalClues, setTotalClues] = useState([]);
  const [numCorrect, setNumCorrect] = useState([]);
  const { t } = useTranslation();

  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

  const exitHistory = () => {
    if (user === null)
      navigate('/home');
    else 
      navigate('/profile', { state: { user: user } });
  };

  const enterContest = (id) => {
    navigate('/contest/' + id);
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  useEffect(() => {
    const getHistory = async () => {
      try {
        let response;
        if (user === null) {
          response = await axios.get(`${apiEndpoint}/gethistory`);
          setUserCount(response.data.userCount);
          setQuestionCount(response.data.questionCount);
          setContests(response.data.contests);
        } else {
          response = await axios.get(`${apiEndpoint}/gethistory/${user}`);
          setContests(response.data.contests);
        }

        let auxArTimes = [];
        let auxArClues = [];
        let auxArCorrect = [];
        response.data.contests.forEach(contest => {
          let auxClues = 0;
          let auxTimes = 0;
          let auxCorrect = 0;
          contest.pistas.forEach(clue => {
            auxClues += clue || 0;
          });
          auxArClues.push(auxClues);

          contest.tiempos.forEach(time => {
            auxTimes += time || 0;
          });
          auxArTimes.push(auxTimes);

          contest.rightAnswers.forEach(answer => {
            if (answer === 1) auxCorrect++;
          });
          auxArCorrect.push(auxCorrect);
        });
        setTotalClues(auxArClues);
        setTotalTime(auxArTimes);
        setNumCorrect(auxArCorrect);
      } catch (error) {
        console.error('Error al obtener el número de usuarios:', error);
      }
    };

    getHistory();
  }, [apiEndpoint, user]);

  const renderContestRow = (contest, index) => (
    <Grid container spacing={2}
      key={contest._id || index}
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
          {contest.difficulty}
        </HistoryText>
      </Grid>
      <Grid item xs={1}>
        <HistoryText color="#00493A" size="h6">
          {contest.mode}
        </HistoryText>
      </Grid>
      <Grid item xs={2}>
        <HistoryText color="#00493A" size="h6">
          {numCorrect[index]}
        </HistoryText>
      </Grid>
      <Grid item xs={1}>
        <HistoryText color="#00493A" size="h6">
          {contest.points}
        </HistoryText>
      </Grid>
      <Grid item xs={1}>
        <HistoryText color="#00493A" size="h6">
          {totalTime[index]}" 
        </HistoryText>
      </Grid>
      <Grid item xs={2}>
        <HistoryText color="#00493A" size="h6">
          {totalClues[index]}
        </HistoryText>
      </Grid>
      <Grid item xs={2}>
        <HistoryText color="#00493A" size="h6">
          {formatDate(contest.date)}
        </HistoryText>
      </Grid>
      <Grid item xs={2}>
        <LargeButton
          width="50%"
          left="25%"
          onClick={() => enterContest(contest._id)}
        >
          {t("details")}
        </LargeButton>
      </Grid>
    </Grid>
  );

  return (
    <div>
      <NavBar />
      <Container
        component="main"
        sx={{
          marginTop: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <HistoryHeader
          user={user}
          userCount={userCount}
          questionCount={questionCount}
          t={t}
        />
        <LargeButton onClick={exitHistory}>
          {t("exit")}
        </LargeButton>
        <Container
          sx={{
            backgroundColor: "#98d7c2",
            marginTop: 2,
            marginBottom: 2,
          }}
        >
          <HistoryTableHeader t={t} />
          {contests.map((contest, index) => renderContestRow(contest, index))}
        </Container>
      </Container>
    </div>
  );
};

export default History;