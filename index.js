const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(bodyParser.json());

// Replace this with your own secret key
const secretKey = 'manglutester';

// Dummy database to store registered users
let users = [];


// mongo start   - -- - -- -- --  -

const { MongoClient } = require('mongodb');

// Connection URI
const uri = 'mongodb+srv://admin2-asr:admin2asr@cluster-test.mgpia3i.mongodb.net/';

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






async function saveUser(user) {
    try {
        const db = client.db('admin2-asr');
        const usersCollection = db.collection('users');
        await usersCollection.insertOne(user);
        console.log('User saved successfully');
    } catch (err) {
        console.error('Error saving user:', err);
    }
}







async function getAllUsers() {

    const db = client.db('admin2-asr')
    const usersCollection = db.collection('users');

    const pipeline = [{ $project: { password: 0 } }];

    try {
        const usersdb = await usersCollection.aggregate(pipeline).toArray();
        users = usersdb;
        return users;
    } catch (err) {
        console.error('Error retrieving users:', err);
    }
}



// mongo end  - -- -- - -- - - 

// APIS ->




app.post('/register', async (req, res) => {
    const { username, password, email, fullName } = req.body;

    try {
        const db = client.db('admin2-asr');
        const usersCollection = db.collection('users');

        // Check if the username is already taken
        const existingUser = await usersCollection.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to register user' });
            }

            bcrypt.hash(password, salt, async (err, hash) => {
                if (err) {
                    return res.status(500).json({ error: 'Failed to register user' });
                }

                const user = {
                    username,
                    password: hash,
                    fullName,
                    email
                };

                const data = {
                    userData: {
                        userName: username,
                        fullName: fullName,
                        email: email,
                        properties: [
                            {
                                id: 1,
                                propertyId: 1,
                                name: 'Ram Tower',
                                propertyImg: 'https://static01.nyt.com/images/2020/01/27/realestate/27WYG-CA-slide-HWXH/27WYG-CA-slide-HWXH-superJumbo.jpg?quality=75&auto=webp&disable=upscale',
                                address: 'Abhiruchi Parisar, Old subhash nagar, Bhopal, M.P., India',
                                tenantsActive: 12,
                            },
                            {
                                id: 2,
                                propertyId: 2,
                                name: 'Shyam Tower',
                                propertyImg: 'https://static01.nyt.com/images/2020/01/27/realestate/27WYG-CA-slide-HWXH/27WYG-CA-slide-HWXH-superJumbo.jpg?quality=75&auto=webp&disable=upscale',
                                address: 'Abhiruchi Parisar, Old subhash nagar, Bhopal, M.P., India',
                                tenantsActive: 12,
                            },
                            {
                                id: 3,
                                propertyId: 3,
                                name: 'Manglu bhawan',
                                propertyImg: 'https://static01.nyt.com/images/2020/01/27/realestate/27WYG-CA-slide-HWXH/27WYG-CA-slide-HWXH-superJumbo.jpg?quality=75&auto=webp&disable=upscale',
                                address: 'Global Pork station,Puncture nagar, Bhopal, M.P., India',
                                tenantsActive: 12,
                            },
                            {
                                id: 4,
                                propertyId: 4,
                                name: 'Bhole nagri',
                                propertyImg: 'https://static01.nyt.com/images/2020/01/27/realestate/27WYG-CA-slide-HWXH/27WYG-CA-slide-HWXH-superJumbo.jpg?quality=75&auto=webp&disable=upscale',
                                address: 'Chapra district, Puncture nagar, Bhopal, M.P., India',
                                tenantsActive: 12,
                            },
                        ]
                    }
                }

                await saveUser(user);
                const token = jwt.sign({ username, password }, secretKey);
                res.status(200).json({
                    message: 'User registered successfully',
                    token: token,
                    data: data
                });
            });
        });
    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).json({ error: 'Failed to register user' });
    }
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


app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const db = client.db('admin2-asr');
        const usersCollection = db.collection('users');
        const user = await usersCollection.findOne({ username });
        const data = {
            userData: {
                userName: username,
                fullName: fullName,
                email: email,
                properties: [
                    {
                        id: 1,
                        propertyId: 1,
                        name: 'Ram Tower',
                        propertyImg: 'https://static01.nyt.com/images/2020/01/27/realestate/27WYG-CA-slide-HWXH/27WYG-CA-slide-HWXH-superJumbo.jpg?quality=75&auto=webp&disable=upscale',
                        address: 'Abhiruchi Parisar, Old subhash nagar, Bhopal, M.P., India',
                        tenantsActive: 12,
                    },
                    {
                        id: 2,
                        propertyId: 2,
                        name: 'Shyam Tower',
                        propertyImg: 'https://static01.nyt.com/images/2020/01/27/realestate/27WYG-CA-slide-HWXH/27WYG-CA-slide-HWXH-superJumbo.jpg?quality=75&auto=webp&disable=upscale',
                        address: 'Abhiruchi Parisar, Old subhash nagar, Bhopal, M.P., India',
                        tenantsActive: 12,
                    },
                    {
                        id: 3,
                        propertyId: 3,
                        name: 'Manglu bhawan',
                        propertyImg: 'https://static01.nyt.com/images/2020/01/27/realestate/27WYG-CA-slide-HWXH/27WYG-CA-slide-HWXH-superJumbo.jpg?quality=75&auto=webp&disable=upscale',
                        address: 'Global Pork station,Puncture nagar, Bhopal, M.P., India',
                        tenantsActive: 12,
                    },
                    {
                        id: 4,
                        propertyId: 4,
                        name: 'Bhole nagri',
                        propertyImg: 'https://static01.nyt.com/images/2020/01/27/realestate/27WYG-CA-slide-HWXH/27WYG-CA-slide-HWXH-superJumbo.jpg?quality=75&auto=webp&disable=upscale',
                        address: 'Chapra district, Puncture nagar, Bhopal, M.P., India',
                        tenantsActive: 12,
                    },
                ]
            }
        }
        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err || !isMatch) {
                return res.status(401).json({ error: 'Invalid username or password' });
            }

            const token = jwt.sign({ username }, secretKey);
            res.status(200).json({
                token,
                data: data
            });
        });
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).json({ error: 'Failed to log in' });
    }
});

app.delete('/deleteUser/:username', async (req, res) => {
    const { username } = req.params;

    try {
        const db = client.db('admin2-asr');
        const usersCollection = db.collection('users');

        // Find the user by username
        const user = await usersCollection.findOne({ username });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Delete the user from the database
        await usersCollection.deleteOne({ username });

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ error: 'Failed to delete user' });
    }
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
