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

  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

  const exitHistory = () => {
    navigate('/home');
  }

  // Se ejecuta al cargar el componente
  useEffect(() => {
    const getHistory = async () => {
      try {
        const response = await axios.get(`${apiEndpoint}/getHistory`);
        setUserCount(response.data.userCount);
        setQuestionCount(response.data.questionCount);
      } catch (error) {
        console.error('Error al obtener el número de usuarios:', error);
      }
    };

    getHistory();
  }, [apiEndpoint]); 
  
  return (
    <div>
      <NavBar/>
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
      </Container>
    </div>
  );
};

export default History;