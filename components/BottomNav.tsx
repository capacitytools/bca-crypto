'use client';

import { Home, BarChart3, Brain, User } from 'lucide-react';
import Link from 'next/link';

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-t border-white/10 px-6 py-3 pb-6 flex items-center justify-around">
      <Link href="/" className="flex flex-col items-center gap-1 text-gray-500 hover:text-blue-400">
        <Home size={22} />
        <span className="text-[10px] font-medium">Home</span>
      </Link>
      
      <Link href="/markets" className="flex flex-col items-center gap-1 text-gray-500 hover:text-blue-400">
        <BarChart3 size={22} />
        <span className="text-[10px] font-medium">Markets</span>
      </Link>
      
      <div className="flex flex-col items-center gap-1 text-gray-500">
        <Brain size={22} />
        <span className="text-[10px] font-medium">AI</span>
      </div>
      <div className="flex flex-col items-center gap-1 text-gray-500">
        <User size={22} />
        <span className="text-[10px] font-medium">Profile</span>
      </div>
    </nav>
  );
}
