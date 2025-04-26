import React from 'react';
import Container from '@mui/material/Container';
import { useNavigate } from 'react-router';
import LargeButton from '../ReactComponents/LargeButton';
import CustomH1 from '../ReactComponents/CustomH1';
import NavBar from "../NavBar/NavBar";
import { useTranslation } from "react-i18next";
import ContestList from '../ReactComponents/ContestList';
import useFetchHistory from '../../hooks/useFetchHistory';

const History = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';
  const { contests, totalTime, totalClues, numCorrect, extraData } = useFetchHistory(`${apiEndpoint}/gethistory`);

  const exitHistory = () => {
    navigate('/home');
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
          <span>{t("total-users")}: {extraData.userCount}</span>
        </CustomH1>
        <CustomH1 size="h5">
          <span>{t("questions-generated")}: {extraData.questionCount}</span>
        </CustomH1>
        <LargeButton onClick={exitHistory}>
          {t("exit")}
        </LargeButton>
        <ContestList
          contests={contests}
          numCorrect={numCorrect}
          totalTime={totalTime}
          totalClues={totalClues}
          formatDate={formatDate}
          enterContest={enterContest}
          t={t}
        />
      </Container>
    </div>
  );
};

export default History;