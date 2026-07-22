'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
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

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h');
        
        if (!res.ok) {
          throw new Error('Failed to fetch coins');
        }
        
        const data = await res.json();
        setCoins(data);
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load coins. Please refresh.');
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();  }, []);

  // Filter coins by category
  const filteredCoins = coins.filter(coin => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'eth') return coin.platforms?.ethereum;
    if (selectedCategory === 'bsc') return coin.platforms?.binance_smart_chain;
    if (selectedCategory === 'sol') return coin.platforms?.solana;
    if (selectedCategory === 'others') return !coin.platforms?.ethereum && !coin.platforms?.binance_smart_chain && !coin.platforms?.solana;
    return true;
  });

  const categories = [
    { id: 'all', label: 'All', count: coins.length },
    { id: 'eth', label: 'Ethereum', count: coins.filter(c => c.platforms?.ethereum).length },
    { id: 'bsc', label: 'BSC', count: coins.filter(c => c.platforms?.binance_smart_chain).length },
    { id: 'sol', label: 'Solana', count: coins.filter(c => c.platforms?.solana).length },
    { id: 'others', label: 'Others', count: coins.filter(c => !c.platforms?.ethereum && !c.platforms?.binance_smart_chain && !c.platforms?.solana).length },
  ];

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-white">Markets</h1>
        <p className="text-sm text-gray-400">Top 100 coins by market cap.</p>
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

  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-white">Markets</h1>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
          <p className="text-red-400 font-bold">{error}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-white">Markets</h1>
      <p className="text-sm text-gray-400">Top 100 coins by market cap.</p>
      
      {/* Category Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id as Category)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat.id
                ? 'bg-blue-500 text-white'
                : 'bg-bca-card border border-bca-border text-gray-400 hover:text-white'
            }`}
          >
            {cat.label} ({cat.count})
          </button>
        ))}
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
