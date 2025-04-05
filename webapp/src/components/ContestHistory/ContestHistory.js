import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router';
import CustomH1 from '../ReactComponents/CustomH1';
import HistoryText from '../ReactComponents/HistoryText';
import Container from '@mui/material/Container';
import NavBar from "../NavBar/NavBar";
import LargeButton from '../ReactComponents/LargeButton';
import { useTranslation } from "react-i18next";

const ContestHistory = () => {

  const navigate = useNavigate();

  const { id } = useParams();
  const [questions, setQuestions] = useState([]);
  const [times, setTimes] = useState([]);
  const [clues, setClues] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const { t } = useTranslation();

  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

  const exitContestHistory = () => {
    navigate('/history');
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
        <CustomH1 size="h2">{t("history-title")}</CustomH1>
        <LargeButton onClick={exitContestHistory}>
          {t("exit")}
        </LargeButton>
        {questions.map((question, index) => (
          <Container 
          sx={{
            backgroundColor: '#00493A',
            marginTop: 2,
            padding: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <img src={question.image} alt={t("question-img-alt")} className="responsive-img" draggable="false"/>
            <HistoryText size="h6">
              {t("question")}{`: ${question.question}`}
            </HistoryText>
            <HistoryText size="h6">
              {t("answers-shown")}{`: ${question.wrongAnswers[0]}, ${question.wrongAnswers[1]}, ${question.wrongAnswers[2]}, ${question.wrongAnswers[3]}`}
            </HistoryText>
            <HistoryText size="h6">
              {t("correct-answer")}{`: ${question.answer}`}
            </HistoryText>
            <HistoryText size="h6">
              {t("correct")}{`: ${correctAnswers[index] === 0 ? '❌' : '✅'}`}
            </HistoryText>
            <HistoryText size="h6">
              {t("time-to-answer")}{`: ${times[index]}`} {t("seconds")}
            </HistoryText>
            <HistoryText size="h6">
              {t("number-of-clues")}{`: ${clues[index]}`}
            </HistoryText>
            <HistoryText size="h6">
              {t("question-generation-date")}{`: ${formatDate(question.createdAt)}`}
            </HistoryText>
          </Container>
        ))}
      </Container>
    </div>
  );
};

export default ContestHistory;