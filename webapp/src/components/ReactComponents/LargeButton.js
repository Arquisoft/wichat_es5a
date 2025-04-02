import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@mui/material';

const LargeButton = ({ onClick, children, width }) => {
  return (
    <Button
      onClick={onClick}
      sx={{
        backgroundColor: "#00735C",
        color: "white", '&:hover': { backgroundColor: "#29A0B1" },
        marginTop: 2,
        width: width || '15%'
      }}
    >
      {children}
    </Button>
  );
};

LargeButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  width: PropTypes.string,
};

export default LargeButton;