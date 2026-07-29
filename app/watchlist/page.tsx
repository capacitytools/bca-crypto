'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { get24hTickers, formatSymbol, getBaseAsset } from '@/lib/binance';
import { useWatchlist } from '@/lib/useWatchlist';
import { Star } from 'lucide-react';

export default function WatchlistPage() {
  const router = useRouter();
  const { watchlist, toggleCoin, isInWatchlist } = useWatchlist();
  const [tickers, setTickers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const allTickers = await get24hTickers();
        // Only keep the coins that are in our watchlist
        const savedTickers = allTickers.filter(t => watchlist.includes(t.symbol));
        setTickers(savedTickers);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (watchlist.length > 0) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [watchlist]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0E11] p-4">
        <h1 className="text-2xl font-bold text-white mb-4">Watchlist</h1>
        <div className="text-gray-400">Loading favorites...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0E11] p-4">
      <h1 className="text-2xl font-bold text-white mb-4">Watchlist</h1>
      
      {watchlist.length === 0 ? (
        <div className="text-center py-20">
          <Star className="mx-auto text-gray-600 mb-4" size={48} />
          <p className="text-gray-400 text-lg">Your watchlist is empty</p>
          <p className="text-gray-500 text-sm mt-2">Go to Markets and tap the star to add coins.</p>
          <button 
            onClick={() => router.push('/markets')}
            className="mt-6 px-6 py-3 bg-[#F3BA2F] text-black font-bold rounded-xl"
          >
            Go to Markets
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {tickers.map(ticker => (
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
              
              <div className="text-right mr-4">
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
      )}
    </div>
  );
}