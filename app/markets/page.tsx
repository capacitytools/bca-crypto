'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { get24hTickers, formatSymbol, getBaseAsset } from '@/lib/binance';
import { useWatchlist } from '@/lib/useWatchlist';
import { Star } from 'lucide-react';

export default function MarketsPage() {
  const router = useRouter();
  const { toggleCoin, isInWatchlist } = useWatchlist();
  const [tickers, setTickers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const loadMarkets = async () => {
      try {
        const data = await get24hTickers();
        const usdtPairs = data.filter(t => t.symbol.endsWith('USDT'));
        setTickers(usdtPairs);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadMarkets();
  }, []);

  const filteredTickers = tickers.filter(t => {
    const base = getBaseAsset(t.symbol).toLowerCase();
    return base.includes(search.toLowerCase());
  }).slice(0, 50);

  if (loading) {
    return (
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
      
      <input
        type="text"
        placeholder="Search coins..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full bg-[#1E2329] border border-[#2B3139] rounded-lg px-4 py-3 text-white mb-4 focus:outline-none focus:border-[#F3BA2F]"
      />

      <div className="space-y-2">
        {filteredTickers.map(ticker => (
          <div 
            key={ticker.symbol}
            className="bg-[#1E2329] border border-[#2B3139] rounded-lg p-3 flex items-center justify-between"
          >
            <div 
              className="flex items-center gap-3 flex-1 cursor-pointer"
              onClick={() => router.push(`/markets/${ticker.symbol}`)}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-[#F3BA2F] to-[#F3BA2F]/60 rounded-full flex items-center justify-center font-bold text-black text-xs">
                {getBaseAsset(ticker.symbol)[0]}
              </div>
              <div>
                <p className="text-white font-bold text-sm">{getBaseAsset(ticker.symbol)}</p>
                <p className="text-gray-500 text-xs">{formatSymbol(ticker.symbol)}</p>
              </div>
            </div>
            
            <div className="text-right mr-2">
              <p className="text-white font-bold text-sm">${parseFloat(ticker.price).toLocaleString()}</p>
              <p className={parseFloat(ticker.priceChangePercent) >= 0 ? 'text-green-400 text-xs' : 'text-red-400 text-xs'}>
                {parseFloat(ticker.priceChangePercent) >= 0 ? '+' : ''}{parseFloat(ticker.priceChangePercent).toFixed(2)}%
              </p>
            </div>

            <button onClick={() => toggleCoin(ticker.symbol)} className="p-2">
              <Star 
                size={20} 
                className={isInWatchlist(ticker.symbol) ? 'text-[#F3BA2F] fill-[#F3BA2F]' : 'text-gray-500'} 
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}