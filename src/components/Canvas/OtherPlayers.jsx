import React, { useEffect, useState } from 'react';
import { socket } from '../../socket.js';
import { Avatar } from './Avatar.jsx';

export function OtherPlayers() {
    const [players, setPlayers] = useState({})
    //自分のソケットIDをStatusで保持する
    const [currentSocketId, setCurrentSocketId] = useState(socket.id)

    useEffect(() => {
        // サーバーに接続したときに自分のソケットIDを取得
        const handleConnect = () => {
            setCurrentSocketId(socket.id)
        }

        // サーバーから全プレイヤーの最新位置を受信
        const handleUpdatePlayers = (backendPlayers) => {
            //ログを出してデータが届いているか確認
            //console.log('サーバーからのプレイヤー位置データ:', backendPlayers)
            //console.log('自分のソケットID:', socket.id)
            setPlayers(backendPlayers)
        }

        // イベントリスナーの登録
        socket.on('connect', handleConnect)
        socket.on('updatePlayers', handleUpdatePlayers)

        //すでに接続済みの場合は、ソケットIDを取得しておく
        if (socket.connected) {
            setCurrentSocketId(socket.id)
        }

        return () => {
            socket.off('connect', handleConnect)
            socket.off('updatePlayers', handleUpdatePlayers)
        }
    }, [])

    return (
        <group>
            {Object.entries(players).map(([id, pos]) => {
                // 自分自身のIDは描画スキップ（自分は Player.jsx で描画しているため）
                if (id === currentSocketId) return null

                return (
                    <group key={id} position={[pos.x, pos.y, pos.z]}>
                        <Avatar color="red" />
                    </group>
                )
            })}
        </group>
    )
}