'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { get24hTickers, formatSymbol, getBaseAsset } from '@/lib/binance';

export default function Home() {
  const [tickers, setTickers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [btcPrice, setBtcPrice] = useState('0');

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await get24hTickers();
        setTickers(data);
        
        const btc = data.find(t => t.symbol === 'BTCUSDT');
        if (btc) setBtcPrice(btc.price);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    const interval = setInterval(loadData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const topGainers = tickers
    .filter(t => parseFloat(t.priceChangePercent) > 0)
    .sort((a, b) => parseFloat(b.priceChangePercent) - parseFloat(a.priceChangePercent))
    .slice(0, 5);

  const topLosers = tickers
    .filter(t => parseFloat(t.priceChangePercent) < 0)
    .sort((a, b) => parseFloat(a.priceChangePercent) - parseFloat(b.priceChangePercent))
    .slice(0, 5);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0E11] p-4 flex items-center justify-center">
        <div className="text-[#F3BA2F] text-xl font-bold">Loading BCA...</div>
      </div>
    );
  }

  return (    <div className="min-h-screen bg-[#0B0E11] p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-[#F3BA2F] to-[#F3BA2F]/60 rounded-lg flex items-center justify-center font-bold text-black">
            B
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">BCA</h1>
            <p className="text-xs text-gray-400">Binance Crypto Analysis</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">BTC Price</p>
          <p className="text-[#F3BA2F] font-bold">${parseFloat(btcPrice).toLocaleString()}</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Link href="/markets" className="bg-[#1E2329] border border-[#2B3139] rounded-xl p-4 active:scale-95 transition-transform">
          <p className="text-gray-400 text-xs mb-1">Markets</p>
          <p className="text-white font-bold text-lg">{tickers.length} Pairs</p>
        </Link>
        <Link href="/signals" className="bg-[#1E2329] border border-[#2B3139] rounded-xl p-4 active:scale-95 transition-transform">
          <p className="text-gray-400 text-xs mb-1">Signals</p>
          <p className="text-[#F3BA2F] font-bold text-lg">AI Powered</p>
        </Link>
      </div>

      {/* Top Gainers */}
      <div>
        <h2 className="text-white font-bold mb-2 flex items-center gap-2">
          <span className="text-green-400">↑</span> Top Gainers
        </h2>
        <div className="space-y-2">
          {topGainers.map(ticker => (
            <Link 
              key={ticker.symbol}
              href={`/markets/${ticker.symbol}`}
              className="block bg-[#1E2329] border border-[#2B3139] rounded-lg p-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-bold text-sm">{getBaseAsset(ticker.symbol)}</p>
                  <p className="text-gray-500 text-xs">{formatSymbol(ticker.symbol)}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold text-sm">${parseFloat(ticker.price).toLocaleString()}</p>
                  <p className="text-green-400 text-xs">+{parseFloat(ticker.priceChangePercent).toFixed(2)}%</p>                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Top Losers */}
      <div>
        <h2 className="text-white font-bold mb-2 flex items-center gap-2">
          <span className="text-red-400">↓</span> Top Losers
        </h2>
        <div className="space-y-2">
          {topLosers.map(ticker => (
            <Link 
              key={ticker.symbol}
              href={`/markets/${ticker.symbol}`}
              className="block bg-[#1E2329] border border-[#2B3139] rounded-lg p-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-bold text-sm">{getBaseAsset(ticker.symbol)}</p>
                  <p className="text-gray-500 text-xs">{formatSymbol(ticker.symbol)}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold text-sm">${parseFloat(ticker.price).toLocaleString()}</p>
                  <p className="text-red-400 text-xs">{parseFloat(ticker.priceChangePercent).toFixed(2)}%</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}