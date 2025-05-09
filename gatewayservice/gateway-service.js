const express = require('express');
const axios = require('axios');
const cors = require('cors');
const promBundle = require('express-prom-bundle');
//libraries required for OpenAPI-Swagger
const swaggerUi = require('swagger-ui-express'); 
const fs = require("fs")
const YAML = require('yaml')

const app = express();
const port = 8000;

const historyServiceUrl = process.env.HISTORY_SERVICE_URL || 'http://localhost:8005';
const wikiServiceUrl = process.env.WIKI_SERVICE_URL || 'http://localhost:8004';
const llmServiceUrl = process.env.LLM_SERVICE_URL || 'http://localhost:8003';
const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:8002';
const userServiceUrl = process.env.USER_SERVICE_URL || 'http://localhost:8001';

const allowedOrigins = ['http://localhost:8080', 'http://48.209.10.166:8080',
  'http://localhost', 'http://48.209.10.166'];

app.use(cors({
  origin: function (origin, callback) {
    // Permitir requests sin 'origin' (por ejemplo, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true // Solo si necesitas enviar cookies/autenticación
}));
app.use(express.json());

//Prometheus configuration
const metricsMiddleware = promBundle({includeMethod: true});
app.use(metricsMiddleware);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.post('/login', async (req, res) => {
  try {
    // Forward the login request to the authentication service
    const authResponse = await axios.post(authServiceUrl+'/login', req.body);
    res.json(authResponse.data);
  } catch (error) {
    res.status(error.response.status).json({ error: error.response.data.error });
  }
});

app.post('/adduser', async (req, res) => {
  try {
    // Forward the add user request to the user service
    const userResponse = await axios.post(userServiceUrl+'/adduser', req.body);
    res.json(userResponse.data);
  } catch (error) {
    res.status(error.response.status).json({ error: error.response.data.error });
  }
});

app.get('/profile', async (req, res) => {
  try {
    const userResponse = await axios.get(userServiceUrl + '/profile', {
      headers: req.headers, // Forward all headers, including Authorization
    });
    res.json(userResponse.data);
  } catch (error) {
    res.status(error.response.status).json({ error: error.response.data.error });
  }
});

app.put('/profile/edit/:username', async (req, res) => {
  try {
    const userResponse = await axios.put(userServiceUrl + `/profile/edit/${req.params.username}`, req.body, {
      headers: req.headers, // Forward all headers, including Authorization
    });
    res.json(userResponse.data);
  } catch (error) {
    res.status(error.response.status).json({ error: error.response.data.error });
  }
});

app.put('/profile/changePassword/:username', async (req, res) => {
  try {
    const userResponse = await axios.put(userServiceUrl + `/profile/changePassword/${req.params.username}`, req.body, {
      headers: req.headers, // Forward all headers, including Authorization
    });
    res.json(userResponse.data);
  } catch (error) {
    res.status(error.response.status).json({ error: error.response.data.error });
  }
});

app.post('/askllm', async (req, res) => {
  try {
    // Forward the add user request to the user service
    const llmResponse = await axios.post(llmServiceUrl+'/ask', req.body);
    res.json(llmResponse.data);
  } catch (error) {
    res.status(error.response.status).json({ error: error.response.data.error });
  }
});

app.post('/questions/:kind', async (req, res) => {
  try {
    const wikiResponse = await axios.post(wikiServiceUrl + '/questions/' + req.params.kind, req.body);
    res.json(wikiResponse.data);
  } catch (error) {
    res.status(error.response.status).json({error: error.response.data.error });
  }
});

app.post('/savegame', async (req, res) => {
  try {
    // Llama al servicio de historial para guardar el juego
    const historyResponse = await axios.post(historyServiceUrl + '/savegame', req.body);

    // Llama al servicio de usuario para asociar el historial con el usuario
    const userResponse = await axios.post(userServiceUrl + '/savegame', {
      id: historyResponse.data.id,
      username: req.body.username,
      points: req.body.points,
    });

    res.json(userResponse.data);
  } catch (error) {
    console.error('Error en /savegame:', error.message);
    res.status(error.response?.status || 500).json({ error: error.response?.data?.error || 'Internal Server Error' });
  }
});

app.get('/gethistory', async (req, res) => {
  try {
    const historyResponse = await axios.get(historyServiceUrl + '/gethistory');
    res.json(historyResponse.data);
  } catch (error) {
    res.status(error.response.status).json({error: error.response.data.error });
  }
});

app.get('/gethistory/:username', async (req, res) => {
  try {
    
    const userResponse = await axios.get(userServiceUrl + '/getUserhistory/' + req.params.username);
    
    const historyResponse = await axios.post(historyServiceUrl + '/getUserhistory', {contestIds: userResponse.data.contests});
    res.json(historyResponse.data);
  } catch (error) {
    res.status(error.response.status).json({error: error.response.data.error });
  }
});

app.get('/getranking', async (req, res) => {
  try {
    const userResponse = await axios.get(userServiceUrl + '/getranking');
    res.json(userResponse.data);
  } catch (error) {
    res.status(error.response.status).json({error: error.response.data.error });
  }
});

app.get('/getquestions/:id', async (req, res) => {
  try {
    const historyResponse = await axios.get(historyServiceUrl + `/getquestions/${req.params.id}`);
    res.json(historyResponse.data);
  } catch (error) {
    res.status(error.response.status).json({error: error.response.data.error });
  }
});

// Read the OpenAPI YAML file synchronously
openapiPath='./openapi.yaml'
if (fs.existsSync(openapiPath)) {
  const file = fs.readFileSync(openapiPath, 'utf8');

  // Parse the YAML content into a JavaScript object representing the Swagger document
  const swaggerDocument = YAML.parse(file);

  // Serve the Swagger UI documentation at the '/api-doc' endpoint
  // This middleware serves the Swagger UI files and sets up the Swagger UI page
  // It takes the parsed Swagger document as input
  app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} else {
  console.log("Not configuring OpenAPI. Configuration file not present.")
}


// Start the gateway service
const server = app.listen(port, () => {
  console.log(`Gateway Service listening at http://localhost:${port}`);
});

module.exports = server
