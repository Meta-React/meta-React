const express = require('express');
const helmet = require('helmet');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

// 作成したパーツをインポート
const indexRoutes = require('./routes/indexRoutes');
const { setupSocket } = require('./sockets/gameSocket');

const app = express();

// ミドルウェアの設定
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

// ルーティングの適用
app.use('/', indexRoutes);

// HTTPサーバーと Socket.io の作成
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173', // ViteのフロントエンドURLを許可
        methods: ['GET', 'POST'],
    },
});

// オンラインのプレイヤー一覧を保持するオブジェクト
setupSocket(io);

// 起動前の server オブジェクトを外部に渡すためにエクスポートする
module.exports = server;