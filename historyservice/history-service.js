const express = require('express');
const mongoose = require('mongoose');
const User = require('./history-userModel')
const Question = require('./history-questionModel')

const app = express();
const port = 8005;

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/userdb';
mongoose.connect(mongoUri);

const server = app.listen(port, () => {
    console.log(`History Service listening at http://localhost:${port}`);
});

app.get('/history', async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const questionCount = await Question.countDocuments();
        res.json({ userCount: userCount, questionCount: questionCount });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Listen for the 'close' event on the Express.js server
server.on('close', () => {
    //Close the connections
});

module.exports = server