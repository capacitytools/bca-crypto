'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { TrendingUp, TrendingDown, Activity, BarChart3, Layers } from 'lucide-react';

interface CoinDetails {
  id: string;
  name: string;
  symbol: string;
  image: { large: string };
  market_data: {
    current_price: { usd: number };
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    market_cap: { usd: number };
    total_volume: { usd: number };
    circulating_supply: number;
  };
}

export default function CoinDetailsPage() {
  const params = useParams();
  const coinId = params.id as string;
  
  const [coin, setCoin] = useState<CoinDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`);
        const data = await res.json();
        setCoin(data);
      } catch (error) {
        console.error("Failed to fetch details", error);
      } finally {
        setLoading(false);
      }
    };

    if (coinId) fetchDetails();
  }, [coinId]);

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 bg-white/10 rounded w-1/3"></div>
        <div className="h-20 bg-white/10 rounded"></div>
      </div>    );
  }

  if (!coin) return <p className="text-white">Coin not found.</p>;

  const formatNumber = (num: number) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return num.toLocaleString();
  };

  const isPositive24h = coin.market_data.price_change_percentage_24h >= 0;
  const isPositive7d = coin.market_data.price_change_percentage_7d >= 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <img src={coin.image.large} alt={coin.name} className="w-12 h-12 rounded-full" />
        <div>
          <h1 className="text-2xl font-bold text-white">{coin.name}</h1>
          <p className="text-sm text-gray-400 uppercase">{coin.symbol}</p>
        </div>
      </div>

      {/* Price Card */}
      <div className="bg-bca-card border border-bca-border rounded-2xl p-5 backdrop-blur-sm">
        <p className="text-3xl font-bold text-white">${coin.market_data.current_price.usd.toLocaleString()}</p>
        <div className="flex gap-4 mt-2">
          <div className={`flex items-center gap-1 text-sm font-medium ${isPositive24h ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive24h ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            <span>24h: {coin.market_data.price_change_percentage_24h.toFixed(2)}%</span>
          </div>
          <div className={`flex items-center gap-1 text-sm font-medium ${isPositive7d ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive7d ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            <span>7d: {coin.market_data.price_change_percentage_7d.toFixed(2)}%</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-bca-card border border-bca-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 size={14} className="text-blue-400" />
            <p className="text-[10px] text-gray-400 uppercase font-bold">Market Cap</p>
          </div>
          <p className="text-white font-bold">{formatNumber(coin.market_data.market_cap.usd)}</p>
        </div>
                <div className="bg-bca-card border border-bca-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Activity size={14} className="text-purple-400" />
            <p className="text-[10px] text-gray-400 uppercase font-bold">24h Volume</p>
          </div>
          <p className="text-white font-bold">{formatNumber(coin.market_data.total_volume.usd)}</p>
        </div>

        <div className="bg-bca-card border border-bca-border rounded-xl p-4 col-span-2">
          <div className="flex items-center gap-2 mb-1">
            <Layers size={14} className="text-orange-400" />
            <p className="text-[10px] text-gray-400 uppercase font-bold">Circulating Supply</p>
          </div>
          <p className="text-white font-bold">{coin.market_data.circulating_supply.toLocaleString()} {coin.symbol.toUpperCase()}</p>
        </div>
      </div>
    </div>
  );
}
