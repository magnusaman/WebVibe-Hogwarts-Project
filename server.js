const express = require('express');
const path = require('path');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const app = express();
const port = 3001;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Connection URI for MongoDB
const uri = 'mongodb://localhost:27017';

// Create a new MongoClient
const client = new MongoClient(uri);

// Connect to MongoDB
async function connectToMongoDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

// Middleware for user registration validation
async function validateRegistration(req, res, next) {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    // Validate email format (you can use a library like validator.js for more complex validation)
    if (!isValidEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    // Check if the email is already registered
    const existingUser = await client.db('Hogwarts').collection('users').findOne({ email });
    if (existingUser) {
        return res.status(400).json({ error: 'Email is already registered' });
    }

    next(); // Move to the next middleware or route handler
}

// Middleware for user login validation
function validateLogin(req, res, next) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    next(); // Move to the next middleware or route handler
}

// Route for user registration
app.post('/register', validateRegistration, async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Hash the password before storing it in the database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        await client.db('Hogwarts').collection('users').insertOne({
            username,
            email,
            password: hashedPassword
        });

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route for user login
app.post('/login', validateLogin, async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user in the database by email
        const user = await client.db('Hogwarts').collection('users').findOne({ email });

        // If user not found or password doesn't match, return an error
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // If login is successful, you can create a session or JWT token here
        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    
    // Call the function to connect to MongoDB
    connectToMongoDB();
});
