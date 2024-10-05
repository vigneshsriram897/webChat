const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

const signupRouter = require('./auth/signUp');
const loginRouter = require('./auth/login');
const textRouter = require('./controllers/text');

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const db = require('./db/db');

textRouter.setWSS(wss);
let userSockets = {};
wss.on('connection', (ws, req) => {
  const userId = new URL(req.url, `http://${req.headers.host}`).searchParams.get('userId');
  if (userId) {
    userSockets[userId] = ws;
    console.log(`User connected: ${userId}`);

    ws.on('message', (messageDetails) => {
      console.log(`Received message from ${userId}: ${messageDetails}`, "server.js");

      const parsedMessage = JSON.parse(messageDetails);
      const { senderId, receiverId, message } = parsedMessage;

      if (userSockets[receiverId]) {
        const recipientSocket = userSockets[receiverId];
        console.log({ senderId: userId, message: message }, "server.js line 94");
        textRouter.chat(senderId, receiverId, message)
        recipientSocket.send(JSON.stringify({ senderId: userId, message: message }));
        console.log(`Message sent to ${receiverId}`);
      } else {
        console.log(`Recipient ${receiverId} not connected`);
      }
    });

    ws.on('close', () => {
      console.log(`User disconnected: ${userId}`);
      delete userSockets[userId];
    });
  } else {
    console.log("No userId provided, WebSocket connection failed");
  }
});


// API routes
app.use('/api', signupRouter);
app.use('/api', loginRouter);
app.use('/api', textRouter.router); // Make sure to use the exported router

// Start the server
server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
