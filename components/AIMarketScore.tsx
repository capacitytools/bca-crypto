'use client';

import { useEffect, useState } from 'react';
import { BrainCircuit } from 'lucide-react';

interface ScoreData {
  score: number;
  label: string;
  color: string;
  reasoning: string;
}

export default function AIMarketScore() {
  const [data, setData] = useState<ScoreData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const calculateScore = async () => {
      try {
        // 1. Get Sentiment (The Mood)
        const fngRes = await fetch('https://api.alternative.me/fng/?limit=1');
        const fngData = await fngRes.json();
        const sentiment = parseInt(fngData.data[0].value);

        // 2. Get Top 10 Performance (The Reality)
        const marketsRes = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h');
        const marketsData = await marketsRes.json();
        
        // Calculate average 24h change of top 10 coins
        const avgChange = marketsData.reduce((acc: number, coin: any) => acc + (coin.price_change_percentage_24h || 0), 0) / marketsData.length;

        // 3. AI Logic (The "Brain")
        let score = 50;
        let label = 'Neutral';
        let color = 'text-yellow-400';
        let reasoning = 'Market is undecided. Wait for clarity.';

        // Base score from sentiment
        score = sentiment;

        // Adjust based on price action
        if (avgChange > 2) {
            score = Math.min(100, score + 10);
            reasoning = 'Strong buying pressure detected in top assets.';
        } else if (avgChange < -2) {
            score = Math.max(0, score - 10);
            reasoning = 'Selling pressure detected. Market is weak.';
        }

        // Determine Label based on final score        if (score >= 75) { label = 'Strong Buy'; color = 'text-green-400'; }
        else if (score >= 55) { label = 'Bullish'; color = 'text-green-300'; }
        else if (score <= 25) { label = 'Strong Sell'; color = 'text-red-400'; }
        else if (score <= 45) { label = 'Bearish'; color = 'text-red-300'; }
        
        // CRITICAL: Check for Divergence (The Trap!)
        // If Sentiment is High (Greed) but Prices are Dropping, warn the user!
        if (sentiment > 65 && avgChange < -1) {
            label = 'Caution (Divergence)';
            color = 'text-orange-400';
            reasoning = 'Sentiment is high but prices are dropping. Possible trap!';
            score = 50; // Neutralize score to force caution
        }

        setData({ score, label, color, reasoning });
      } catch (error) {
        console.error("AI Error", error);
      } finally {
        setLoading(false);
      }
    };

    calculateScore();
    // Refresh every 5 minutes
    const interval = setInterval(calculateScore, 300000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="h-32 bg-bca-card border border-bca-border rounded-2xl animate-pulse"></div>
    );
  }

  if (!data) return null;

  return (
    <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/30 rounded-2xl p-5 backdrop-blur-sm relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
      
      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className="flex items-center gap-2">
          <BrainCircuit className="text-purple-400" size={20} />
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">BCA AI Score</h2>
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded-full bg-black/30 ${data.color}`}>
          {data.label}
        </span>
      </div>
      <div className="flex items-center gap-4 relative z-10">
        <div className={`text-5xl font-bold ${data.color}`}>
          {data.score}
        </div>
        <div className="flex-1">
          <p className="text-xs text-gray-400 leading-relaxed">
            <span className="text-white font-bold">AI Analysis:</span> {data.reasoning}
          </p>
        </div>
      </div>
    </div>
  );
}
