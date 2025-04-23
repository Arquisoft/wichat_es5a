const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./user-model');


const app = express();
const port = process.env.PORT || 8001;
const secretKey = 'your-secret-key';

// Middleware to parse JSON in request body
app.use(express.json());

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/userdb';
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  });

// Function to validate required fields in the request body
function validateRequiredFields(req, requiredFields) {
  for (const field of requiredFields) {
    if (!(field in req.body)) {
      throw new Error(`Missing required field: ${field}`);
    }
  }
}

// Function to find a user by username or email
async function findOne(username, email) {
  const query = {};
  if (username) {
    query.username = username.toString();
  }
  if (email) {
    query.email = email.toString();
  }
  return await User.findOne(query);
}

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};

// Route to get user profile using username from token
app.get('/profile', authenticateToken, async (req, res) => {
  try {
    const username = req.user.user.username; // Extract username from token
    const user = await findOne(username, null); // Use findOne() to get user data

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/savegame', async (req, res) => {
  try {
    const username = req.body.username // Extract username from token
    const user = await findOne(username, null); // Use findOne() to get user data
    const contestId = req.body.id; // Extract id from request body

    console.log(contestId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.points = req.body.points + user.points
    user.contests.push(contestId);

    await user.save(); // Save the updated user data
    
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.post('/adduser', async (req, res) => {
  try {
      // Check if required fields are present in the request body
      validateRequiredFields(req, ['username','password','confirmPassword']);
      const { username, password, confirmPassword } = req.body;
      if (password !== confirmPassword) {
        return res.status(400).json({ error: "Las contraseñas no coinciden" });
      }
      const user_Username = await findOne(username, null);
      //const user_Email = await findOne(null, email);
      const user_Email = false; // Ahora mismo los usuarios no tienen email, cuando lo tengan cambiar la linea por la de arriba
      if(user_Email || user_Username ){
          throw new Error("Ya se ha registrado un usuario con ese email o nombre de usuario");
      }
      const newUser = new User({
        username,
        email: username, //Cambiar más adelante por email
        password: await bcrypt.hash(password, 10), //Guarda la contraseña encriptada
      });

      const token = jwt.sign(
        { userId: newUser._id, username: newUser.username },
        secretKey,
        { expiresIn: '1h' }
      );

      await newUser.save();
      res.json({token: token, user: newUser});
  } catch (error) {
    console.log("Error: " + error)
    res.status(400).json({ error: error.message }); 
  }});

  app.get('/getUserHistory/:username', async (req, res) => {
    try {
        const username = req.params.username;
        const user = await findOne(username, null);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const contests = user.contests;

        res.json({ contests: contests });
    } catch (error) {
        console.error('Error fetching user history:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
  }
);

app.get('/getranking', async (req, res) => {
  try {
    const users = await User.find({}).sort({ points: -1 });
    res.json({ users });
  } catch (error) {
    console.error('Error fetching ranking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const server = app.listen(port, () => {
  console.log(`User Service listening at http://localhost:${port}`);
});

// Listen for the 'close' event on the Express.js server
server.on('close', () => {
  mongoose.connection.close();
});

module.exports = server;