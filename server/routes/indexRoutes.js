const express = require('express');
const router = express.Router();

//favicon.ico に対するリクエストを無視（204 Status）
router.get('/favicon.ico', (req, res) => res.status(204).end());
// ルートパスへのアクセス確認用
router.get('/', (req, res) => {
    res.send('Metaverse Server is running!');
});

module.exports = router;