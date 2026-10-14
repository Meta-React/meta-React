// server/index.js
const express = require('express');
const helmet = require('helmet');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                connectSrc: ["'self'", 'http://localhost:3001', 'ws://localhost:3001'],
            }
        }
    })
);

app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173', // ViteのフロントエンドURLを許可
        methods: ['GET', 'POST'],
    },
});

// favicon.ico に対するリクエストを無視（204 Status）
app.get('/favicon.ico', (req, res) => res.status(204).end());
// ルートパスへのアクセス確認用
app.get('/', (req, res) => {
    res.send('Metaverse Server is running!');
});


// オンラインのプレイヤー一覧を保持するオブジェクト
// { socketId: { x, y, z } }
const players = {};

io.on('connection', (socket) => {
    console.log(`プレイヤーが接続しました: ${socket.id}`);

    // 新規プレイヤーの初期位置を登録
    players[socket.id] = { x: 0, y: 0, z: 0 };

    // ① 接続した本人に、現在の全プレイヤー一覧を送る
    // ② 他の全員に、「新しいプレイヤーが入ってきた」ことを知らせる
    io.emit('updatePlayers', players);

    // プレイヤーが移動した時の処理を受け取る
    socket.on('move', (position) => {
        if (players[socket.id]) {
            players[socket.id] = position;
            // 全員に更新された位置情報を配信
            io.emit('updatePlayers', players);
        }
    });

    // プレイヤーが切断（退出）した時の処理
    socket.on('disconnect', () => {
        console.log(`プレイヤーが切断しました: ${socket.id}`);
        delete players[socket.id];
        io.emit('updatePlayers', players);
    });
});

const PORT = process.env.PORT === undefined ? 3001 : Number(process.env.PORT);

if (!Number.isInteger(PORT) || PORT < 0 || PORT > 65535) {
    throw new Error('PORTには0〜65535の整数を指定してください。');
}

server.listen(PORT, () => {
    const address = server.address();
    const listeningPort = typeof address === 'object' && address !== null ? address.port : PORT;
    console.log(`バックエンドサーバーが起動しました: http://localhost:${listeningPort}`);
});