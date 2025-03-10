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

const query = 'SELECT ?cityLabel ?image WHERE {' +
  '?city wdt:P31 wd:Q515. ?city wdt:P18 ?image.' +
  'SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es,en". }}';

const wikiQuery = new WikiQuery();

// Middleware to parse JSON in request body
app.use(bodyParser.json());

app.post("/questions", async (req, res) => {
  try {
    const results = await wikiQuery.SPARQLQuery(query).catch((error) => {
        console.error('Error al ejecutar la consulta:', error);
    });
      let size = results.results.bindings.length;
      let random = Math.floor(Math.random() * size);

      let wrongAnswers = [];
      let image = results.results.bindings[random].image.value;
      let answer = results.results.bindings[random].cityLabel.value;

      //Adds wrong answer until there are 3 of them
      while (wrongAnswers.length < 3) {
        let randomIndex = Math.floor(Math.random() * size);
        let wrongAnswer = results.results.bindings[randomIndex].cityLabel.value;
        
        //Adds the anwer if it was not added previously and is wrong
        if (wrongAnswer !== answer && !wrongAnswers.includes(wrongAnswer)) {
          wrongAnswers.push(wrongAnswer);
        }
      }

      let queryResults = {
        question: "¿Que ciudad es esta?",
        image: image,
        answer: answer,
        wrongAnswers: wrongAnswers
      }


        // Guardar la pregunta en la base de datos
    const newQuestion = new Question(queryResults);
    await newQuestion.save();
      res.send(queryResults);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send(error); //Shows the error to the user
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