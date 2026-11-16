import { useEffect, useState } from 'react'

export function useKeyboard() {
    const [movement, setMovement] = useState({
        moveForward: false,
        moveBackward: false,
        moveLeft: false,
        moveRight: false,
    })

    useEffect(() => {
        const handleKeyDown = (event) => {
            switch (event.code) {
                case 'KeyW':
                case 'ArrowUp':
                    setMovement((prevMovement) => ({ ...prevMovement, moveForward: true }))
                    break
                case 'KeyS':
                case 'ArrowDown':
                    setMovement((prevMovement) => ({ ...prevMovement, moveBackward: true }))
                    break
                case 'KeyA':
                case 'ArrowLeft':
                    setMovement((prevMovement) => ({ ...prevMovement, moveLeft: true }))
                    break
                case 'KeyD':
                case 'ArrowRight':
                    setMovement((prevMovement) => ({ ...prevMovement, moveRight: true }))
                    break
            }
        }

        const handleKeyUp = (event) => {
            switch (event.code) {
                case 'KeyW':
                case 'ArrowUp':
                    setMovement((prevMovement) => ({ ...prevMovement, moveForward: false }))
                    break
                case 'KeyS':
                case 'ArrowDown':
                    setMovement((prevMovement) => ({ ...prevMovement, moveBackward: false }))
                    break
                case 'KeyA':
                case 'ArrowLeft':
                    setMovement((prevMovement) => ({ ...prevMovement, moveLeft: false }))
                    break
                case 'KeyD':
                case 'ArrowRight':
                    setMovement((prevMovement) => ({ ...prevMovement, moveRight: false }))
                    break
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('keyup', handleKeyUp)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('keyup', handleKeyUp)
        }
    }, [])

    return movement
}