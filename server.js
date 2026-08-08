const express = require('express');
const { WebSocketServer } = require('ws');
const http = require('http');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'docs')));

wss.on('connection', (ws) => {
  console.log('✅ Client connected');

  // Send a welcome message to newly connected client
  ws.send(JSON.stringify({ type: 'system', text: 'Connected to WebSocket Server!' }));

  ws.on('message', (message) => {
    try {
      const parsed = JSON.parse(message);
      console.log('Received:', parsed);

      // Broadcast received message to ALL connected clients
      wss.clients.forEach((client) => {
        if (client.readyState === ws.OPEN) {
          client.send(JSON.stringify({
            type: 'user',
            text: parsed.text,
            time: new Date().toLocaleTimeString()
          }));
        }
      });
    } catch (err) {
      console.error('Invalid JSON received:', message.toString());
    }
  });

  ws.on('close', () => {
    console.log('❌ Client disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
