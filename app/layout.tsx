
import Navbar from '@/src/components/Navar';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="h-screen overflow-hidden bg-black text-white">
        <Navbar />
        {/* pt-16 でNavbarの高さ分を空け、残りを h-[calc(100vh-4rem)] にする */}
        <main className="pt-16 h-[calc(100vh-4rem)] overflow-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}
