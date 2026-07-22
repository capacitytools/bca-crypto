'use client';

import { useEffect, useState } from 'react';

export default function MarketsPage() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCoins() {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1');
        const data = await response.json();
        setCoins(data);
      } catch (error) {
        console.log('Error loading coins:', error);
      }
      setLoading(false);
    }
    
    loadCoins();
  }, []);

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-white mb-4">Markets</h1>
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-4">Markets</h1>
      <p className="text-gray-400 mb-4">Top 20 coins</p>
      
      <div className="space-y-2">
        {coins.map((coin) => (
          <a 
            key={coin.id}
            href={`/markets/${coin.id}`}
            className="block bg-white/5 border border-white/10 rounded-lg p-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src={coin.image} alt="" className="w-8 h-8 rounded-full" />
                <div>
                  <div className="text-white font-bold">{coin.symbol.toUpperCase()}</div>
                  <div className="text-gray-500 text-xs">{coin.name}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-bold">${coin.current_price}</div>
                <div className={coin.price_change_percentage_24h >= 0 ? 'text-green-400 text-xs' : 'text-red-400 text-xs'}>
                  {coin.price_change_percentage_24h.toFixed(2)}%
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
