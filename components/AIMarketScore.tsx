'use client';

import { useEffect, useState } from 'react';
import { Brain } from 'lucide-react';

export default function AIMarketScore() {
  const [score, setScore] = useState(50);
  const [label, setLabel] = useState('Loading...');
  const [color, setColor] = useState('text-gray-400');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const calculateScore = async () => {
      try {
        // Fetch Sentiment
        const fngRes = await fetch('https://api.alternative.me/fng/?limit=1');
        const fngData = await fngRes.json();
        
        if (!fngData || !fngData.data || !fngData.data[0]) {
          throw new Error('Invalid sentiment data');
        }
        
        const sentiment = parseInt(fngData.data[0].value) || 50;

        // Fetch Market Data
        const marketsRes = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h');
        const marketsData = await marketsRes.json();
        
        let avgChange = 0;
        if (marketsData && marketsData.length > 0) {
          const totalChange = marketsData.reduce((acc: number, coin: any) => {
            return acc + (coin.price_change_percentage_24h || 0);
          }, 0);
          avgChange = totalChange / marketsData.length;
        }

        // Calculate Score
        let finalScore = sentiment;
        let finalLabel = 'Neutral';
        let finalColor = 'text-yellow-400';
        let reasoning = 'Market is balanced.';

        if (avgChange > 2) {
          finalScore = Math.min(100, finalScore + 10);
          reasoning = 'Buying pressure detected.';
        } else if (avgChange < -2) {
          finalScore = Math.max(0, finalScore - 10);
          reasoning = 'Selling pressure detected.';
        }
        if (finalScore >= 75) { 
          finalLabel = 'Strong Buy'; 
          finalColor = 'text-green-400'; 
        } else if (finalScore >= 55) { 
          finalLabel = 'Bullish'; 
          finalColor = 'text-green-300'; 
        } else if (finalScore <= 25) { 
          finalLabel = 'Strong Sell'; 
          finalColor = 'text-red-400'; 
        } else if (finalScore <= 45) { 
          finalLabel = 'Bearish'; 
          finalColor = 'text-red-300'; 
        }

        setScore(finalScore);
        setLabel(finalLabel);
        setColor(finalColor);
        
      } catch (error) {
        console.error('AI Score Error:', error);
        setScore(50);
        setLabel('Unavailable');
        setColor('text-gray-400');
      } finally {
        setLoading(false);
      }
    };

    calculateScore();
    const interval = setInterval(calculateScore, 300000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/30 rounded-2xl p-5 backdrop-blur-sm">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-white/10 rounded w-1/3"></div>
          <div className="h-12 bg-white/10 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/30 rounded-2xl p-5 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Brain className="text-purple-400" size={20} />
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">BCA AI Score</h2>        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded-full bg-black/30 ${color}`}>
          {label}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className={`text-5xl font-bold ${color}`}>
          {score}
        </div>
        <div className="flex-1">
          <p className="text-xs text-gray-400">
            <span className="text-white font-bold">AI Analysis:</span> Market intelligence based on sentiment and price action.
          </p>
        </div>
      </div>
    </div>
  );
}
