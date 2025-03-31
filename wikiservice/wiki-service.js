const express = require('express');
const bodyParser = require('body-parser');
const WikiQuery = require('./wiki-query');
const mongoose = require('mongoose');
const Question = require('./question-model'); // Importar el modelo de preguntas
const app = express();
const port = 8004;

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/userdb';
const preguntas=new Set();
mongoose.connect(mongoUri);

const wikiQuery = new WikiQuery();

const queries = [{
  kind: "city",
  question: "¿Qué ciudad es esta?",
  query: 'SELECT ?answerLabel ?image WHERE {' +
      '?answer wdt:P31 wd:Q515; wdt:P18 ?image; wdt:P1082 ?population. FILTER(?population > 1000000)' +
      ' SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es,en". }} LIMIT 100'
}, {
  kind: "album",
  question: "¿Cuál es el nombre de este álbum?",
  query: 'SELECT ?answerLabel ?image WHERE {' + 
      '?answer wdt:P31 wd:Q482994;' +
      '        wdt:P18 ?image.' +
      'OPTIONAL { ?answer wdt:P175 ?artist }' +
      'OPTIONAL { ?answer wdt:P166 ?award }' +
      ' SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es,en". }} LIMIT 50'
}, {
  kind: "football",
  question: "¿Qué equipo de fútbol es este?",
  query: 'SELECT ?answerLabel ?image WHERE {' +
      '?answer wdt:P31 wd:Q476028;' +
      '     wdt:P154 ?image.' +
      '?answer wdt:P118 ?league.' +
      'SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es,en". }} LIMIT 100'
}, {
  kind: "flag",
  question: "¿De qué país es esta bandera?",
  query: 'SELECT ?answerLabel ?image WHERE {' +
      '?answer wdt:P31 wd:Q6256;' +
      '         wdt:P41 ?image.' +
      ' SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es,en". }} LIMIT 100'
}];

function getQuery(kind) {
  return queries.find(q => q.kind.includes(kind)) || null;
}

// Middleware to parse JSON in request body
app.use(bodyParser.json());

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.post("/questions/:kind", async (req, res) => {
  let {question, query} = getQuery(req.params.kind);
  try {
    const results = await wikiQuery.SPARQLQuery(query).catch((error) => {
        console.error('Error al ejecutar la consulta:', error);
    });
    let size = results.results.bindings.length;
    let random = Math.floor(Math.random() * size);
    
    let wrongAnswers = [];
    let image = results.results.bindings[random].image.value;
    let answer = results.results.bindings[random].answerLabel.value;

    //Adds wrong answer until there are 3 of them
    while (wrongAnswers.length < 3) {
      let randomIndex = Math.floor(Math.random() * size);
      let wrongAnswer = results.results.bindings[randomIndex].answerLabel.value;
      
      //Adds the anwer if it was not added previously and is wrong
      if (wrongAnswer !== answer && !wrongAnswers.includes(wrongAnswer)) {
        wrongAnswers.push(wrongAnswer);
      }
    }

    let queryResults = {
      question: question,
      image: image,
      answer: answer,
      wrongAnswers: wrongAnswers
    }
    const uniqueKey = `${question}-${image}-${answer}`;
    if (!preguntas.has(uniqueKey)) {
      preguntas.add(uniqueKey); 
      const newQuestion = new Question(queryResults); 
      await newQuestion.save();
      res.send(queryResults); 
    } 
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send(error); // Mostrar el error al usuario
  }
});

const server = app.listen(port, () => {
  console.log(`Wiki Service listening at http://localhost:${port}`);
});

// Listen for the 'close' event on the Express.js server
server.on('close', () => {
  //Close the connections
});

module.exports = server