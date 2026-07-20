'use client';

import { useEffect, useState } from 'react';
import { PieChart } from 'lucide-react';

interface DominanceData {
  btc: number;
  eth: number;
  usdt: number;
}

export default function MarketDominance() {
  const [dominance, setDominance] = useState<DominanceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/global');
        const data = await res.json();
        const marketCap = data.data.market_cap_percentage;
        
        // We add || 0 just in case the API temporarily misses a number, so the app doesn't crash
        setDominance({
          btc: marketCap.btc || 0,
          eth: marketCap.eth || 0,
          usdt: marketCap.usdt || 0
        });
      } catch (error) {
        console.error("Failed to fetch dominance", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Refresh every 5 minutes (300,000 milliseconds)
    const interval = setInterval(fetchData, 300000); 
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-bca-card border border-bca-border rounded-2xl p-5 backdrop-blur-sm animate-pulse">
        <div className="h-5 bg-white/10 rounded w-1/3 mb-4"></div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-8 bg-white/5 rounded"></div>)}
        </div>
      </div>
    );
  }

  if (!dominance) return null;

  const items = [
    { label: 'Bitcoin', value: dominance.btc, color: 'bg-orange-500', textColor: 'text-orange-400' },
    { label: 'Ethereum', value: dominance.eth, color: 'bg-blue-500', textColor: 'text-blue-400' },
    { label: 'USDT (Stablecoin)', value: dominance.usdt, color: 'bg-green-500', textColor: 'text-green-400' },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 px-1">
        <PieChart className="text-purple-400" size={20} />
        <h2 className="text-lg font-bold text-white">Market Dominance</h2>
      </div>
      <div className="bg-bca-card border border-bca-border rounded-2xl p-5 backdrop-blur-sm space-y-4">
        {items.map((item) => (
          <div key={item.label}>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-sm font-medium text-gray-300">{item.label}</span>
              <span className={`text-sm font-bold ${item.textColor}`}>{item.value.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-black/30 rounded-full h-2 overflow-hidden">
              <div 
                className={`h-full rounded-full ${item.color} transition-all duration-1000`}
                style={{ width: `${item.value}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
