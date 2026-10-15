// データベースへの保存処理をここに全部まとめる
const db = require('../db'); // SQLiteの接続

function recordLogin(socketId) {
    // SQLite用のSQL
    db.run("INSERT INTO login_logs (socket_id, login_time) VALUES (?, datetime('now'))", [socketId]);
}

function recordLogout(socketId) {
    // SQLite用のSQL
    db.run("UPDATE login_logs SET logout_time = datetime('now') WHERE socket_id = ? AND logout_time IS NULL", [socketId]);
}

module.exports = { recordLogin, recordLogout };