'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function CoinPage() {
  const params = useParams();
  const router = useRouter();
  const [coin, setCoin] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const coinId = params?.id;
    
    if (!coinId) return;

    const loadCoin = async () => {
      try {
        setLoading(true);
        const url = `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`;
        
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch');
        
        const data = await res.json();
        setCoin(data);
      } catch (err) {
        console.error('Error loading coin:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCoin();
  }, [params?.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black p-4">
        <div className="text-white text-xl font-bold">Loading...</div>
      </div>
    );
  }

  if (!coin) {
    return (
      <div className="min-h-screen bg-black p-4">
        <div className="text-white text-xl font-bold">Coin not found</div>
        <button 
          onClick={() => router.back()}          className="mt-4 px-4 py-2 bg-blue-500 rounded-lg text-white"
        >
          Go Back
        </button>
      </div>
    );
  }

  const price = coin.market_data?.current_price?.usd || 0;
  const change24h = coin.market_data?.price_change_percentage_24h || 0;
  const marketCap = coin.market_data?.market_cap?.usd || 0;

  return (
    <div className="min-h-screen bg-black p-4 space-y-4">
      {/* Coin Header */}
      <div className="flex items-center gap-3">
        <img 
          src={coin.image?.large || ''} 
          alt={coin.name || ''}
          className="w-12 h-12 rounded-full"
        />
        <div>
          <h1 className="text-2xl font-bold text-white">{coin.name}</h1>
          <p className="text-gray-400 text-sm">{coin.symbol?.toUpperCase()}</p>
        </div>
      </div>

      {/* Price Card */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <div className="text-3xl font-bold text-white">
          ${price.toLocaleString()}
        </div>
        <div className={`text-sm mt-1 ${change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {change24h >= 0 ? '↑' : '↓'} {Math.abs(change24h).toFixed(2)}% (24h)
        </div>
      </div>

      {/* Market Cap */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <p className="text-gray-400 text-xs uppercase font-bold mb-1">Market Cap</p>
        <p className="text-white font-bold text-lg">
          ${marketCap >= 1e9 ? (marketCap / 1e9).toFixed(2) + 'B' : marketCap >= 1e6 ? (marketCap / 1e6).toFixed(2) + 'M' : marketCap.toLocaleString()}
        </p>
      </div>

      {/* Back Button */}
      <button 
        onClick={() => router.back()}
        className="w-full py-3 bg-blue-500 hover:bg-blue-600 rounded-xl text-white font-bold"
      >        Back to Markets
      </button>
    </div>
  );
}
