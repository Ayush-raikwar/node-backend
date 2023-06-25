const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(bodyParser.json());

// Replace this with your own secret key
const secretKey = 'your_secret_key';

// Dummy database to store registered users
const users = [];


// mongo start   - -- - -- -- --  -

const { MongoClient } = require('mongodb');

// Connection URI
const uri = 'mongodb+srv://admin-asr:asradmin@cluster-test.mgpia3i.mongodb.net/';

// Create a new MongoClient
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Connect to the MongoDB cluster
async function connect() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    }
}

// Call the connect function to establish a connection
connect();


// mongo end  - -- -- - -- - - 


// mongo save user start  - -- -- - - - - -- -
async function saveUser(user) {
    try {
        const db = client.db('admin-asr');
        const usersCollection = db.collection('users');
        await usersCollection.insertOne(user);
        console.log('User saved successfully');
    } catch (err) {
        console.error('Error saving user:', err);
    }
}

// Example usage
//   const newUser = { username: 'exampleUser', email: 'example@example.com' };


// mongo save user end   ------------


// mongo get all users - -- -- -- - -- - --

async function getAllUsers() {

    const db = client.db('admin-asr')
    const usersCollection = db.collection('users');

    try {
        const users = await usersCollection.find().toArray();
        return users;
    } catch (err) {
        console.error('Error retrieving users:', err);
    }
}

//   - - - -- -- - -- - --

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
            let usr = {
                username: username,
                password: password
            }
            saveUser(usr)
            // users.push({ username, password: hash });
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

app.get('/getAllUsers', async (req, res) => {

    const data = await getAllUsers()
    res.json(data)
})

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
