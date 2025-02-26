import React from 'react';

const Points = () => {
  return (
    <div>
          <Typography component="h1" variant="h1" sx={{ textAlign: 'center', marginTop: 2 }}>
            "Puntación" X/20
          </Typography>
          <Typography component="h1" variant="h2" sx={{ textAlign: 'center', marginTop: 2 }}>
            ¡Bien hecho!
          </Typography>
          <Box display="flex" justifyContent="center" mt={2}>
            <Button variant="contained" color="primary" >
              Jugar otra vez
            </Button>
          </Box>
          <Box display="flex" justifyContent="center" mt={2}>
            <Button variant="contained" color="primary" >
              Salir
            </Button>
          </Box>
    </div>
  );
};

export default Points;