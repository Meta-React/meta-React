//オンラインのプレイヤー一覧を保持するオブジェクト

const players = {};
const { recordLogin, recordLogout } = require('../db_models/logModel');

function setupSocket(io) {
    io.on('connection', (socket) => {
        console.log(`プレイヤーが接続しました: ${socket.id}`);
        recordLogin(socket.id);

        // 新規プレイヤーの初期位置を登録
        players[socket.id] = { x: 0, y: 0, z: 0 };

        // ① 接続した本人に、現在の全プレイヤー一覧を送る
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
            // オンラインのプレイヤー一覧から削除
            delete players[socket.id];
            // 全員に更新されたプレイヤー一覧を配信
            io.emit('updatePlayers', players);
            recordLogout(socket.id);
        });
    });
}

module.exports = { setupSocket };