'use client';

import { useEffect, useState } from 'react';
import { TrendingUp } from 'lucide-react';

interface CoinData {
  id: string;
  symbol: string;
  image: string;
  price_change_percentage_24h: number;
}

export default function MoversAndShakers() {
  const [gainers, setGainers] = useState<CoinData[]>([]);
  const [losers, setLosers] = useState<CoinData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=24h');
        const data = await res.json();
        
        // Filter out coins with missing data
        const validData = data.filter((coin: CoinData) => coin.price_change_percentage_24h !== null);
        
        // Sort by price change percentage (Highest to Lowest)
        const sorted = validData.sort((a: CoinData, b: CoinData) => b.price_change_percentage_24h - a.price_change_percentage_24h);
        
        // Top 3 are the biggest gainers
        setGainers(sorted.slice(0, 3));
        
        // Bottom 3 are the biggest losers. We reverse them so the biggest crash is at the top.
        setLosers(sorted.slice(-3).reverse()); 
      } catch (error) {
        console.error("Failed to fetch movers", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Refresh every 2 minutes (120,000 milliseconds)
    const interval = setInterval(fetchData, 120000); 
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-bca-card border border-bca-border rounded-2xl p-5 backdrop-blur-sm animate-pulse">        <div className="h-5 bg-white/10 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-10 bg-white/5 rounded"></div>)}
        </div>
      </div>
    );
  }

  const renderList = (coins: CoinData[], type: 'gainer' | 'loser') => (
    <div className="space-y-2">
      {coins.map((coin) => (
        <div key={coin.id} className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <img src={coin.image} alt={coin.symbol} className="w-8 h-8 rounded-full" />
            <span className="text-sm font-bold text-white uppercase">{coin.symbol}</span>
          </div>
          <span className={`text-sm font-bold ${type === 'gainer' ? 'text-green-400' : 'text-red-400'}`}>
            {coin.price_change_percentage_24h >= 0 ? '+' : ''}{coin.price_change_percentage_24h.toFixed(2)}%
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 px-1">
        <TrendingUp className="text-blue-400" size={20} />
        <h2 className="text-lg font-bold text-white">Movers & Shakers</h2>
      </div>
      
      <div className="bg-bca-card border border-bca-border rounded-2xl p-4 backdrop-blur-sm space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Top Gainers</h3>
          </div>
          {renderList(gainers, 'gainer')}
        </div>
        
        <div className="border-t border-bca-border pt-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-red-400"></div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Top Losers</h3>
          </div>
          {renderList(losers, 'loser')}
        </div>
      </div>
    </div>
  );}
