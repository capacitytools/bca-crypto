'use client';

import { Home, BarChart3, Star, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();

  const getLinkClass = (path: string) => {
    return pathname === path ? 'text-[#F3BA2F]' : 'text-gray-500';
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0B0E11]/90 backdrop-blur-xl border-t border-[#2B3139] px-6 py-3 pb-6 flex items-center justify-around">
      <Link href="/" className={`flex flex-col items-center gap-1 ${getLinkClass('/')}`}>
        <Home size={22} />
        <span className="text-[10px] font-medium">Home</span>
      </Link>
      
      <Link href="/markets" className={`flex flex-col items-center gap-1 ${getLinkClass('/markets')}`}>
        <BarChart3 size={22} />
        <span className="text-[10px] font-medium">Markets</span>
      </Link>
      
      <Link href="/watchlist" className={`flex flex-col items-center gap-1 ${getLinkClass('/watchlist')}`}>
        <Star size={22} />
        <span className="text-[10px] font-medium">Watchlist</span>
      </Link>

      <div className="flex flex-col items-center gap-1 text-gray-500">
        <User size={22} />
        <span className="text-[10px] font-medium">Profile</span>
      </div>
    </nav>
  );
}