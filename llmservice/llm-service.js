const axios = require('axios');
const express = require('express');
const cors = require('cors');
const app = express();
const port = 8003;

// Middleware to parse JSON in request body
app.use(cors());
app.use(express.json());
// Load enviroment variables
require('dotenv').config();

// Define configurations for different LLM APIs
const llmConfigs = {
  gemini: {
    url: (apiKey) => `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    transformRequest: (question) => ({
      contents: [{ parts: [{ text: question }] }]
    }),
    transformResponse: (response) => response.data.candidates[0]?.content?.parts[0]?.text
  }
  // empathy: {
  //   url: () => 'https://empathyai.prod.empathy.co/v1/chat/completions',
  //   transformRequest: (question) => ({
  //     model: "qwen/Qwen2.5-Coder-7B-Instruct",
  //     messages: [
  //       { role: "system", content: "You are a helpful assistant." },
  //       { role: "user", content: question }
  //     ]
  //   }),
  //   transformResponse: (response) => response.data.choices[0]?.message?.content,
  //   headers: (apiKey) => ({
  //     Authorization: `Bearer ${apiKey}`,
  //     'Content-Type': 'application/json'
  //   })
  // }
};

// Function to validate required fields in the request body
function validateRequiredFields(req, requiredFields) {
  for (const field of requiredFields) {
    if (!(field in req.body)) {
      throw new Error(`Missing required field: ${field}`);
    }
  }
}

// Generic function to send questions to LLM
async function sendQuestionToLLM(question, apiKey, model = 'gemini') {
  try {
    const config = llmConfigs[model];
    if (!config) {
      throw new Error(`Model "${model}" is not supported.`);
    }

    const url = config.url(apiKey);
    const requestData = config.transformRequest(question);

    console.log('URL:', url);
    console.log('Request Data:', JSON.stringify(requestData, null, 2));

    const headers = {
      'Content-Type': 'application/json',
      ...(config.headers ? config.headers(apiKey) : {})
    };

    const response = await axios.post(url, requestData, { headers });

    console.log('Response:', response.data);

    return config.transformResponse(response);

  } catch (error) {
    console.error(`Error sending question to ${model}:`, error.message || error);
    console.error('Error Response:', error.response?.data);
    return null;
  }
}

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.post('/ask', async (req, res) => {
  try {
    validateRequiredFields(req, ['question', 'model']);
    const { question, model, resCorr } = req.body;
    
    const context = `Eres un asistente que da pistas sobre determinados temas. 
    La respuesta correcta sobre la que debes dar pistas es: ${resCorr || 'no especificada'}. 
    Cuando te pregunten sobre esta respuesta, ofrece pistas progresivas pero nunca la reveles directamente.
    
    Pregunta: ${question}`;
    
    const apiKey = process.env.LLM_API_KEY;
    if(!apiKey) return res.status(400).json({error: 'API key is missing'});
    
    const answer = await sendQuestionToLLM(context, apiKey, model);
    res.json({ answer });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const server = app.listen(port, () => {
  console.log(`LLM Service listening at http://localhost:${port}`);
});

module.exports = server


