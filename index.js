const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const serverless = require('serverless-http')
const router = express.Router()

const app = express();
app.use(bodyParser.json());

// Replace this with your own secret key
const secretKey = 'your_secret_key';

// Dummy database to store registered users
const users = [];

// Register a new user
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    // Check if the username is already taken
    if (users.find(user => user.username === username)) {
        return res.status(400).json({ error: 'Username already exists' });
    }

    // Generate a salt and hash the password
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to register user' });
        }

        bcrypt.hash(password, salt, (err, hash) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to register user' });
            }

            // Save the user in the database
            users.push({ username, password: hash });
            res.status(200).json({ message: 'User registered successfully' });
        });
    });
});

app.get('/api/data', (req, res) => {
    const data = [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Smith' },
        { id: 3, name: 'Bob Johnson' }
    ];

    res.json(data);
});

// User login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Find the user in the database
    const user = users.find(user => user.username === username);
    if (!user) {
        return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Compare the provided password with the stored hash
    bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err || !isMatch) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Generate a JWT token
        const token = jwt.sign({ username }, secretKey);

        // Send the token as a response
        res.status(200).json({ token });
    });
});

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

app.use('/.netlify/functions/api/', router)
module.exports.handler = serverless(app)