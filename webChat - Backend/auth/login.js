const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../db/db');
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [result] = await db.execute(`
      SELECT * FROM users
      WHERE email = ?;
    `, [email]);

    if (!result[0]) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isValidPassword = await bcrypt.compare(password, result[0].password);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    console.log(result, 'login');
    const token = jwt.sign({ userId: result[0].id, name: result[0].name, email: result[0].email }, 'secretkey', { expiresIn: '1h' });

    res.status(200).json({ token, message: "Logged In Successfully!" });
  } catch (err) {
    res.status(400).json({ message: 'Error logging in' });
  }
});

module.exports = router;