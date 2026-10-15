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
});