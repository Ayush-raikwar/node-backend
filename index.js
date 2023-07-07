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

const dbUser = 'admin2-asr'
const dbUserPass = 'admin2asr'
const dbCollection = 'users'


const uri = `mongodb+srv://${dbUser}:${dbUserPass}@cluster-test.mgpia3i.mongodb.net/`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


const db = client.db(dbUser);
const usersCollection = db.collection(dbCollection);

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

        await usersCollection.insertOne(user);
        console.log('User saved successfully');
    } catch (err) {
        console.error('Error saving user:', err);
    }
}







async function getAllUsers() {


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
                        // properties: [
                        //     {
                        //         id: 1,
                        //         propertyId: 1,
                        //         name: 'Ram Tower',
                        //         propertyImg: 'https://static01.nyt.com/images/2020/01/27/realestate/27WYG-CA-slide-HWXH/27WYG-CA-slide-HWXH-superJumbo.jpg?quality=75&auto=webp&disable=upscale',
                        //         address: 'Abhiruchi Parisar, Old subhash nagar, Bhopal, M.P., India',
                        //         tenantsActive: 12,
                        //     },
                        //     {
                        //         id: 2,
                        //         propertyId: 2,
                        //         name: 'Shyam Tower',
                        //         propertyImg: 'https://static01.nyt.com/images/2020/01/27/realestate/27WYG-CA-slide-HWXH/27WYG-CA-slide-HWXH-superJumbo.jpg?quality=75&auto=webp&disable=upscale',
                        //         address: 'Abhiruchi Parisar, Old subhash nagar, Bhopal, M.P., India',
                        //         tenantsActive: 12,
                        //     },
                        //     {
                        //         id: 3,
                        //         propertyId: 3,
                        //         name: 'Manglu bhawan',
                        //         propertyImg: 'https://static01.nyt.com/images/2020/01/27/realestate/27WYG-CA-slide-HWXH/27WYG-CA-slide-HWXH-superJumbo.jpg?quality=75&auto=webp&disable=upscale',
                        //         address: 'Global Pork station,Puncture nagar, Bhopal, M.P., India',
                        //         tenantsActive: 12,
                        //     },
                        //     {
                        //         id: 4,
                        //         propertyId: 4,
                        //         name: 'Bhole nagri',
                        //         propertyImg: 'https://static01.nyt.com/images/2020/01/27/realestate/27WYG-CA-slide-HWXH/27WYG-CA-slide-HWXH-superJumbo.jpg?quality=75&auto=webp&disable=upscale',
                        //         address: 'Chapra district, Puncture nagar, Bhopal, M.P., India',
                        //         tenantsActive: 12,
                        //     },
                        // ]
                    }
                }

                await saveUser(user);
                const token = jwt.sign({ username, password }, secretKey, { expiresIn: '12h' });
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
        const user = await usersCollection.findOne({ username });
        const data = {
            userData: {
                userName: username,
                // properties: [
                //     {
                //         id: 1,
                //         propertyId: 1,
                //         name: 'Ram Tower',
                //         propertyImg: 'https://static01.nyt.com/images/2020/01/27/realestate/27WYG-CA-slide-HWXH/27WYG-CA-slide-HWXH-superJumbo.jpg?quality=75&auto=webp&disable=upscale',
                //         address: 'Abhiruchi Parisar, Old subhash nagar, Bhopal, M.P., India',
                //         tenantsActive: 12,
                //     },
                //     {
                //         id: 2,
                //         propertyId: 2,
                //         name: 'Shyam Tower',
                //         propertyImg: 'https://static01.nyt.com/images/2020/01/27/realestate/27WYG-CA-slide-HWXH/27WYG-CA-slide-HWXH-superJumbo.jpg?quality=75&auto=webp&disable=upscale',
                //         address: 'Abhiruchi Parisar, Old subhash nagar, Bhopal, M.P., India',
                //         tenantsActive: 12,
                //     },
                //     {
                //         id: 3,
                //         propertyId: 3,
                //         name: 'Manglu bhawan',
                //         propertyImg: 'https://static01.nyt.com/images/2020/01/27/realestate/27WYG-CA-slide-HWXH/27WYG-CA-slide-HWXH-superJumbo.jpg?quality=75&auto=webp&disable=upscale',
                //         address: 'Global Pork station,Puncture nagar, Bhopal, M.P., India',
                //         tenantsActive: 12,
                //     },
                //     {
                //         id: 4,
                //         propertyId: 4,
                //         name: 'Bhole nagri',
                //         propertyImg: 'https://static01.nyt.com/images/2020/01/27/realestate/27WYG-CA-slide-HWXH/27WYG-CA-slide-HWXH-superJumbo.jpg?quality=75&auto=webp&disable=upscale',
                //         address: 'Chapra district, Puncture nagar, Bhopal, M.P., India',
                //         tenantsActive: 12,
                //     },
                // ]
            }
        }
        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err || !isMatch) {
                return res.status(401).json({ error: 'Invalid username or password' });
            }

            const token = jwt.sign({ username }, secretKey, { expiresIn: '12h' });
            res.status(200).json({
                token: token,
                data: data
            });
        });
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).json({ error: err });
    }
});


