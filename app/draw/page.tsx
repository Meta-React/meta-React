

import DrawingCanvas from '@/src/components/Drawing';

export default function DrawPage() {
    return (
        <main className="min-h-[calc(100vh-64px)] bg-zinc-900 flex flex-col items-center justify-center">
            <DrawingCanvas />
        </main>
    );
}