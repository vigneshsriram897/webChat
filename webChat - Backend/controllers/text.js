const express = require('express');
const router = express.Router();
const db = require('../db/db'); 
const WebSocket = require('ws');
let wss; 

const setWSS = (wsInstance) => {
    wss = wsInstance;
};

router.get('/users', async (req, res) => {
    try {
        const [results] = await db.execute('SELECT * FROM users');
        res.json(results);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.get('/conversations/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const [results] = await db.execute(
            'SELECT * FROM conversations WHERE sender_id = ? OR receiver_id = ? LIMIT 50',
            [userId, userId]
        );
        res.json(results);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.post('/conversations', async (req, res) => {
    const { senderId, receiverId, message } = req.body;
    try {
        await db.execute(
            'INSERT INTO conversations (sender_id, receiver_id, message) VALUES (?, ?, ?)',
            [senderId, receiverId, message]
        );

        const newMessage = { senderId, receiverId, message };
        broadcastMessage(receiverId, newMessage);

        res.status(200).json({ message: 'Message sent' });
    } catch (err) {
        res.status(500).send(err);
    }
});
module.exports = { router, setWSS };