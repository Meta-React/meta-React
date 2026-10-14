// components/canvas/Ground.jsx

export function Ground() {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[100, 100]} />
            <meshStandardMaterial color="green" />
        </mesh>
    )
}