'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function CoinDetailsPage() {
  const params = useParams();
  const coinId = Array.isArray(params.id) ? params.id[0] : params.id;
  
  const [coin, setCoin] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!coinId) {
      setError('No coin selected');
      setLoading(false);
      return;
    }

    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError('');
        
        const url = `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }
        
        const data = await response.json();
        setCoin(data);
      } catch (err) {
        console.error('Error fetching coin:', err);
        setError('Could not load coin data');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [coinId]);

  // Loading state
  if (loading) {
    return (
      <div className="space-y-4">        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-white/10 animate-pulse"></div>
          <div className="space-y-2">
            <div className="h-6 bg-white/10 rounded w-24 animate-pulse"></div>
            <div className="h-4 bg-white/10 rounded w-16 animate-pulse"></div>
          </div>
        </div>
        <div className="h-32 bg-white/5 rounded-2xl animate-pulse"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
        <p className="text-red-400 font-bold">Error</p>
        <p className="text-sm text-gray-300">{error}</p>
        <p className="text-xs text-gray-500 mt-1">ID: {coinId}</p>
      </div>
    );
  }

  // No data state
  if (!coin || !coin.market_data) {
    return (
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
        <p className="text-yellow-400 font-bold">No Data</p>
        <p className="text-sm text-gray-300">Could not find coin information</p>
      </div>
    );
  }

  // Helper function
  const formatNum = (num: number) => {
    if (!num && num !== 0) return '$0';
    if (num >= 1000000000) return '$' + (num / 1000000000).toFixed(2) + 'B';
    if (num >= 1000000) return '$' + (num / 1000000).toFixed(2) + 'M';
    return '$' + num.toLocaleString();
  };

  const price = coin.market_data.current_price?.usd || 0;
  const change24h = coin.market_data.price_change_percentage_24h || 0;
  const change7d = coin.market_data.price_change_percentage_7d_in_currency?.usd || 0;
  const marketCap = coin.market_data.market_cap?.usd || 0;
  const volume = coin.market_data.total_volume?.usd || 0;
  const supply = coin.market_data.circulating_supply || 0;

  return (
    <div className="space-y-6">      {/* Header */}
      <div className="flex items-center gap-4">
        <img 
          src={coin.image?.large || '/placeholder.png'} 
          alt={coin.name || 'Coin'} 
          className="w-12 h-12 rounded-full"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48';
          }}
        />
        <div>
          <h1 className="text-2xl font-bold text-white">{coin.name || 'Unknown'}</h1>
          <p className="text-sm text-gray-400 uppercase">{coin.symbol || 'N/A'}</p>
        </div>
      </div>

      {/* Price Card */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
        <p className="text-3xl font-bold text-white">${price.toLocaleString()}</p>
        <div className="flex gap-4 mt-2">
          <span className={change24h >= 0 ? 'text-green-400' : 'text-red-400'}>
            24h: {change24h >= 0 ? '↑' : '↓'} {Math.abs(change24h).toFixed(2)}%
          </span>
          <span className={change7d >= 0 ? 'text-green-400' : 'text-red-400'}>
            7d: {change7d >= 0 ? '↑' : '↓'} {Math.abs(change7d).toFixed(2)}%
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Market Cap</p>
          <p className="text-white font-bold">{formatNum(marketCap)}</p>
        </div>
        
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">24h Volume</p>
          <p className="text-white font-bold">{formatNum(volume)}</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-4 col-span-2">
          <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Circulating Supply</p>
          <p className="text-white font-bold">{supply.toLocaleString()} {coin.symbol?.toUpperCase()}</p>
        </div>
      </div>
    </div>
  );
}
