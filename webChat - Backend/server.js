// const express = require('express');
// const cors = require('cors');

// const app = express();
// const port = 3000;

// app.use(express.json());
// app.use(cors());

// const signupRouter = require('./auth/signUp');
// const loginRouter = require('./auth/login');
// const textRouter = require('./controllers/text');


// app.use('/api', signupRouter);
// app.use('/api', loginRouter);
// app.use('/api', textRouter.userList);
// app.use('/api', textRouter.sendMessage);
// app.use('/api', textRouter.receiveMessage);

// app.listen(port, () => {
//   console.log(`Server started on port ${port}`);
// });




























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

// Set the WebSocket instance in the textRouter
textRouter.setWSS(wss);
let userSockets = {};
// WebSocket connection handling
wss.on('connection', (ws, req) => {
  // Extract userId from query params (in this example, we assume it's passed like ?userId=123)
  const userId = new URL(req.url, `http://${req.headers.host}`).searchParams.get('userId');

  // Store the WebSocket connection in userSockets mapping
  if (userId) {
    userSockets[userId] = ws;
    console.log(`User connected: ${userId}`);

    // Handle message received from client
    ws.on('message', (messageDetails) => {
      console.log(`Received message from ${userId}: ${messageDetails}`, "server.js");

      // Parse the message to get the intended recipient and the content
      const parsedMessage = JSON.parse(messageDetails);
      const { senderId, receiverId, message } = parsedMessage;

      // Send the message to the intended recipient (if they're connected)
      if (userSockets[receiverId]) {
        const recipientSocket = userSockets[receiverId];
        console.log({ senderId: userId, message: message }, "server.js line 94")
        recipientSocket.send(JSON.stringify({ senderId: userId, message: message }));
        console.log(`Message sent to ${receiverId}`);
      } else {
        console.log(`Recipient ${receiverId} not connected`);
      }
    });

    // Handle WebSocket close event (cleanup)
    ws.on('close', () => {
      console.log(`User disconnected: ${userId}`);
      delete userSockets[userId]; // Remove the user from the userSockets mapping
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
