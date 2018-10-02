const express = require('express');
const sockjs = require('sockjs');

const app = express();
const port = 8000;

const clients = {}; // 접속된 모든 유저

// 메시지 보낸 유저를 제외한 모든 유저에게 브로드캐스팅
const broadcast = (connId, message) => {
  for (const client in clients) {
    if (client !== connId) {
      clients[client].write(JSON.stringify(message));
    }
  }
};

// 1. Chat sockjs server
const sockjs_chat = sockjs.createServer();

sockjs_chat.on('connection', conn => {
  clients[conn.id] = conn;

  conn.on('data', message => {
    broadcast(conn.id, JSON.parse(message));
  });

  conn.on('close', () => {
    delete clients[conn.id];
  });
});

// 2. Express server
const server = app.listen(port, () => {
  console.log(`Express listening on port ${port}`);
});

sockjs_chat.installHandlers(server, { prefix: '/chat' });
