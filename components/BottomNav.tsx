import { Home, BarChart3, Brain, User } from 'lucide-react';

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-t border-white/10 px-6 py-3 pb-6 flex items-center justify-around">
      <button className="flex flex-col items-center gap-1 text-blue-400">
        <Home size={22} />
        <span className="text-[10px] font-medium">Home</span>
      </button>
      <button className="flex flex-col items-center gap-1 text-gray-500">
        <BarChart3 size={22} />
        <span className="text-[10px] font-medium">Markets</span>
      </button>
      <button className="flex flex-col items-center gap-1 text-gray-500">
        <Brain size={22} />
        <span className="text-[10px] font-medium">AI</span>
      </button>
      <button className="flex flex-col items-center gap-1 text-gray-500">
        <User size={22} />
        <span className="text-[10px] font-medium">Profile</span>
      </button>
    </nav>
  );
}
