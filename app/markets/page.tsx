'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MarketsPage() {
  const router = useRouter();
  const [coins, setCoins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCoins = async () => {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1');
        const data = await res.json();
        setCoins(data);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCoins();
  }, []);

  const handleCoinClick = (coinId: string) => {
    router.push(`/markets/${coinId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black p-4">
        <h1 className="text-2xl font-bold text-white mb-4">Markets</h1>
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-4">
      <h1 className="text-2xl font-bold text-white mb-2">Markets</h1>
      <p className="text-gray-400 text-sm mb-4">Top 20 coins</p>
      
      <div className="space-y-2">
        {coins.map((coin) => (
          <div 
            key={coin.id}
            onClick={() => handleCoinClick(coin.id)}
            className="bg-gray-900 border border-gray-800 rounded-lg p-3 active:bg-gray-800 cursor-pointer"
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
          </div>
        ))}
      </div>
    </div>
  );
}
