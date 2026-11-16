

export function Avatar({ color = 'blue' }) {
    {/*待機と動きを分けるならisMovingをpropsで受け取るようにする*/ }
    return (
        <mesh position={[0, 0.5, 0]}>
            {/* 見た目の箱を表示 */}
            <boxGeometry args={[1, 1.5, 1]} />
            <meshStandardMaterial color={color} />
        </mesh>
    )
}
