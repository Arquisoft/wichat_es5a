const express = require('express');
const bodyParser = require('body-parser');
const WikiQuery = require('./wiki-query');
const mongoose = require('mongoose');
const Question = require('./question-model'); // Importar el modelo de preguntas
const app = express();
const port = 8004;

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/userdb';
mongoose.connect(mongoUri);

const wikiQuery = new WikiQuery();

const queries = [{
  kind: "city",
  question: "question-city",
  query: 'SELECT ?answerLabel ?image WHERE {' +
    '?answer wdt:P31 wd:Q515; wdt:P18 ?image; wdt:P1082 ?population. FILTER(?population > 1000000)' +
    ' SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es,en". }} LIMIT '
}, {
  kind: "album",
  question: "question-album",
  query: 'SELECT ?answerLabel ?image WHERE {' +
    '?answer wdt:P31 wd:Q482994;' +
    '        wdt:P18 ?image.' +
    'OPTIONAL { ?answer wdt:P175 ?artist }' +
    'OPTIONAL { ?answer wdt:P166 ?award }' +
    ' SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es,en". }} LIMIT '
}, {
  kind: "football",
  question: "question-football",
  query: 'SELECT ?answerLabel ?image WHERE {' +
    '?answer wdt:P31 wd:Q476028;' +
    '     wdt:P154 ?image.' +
    '?answer wdt:P118 ?league.' +
    'SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es,en". }} LIMIT '
}, {
  kind: "flag",
  question: "question-flag",
  query: 'SELECT ?answerLabel ?image WHERE {' +
    '?answer wdt:P31 wd:Q6256;' +
    '         wdt:P41 ?image.' +
    ' SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es,en". }} LIMIT '
}, {
  kind: "music",
  question: "question-music",
  query: 'SELECT ?answerLabel ?image WHERE {' +
      '?answer wdt:P31 wd:Q215380;' +
      '         wdt:P18 ?image;' +
      '         wdt:P166 ?award.' +
      'SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es,en". }} LIMIT '
}, {
  kind: "food",
  question: "question-food",
  query: 'SELECT ?answerLabel ?image WHERE {' +
      '?answer wdt:P31 wd:Q2095;' +
      '       wdt:P18 ?image;' +
      '       wdt:P495 ?country.' +
      'FILTER(?country IN (wd:Q29, wd:Q38, wd:Q142))' +
      'SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es,en,it". }} LIMIT '
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
  let { question, query } = getQuery(req.params.kind);
  let { language, numQuestions } = req.body;
  query = query.replace("[AUTO_LANGUAGE],es,en", language + ",es,en");
  let limit = numQuestions * 3;
  if(req.params.kind === "music") {
    limit = limit * 3;
  }
  try {
    const results = await wikiQuery.SPARQLQuery(query + limit).catch((error) => {
      console.error('Error al ejecutar la consulta:', error);
    });
    let size = results.results.bindings.length;
    let random = Math.floor(Math.random() * size);
    let current = 0;
    let questions = [];
    let answers = [];

    while(current < req.body.numQuestions) {
      let wrongAnswers = [];
      let image = results.results.bindings[random].image.value;
      let answer = results.results.bindings[random].answerLabel.value;
      if(!answers.includes(answer.toLowerCase()) && !/^Q\d+$/.test(answer)) {
        //Adds wrong answer until there are 3 of them
        while (wrongAnswers.length < 3) {
          let randomIndex = Math.floor(Math.random() * size);
          let wrongAnswer = results.results.bindings[randomIndex].answerLabel.value;
          //Adds the anwer if it was not added previously and is wrong
          if (wrongAnswer !== answer && !wrongAnswers.includes(wrongAnswer) && !/^Q\d+$/.test(wrongAnswer)) {
            wrongAnswers.push(wrongAnswer);
          }
        }
        let queryResults = {
          question: question,
          image: image,
          answer: answer,
          wrongAnswers: wrongAnswers
        }
        questions.push(queryResults);
        answers.push(queryResults.answer.toLowerCase());
        current++;
        const newQuestion = new Question(queryResults);
        await newQuestion.save();
      }
      random = Math.floor(Math.random() * size);
    }
    res.send(questions);
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