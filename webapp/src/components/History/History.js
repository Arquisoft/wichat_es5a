import React from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from "react-i18next";
import useFetchHistory from '../../hooks/useFetchHistory';
import HistoryBase from '../ReactComponents/HistoryBase';

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
    <HistoryBase
      title={t("history")}
      extraData={extraData}
      contests={contests}
      totalTime={totalTime}
      totalClues={totalClues}
      numCorrect={numCorrect}
      formatDate={formatDate}
      enterContest={enterContest}
      exitAction={exitHistory}
      t={t}
    />
  );
};

export default History;