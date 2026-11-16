// server/routes/indexRoutes.js
const express = require('express');
const router = express.Router();
const { getOnlinePlayers, getAccessLogs, VALID_TOKENS } = require('../sockets/gameSocket');

// favicon.ico に対するリクエストを無視（204 Status）
router.get('/favicon.ico', (req, res) => res.status(204).end());

// ルートパスへのアクセス確認用
router.get('/', (req, res) => {
    res.send('Metaverse Server is running! 管理画面は <a href="/admin">/admin</a> です。');
});

// QRコードのトークンを検証するAPI（例: /api/auth?token=qr-taro-001）
router.get('/api/auth', (req, res) => {
    const token = req.query.token;
    if (token && VALID_TOKENS[token]) {
        return res.json({
            status: 'success',
            token,
            name: VALID_TOKENS[token].name,
            role: VALID_TOKENS[token].role,
        });
    }
    return res.status(401).json({
        status: 'error',
        message: '無効なQRトークンです',
    });
});

// 運営・支援者向け 見守り管理ダッシュボード（http://localhost:3001/admin）
router.get('/admin', (req, res) => {
    const players = getOnlinePlayers();
    const logs = getAccessLogs();
    const playerEntries = Object.entries(players);

    // オンライン一覧のテーブル行を作成
    const playerRows = playerEntries.length > 0
        ? playerEntries.map(([id, p]) => `
            <tr>
                <td><strong>${p.name}</strong></td>
                <td>${p.role}</td>
                <td>${p.joinedAt}</td>
                <td>X:${Number(p.x).toFixed(1)}, Z:${Number(p.z).toFixed(1)}</td>
                <td style="font-size: 12px; color: #666;">${id}</td>
            </tr>
        `).join('')
        : '<tr><td colspan="5" style="text-align:center; color:#888;">現在入室しているユーザーはいません</td></tr>';

    // 入退室履歴のリストを作成
    const logRows = logs.length > 0
        ? logs.map((log) => `
            <tr>
                <td>${log.time}</td>
                <td><span class="badge ${log.type === '退室' ? 'out' : 'in'}">${log.type}</span></td>
                <td>${log.name}（${log.role}）</td>
            </tr>
        `).join('')
        : '<tr><td colspan="3" style="text-align:center; color:#888;">まだ履歴がありません</td></tr>';

    res.send(`
        <!DOCTYPE html>
        <html lang="ja">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="refresh" content="5">
            <title>見守り管理ダッシュボード</title>
            <style>
                body { font-family: sans-serif; max-width: 900px; margin: 30px auto; padding: 0 20px; background: #f7f9fc; color: #333; }
                h1 { font-size: 22px; border-left: 5px solid #4a90e2; padding-left: 12px; }
                h2 { font-size: 17px; margin-top: 30px; }
                .header-bar { display: flex; justify-content: space-between; align-items: center; }
                .btn { background: #4a90e2; color: #fff; text-decoration: none; padding: 8px 14px; border-radius: 6px; font-size: 14px; }
                table { width: 100%; border-collapse: collapse; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-top: 10px; }
                th, td { border: 1px solid #e0e6ed; padding: 10px 12px; text-align: left; }
                th { background: #eef3f8; }
                .badge { padding: 3px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
                .badge.in { background: #d4edda; color: #155724; }
                .badge.out { background: #f8d7da; color: #721c24; }
                .note { font-size: 12px; color: #666; margin-top: 8px; }
            </style>
        </head>
        <body>
            <div class="header-bar">
                <h1>仮想空間 見守り管理ダッシュボード</h1>
                <a href="/admin" class="btn">最新の状態に更新</a>
            </div>
            <p class="note">※この画面は5秒ごとに自動更新されます。</p>

            <h2>現在の入室者一覧（${playerEntries.length}人 オンライン）</h2>
            <table>
                <thead>
                    <tr>
                        <th>ニックネーム</th>
                        <th>区分</th>
                        <th>入室時刻</th>
                        <th>現在位置</th>
                        <th>接続ID</th>
                    </tr>
                </thead>
                <tbody>${playerRows}</tbody>
            </table>

            <h2>最近の入退室ログ（直近50件）</h2>
            <table>
                <thead>
                    <tr>
                        <th>時刻</th>
                        <th>区分</th>
                        <th>ユーザー</th>
                    </tr>
                </thead>
                <tbody>${logRows}</tbody>
            </table>
        </body>
        </html>
    `);
});

module.exports = router;