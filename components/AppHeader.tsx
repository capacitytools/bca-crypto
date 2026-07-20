export default function AppHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-xl border-b border-white/5 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-sm shadow-lg shadow-blue-500/20">
          B
        </div>
        <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          BCA
        </h1>
      </div>
      <div className="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center">
        <span className="text-sm">👤</span>
      </div>
    </header>
  );
}
