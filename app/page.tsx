export default function Home() {
  return (
    // h-screen と overflow-hidden で画面の高さを固定し、はみ出しのスクロールを消す
    <div className="flex flex-col h-screen overflow-hidden bg-zinc-900 text-white">
      <main className="flex-1 flex flex-col items-center justify-center p-4">

        {/* タイトル */}
        <h1 className="text-2xl font-bold mb-2">Meta-React メタバース空間</h1>
        <p className="text-gray-400 mb-4 text-sm">ここにUnityの画面やコンテンツが入ります</p>

        {/* 画面サイズに合わせて収まるUnity用ボックス */}
        <div className="w-full max-w-4xl h-[70vh] bg-black rounded-lg border border-zinc-700 flex items-center justify-center">
          <span className="text-zinc-500">Unity Canvas Area</span>
        </div>

      </main>
    </div>
  );
}
