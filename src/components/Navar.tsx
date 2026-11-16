
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// メニュー項目の配列（ここを編集するだけで項目を増減できる）
const navItems = [
    { name: 'ホーム', href: '/' },
    { name: 'Unityゲーム', href: '/unity' },
    { name: 'ワールド一覧', href: '/worlds' },
    { name: '掲示板', href: '/board' },
    { name: 'マイページ', href: '/profile' },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname(); // 現在のURLパスを取得

    return (
        <header className="fixed top-0 left-0 w-full h-16 bg-slate-900 text-white z-50 flex items-center px-4">
            <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                {/* ロゴ */}
                <Link href="/" className="text-xl font-bold tracking-wider">
                    Meta-App
                </Link>

                {/* PC用横並びメニュー */}
                <nav className="hidden md:flex space-x-8">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={
                                    `px-4 py-2 rounded-full text-sm 
                                    transition-colors ${isActive
                                        ? 'text-blue-400 font-semibold border-b-2 border-blue-400 pb-1'
                                        : 'text-gray-300 hover:text-white'
                                    }`}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* スマホ用ハンバーガーボタン */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden p-2 rounded hover:bg-slate-800 focus:outline-none"
                    aria-label="メニューを開閉"
                >
                    {isOpen ? '✕' : '☰'}
                </button>
            </div>

            {/* スマホ用ドロップダウンメニュー */}
            {isOpen && (
                <nav className="md:hidden bg-slate-800 px-4 pt-2 pb-4 space-y-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)} // クリックしたらメニューを閉じる
                                className={`block py-2 px-3 rounded ${isActive
                                    ? 'bg-blue-600 text-white font-semibold'
                                    : 'text-gray-300 hover:bg-slate-700'
                                    }`}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            )}
        </header>
    );
}