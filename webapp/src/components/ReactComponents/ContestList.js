import React from 'react';
import Container from '@mui/material/Container';
import ContestRow from './ContestRow';

const ContestList = ({ contests, numCorrect, totalTime, totalClues, formatDate, enterContest, t }) => {
  return (
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
  );
};

export default ContestList;