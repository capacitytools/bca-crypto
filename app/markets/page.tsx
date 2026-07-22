'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import Link from 'next/link';

interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  platforms?: {
    binance_smart_chain?: string;
    ethereum?: string;
    solana?: string;
  };
}

type Category = 'all' | 'eth' | 'bsc' | 'sol' | 'others';

export default function MarketsPage() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [retryCount, setRetryCount] = useState(0);

  const fetchCoins = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Add a small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const res = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=24h',
        { 
          headers: {
            'Accept': 'application/json',
          }
        }
      );
      
      if (!res.ok) {
        if (res.status === 429) {
          throw new Error('Rate limit reached. Please wait a moment.');
        }        throw new Error(`API error: ${res.status}`);
      }
      
      const data = await res.json();
      setCoins(data);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to load coins. Please wait and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoins();
  }, [retryCount]);

  // Filter coins by category
  const filteredCoins = coins.filter(coin => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'eth') return coin.platforms?.ethereum;
    if (selectedCategory === 'bsc') return coin.platforms?.binance_smart_chain;
    if (selectedCategory === 'sol') return coin.platforms?.solana;
    if (selectedCategory === 'others') return !coin.platforms?.ethereum && !coin.platforms?.binance_smart_chain && !coin.platforms?.solana;
    return true;
  });

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-white">Markets</h1>
        <p className="text-sm text-gray-400">Top 50 coins by market cap.</p>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-10 w-20 bg-white/10 rounded-full animate-pulse"></div>
          ))}
        </div>
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Markets</h1>
        <button 
          onClick={handleRetry}
          className="p-2 bg-bca-card border border-bca-border rounded-full active:scale-95 transition-transform"
        >
          <RefreshCw size={18} className="text-gray-400" />
        </button>
      </div>
      <p className="text-sm text-gray-400">Top 50 coins by market cap.</p>
      
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
          <p className="text-red-400 font-bold mb-2">{error}</p>
          <button 
            onClick={handleRetry}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-sm font-medium transition-colors"
          >
            Try Again
          </button>
          <p className="text-xs text-gray-500 mt-2">
            Free API has limits. Wait 60 seconds if this keeps failing.
          </p>
        </div>
      )}
      
      {/* Category Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            selectedCategory === 'all'
              ? 'bg-blue-500 text-white'
              : 'bg-bca-card border border-bca-border text-gray-400 hover:text-white'
          }`}
        >
          All ({coins.length})
        </button>
        <button
          onClick={() => setSelectedCategory('eth')}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            selectedCategory === 'eth'
              ? 'bg-blue-500 text-white'
              : 'bg-bca-card border border-bca-border text-gray-400 hover:text-white'
          }`}
        >
          Ethereum ({coins.filter(c => c.platforms?.ethereum).length})
        </button>        <button
          onClick={() => setSelectedCategory('bsc')}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            selectedCategory === 'bsc'
              ? 'bg-blue-500 text-white'
              : 'bg-bca-card border border-bca-border text-gray-400 hover:text-white'
          }`}
        >
          BSC ({coins.filter(c => c.platforms?.binance_smart_chain).length})
        </button>
        <button
          onClick={() => setSelectedCategory('sol')}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            selectedCategory === 'sol'
              ? 'bg-blue-500 text-white'
              : 'bg-bca-card border border-bca-border text-gray-400 hover:text-white'
          }`}
        >
          Solana ({coins.filter(c => c.platforms?.solana).length})
        </button>
      </div>

      {/* Coins List */}
      <div className="space-y-2">
        {filteredCoins.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p>No coins in this category</p>
          </div>
        ) : (
          filteredCoins.map((coin) => (
            <Link 
              key={coin.id} 
              href={`/markets/${coin.id}`} 
              className="block bg-bca-card border border-bca-border rounded-xl p-4 active:bg-white/5 transition-colors"
            >
              <div className="flex items-center justify-between">
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
                </div>              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
