import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useKeyboard } from '../../hooks/useKeyboard.js'
import { Avatar } from './Avatar.jsx'
import { socket } from '../../socket.js'

export function MovePlayer() {
    const meshRef = useRef()
    const movement = useKeyboard()

    useFrame((state, delta) => {
        let moved = false // 移動したかどうかのフラグ

        if (meshRef.current) {
            const speed = 5 // 移動速度


            if (movement.moveForward) { meshRef.current.position.z -= speed * delta; moved = true }
            if (movement.moveBackward) { meshRef.current.position.z += speed * delta; moved = true }
            if (movement.moveLeft) { meshRef.current.position.x -= speed * delta; moved = true }
            if (movement.moveRight) { meshRef.current.position.x += speed * delta; moved = true }
        }

        // サーバーに自分の位置を送信
        if (moved) {
            socket.emit('move', {
                x: meshRef.current.position.x,
                y: meshRef.current.position.y,
                z: meshRef.current.position.z,
            })
        }
    })

    return (
        <mesh ref={meshRef} position={[0, 0.5, 0]}>
            {/* 見た目コンポーネントを呼び出し、移動状態を渡す */}
            <Avatar color="orange" />
        </mesh>
    )
}
