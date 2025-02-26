import React from 'react';

const Home = () => {
  return (
    <div>
          <Typography component="h1" variant="h1" sx={{ textAlign: 'center', marginTop: 2 }}>
            WICHAT
          </Typography>
          <Box display="flex" justifyContent="center" mt={2}>
            <Button variant="contained" color="primary" >
              Jugar
            </Button>
          </Box>
          <Box display="flex" justifyContent="center" mt={2}>
            <Button variant="contained" color="primary" >
              Perfil
            </Button>
          </Box>
          <Box display="flex" justifyContent="center" mt={2}>
            <Button variant="contained" color="primary" >
              Créditos
            </Button>
          </Box>
    </div>
  );
};

export default Home;