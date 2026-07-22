'use client';

import { useEffect, useState } from 'react';
import { use } from 'react';

export default function CoinPage({ params }) {
  const { id } = params;
  const [coin, setCoin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCoin() {
      try {
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=true`);
        const data = await response.json();
        setCoin(data);
      } catch (error) {
        console.log('Error:', error);
      }
      setLoading(false);
    }
    
    if (id) {
      loadCoin();
    }
  }, [id]);

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-white">Loading...</h1>
      </div>
    );
  }

  if (!coin || !coin.market_data) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-white">Coin not found</h1>
      </div>
    );
  }

  const price = coin.market_data.current_price?.usd || 0;
  const change24h = coin.market_data.price_change_percentage_24h || 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <img src={coin.image?.large} alt="" className="w-12 h-12 rounded-full" />
        <div>
          <h1 className="text-2xl font-bold text-white">{coin.name}</h1>
          <p className="text-gray-400">{coin.symbol.toUpperCase()}</p>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <div className="text-3xl font-bold text-white">${price.toLocaleString()}</div>
        <div className={change24h >= 0 ? 'text-green-400' : 'text-red-400'}>
          {change24h >= 0 ? '↑' : '↓'} {Math.abs(change24h).toFixed(2)}% (24h)
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <p className="text-gray-400 text-sm">Market Cap</p>
        <p className="text-white font-bold">
          ${coin.market_data.market_cap?.usd?.toLocaleString() || 0}
        </p>
      </div>
    </div>
  );
}
