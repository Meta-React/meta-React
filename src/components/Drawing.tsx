'use client';

import React, { useRef, useState, useEffect } from 'react';

export default function DrawingCanvas() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('#000000');
    const [lineWidth, setLineWidth] = useState(5);

    // 初期設定（背景を白く塗りつぶす）
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
    }, []);

    // 座標を取得するヘルパー関数（マウス・タッチ両対応）
    const getCoordinates = (
        e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
    ) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();

        if ('touches' in e) {
            return {
                x: e.touches[0].clientX - rect.left,
                y: e.touches[0].clientY - rect.top,
            };
        }
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
    };

    // 描画開始
    const startDrawing = (
        e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
    ) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx) return;

        const { x, y } = getCoordinates(e);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        setIsDrawing(true);
    };

    // 描画中
    const draw = (
        e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
    ) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx) return;

        const { x, y } = getCoordinates(e);
        ctx.lineTo(x, y);
        ctx.stroke();
    };

    // 描画終了
    const stopDrawing = () => {
        setIsDrawing(false);
    };

    // キャンバスを全消去
    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    // 画像として保存
    const downloadImage = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const link = document.createElement('a');
        link.download = 'drawing.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    return (
        <div className="flex flex-col items-center gap-4 p-4">
            {/* ツールバー */}
            <div className="flex flex-wrap items-center gap-4 bg-zinc-800 text-white px-6 py-3 rounded-full shadow-md">
                {/* カラーピッカー */}
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <span>色:</span>
                    <input
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="w-8 h-8 rounded-full cursor-pointer border-none bg-transparent"
                    />
                </label>

                {/* 消しゴム（白ペン） */}
                <button
                    onClick={() => setColor('#ffffff')}
                    className="px-3 py-1 rounded-full bg-zinc-700 hover:bg-zinc-600 text-sm transition-colors"
                >
                    消しゴム
                </button>

                {/* ペンの太さ */}
                <label className="flex items-center gap-2 text-sm">
                    <span>太さ:</span>
                    <input
                        type="range"
                        min="1"
                        max="30"
                        value={lineWidth}
                        onChange={(e) => setLineWidth(Number(e.target.value))}
                        className="w-24 cursor-pointer"
                    />
                    <span className="w-6 text-right">{lineWidth}</span>
                </label>

                {/* クリアボタン */}
                <button
                    onClick={clearCanvas}
                    className="px-4 py-1 rounded-full bg-red-600 hover:bg-red-500 text-sm font-medium transition-colors"
                >
                    全消去
                </button>

                {/* 保存ボタン */}
                <button
                    onClick={downloadImage}
                    className="px-4 py-1 rounded-full bg-blue-600 hover:bg-blue-500 text-sm font-medium transition-colors"
                >
                    保存
                </button>
            </div>

            {/* 描画エリア */}
            <canvas
                ref={canvasRef}
                width={800}
                height={500}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="border-2 border-zinc-700 rounded-lg bg-white shadow-lg cursor-crosshair touch-none"
            />
        </div>
    );
}