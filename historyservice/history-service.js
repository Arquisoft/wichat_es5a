const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 8005;

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/userdb';
mongoose.connect(mongoUri);

const server = app.listen(port, () => {
    console.log(`History Service listening at http://localhost:${port}`);
});

// Listen for the 'close' event on the Express.js server
server.on('close', () => {
    //Close the connections
});

module.exports = server