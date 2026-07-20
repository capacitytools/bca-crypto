'use client';

import { useEffect, useState } from 'react';
import { BarChart3 } from 'lucide-react';

interface CoinData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  total_volume: number;
}

export default function HighestVolume() {
  const [coins, setCoins] = useState<CoinData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // We add &order=volume_desc to tell the API to sort by highest volume first
        const res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=volume_desc&per_page=5&page=1&sparkline=false');
        const data = await res.json();
        setCoins(data);
      } catch (error) {
        console.error("Failed to fetch volume", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Refresh every 2 minutes
    const interval = setInterval(fetchData, 120000); 
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-bca-card border border-bca-border rounded-2xl p-5 backdrop-blur-sm animate-pulse">
        <div className="h-5 bg-white/10 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-10 bg-white/5 rounded"></div>)}
        </div>
      </div>
    );
  }

  // Find the highest volume to scale the bars perfectly
  const maxVolume = coins.length > 0 ? coins[0].total_volume : 1;

  // A helper function to turn giant numbers into clean text (e.g., 1500000000 -> $15.00B)
  const formatVolume = (vol: number) => {
    if (vol >= 1e9) return `$${(vol / 1e9).toFixed(2)}B`;
    if (vol >= 1e6) return `$${(vol / 1e6).toFixed(2)}M`;
    return `$${vol.toFixed(0)}`;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 px-1">
        <BarChart3 className="text-cyan-400" size={20} />
        <h2 className="text-lg font-bold text-white">Highest Volume (Whale Activity)</h2>
      </div>
      <div className="bg-bca-card border border-bca-border rounded-2xl p-4 backdrop-blur-sm space-y-3">
        {coins.map((coin, index) => (
          <div key={coin.id} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-500 w-4">{index + 1}</span>
                <img src={coin.image} alt={coin.symbol} className="w-7 h-7 rounded-full" />
                <div>
                  <p className="text-sm font-bold text-white uppercase">{coin.symbol}</p>
                  <p className="text-[10px] text-gray-500">{coin.name}</p>
                </div>
              </div>
              <span className="text-sm font-bold text-cyan-400">{formatVolume(coin.total_volume)}</span>
            </div>
            <div className="w-full bg-black/30 rounded-full h-1.5 overflow-hidden ml-7">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-1000"
                style={{ width: `${(coin.total_volume / maxVolume) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
