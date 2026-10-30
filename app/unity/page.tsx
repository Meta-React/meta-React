'use client';

import React, { useEffect, useState } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import { Socket, io } from "socket.io-client";

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


        const socket: Socket = io("http://localhost:3001");

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


        socket.on("players", (players) => {
            console.log("全員の位置：", players);
        });

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);
        return () => {
            socket.disconnect();

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