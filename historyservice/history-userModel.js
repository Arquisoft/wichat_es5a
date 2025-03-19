const mongoose = require('mongoose');
const { create } = require('./history-questionModel');

const userSchema = new mongoose.Schema({
    username: {
        String
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const User = mongoose.model('User', userSchema);

module.exports = User