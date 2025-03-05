const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Signup Route (Register a New User)
router.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists. Please log in." });
        }

        // Create and save user
        const newUser = new User({ username, email, password });
        await newUser.save();

        res.status(201).json({ message: "Signup successful! Please log in." });
    } catch (error) {
        res.status(500).json({ error: "Signup failed" });
    }
});

// Login Route (Authenticate User)
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Check if password matches
        if (password !== user.password) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ token, userId: user._id });
    } catch (error) {
        res.status(500).json({ error: "Login failed" });
    }
});

module.exports = router;



