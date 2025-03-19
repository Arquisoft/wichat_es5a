const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question: {
        type: String,
      },
      image: {
        type: String,
      },
      answer: {
        type: String,
      },
      wrongAnswers: {
        type: [String],
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question