import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Container from '@mui/material/Container';
import { useNavigate } from 'react-router';
import LargeButton from '../ReactComponents/LargeButton';
import CustomH1 from '../ReactComponents/CustomH1';
import NavBar from "../NavBar/NavBar";

const History = () => {
  const navigate = useNavigate();

  // Jugadores totales
  const [userCount, setUserCount] = useState(0)
  // Preguntas generadas
  const [questionCount, setQuestionCount] = useState(0)
  // Contests generados
  const [contests, setContests] = useState([])
  const [totalTime, setTotalTime] = useState([])
  const [totalClues, setTotalClues] = useState([])
  const [numCorrect, setNumCorrect] = useState([])

  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

  const exitHistory = () => {
    navigate('/home');
  }

  const enterContest = (id) => {
    navigate('/contest/' + id);
  }

  // Se ejecuta al cargar el componente
  useEffect(() => {
    const getHistory = async () => {
      try {
        const response = await axios.get(`${apiEndpoint}/getHistory`);
        setUserCount(response.data.userCount);
        setQuestionCount(response.data.questionCount);
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
  }, [apiEndpoint]);

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
        <CustomH1 size="h5">
          Jugadores totales: {userCount}
        </CustomH1>
        <CustomH1 size="h5">
          Preguntas generadas: {questionCount}
        </CustomH1>
        <LargeButton onClick={exitHistory}>
          Salir
        </LargeButton>
        {contests.map((contest, index) => (
          <Container
            sx={{
              backgroundColor: 'lightgray',
              marginTop: 2,
              padding: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <CustomH1 size="h6">
              {`Mode: ${contest.mode} - Type of questions: ${contest.typeOfQuestions} - Right answers: ${numCorrect[index]} - Points: ${contest.points} - Total Time: ${totalTime[index]} - Clues used: ${totalClues[index]} - Date: ${contest.date}`}
            </CustomH1>
            <LargeButton
              key={contest._id || index} // Usa el ID del contest como clave si está disponible
              onClick={() => enterContest(contest._id)} // Acción al hacer clic
            >
              {`Detalles Contest ${index + 1}`}
            </LargeButton>
          </Container>
        ))}
      </Container>
    </div>
  );
};

export default History;