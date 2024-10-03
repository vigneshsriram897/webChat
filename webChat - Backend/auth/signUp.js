const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../db/db');

router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Im Here")
    try {
        const [result] = await db.execute(`
      INSERT INTO users (name, email, password)
      VALUES (?, ?, ?);
    `, [name, email, hashedPassword]);

        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        res.status(400).json({ message: 'Error creating user' });
    }
});

module.exports = router;