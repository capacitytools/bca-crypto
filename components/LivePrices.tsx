'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface CoinData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
}

export default function LivePrices() {
  const [coins, setCoins] = useState<CoinData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana,binancecoin&order=market_cap_desc&per_page=4&page=1&sparkline=false&price_change_percentage=24h');
        const data = await res.json();
        setCoins(data);
      } catch (error) {
        console.error("Failed to fetch prices", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
    // Refresh every 60 seconds
    const interval = setInterval(fetchPrices, 60000); 

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-bca-card border border-bca-border rounded-2xl p-5 backdrop-blur-sm">
        <p className="text-gray-400 text-sm">Loading live prices...</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold text-white px-1">Live Market</h2>
      <div className="grid grid-cols-2 gap-3">
        {coins.map((coin) => (
          <div key={coin.id} className="bg-bca-card border border-bca-border rounded-2xl p-4 backdrop-blur-sm flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <img src={coin.image} alt={coin.name} className="w-6 h-6 rounded-full" />
              <div>
                <p className="text-sm font-bold text-white">{coin.symbol.toUpperCase()}</p>
                <p className="text-[10px] text-gray-500">{coin.name}</p>
              </div>
            </div>
            <p className="text-lg font-bold text-white">${coin.current_price.toLocaleString()}</p>
            <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${coin.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {coin.price_change_percentage_24h >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              <span>{coin.price_change_percentage_24h.toFixed(2)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
