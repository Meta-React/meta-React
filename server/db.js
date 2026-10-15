const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// データベースファイルを保存するパスを指定（プロジェクトのルートに database.sqlite が作られます）
const dbPath = path.resolve(__dirname, '../database.sqlite');

// データベースに接続（ファイルがなければ自動で作られます）
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('データベースの接続に失敗しました:', err.message);
    } else {
        console.log('SQLiteデータベースに接続しました。');
    }
});

// 入退室記録を保存するテーブルを作成する
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS login_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            socket_id TEXT NOT NULL,
            login_time TEXT NOT NULL,
            logout_time TEXT
        )
    `, (err) => {
        if (err) {
            console.error('テーブルの作成に失敗しました:', err.message);
        } else {
            console.log('login_logs テーブルの準備ができました。');
        }
    });
});

// 他のファイルから `db` を使えるようにエクスポートする
module.exports = db;