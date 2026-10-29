'use client';

import { sendTaskMessage } from "next/dist/build/swc/generated-native";
import React, { useEffect, useState } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

export default function GamePage() {
    // Unityのビルドファイルへのパスを指定
    // ※ファイル名は実際にUnityが出力したものに合わせて書き換えてください
    const { unityProvider, sendMessage } = useUnityContext({
        loaderUrl: "/Build/Web.loader.js",
        dataUrl: "/Build/Web.data",
        frameworkUrl: "/Build/Web.framework.js",
        codeUrl: "/Build/Web.wasm",
    });

    const [dpr, setDpr] = useState(1);


    useEffect(() => {

        setDpr(window.devicePixelRatio);

        const keyMap: Record<string, string> = { w: "W", a: "A", s: "S", d: "D" };

        const handleKeyDown = (event: KeyboardEvent) => {
            const action = keyMap[event.key.toLowerCase()];
            if (action) {
                sendMessage("Player", "OnReceiveInput", action);
            }
        };

        const handleKeyUp = () => {
            sendMessage("Player", "OnReceiveInput", "STOP"); // どのcaseにも当てはまらず、moveDirがzeroになる
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [sendMessage]);

    return (
        <main style={{ padding: "2rem", textAlign: "center" }}>
            <h1>Next.js × Unity</h1>

            {/* Unityを表示する領域 */}
            <div style={{ width: "100vw", height: "100vh" }}>
                <Unity
                    unityProvider={unityProvider}
                    devicePixelRatio={dpr}
                    style={{ width: "100%", height: "100%" }} />
            </div>
        </main>
    );
}