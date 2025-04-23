import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Container from '@mui/material/Container';
import { useNavigate } from 'react-router';
import LargeButton from '../ReactComponents/LargeButton';
import HistoryText from '../ReactComponents/HistoryText';
import NavBar from "../NavBar/NavBar";
import { useTranslation } from "react-i18next";

const Ranking = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([])
  const { t } = useTranslation();
  

  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

  const exitRanking = () => {
    navigate('/home');
  }

  const enterHistory = (username) => {
    navigate('/history/' + username);
  }

  // Se ejecuta al cargar el componente
  useEffect(() => {
    const getRanking = async () => {
      try {
        const response = await axios.get(`${apiEndpoint}/getranking`);
        setUsers(response.data.users);
      } catch (error) {
        console.error('Error al obtener el número de usuarios:', error);
      }
    };

    getRanking();
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
        <LargeButton onClick={exitRanking}>
          {t("exit")}
        </LargeButton>
        {users.map((user, index) => (
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
              {t("Puesto")}{`: ${index + 1}`}
            </HistoryText>    
            <HistoryText size="h6">
              {t("Nombre de usuario")}{`: ${user.username}`}
            </HistoryText>
            <HistoryText size="h6">
              {t("Puntos")}{`: ${user.points}`}
            </HistoryText>
            <LargeButton
              key={user.username || index} // Usa el ID del contest como clave si está disponible
              onClick={() => enterHistory(user.username)} // Acción al hacer clic
            >
              {t("Historial")}
            </LargeButton>
          </Container>
        ))}
      </Container>
    </div>
  );
};

export default Ranking;