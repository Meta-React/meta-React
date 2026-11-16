<<<<<<< HEAD

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
    cors: { origin: ["http://localhost:3000", "http://localhost:5173"] },
});

const players = {}; // { socketId: { x, y, z } }

io.on("connection", (socket) => {
    console.log("接続:", socket.id);
    players[socket.id] = { x: 0, y: 0, z: 0 };

    socket.on("move", (pos) => {
        players[socket.id] = pos;
        io.emit("players", players); // 全員に全員分の位置を送る
    });

    socket.on("disconnect", () => {
        console.log("切断:", socket.id);
        delete players[socket.id];
        io.emit("players", players);
    });
});

httpServer.listen(3001, () => {
    console.log("サーバー起動: http://localhost:3001");
=======
// server/index.js
const server = require('./app');

const PORT = process.env.PORT === undefined ? 3001 : Number(process.env.PORT);

if (!Number.isInteger(PORT) || PORT < 0 || PORT > 65535) {
    throw new Error('PORTには0〜65535の整数を指定してください。');
}

server.listen(PORT, () => {
    const address = server.address();
    const listeningPort = typeof address === 'object' && address !== null ? address.port : PORT;
    console.log(`バックエンドサーバーが起動しました: http://localhost:${listeningPort}`);
>>>>>>> 6e60b73889668fedafebe69a4f1899b1a405e946
});