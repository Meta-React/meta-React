'use client';

import React, { useEffect, useState, useRef } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import { Socket, io } from "socket.io-client";

export default function GamePage() {
    // Unityのビルドファイルへのパスを指定
    // ※ファイル名は実際にUnityが出力したものに合わせて書き換えてください
    const { unityProvider, sendMessage, isLoaded, addEventListener, removeEventListener }
        = useUnityContext({
            loaderUrl: "/Build/Build/Build.loader.js",
            dataUrl: "/Build/Build/Build.data",
            frameworkUrl: "/Build/Build/Build.framework.js",
            codeUrl: "/Build/Build/Build.wasm",

        });

    const [dpr, setDpr] = useState(1);



    const socketRef = useRef<Socket | null>(null);

    //キーボード入力
    useEffect(() => {

        if (!isLoaded) return;   // Unityの読み込みが終わってから

        const keyMap: Record<string, string> = { w: "W", a: "A", s: "S", d: "D" };
        const pressed = new Set<String>();
        let last = "";

        // 押されているキーの組み合わせが変わったときだけ送る
        const send = () => {
            const dir = ["W", "A", "S", "D"].filter((k) => pressed.has(k)).join("");
            if (dir === last) return;
            last = dir;
            sendMessage("Player", "OnReceiveInput", dir === "" ? "STOP" : dir);
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            const k = keyMap[e.key.toLowerCase()];
            if (!k) return;
            pressed.add(k);
            send();
        };
        const handleKeyUp = (e: KeyboardEvent) => {
            const k = keyMap[e.key.toLowerCase()];
            if (!k) return;
            pressed.delete(k);
            send();
        };

        // ウィンドウから離れたときにキーが押されっぱなしになるのを防ぐ
        const handleBlur = () => {
            pressed.clear();
            send();
        };


        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);
        window.addEventListener("blur", handleBlur);
        return () => {

            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
            window.removeEventListener("blur", handleBlur);
        };
    }, [isLoaded, sendMessage]);

    //他プレイヤー描画
    // サーバーとの接続 + 全員の位置をUnityへ
    useEffect(() => {
        if (!isLoaded) return;   // Unityの読み込みが終わってから

        const socket = io("http://localhost:3001");
        socketRef.current = socket;

        socket.on("players", (players: Record<string, { x: number; y: number; z: number }>) => {
            console.log("② サーバーから:", players);
            const list = Object.entries(players)
                .filter(([id]) => id !== socket.id)   // 自分は除く
                .map(([id, p]) => ({ id, ...p }));
            console.log("③ Unityへ送る:", list);
            sendMessage("NetworkManager", "OnPlayersUpdate", JSON.stringify({ players: list }));
        });

        return () => {
            socket.disconnect();
            socketRef.current = null;
        };
    }, [isLoaded, sendMessage]);

    // Unityから届いた自分の位置をサーバーへ
    useEffect(() => {
        const handlePosition = (x: number, y: number, z: number) => {
            socketRef.current?.emit("move", { x, y, z });
            console.log("position:", x, y, z);
        };
        addEventListener("SendPosition", handlePosition as any);
        return () => removeEventListener("SendPosition", handlePosition as any);
    }, [addEventListener, removeEventListener]);

    return (
        <main style={{ padding: "2rem", textAlign: "center" }}>
            <h1>Next.js × Unity</h1>

            {/* Unityを表示する領域 */}
            <div style={{ width: "100vw", height: "100vh" }}>
                <Unity
                    unityProvider={unityProvider}
                    style={{ width: "100%", height: "100%" }} />
            </div>
        </main>
    );
}