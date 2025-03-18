import React from 'react';

import { useNavigate } from 'react-router';
import LargeButton from '../ReactComponents/LargeButton';
import CustomH1 from '../ReactComponents/CustomH1';

const History = () => {

  const navigate = useNavigate();
  
  const exitHistory = () => {
    navigate('/home');
  }

  return (
    <div>
          <CustomH1>
           AAAAAAAAAAAA
          </CustomH1>
          <LargeButton onClick={exitHistory}>
            Salir
          </LargeButton>
    </div>
  );
};

export default History;