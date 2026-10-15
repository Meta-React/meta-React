// データベースへの保存処理をここに全部まとめる
const db = require('../db'); // SQLiteの接続

function recordLogin(socketId) {
    // SQLite用のSQL
    db.run("INSERT INTO login_logs (user_id, socket_id, login_time) VALUES (?, ?, datetime('now'))",
        [userId, socketId],
        (err) => {
            if (err) {
                console.error('ログイン記録の保存に失敗しました:', err.message);
            }
        }
    );
}

// ログアウト時の記録を保存する関数
// キーは socketId
function recordLogout(socketId) {
    // SQLite用のSQL
    db.run("UPDATE login_logs SET logout_time = datetime('now') WHERE socket_id = ? AND logout_time IS NULL",
        [socketId],
        (err) => {
            if (err) {
                console.error('ログアウト記録の保存に失敗しました:', err.message);
            }
        }
    );
}

module.exports = { recordLogin, recordLogout };