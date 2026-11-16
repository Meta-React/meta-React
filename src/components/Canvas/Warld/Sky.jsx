import { Sky as DreiSky } from "@react-three/drei";

export function Sky() {
    return (
        <DreiSky
            sunPosition={[100, 20, 100]}
            distance={450000}
        />
    );
}