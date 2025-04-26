import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Container from '@mui/material/Container';
import { useNavigate, useParams } from 'react-router';
import LargeButton from '../ReactComponents/LargeButton';
import CustomH1 from '../ReactComponents/CustomH1';
import NavBar from "../NavBar/NavBar";
import { useTranslation } from "react-i18next";
import ContestRow from '../ReactComponents/ContestRow';

const HistoryUser = () => {
  const { username } = useParams();
  const navigate = useNavigate();

  const [contests, setContests] = useState([]);
  const [totalTime, setTotalTime] = useState([]);
  const [totalClues, setTotalClues] = useState([]);
  const [numCorrect, setNumCorrect] = useState([]);
  const { t } = useTranslation();

  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

  const exitHistory = () => {
    navigate('/profile');
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
        <CustomH1>{t("user-history")} {` "${username}"`}</CustomH1>
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
          <ContestRow isHeader={true} t={t} />
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
              isHeader={false}
            />
          ))}
        </Container>
      </Container>
    </div>
  );
};

export default HistoryUser;