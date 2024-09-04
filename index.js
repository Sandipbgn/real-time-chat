const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

// Routes
// Basic route for testing the server
app.get('/', (req, res) => {
    res.send('Hello from the chat app backend!');
});

app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Validate email format
        if (email && !validator.isEmail(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Check if username or email is already taken
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { username },
                    { email }
                ]
            }
        });

        if (existingUser) {
            return res.status(400).json({ error: 'Username or email already taken' });
        }

        // Encrypt the password
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                passwordHash: hashedPassword
            }
        });

        res.status(201).json({ message: 'User registered successfully!', userId: newUser.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'User registration failed' });
    }
});

// User login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: {
                username
            }
        });

        if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });
        res.cookie('token', token, { httpOnly: true });
        res.json({ message: 'Logged in successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
