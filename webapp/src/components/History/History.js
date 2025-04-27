import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Container from '@mui/material/Container';
import { useNavigate, useLocation } from 'react-router';
import LargeButton from '../ReactComponents/LargeButton';
import CustomH1 from '../ReactComponents/CustomH1';
import HistoryText from '../ReactComponents/HistoryText';
import NavBar from "../NavBar/NavBar";
import { useTranslation } from "react-i18next";
import Grid from '@mui/material/Grid';

const History = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = location.state || { user: null };

  // Jugadores totales
  const [userCount, setUserCount] = useState(0)
  // Preguntas generadas
  const [questionCount, setQuestionCount] = useState(0)
  // Contests generados
  const [contests, setContests] = useState([])
  const [totalTime, setTotalTime] = useState([])
  const [totalClues, setTotalClues] = useState([])
  const [numCorrect, setNumCorrect] = useState([])
  const { t } = useTranslation();


  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

  const exitHistory = () => {
    if (user === null)
      navigate('/home');
    else 
      navigate('/profile', { state: { user: user } });
  }

  const enterContest = (id) => {
    navigate('/contest/' + id);
  }

  // Función para formatear la fecha
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0'); // Día con dos dígitos
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mes con dos dígitos (0-indexado)
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0'); // Hora con dos dígitos
    const minutes = String(date.getMinutes()).padStart(2, '0'); // Minutos con dos dígitos
    const seconds = String(date.getSeconds()).padStart(2, '0'); // Segundos con dos dígitos

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  // Se ejecuta al cargar el componente
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
            if (clue === undefined) {
              clue = 0;
            }
            auxClues += clue;
          });
          auxArClues.push(auxClues);
          auxClues = 0;

          contest.tiempos.forEach(time => {
            if (time === undefined) {
              time = 0;
            }
            auxTimes += time;
          });
          auxArTimes.push(auxTimes);
          auxTimes = 0;

          contest.rightAnswers.forEach(answer => {
            if (answer === 1) {
              auxCorrect++;
            }
          });
          auxArCorrect.push(auxCorrect);
          auxCorrect = 0;

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

  const ContestRow = ({ contest, index, numCorrect, totalTime, totalClues, formatDate, enterContest, t }) => (
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
          {`${contest.difficulty}`}
        </HistoryText>
      </Grid>
      <Grid item xs={1}>
        <HistoryText color="#00493A" size="h6">
          {`${contest.mode}`}
        </HistoryText>
      </Grid>
      <Grid item xs={2}>
        <HistoryText color="#00493A" size="h6">
          {`${numCorrect[index]}`}
        </HistoryText>
      </Grid>
      <Grid item xs={1}>
        <HistoryText color="#00493A" size="h6">
          {`${contest.points}`}
        </HistoryText>
      </Grid>
      <Grid item xs={1}>
        <HistoryText color="#00493A" size="h6">
          {`${totalTime[index]}"`}
        </HistoryText>
      </Grid>
      <Grid item xs={2}>
        <HistoryText color="#00493A" size="h6">
          {`${totalClues[index]}`}
        </HistoryText>
      </Grid>
      <Grid item xs={2}>
        <HistoryText color="#00493A" size="h6">
          {`${formatDate(contest.date)}`}
        </HistoryText>
      </Grid>
      <Grid item xs={2}>
        <LargeButton
          width="50%"
          left="25%"
          key={contest._id || index} // Usa el ID del contest como clave si está disponible
          onClick={() => enterContest(contest._id)} // Acción al hacer clic
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
        {user === null ? (
        <>
          <CustomH1>
            {t("history")}
          </CustomH1>
          <CustomH1 size="h5">
            <span>{t("total-users")}: {userCount}</span>
          </CustomH1>
          <CustomH1 size="h5">
            <span>{t("questions-generated")}: {questionCount}</span>
          </CustomH1>
        </>
      ) : (
        <>
          <CustomH1>
            {t("user-history")} {user}
          </CustomH1>
        </>
      )}
        <LargeButton onClick={exitHistory}>
          {t("exit")}
        </LargeButton>
        <Container
          sx={{
            backgroundColor: "#98d7c2",
            marginTop: 2,
            marginBottom: 2,
          }}>
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
          {contests.map((contest, index) => (
            <ContestRow
              key={contest._id || index}
              contest={contest}
              index={index}
              numCorrect={numCorrect}
              totalTime={totalTime}
              totalClues={totalClues}
              formatDate={formatDate}
              enterContest={enterContest}
              t={t}
            />
          ))}
        </Container>
      </Container>
    </div>
  );
};

export default History;