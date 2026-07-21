'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
}

export default function MarketsPage() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=24h');
        const data = await res.json();
        setCoins(data);
      } catch (error) {
        console.error("Failed to fetch markets", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-white">Markets</h1>
        <p className="text-sm text-gray-400">Top 50 coins by market cap.</p>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-16 bg-bca-card border border-bca-border rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-white">Markets</h1>
      <p className="text-sm text-gray-400">Top 50 coins by market cap.</p>
      <div className="space-y-2">
        {coins.map((coin) => (
          <div key={coin.id} className="bg-bca-card border border-bca-border rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={coin.image} className="w-8 h-8 rounded-full" alt={coin.name} />
              <div>
                <p className="font-bold text-white text-sm">{coin.symbol.toUpperCase()}</p>
                <p className="text-xs text-gray-500">{coin.name}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-white text-sm">${coin.current_price.toLocaleString()}</p>
              <div className={`flex items-center justify-end gap-1 text-xs font-medium ${coin.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {coin.price_change_percentage_24h >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                <span>{coin.price_change_percentage_24h.toFixed(2)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
