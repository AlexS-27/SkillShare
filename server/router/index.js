/*
File : server/router/index.js
Description : Route for the redirection
Autor : Kilian Testard, Alex Kamano
Version : 1.0
Project : SkillShare
Date : 6 Mars 2026
*/

const express = require('express');
const cors = require('cors');
const app = express();
const { register } = require('../db_manager');
const { isPasswordStrong } = require('../utils.js');

app.use(cors());
app.use(express.json());

app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello from Express!' });
});

/**
 * Check if the password is correct then post the data
 * @param {string} password
 * @param {string} name
 * @returns {[boolean, string]} A table with the status and the message
 */
// Route to the register
app.post('/register', async (req, res) => {
    const { name, password } = req.body;

    // 1. Security validation for the password
    const [isValid, message] = isPasswordStrong(password);
    if (!isValid) {
        return res.status(400).json({ success: false, message: message });
    }

    // Call the function to register
    const result = await register(name, password);

    if (result.success) {
        res.status(201).json(result);
    } else {
        res.status(400).json(result);
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server run on http://localhost:${PORT}`);
});