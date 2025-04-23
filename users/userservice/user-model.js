const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique:true,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now, 
    },
    points: {
      type: Number,
      default: 0,
    },
    contests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contest' }] // Array de IDs de concursos
});

const User = mongoose.model('User', userSchema);
User.createIndexes();
module.exports = User