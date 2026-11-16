import { io } from 'socket.io-client';

// サーバーのURLを指定（必要に応じて変更）
const SERVER_URL = 'http://localhost:3001';

// ソケットの接続を生成
export const socket = io(SERVER_URL, {
    autoConnect: true, // 自動接続を有効化
})