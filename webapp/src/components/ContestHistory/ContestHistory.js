import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router';
import CustomH1 from '../ReactComponents/CustomH1';
import Container from '@mui/material/Container';
import NavBar from "../NavBar/NavBar";
import LargeButton from '../ReactComponents/LargeButton';

const ContestHistory = () => {

  const navigate = useNavigate();

  const { id } = useParams();
  const [questions, setQuestions] = useState([]);
  const [times, setTimes] = useState([]);
  const [clues, setClues] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState([]);

  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

  const exitContestHistory = () => {
    navigate('/history');
  }

  useEffect(() => {
    const getHistory = async () => {
      try {
        const response = await axios.get(`${apiEndpoint}/getquestions/${id}`);
        setQuestions(response.data.questions);
        setTimes(response.data.times);
        setClues(response.data.clues);
        setCorrectAnswers(response.data.correctAnswers);
      } catch (error) {
        console.error('Error al obtener el número de usuarios:', error);
      }
    };

    getHistory();
  }, [apiEndpoint, id]);

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
        <CustomH1 size="h4">Historial de preguntas</CustomH1>
        <LargeButton onClick={exitContestHistory}>
          Salir
        </LargeButton>
        {questions.map((question, index) => (
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
            <img src={question.image} alt="Imagen de la pregunta" className="responsive-img" />
            <CustomH1 size="h6">
              {`Pregunta: ${question.question} - Answers: ${question.wrongAnswers[0]}, ${question.wrongAnswers[1]}, ${question.wrongAnswers[2]}, ${question.wrongAnswers[3]} - Right answer: ${question.answer} - Correct: ${correctAnswers[index]} - Times: ${times[index]} - Clues: ${clues[index]} - Date: , ${question.createdAt}`}
            </CustomH1>
          </Container>
        ))}
      </Container>
    </div>
  );
};

export default ContestHistory;