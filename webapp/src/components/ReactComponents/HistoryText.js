import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@mui/material';

const CustomH1 = ({children, size}) => {
    return (
        <Typography
            component="h1"
            variant={size || "h1"}
            sx={{ color: "#FFFFFF", marginTop: 2, textAlign: 'center' }}>
            {children}
        </Typography>
    );
};

CustomH1.propTypes = {
    children: PropTypes.node.isRequired,
};

export default CustomH1;