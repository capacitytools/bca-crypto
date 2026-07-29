'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { get24hTickers, formatSymbol, getBaseAsset } from '@/lib/binance';

export default function MarketsPage() {
  const router = useRouter();
  const [tickers, setTickers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'gainers' | 'losers' | 'volume'>('all');

  useEffect(() => {
    const loadMarkets = async () => {
      try {
        const data = await get24hTickers();
        // Filter only USDT pairs for simplicity
        const usdtPairs = data.filter(t => t.symbol.endsWith('USDT'));
        setTickers(usdtPairs);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadMarkets();
    const interval = setInterval(loadMarkets, 30000);
    return () => clearInterval(interval);
  }, []);

  const filteredTickers = tickers
    .filter(t => {
      const base = getBaseAsset(t.symbol).toLowerCase();
      return base.includes(search.toLowerCase());
    })
    .filter(t => {
      if (filter === 'gainers') return parseFloat(t.priceChangePercent) > 0;
      if (filter === 'losers') return parseFloat(t.priceChangePercent) < 0;
      if (filter === 'volume') return parseFloat(t.quoteVolume) > 10000000; // $10M+ volume
      return true;
    })
    .sort((a, b) => {
      if (filter === 'volume') return parseFloat(b.quoteVolume) - parseFloat(a.quoteVolume);
      return parseFloat(b.priceChangePercent) - parseFloat(a.priceChangePercent);
    })
    .slice(0, 50); // Show top 50

  if (loading) {    return (
      <div className="min-h-screen bg-[#0B0E11] p-4">
        <h1 className="text-2xl font-bold text-white mb-4">Markets</h1>
        <div className="space-y-2">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="h-16 bg-[#1E2329] rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0E11] p-4">
      <h1 className="text-2xl font-bold text-white mb-4">Markets</h1>
      
      {/* Search */}
      <input
        type="text"
        placeholder="Search coins..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full bg-[#1E2329] border border-[#2B3139] rounded-lg px-4 py-3 text-white mb-4 focus:outline-none focus:border-[#F3BA2F]"
      />

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
        <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${filter === 'all' ? 'bg-[#F3BA2F] text-black font-bold' : 'bg-[#1E2329] text-gray-400'}`}>
          All ({tickers.length})
        </button>
        <button onClick={() => setFilter('gainers')} className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${filter === 'gainers' ? 'bg-green-500 text-white font-bold' : 'bg-[#1E2329] text-gray-400'}`}>
          Gainers
        </button>
        <button onClick={() => setFilter('losers')} className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${filter === 'losers' ? 'bg-red-500 text-white font-bold' : 'bg-[#1E2329] text-gray-400'}`}>
          Losers
        </button>
        <button onClick={() => setFilter('volume')} className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${filter === 'volume' ? 'bg-[#F3BA2F] text-black font-bold' : 'bg-[#1E2329] text-gray-400'}`}>
          High Volume
        </button>
      </div>

      {/* List */}
      <div className="space-y-2">
        {filteredTickers.map(ticker => (
          <div 
            key={ticker.symbol}
            onClick={() => router.push(`/markets/${ticker.symbol}`)}
            className="bg-[#1E2329] border border-[#2B3139] rounded-lg p-3 active:bg-[#2B3139] cursor-pointer"
          >
            <div className="flex items-center justify-between">              <div className="flex items-center gap-3">
                <img 
                  src={`https://bin.bnbstatic.com/image/admin_mgs_image_upload/20201110/8749e2d0-7c65-4f5c-8e3f-7e8b5c5e5e5e.png`}
                  alt=""
                  className="w-8 h-8 rounded-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/32';
                  }}
                />
                <div>
                  <p className="text-white font-bold text-sm">{getBaseAsset(ticker.symbol)}</p>
                  <p className="text-gray-500 text-xs">{formatSymbol(ticker.symbol)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-bold text-sm">${parseFloat(ticker.price).toLocaleString()}</p>
                <p className={parseFloat(ticker.priceChangePercent) >= 0 ? 'text-green-400 text-xs' : 'text-red-400 text-xs'}>
                  {parseFloat(ticker.priceChangePercent) >= 0 ? '+' : ''}{parseFloat(ticker.priceChangePercent).toFixed(2)}%
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}