// server/index.js
const express = require('express');
const helmet = require('helmet');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
//外部ファイル
const { setupSocket } = require('./sockets/gameSocket');
const indexRoutes = require('./routes/indexRoutes');

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

//★ ルーティングを適用（すべてのリクエストを indexRoutes に割り振る）
app.use('/', indexRoutes);


// オンラインのプレイヤー一覧を保持するオブジェクト
setupSocket(io);

const PORT = process.env.PORT === undefined ? 3001 : Number(process.env.PORT);

if (!Number.isInteger(PORT) || PORT < 0 || PORT > 65535) {
    throw new Error('PORTには0〜65535の整数を指定してください。');
}

server.listen(PORT, () => {
    const address = server.address();
    const listeningPort = typeof address === 'object' && address !== null ? address.port : PORT;
    console.log(`バックエンドサーバーが起動しました: http://localhost:${listeningPort}`);
});