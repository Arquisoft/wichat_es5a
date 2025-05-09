import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@mui/material';

const CustomH1 = ({children, size, color}) => {
    return (
        <Typography
            component="h1"
            variant={size || "h1"}
            sx={{ color: color || "#FFFFFF", textAlign: 'center' }}>
            {children}
        </Typography>
    );
};

CustomH1.propTypes = {
    children: PropTypes.node.isRequired,
};

export default CustomH1;