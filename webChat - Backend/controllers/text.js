// const router = require("../auth/signUp");
// const db = require('../db/db')

// let userList = router.get('/users', async (req, res) => {
//     try {
//         const [results] = await await db.execute('SELECT * FROM users ');
//         // console.log(results)
//         res.json(results);
//     } catch (err) {
//         res.status(500).send(err);
//     }
// });

// // Get conversations
// let receiveMessage = router.get('/conversations/:userId', async (req, res) => {
//     const userId = req.params.userId;
//     try {
//         const [results] = await db.execute(
//             'SELECT * FROM conversations WHERE sender_id = ? OR receiver_id = ? LIMIT 50',
//             [userId, userId]
//         );
//         res.json(results);
//     } catch (err) {
//         res.status(500).send(err);
//     }
// });

// // Send message
// let sendMessage = router.post('/conversations', async (req, res) => {
//     const { senderId, receiverId, message } = req.body;
//     try {
//         await db.execute(
//             'INSERT INTO conversations (sender_id, receiver_id, message) VALUES (?, ?, ?)',
//             [senderId, receiverId, message]
//         );
//         res.status(200).json({ 'message': 'Message sent' });
//     } catch (err) {
//         res.status(500).send(err);
//     }
// });
// module.exports = { userList, sendMessage, receiveMessage, router }





















const express = require('express');
const router = express.Router();
const db = require('../db/db'); // Ensure your DB connection is correct
const WebSocket = require('ws');
let wss; // WebSocket instance

const setWSS = (wsInstance) => {
    wss = wsInstance;
};

// User list route
router.get('/users', async (req, res) => {
    try {
        const [results] = await db.execute('SELECT * FROM users');
        res.json(results);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Get conversations
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

// Send message
router.post('/conversations', async (req, res) => {
    const { senderId, receiverId, message } = req.body;
    try {
        await db.execute(
            'INSERT INTO conversations (sender_id, receiver_id, message) VALUES (?, ?, ?)',
            [senderId, receiverId, message]
        );

        // Broadcast the new message to the intended recipient
        const newMessage = { senderId, receiverId, message };
        broadcastMessage(receiverId, newMessage);

        res.status(200).json({ message: 'Message sent' });
    } catch (err) {
        res.status(500).send(err);
    }
});
module.exports = { router, setWSS };