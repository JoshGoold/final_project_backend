const User = require("../../models/UserSchema");
const express = require("express");
const hash = require("../../utils/hash");
const bcrypt = require("bcrypt");
const route = express.Router();

// Register Route
route.post("/register", async (req, res) => {
    const { username, email, password } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
        return res.status(400).send({ Message: "All fields are required", Success: false });
    }

    try {
        // Hash password
        const hashedPassword = await hash(password);

        // Create new user
        const user = new User({
            name: username,
            email,
            password: hashedPassword,
        });

        // Save user to database
        await user.save();

        res.status(200).send({ Message: "Registration Successful", Success: true });
    } catch (error) {
        console.error("Error registering: ", error);

        // Handle duplicate key error
        if (error.code === 11000) {
            return res.status(400).send({ Message: "Username or Email already exists", Success: false });
        }

        res.status(500).send({ Message: "Server Error while Registering", Success: false });
    }
});

// Login Route
route.post("/login", async (req, res) => {
    const { username, password } = req.body;

    // Validate required fields
    if (!username || !password) {
        return res.status(400).send({ Message: "All fields are required", Success: false });
    }

    try {
        // Find user by username
        const user = await User.findOne({ name: username });

        // Check if user exists
        if (!user) {
            return res.status(400).send({ Message: "Invalid credentials", Success: false });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).send({ Message: "Invalid credentials", Success: false });
        }

        res.status(200).send({ Message: "User Authenticated", Success: true });
    } catch (error) {
        console.error(`Error logging in: ${error}`);
        res.status(500).send({ Message: "Server Error while logging in", Success: false });
    }
});

module.exports = route;
