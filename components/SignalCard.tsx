'use client';

import { Brain, TrendingUp, TrendingDown } from 'lucide-react';

interface SignalData {
  signal: string;
  color: string;
  bg: string;
  reasoning: string;
  rsi: string;
  ema: string;
}

export default function SignalCard({ data }: { data: SignalData }) {
  return (
    <div className={`border rounded-2xl p-5 backdrop-blur-sm ${data.bg}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="text-[#F3BA2F]" size={20} />
          <h2 className="text-sm font-bold text-gray-300 uppercase tracking-wider">AI Signal</h2>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-bold border ${data.bg} ${data.color}`}>
          {data.signal}
        </div>
      </div>

      <p className="text-sm text-gray-300 mb-4 leading-relaxed">
        {data.reasoning}
      </p>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-black/20 rounded-lg p-3">
          <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">RSI (14)</p>
          <p className={`text-lg font-bold ${parseFloat(data.rsi) > 70 ? 'text-red-400' : parseFloat(data.rsi) < 30 ? 'text-green-400' : 'text-white'}`}>
            {data.rsi}
          </p>
        </div>
        <div className="bg-black/20 rounded-lg p-3">
          <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Trend (EMA 50)</p>
          <p className="text-lg font-bold text-white">${data.ema}</p>
        </div>
      </div>
    </div>
  );
}