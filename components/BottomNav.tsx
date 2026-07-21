'use client';

import { Home, BarChart3, Brain, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  // This hook tells us which page we are currently on
  const pathname = usePathname();

  // A helper to decide if a button should be blue (active) or gray (inactive)
  const getLinkClass = (path: string) => {
    return pathname === path ? 'text-blue-400' : 'text-gray-500';
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-t border-white/10 px-6 py-3 pb-6 flex items-center justify-around">
      <Link href="/" className={`flex flex-col items-center gap-1 ${getLinkClass('/')}`}>
        <Home size={22} />
        <span className="text-[10px] font-medium">Home</span>
      </Link>
      
      <Link href="/markets" className={`flex flex-col items-center gap-1 ${getLinkClass('/markets')}`}>
        <BarChart3 size={22} />
        <span className="text-[10px] font-medium">Markets</span>
      </Link>
      
      {/* AI and Profile are placeholders for now */}
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
