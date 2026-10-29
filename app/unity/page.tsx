'use client';

import { sendTaskMessage } from "next/dist/build/swc/generated-native";
import React, { useEffect } from "react";
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


    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            console.log("keydown:", event.key);
            if (event.key === "a") {
                // Unity側の "Player" オブジェクトに付いている "OnReactKey" メソッドを呼び出す
                sendMessage("Player", "OnReactKey", "A key pressed");
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <main style={{ padding: "2rem", textAlign: "center" }}>
            <h1>Next.js × Unity</h1>

            {/* Unityを表示する領域 */}
            <div style={{ width: "960px", height: "600px", margin: "0 auto" }}>
                <Unity unityProvider={unityProvider} style={{ width: "100%", height: "100%" }} />
            </div>
        </main>
    );
}