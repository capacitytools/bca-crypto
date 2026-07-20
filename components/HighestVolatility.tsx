'use client';

import { useEffect, useState } from 'react';
import { Zap } from 'lucide-react';

interface CoinData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  high_24h: number;
  low_24h: number;
  volatility?: number;
}

export default function HighestVolatility() {
  const [coins, setCoins] = useState<CoinData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false');
        const data = await res.json();
        
        // Filter out coins missing high/low data and calculate volatility
        const withVolatility = data
          .filter((coin: CoinData) => coin.high_24h && coin.low_24h && coin.low_24h > 0)
          .map((coin: CoinData) => ({
            ...coin,
            volatility: ((coin.high_24h - coin.low_24h) / coin.low_24h) * 100
          }));
          
        // Sort by highest volatility (Biggest swings first)
        const sorted = withVolatility.sort((a: CoinData, b: CoinData) => (b.volatility || 0) - (a.volatility || 0));
        
        setCoins(sorted.slice(0, 5));
      } catch (error) {
        console.error("Failed to fetch volatility", error);
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

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 px-1">
        <Zap className="text-yellow-400" size={20} />
        <h2 className="text-lg font-bold text-white">Highest Volatility</h2>
      </div>
      <div className="bg-bca-card border border-bca-border rounded-2xl p-4 backdrop-blur-sm space-y-3">
        {coins.map((coin, index) => (
          <div key={coin.id} className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-gray-500 w-4">{index + 1}</span>
              <img src={coin.image} alt={coin.symbol} className="w-8 h-8 rounded-full" />
              <div>
                <p className="text-sm font-bold text-white uppercase">{coin.symbol}</p>
                <p className="text-[10px] text-gray-500">{coin.name}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-yellow-400">±{coin.volatility?.toFixed(1)}%</span>
              <p className="text-[10px] text-gray-500">24h Range</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
