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

// Función para actualizar la información del usuario en la base de datos
async function updateUserProfile(currentUsername, newUsername, newEmail) {
  try {
    const updateFields = {};

    if (newUsername) {
      const existingUserWithNewUsername = await findOne(newUsername, null);
      if (existingUserWithNewUsername && existingUserWithNewUsername.username !== currentUsername) {
        throw new Error('El nombre de usuario ya está en uso.');
      }
      updateFields.username = newUsername.toString();
    }

    if (newEmail) {
      const existingUserWithNewEmail = await findOne(null, newEmail);
      if (existingUserWithNewEmail && existingUserWithNewEmail.email !== (await User.findOne({ username: currentUsername })).email) {
        throw new Error('El correo electrónico ya está en uso.');
      }
      updateFields.email = newEmail.toString();
    }

    const result = await User.updateOne({ username: currentUsername.toString() }, { $set: updateFields });

    if (result.matchedCount === 0) {
      throw new Error('Usuario no encontrado.');
    }

    return { message: 'Perfil actualizado exitosamente.', modifiedCount: result.modifiedCount };

  } catch (error) {
    throw error;
  }
}

// Función para cambiar la contraseña del usuario
async function changePassword(username, currentPassword, newPassword, repeatPassword) {
  try {
    const updateFields = {};
    const user = await findOne(username, null);
    if(!user) throw new Error("Usuario no encontrado");
    
    if (!await bcrypt.compare(currentPassword, user.password)) {
      throw new Error("Contraseña actual errónea");
    }
    
    const passwordRegex = /^(?=.*[0-9])(?=.*[A-Z]).{7,}$/;
    if (!passwordRegex.test(newPassword)) {
      throw new Error("Formato inválido");
    }

    if (!newPassword || !repeatPassword || newPassword !== repeatPassword) {
      throw new Error('Las contraseñas deben ser iguales');
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    updateFields.password = hashed;

    const result = await User.updateOne({ username: username.toString() }, { $set: updateFields });

    if (result.matchedCount === 0) {
      throw new Error('Usuario no encontrado');
    }

    return { message: 'Contraseña modificada exitosamente.', modifiedCount: result.modifiedCount };

  } catch (error) {
    throw error;
  }
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

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.points = req.body.points + user.points
    user.contests.push(contestId);

    await user.save(); // Save the updated user data

    res.json({message: 'Game saved successfully'});

    
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/profile/edit/:username', async (req, res) => {
  try {
    const currUsername = req.params.username;
    const newUsername = req.body.username; 
    const newEmail = req.body.email;

    //Comprobación de que el email sea del tipo cualquiercosa@cualquiercosa.letras(mínimo 2)
    const emailRegex = /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(newEmail)) {
      return res.status(400).json({ error: "Formato de email inválido" });
    }

    const result = await updateUserProfile(
      currUsername.toString(), 
      newUsername.toString(), 
      newEmail.toString()
    );
    res.json(result);

  } catch (error) {
    res.status(error.message === 'Usuario no encontrado.' ? 404 :
      error.message === 'El nombre de usuario ya está en uso.' ? 409 :
        error.message === 'El correo electrónico ya está en uso.' ? 409 :
          500).json({ error: error.message || 'Error interno del servidor al actualizar el perfil.' });
  }
});

app.put('/profile/changePassword/:username', async (req, res) => {
  try {
    validateRequiredFields(req, ['currentPassword', 'newPassword', 'repeatPassword']);
    const username = req.params.username;
    const currentPassword = req.body.currentPassword; 
    const newPassword = req.body.newPassword;
    const repeatPassword = req.body.repeatPassword;

    const result = await changePassword(
      username.toString(), 
      currentPassword.toString(), 
      newPassword.toString(),
      repeatPassword.toString()
    );
    res.json(result);

  } catch (error) {
    res.status(error.message === 'Usuario no encontrado' ? 404 : error.message === 'Contraseña actual errónea' ? 409 :
      error.message === 'Formato inválido' ? 409 : error.message === 'Las contraseñas deben ser iguales' ? 409 :
        500).json({ error: error.message || 'Error interno del servidor al cambiar la contraseña.' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.post('/adduser', async (req, res) => {
  try {
      // Check if required fields are present in the request body
      validateRequiredFields(req, ['username', 'email', 'password', 'confirmPassword']);
      const { username, email, password, confirmPassword } = req.body;

      //Comprobación de que el nombre de usuario tenga mínimo 4 caracteres
      if (username.length < 4) {
        return res.status(400).json({ error: "El nombre de usuario debe tener al menos 4 caracteres" });
      }

      //Comprobación de que el email sea del tipo cualquiercosa@cualquiercosa.letras(mínimo 2)
      const emailRegex = /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Formato de email inválido" });
      }

      // Comprobación de que el password tenga 7 o más caracteres, al menos un número y al menos una mayúscula
      const passwordRegex = /^(?=.*[0-9])(?=.*[A-Z]).{7,}$/;
      if (!passwordRegex.test(password)) {
        return res.status(400).json({ error: "La contraseña debe tener al menos 7 caracteres, uno de ellos mayúscula y otro un número" });
      }

      //Comprobación de que las contraseñas tienen que coincidir
      if (password !== confirmPassword) {
        return res.status(400).json({ error: "Las contraseñas no coinciden" });
      }

      const user_Username = await findOne(username, null);
      const user_Email = await findOne(null, email);

      if(user_Email || user_Username ){
          throw new Error("Ya se ha registrado un usuario con ese email o nombre de usuario");
      }
      const newUser = new User({
        username,
        email, 
        password: await bcrypt.hash(password, 10), //Guarda la contraseña encriptada
      });

      const token = jwt.sign(
              { user: newUser }, 
              'your-secret-key', 
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