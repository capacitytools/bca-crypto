'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getKlines, getPrice, formatSymbol, getBaseAsset } from '@/lib/binance';
import { calculateEMA, calculateRSI, generateSignal } from '@/lib/indicators';
import SignalCard from '@/components/SignalCard';
import CandlestickChart from '@/components/CandlestickChart';

export default function CoinPage() {
  const params = useParams();
  const router = useRouter();
  const symbol = params.id as string;
  
  const [price, setPrice] = useState<string>('0');
  const [klines, setKlines] = useState<any[]>([]);
  const [signalData, setSignalData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Fetching data for:', symbol);
        
        const [priceData, klineData] = await Promise.all([
          getPrice(symbol),
          getKlines(symbol, '1h', 100) 
        ]);
        
        console.log('Price:', priceData);
        console.log('Klines count:', klineData.length);
        
        setPrice(priceData);
        setKlines(klineData);

        if (klineData.length > 0) {
          const closePrices = klineData.map(k => k.close);
          const currentPrice = parseFloat(priceData);

          const rsi = calculateRSI(closePrices, 14);
          const ema = calculateEMA(closePrices, 50);
          
          const signal = generateSignal(currentPrice, rsi, ema);
          setSignalData(signal);
        }

      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);      }
    };

    if (symbol) {
      loadData();
    }
  }, [symbol]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0E11] p-4">
        <div className="text-white text-xl font-bold">Analyzing Market...</div>
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

      {/* Debug: Show data count */}
      <div className="bg-[#1E2329] border border-[#2B3139] rounded-xl p-4">
        <p className="text-gray-400 text-sm">Candles Loaded: <span className="text-white font-bold">{klines.length}</span></p>
        {klines.length === 0 && (
          <p className="text-yellow-400 text-xs mt-2">⚠️ No candle data available</p>
        )}
        {klines.length > 0 && (
          <p className="text-gray-500 text-xs mt-1">
            First candle: ${klines[0]?.open} | Last candle: ${klines[klines.length - 1]?.close}
          </p>
        )}
      </div>
      {/* THE CHART */}
      {klines.length > 0 ? (
        <div className="bg-[#1E2329] border border-[#2B3139] rounded-xl p-2">
          <h3 className="text-white font-bold text-sm mb-2 px-2">Price Chart (1H)</h3>
          <CandlestickChart data={klines} />
        </div>
      ) : (
        <div className="bg-[#1E2329] border border-[#2B3139] rounded-xl p-8 text-center">
          <p className="text-gray-400">Waiting for chart data...</p>
        </div>
      )}

      {/* THE AI SIGNAL CARD */}
      {signalData && <SignalCard data={signalData} />}

      {/* Back Button */}
      <button 
        onClick={() => router.back()}
        className="w-full py-3 bg-[#F3BA2F] hover:bg-[#F3BA2F]/90 rounded-xl text-black font-bold mt-6"
      >
        Back to Markets
      </button>
    </div>
  );
}