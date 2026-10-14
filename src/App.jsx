// src/App.jsx
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { MovePlayer } from './components/Canvas/MovePlayer'
import { Ground } from './components/Canvas/Warld/Ground'
import { Sky } from './components/Canvas/Warld/Sky'
import { OtherPlayers } from './components/Canvas/OtherPlayers'

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      {/* 3D世界のキャンバス */}
      <Canvas camera={{ position: [0, 5, 10], fov: 60 }}>
        {/* ① ライト（照明） */}
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} />

        {/* ② カメラの操作コントロール（マウスでドラッグ移動できるようになる） */}
        <OrbitControls />

        {/* ③ フィールド */}
        <Ground />
        <Sky />

        {/* ④自分の操作キャラクター */}
        <MovePlayer />

        {/* ⑤ 他のプレイヤー */}
        <OtherPlayers />

      </Canvas>
    </div>
  )
}