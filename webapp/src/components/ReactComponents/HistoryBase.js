import React from 'react';
import Container from '@mui/material/Container';
import LargeButton from '../ReactComponents/LargeButton';
import CustomH1 from '../ReactComponents/CustomH1';
import NavBar from "../NavBar/NavBar";
import ContestList from '../ReactComponents/ContestList';

const HistoryBase = ({
  title,
  extraData,
  contests,
  totalTime,
  totalClues,
  numCorrect,
  formatDate,
  enterContest,
  exitAction,
  t,
}) => {
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
        <CustomH1>{title}</CustomH1>
        {extraData && (
          <>
            <CustomH1 size="h5">
              <span>{t("total-users")}: {extraData.userCount}</span>
            </CustomH1>
            <CustomH1 size="h5">
              <span>{t("questions-generated")}: {extraData.questionCount}</span>
            </CustomH1>
          </>
        )}
        <LargeButton onClick={exitAction}>
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

export default HistoryBase;