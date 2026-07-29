'use client';
import { useState, useEffect } from 'react';

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<string[]>([]);

  useEffect(() => {
    // Load from the browser's tiny notebook when the app starts
    const saved = localStorage.getItem('bca_watchlist');
    if (saved) {
      try {
        setWatchlist(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse watchlist", e);
      }
    }
  }, []);

  const toggleCoin = (symbol: string) => {
    setWatchlist(prev => {
      const exists = prev.includes(symbol);
      // If it exists, remove it. If not, add it.
      const newWatchlist = exists ? prev.filter(s => s !== symbol) : [...prev, symbol];
      // Save to the notebook
      localStorage.setItem('bca_watchlist', JSON.stringify(newWatchlist));
      return newWatchlist;
    });
  };

  const isInWatchlist = (symbol: string) => watchlist.includes(symbol);

  return { watchlist, toggleCoin, isInWatchlist };
}