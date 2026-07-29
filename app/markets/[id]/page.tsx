'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getKlines, getPrice, formatSymbol, getBaseAsset } from '@/lib/binance';

export default function CoinPage() {
  const params = useParams();
  const router = useRouter();
  const symbol = params.id as string;
  
  const [price, setPrice] = useState<string>('0');
  const [klines, setKlines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [priceData, klineData] = await Promise.all([
          getPrice(symbol),
          getKlines(symbol, '1h', 24)
        ]);
        setPrice(priceData);
        setKlines(klineData);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (symbol) {
      loadData();
      const interval = setInterval(loadData, 10000); // Update every 10s
      return () => clearInterval(interval);
    }
  }, [symbol]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0E11] p-4">
        <div className="text-white text-xl font-bold">Loading...</div>
      </div>
    );
  }

  const baseAsset = getBaseAsset(symbol);
  const priceNum = parseFloat(price);

  return (
    <div className="min-h-screen bg-[#0B0E11] p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-[#F3BA2F] to-[#F3BA2F]/60 rounded-full flex items-center justify-center font-bold text-black text-xl">
          {baseAsset[0]}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">{baseAsset}</h1>
          <p className="text-gray-400">{formatSymbol(symbol)}</p>
        </div>
      </div>

      {/* Price */}
      <div className="bg-[#1E2329] border border-[#2B3139] rounded-xl p-6">
        <p className="text-4xl font-bold text-white">${priceNum.toLocaleString()}</p>
        <p className="text-gray-400 text-sm mt-2">Live Price</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#1E2329] border border-[#2B3139] rounded-xl p-4">
          <p className="text-gray-400 text-xs mb-1">24h High</p>
          <p className="text-white font-bold">
            ${klines.length > 0 ? Math.max(...klines.map(k => k.high)).toLocaleString() : '0'}
          </p>
        </div>
        <div className="bg-[#1E2329] border border-[#2B3139] rounded-xl p-4">
          <p className="text-gray-400 text-xs mb-1">24h Low</p>
          <p className="text-white font-bold">
            ${klines.length > 0 ? Math.min(...klines.map(k => k.low)).toLocaleString() : '0'}
          </p>
        </div>
      </div>

      {/* Back Button */}
      <button 
        onClick={() => router.back()}
        className="w-full py-3 bg-[#F3BA2F] hover:bg-[#F3BA2F]/90 rounded-xl text-black font-bold"
      >
        Back to Markets
      </button>
    </div>
  );
}