app.get('/getUserData/:username', async (req, res) => {
    const { username } = req.params;
    const token = req?.headers?.authorization?.split(' ')[1];
    if (!token) {
        res.status(500).json({ error: 'No Token provided !' })
    } else {
        try {
            // Verify the token
            const decoded = jwt.verify(token, secretKey);
            if (decoded.username !== username) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            // Fetch user data from the database
            const pipeline = [{ $project: { password: 0 } }];

            const user = await usersCollection.findOne({ username }, { projection: { password: 0 } });
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Return the user data
            res.status(200).json({
                userData: {
                    ...user,
                    // properties: [
                    //     {
                    //         id: 1,
                    //         propertyId: 1,
                    //         name: 'Ram Tower',
                    //         propertyImg: 'https://static01.nyt.com/images/2020/01/27/realestate/27WYG-CA-slide-HWXH/27WYG-CA-slide-HWXH-superJumbo.jpg?quality=75&auto=webp&disable=upscale',
                    //         address: 'Abhiruchi Parisar, Old subhash nagar, Bhopal, M.P., India',
                    //         tenantsActive: 12,
                    //     },
                    //     {
                    //         id: 2,
                    //         propertyId: 2,
                    //         name: 'Shyam Tower',
                    //         propertyImg: 'https://static01.nyt.com/images/2020/01/27/realestate/27WYG-CA-slide-HWXH/27WYG-CA-slide-HWXH-superJumbo.jpg?quality=75&auto=webp&disable=upscale',
                    //         address: 'Abhiruchi Parisar, Old subhash nagar, Bhopal, M.P., India',
                    //         tenantsActive: 12,
                    //     },
                    //     {
                    //         id: 3,
                    //         propertyId: 3,
                    //         name: 'Manglu bhawan',
                    //         propertyImg: 'https://static01.nyt.com/images/2020/01/27/realestate/27WYG-CA-slide-HWXH/27WYG-CA-slide-HWXH-superJumbo.jpg?quality=75&auto=webp&disable=upscale',
                    //         address: 'Global Pork station,Puncture nagar, Bhopal, M.P., India',
                    //         tenantsActive: 12,
                    //     },
                    //     {
                    //         id: 4,
                    //         propertyId: 4,
                    //         name: 'Bhole nagri',
                    //         propertyImg: 'https://static01.nyt.com/images/2020/01/27/realestate/27WYG-CA-slide-HWXH/27WYG-CA-slide-HWXH-superJumbo.jpg?quality=75&auto=webp&disable=upscale',
                    //         address: 'Chapra district, Puncture nagar, Bhopal, M.P., India',
                    //         tenantsActive: 12,
                    //     },
                    // ]
                },
            });
        } catch (err) {
            console.error('Error retrieving user data:', err);
            res.status(500).json({ error: err });
        }
    }
});

app.put('/updateProperties/:username', async (req, res) => {
    const { username } = req.params;
    const token = req?.headers?.authorization?.split(' ')[1];
    const newProperty = req.body.property;

    if (!token) {
        res.status(500).json({ error: 'No Token provided!' });
    } else {
        try {

            const decoded = jwt.verify(token, secretKey);
            if (decoded.username !== username) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            // Fetch user data from the database
            const user = await usersCollection.findOne({ username }, { projection: { password: 0 } });

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            if (!user.properties) {
                user.properties = [];
            }

            const nextId = user.properties.length + 1;
            const nextPropertyId = nextId;

            const propertyObject = {
                id: nextId,
                propertyId: nextPropertyId,
                ...newProperty
            };

            user.properties.push(propertyObject);

            // user.properties.push(newProperty);

            // Update the user data in the database
            await usersCollection.updateOne({ username }, { $set: { properties: user.properties } });

            // Return the updated user data
            res.status(200).json({ message: 'User data updated successfully', userData: user });
        } catch (err) {
            console.error('Error updating user data:', err);
            res.status(500).json({ error: err });
        }
    }
});



app.delete('/deleteUser/:username', async (req, res) => {
    const { username } = req.params;

    try {


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

    try {
        const data = await getAllUsers();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err });
    }
})

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
