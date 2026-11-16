// server/sockets/gameSocket.js

// 現在オンラインのプレイヤー一覧を保持するオブジェクト（既存の座標 x, y, z も維持）
const players = {};

// 入退室の履歴ログ（最新50件まで保存）
const accessLogs = [];

// QRコード用のサンプル認証トークン一覧（テスト用・後から追加可能）
const VALID_TOKENS = {
    'qr-taro-001': { name: 'たろう', role: 'こども' },
    'qr-hanako-002': { name: 'はなこ', role: 'こども' },
    'qr-staff-001': { name: '川嶋（学生サポーター）', role: '支援者' },
    'qr-staff-002': { name: '高木（学生サポーター）', role: '支援者' },
};

// 現在時刻を「13:25:10」の形式で取得する関数
function getCurrentTime() {
    return new Date().toLocaleTimeString('ja-JP', { hour12: false });
}

// 履歴ログを追加する関数
function addLog(type, name, role, socketId) {
    accessLogs.unshift({
        time: getCurrentTime(),
        type, // '入室' または '退室'
        name,
        role,
        socketId,
    });
    // 50件を超えたら古いものを削除
    if (accessLogs.length > 50) {
        accessLogs.pop();
    }
}

function setupSocket(io) {
    io.on('connection', (socket) => {
        // 接続時に渡されたQRトークンを確認（なければゲスト扱い）
        const token = socket.handshake.auth?.token || socket.handshake.query?.token;
        const userInfo = VALID_TOKENS[token] || { name: 'ゲスト', role: '未認証' };
        const joinedAt = getCurrentTime();

        // 新規プレイヤーの初期位置とプロフィールを登録
        players[socket.id] = {
            x: 0,
            y: 0,
            z: 0,
            name: userInfo.name,
            role: userInfo.role,
            joinedAt: joinedAt,
        };

        console.log(`【入室】${joinedAt} | ${userInfo.name}（${userInfo.role}） [ID: ${socket.id}]`);
        addLog('入室', userInfo.name, userInfo.role, socket.id);

        // 全員に現在の全プレイヤー一覧を送る
        io.emit('updatePlayers', players);

        // フロントエンド側から後から名前やQRトークンが送られてきた場合の更新処理
        socket.on('joinRoom', (data) => {
            if (!players[socket.id]) return;

            const updatedInfo = data?.token && VALID_TOKENS[data.token]
                ? VALID_TOKENS[data.token]
                : { name: data?.name || players[socket.id].name, role: data?.role || 'こども' };

            players[socket.id].name = updatedInfo.name;
            players[socket.id].role = updatedInfo.role;

            console.log(`【認証更新】${getCurrentTime()} | ${updatedInfo.name}（${updatedInfo.role}）`);
            addLog('認証完了', updatedInfo.name, updatedInfo.role, socket.id);
            io.emit('updatePlayers', players);
        });

        // プレイヤーが移動した時の処理を受け取る
        socket.on('move', (position) => {
            if (players[socket.id]) {
                players[socket.id].x = position.x;
                players[socket.id].y = position.y;
                players[socket.id].z = position.z;
                // 全員に更新された位置情報を配信
                io.emit('updatePlayers', players);
            }
        });

        // プレイヤーが切断（退出）した時の処理
        socket.on('disconnect', () => {
            const target = players[socket.id];
            if (target) {
                console.log(`【退室】${getCurrentTime()} | ${target.name}（${target.role}） [ID: ${socket.id}]`);
                addLog('退室', target.name, target.role, socket.id);
                delete players[socket.id];
            }
            // 全員に更新されたプレイヤー一覧を配信
            io.emit('updatePlayers', players);
        });
    });
}

// 管理画面（indexRoutes.js）からデータを参照するための関数
function getOnlinePlayers() {
    return players;
}

function getAccessLogs() {
    return accessLogs;
}

module.exports = { setupSocket, getOnlinePlayers, getAccessLogs, VALID_TOKENS };