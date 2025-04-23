import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Container from '@mui/material/Container';
import { useNavigate, useParams } from 'react-router';
import LargeButton from '../ReactComponents/LargeButton';
import CustomH1 from '../ReactComponents/CustomH1';
import HistoryText from '../ReactComponents/HistoryText';
import NavBar from "../NavBar/NavBar";
import { useTranslation } from "react-i18next";

const History = () => {
  const { username } = useParams();
  const navigate = useNavigate();

  // Contests generados
  const [contests, setContests] = useState([])
  const [totalTime, setTotalTime] = useState([])
  const [totalClues, setTotalClues] = useState([])
  const [numCorrect, setNumCorrect] = useState([])
  const { t } = useTranslation();
  

  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

  const exitHistory = () => {
    navigate('/profile');
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
        const response = await axios.get(`${apiEndpoint}/gethistory/${username}`);
        setContests(response.data.contests);
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
  }, [apiEndpoint, username]);

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
        <CustomH1>{t("User's history")}</CustomH1>
        <LargeButton onClick={exitHistory}>
          {t("exit")}
        </LargeButton>
        {contests.map((contest, index) => (
          <Container
            sx={{
              backgroundColor: "#00493A",
              marginTop: 2,
              padding: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <HistoryText size="h6">
              {t("difficulty")}{`: ${contest.difficulty}`}
            </HistoryText>
            <HistoryText size="h6">
              {t("mode")}{`: ${contest.mode}`}
            </HistoryText>
            <HistoryText size="h6">
              {t("correct-answers")}{`: ${numCorrect[index]}`}
            </HistoryText>
            <HistoryText size="h6">
              {t("points")}{`: ${contest.points}`}
            </HistoryText>
            <HistoryText size="h6">
              {t("total-time")}{`: ${totalTime[index]}`} {t("seconds")}
            </HistoryText>
            <HistoryText size="h6">
              {t("number-of-clues")}{`: ${totalClues[index]}`}
            </HistoryText>
            <HistoryText size="h6">
              {t("game-date")}{`: ${formatDate(contest.date)}`}
            </HistoryText>
            <LargeButton
              key={contest._id || index} // Usa el ID del contest como clave si está disponible
              onClick={() => enterContest(contest._id)} // Acción al hacer clic
            >
              {t("details")}
            </LargeButton>
          </Container>
        ))}
      </Container>
    </div>
  );
};

export default History;