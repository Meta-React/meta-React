
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// メニュー項目の配列（ここを編集するだけで項目を増減できる）
const navItems = [
    { name: 'ホーム', href: '/' },
    { name: 'Unityゲーム', href: '/unity' },
    { name: 'ワールド一覧', href: '/worlds' },
    { name: '掲示板', href: '/board' },
    { name: 'マイページ', href: '/profile' },
    { name: 'お絵描き', href: '/draw' },
];

// 見た目の設定
const navStyles = {
    button:
        //ボタンサイズや位置、色などのスタイルを設定
        'fixed top-3 left-3 z-50 w-24 h-20 rounded-full bg-gradient-to-br from-slate-800 via-slate-900 to-blue-950 text-white text-base tracking-wider flex items-center justify-center shadow-lg border border-slate-700 hover:bg-slate-800 active:scale-95 transition-colors cursor-pointer',
    panel:
        //メニューのパネルのスタイルを設定
        'fixed top-3 left-3 z-50 w-52 max-h-[calc(100vh-1.5rem)] overflow-y-auto rounded-[2rem] bg-gradient-to-b from-slate-900 via-slate-900 to-blue-950 text-white border border-slate-700 px-4 pt-5 pb-5 shadow-2xl flex flex-col space-y-2',
    linkBase:
        //リンクの基本スタイルを設定
        'block py-2 px-3 rounded-full text-sm transition-colors',
    linkActive:
        //リンクがアクティブなときのスタイルを設定
        'text-blue-400 font-semibold rounded-b-full bg-gradient-to-b from-transparent via-blue-500/10 to-blue-400/35 border-b-2 border-blue-400 shadow-[0_4px_12px_rgba(56,189,248,0.45)]',
    linkInactive:
        //リンクが非アクティブなときのスタイルを設定
        'text-gray-300 hover:text-white',
} as const;

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname(); // 現在のURLパスを取得


    // Escキーでメニューを閉じられるようにする
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);


    // メニューの詳細設定
    return (
        <>
            {/* 左上の丸ボタン（PC・スマホ共通） */}
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                aria-expanded={isOpen}
                aria-label="メニューを開閉"
                className={navStyles.button}
            >
                {isOpen ? '閉じる' : 'メニュー'}
            </button>

            {/* メニューが開いているときの背景クリック領域（外側を押したら閉じる） */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 z-40 bg-black/20"
                    aria-hidden="true"
                />
            )}

            {/* 開いたときの赤い縦長角丸メニュー（PC・スマホ共通） */}
            {isOpen && (
                <nav
                    aria-label="メインメニュー"
                    className={navStyles.panel}
                >
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={`${navStyles.linkBase} ${isActive ? navStyles.linkActive : navStyles.linkInactive
                                    }`}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            )}
        </>
    );
}