'use client';

import { useEffect, useState } from 'react';
import { Flame } from 'lucide-react';

interface TrendingItem {
  item: {
    id: string;
    name: string;
    symbol: string;
    thumb: string;
    score: number;
  };
}

export default function TrendingCoins() {
  const [trending, setTrending] = useState<TrendingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/search/trending');
        const data = await res.json();
        setTrending(data.coins.slice(0, 7)); 
      } catch (error) {
        console.error("Failed to fetch trending", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
    const interval = setInterval(fetchTrending, 300000); 
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-white px-1">Trending 🔥</h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="min-w-[130px] h-[140px] bg-bca-card border border-bca-border rounded-2xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 px-1">
        <Flame className="text-orange-400" size={20} />
        <h2 className="text-lg font-bold text-white">Trending Now</h2>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory">
        {trending.map((coin, index) => (
          <div 
            key={coin.item.id} 
            className="min-w-[130px] bg-bca-card border border-bca-border rounded-2xl p-4 backdrop-blur-sm flex flex-col items-center text-center snap-start"
          >
            <div className="relative">
              <img src={coin.item.thumb} alt={coin.item.name} className="w-12 h-12 rounded-full mb-2" />
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-bca-bg">
                {index + 1}
              </div>
            </div>
            <p className="text-sm font-bold text-white truncate w-full">{coin.item.symbol.toUpperCase()}</p>
            <p className="text-[10px] text-gray-500 truncate w-full">{coin.item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
