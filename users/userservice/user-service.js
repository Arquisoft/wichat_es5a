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
  console.log("ENTRO AQUÍ")
  try {
    const username = req.user.username; // Extract username from token
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

app.post('/adduser', async (req, res) => {
  try {
      // Check if required fields are present in the request body
      validateRequiredFields(req, ['username','password']);
      const { username/*, email, password */} = req.body;
      const user_Username = await findOne(username, null);
      //const user_Email = await findOne(null, email);
      const user_Email = false; // Ahora mismo los usuarios no tienen email, cuando lo tengan cambiar la linea por la de arriba
      if(user_Email || user_Username ){
          throw new Error("Ya se ha registrado un usuario con ese email o nombre de usuario");
      }else{
          // Encrypt the password before saving it
          const hashedPassword = await bcrypt.hash(req.body.password, 10);
          //const user_Username = await findOne(username, null); // Creo que esta está mal???
          //const user_Email = await findOne(null, email); // Creo que está mal???
          const newUser = new User({
              username: req.body.username,
              email: req.body.username, //Cuando estén implementados los correos, cambiar esta linea por el correo. Si se cambia ahora da un error al tener varios correos con null
              password: hashedPassword,
          });

          const token = jwt.sign({ userId: newUser._id,
            username: user_Username }, 'your-secret-key', { expiresIn: '1h' });

          await newUser.save();
          res.json({token: token, user: newUser});
      }

  } catch (error) {
    console.log("Error: " + error)
    res.status(400).json({ error: error.message }); 
  }});



const server = app.listen(port, () => {
  console.log(`User Service listening at http://localhost:${port}`);
});

// Listen for the 'close' event on the Express.js server
server.on('close', () => {
  mongoose.connection.close();
});

module.exports = server;