const mongoose = require('mongoose');
const { create } = require('./history-questionModel');

const contestSchema = new mongoose.Schema({
    
    mode: {
        String
    },
    typeOfQuestions: {
        String
    },
    rightAnswers: {
        Number
    },
    points: {
        Number
    },
    date: {
        default: Date.now,
    },
    preguntas: [{type: mongoose.Schema.Types.ObjectId, ref: "Pregunta" }]
});

const Contest = mongoose.model('Contest', contestSchema);

module.exports = Contest