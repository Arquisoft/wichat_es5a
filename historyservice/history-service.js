const express = require('express');
const mongoose = require('mongoose');
const User = require('./history-userModel')
const Question = require('./history-questionModel')
const Contest = require('./history-contestModel')

const app = express();
const port = 8005;

app.use(express.json());

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/userdb';
mongoose.connect(mongoUri);

const server = app.listen(port, () => {
    console.log(`History Service listening at http://localhost:${port}`);
});

app.get('/gethistory', async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const questionCount = await Question.countDocuments();
        res.json({ userCount: userCount, questionCount: questionCount });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/savegame', async (req, res) => {
    try {
        let idPreguntas = []
        for (const preg of req.body.arPreg) {
            const questionData = {
                question: preg.pregunta,
                image: preg.imagen,
                answer: preg.resCorr,
                wrongAnswers: preg.resFalse
            };
            const newQuestion = new Question(questionData);
            await newQuestion.save(); // Espera a que se guarde la pregunta
            idPreguntas.push(newQuestion._id); // Agrega el ID al array
        }
        console.log(idPreguntas)
        let contestData = {
            mode: "mode",
            typeOfQuestions: "typeOfQuestions",
            rightAnswers: req.body.numRespuestasCorrectas,
            points: req.body.points,
            preguntas: idPreguntas
        }
        const newContest = new Contest(contestData)
        await newContest.save()
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Listen for the 'close' event on the Express.js server
server.on('close', () => {
    //Close the connections
});

module.exports = server