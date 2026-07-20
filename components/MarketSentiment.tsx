'use client';

import { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';

interface SentimentData {
  value: string;
  value_classification: string;
}

export default function MarketSentiment() {
  const [sentiment, setSentiment] = useState<SentimentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSentiment = async () => {
      try {
        const res = await fetch('https://api.alternative.me/fng/?limit=1');
        const data = await res.json();
        setSentiment(data.data[0]);
      } catch (error) {
        console.error("Failed to fetch sentiment", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSentiment();
    // Refresh every 5 minutes (300,000 milliseconds)
    const interval = setInterval(fetchSentiment, 300000); 
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-bca-card border border-bca-border rounded-2xl p-5 backdrop-blur-sm animate-pulse">
        <div className="h-6 bg-white/10 rounded w-1/2 mb-2"></div>
        <div className="h-10 bg-white/10 rounded w-1/4"></div>
      </div>
    );
  }

  if (!sentiment) return null;

  const score = parseInt(sentiment.value);
  let colorClass = 'text-yellow-400';
  let bgClass = 'from-yellow-500/20 to-yellow-600/5';
  
  if (score <= 24) {
    colorClass = 'text-red-400';
    bgClass = 'from-red-500/20 to-red-600/5';
  } else if (score <= 49) {
    colorClass = 'text-orange-400';
    bgClass = 'from-orange-500/20 to-orange-600/5';
  } else if (score <= 74) {
    colorClass = 'text-green-400';
    bgClass = 'from-green-500/20 to-green-600/5';
  } else {
    colorClass = 'text-emerald-400';
    bgClass = 'from-emerald-500/20 to-emerald-600/5';
  }

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${bgClass} border border-bca-border rounded-2xl p-5 backdrop-blur-sm`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Activity className={colorClass} size={20} />
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Market Sentiment</h2>
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded-full bg-black/30 ${colorClass}`}>
          {sentiment.value_classification}
        </span>
      </div>
      
      <div className="flex items-end gap-2">
        <span className={`text-5xl font-bold ${colorClass}`}>{score}</span>
        <span className="text-gray-500 text-sm mb-2">/ 100</span>
      </div>
      
      <div className="mt-4 w-full bg-black/30 rounded-full h-2 overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-1000"
          style={{ 
            width: `${score}%`,
            background: `linear-gradient(to right, ${score <= 24 ? '#ef4444' : score <= 49 ? '#f97316' : score <= 74 ? '#4ade80' : '#10b981'}, ${score <= 24 ? '#b91c1c' : score <= 49 ? '#ea580c' : score <= 74 ? '#22c55e' : '#059669'})`
          }}
        ></div>
      </div>
    </div>
  );
}
