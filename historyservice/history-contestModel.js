const mongoose = require('mongoose');
const { create } = require('./history-questionModel');

const contestSchema = new mongoose.Schema({
    
    mode: {
        type: String
    },
    typeOfQuestions: {
        type: String
    },
    rightAnswers: [{type: Number}],
    points: {
        type: Number
    },
    date: {
        type: Date,
        default: Date.now,
    },
    preguntas: [{type: mongoose.Schema.Types.ObjectId, ref: "Pregunta" }],
    tiempos: [{type: Number}],
    pistas: [{type: Number}]
});

const Contest = mongoose.model('Contest', contestSchema);

module.exports = Contest