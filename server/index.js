
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
});