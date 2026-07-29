// lib/indicators.ts

// Calculate Exponential Moving Average (EMA)
export function calculateEMA(data: number[], period: number): number {
  const k = 2 / (period + 1);
  let ema = data[0];
  for (let i = 1; i < data.length; i++) {
    ema = data[i] * k + ema * (1 - k);
  }
  return ema;
}

// Calculate Relative Strength Index (RSI)
export function calculateRSI(data: number[], period: number = 14): number {
  if (data.length < period + 1) return 50; // Not enough data

  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {
    const diff = data[i] - data[i - 1];
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  for (let i = period + 1; i < data.length; i++) {
    const diff = data[i] - data[i - 1];
    const gain = diff > 0 ? diff : 0;
    const loss = diff < 0 ? -diff : 0;

    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
  }

  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
}

// Generate the AI Signal
export function generateSignal(currentPrice: number, rsi: number, ema: number) {
  let signal = 'HOLD';
  let color = 'text-gray-400';
  let bg = 'bg-gray-500/10 border-gray-500/30';
  let reasoning = 'Market is balanced. Wait for a clear trend.';

  // Simple AI Logic
  if (rsi < 30 && currentPrice > ema) {
    signal = 'STRONG BUY';
    color = 'text-green-400';
    bg = 'bg-green-500/10 border-green-500/30';
    reasoning = 'Oversold (RSI < 30) but price is above trend (EMA). High chance of a bounce!';
  } else if (rsi < 40) {
    signal = 'BUY';
    color = 'text-green-300';
    bg = 'bg-green-500/10 border-green-500/30';
    reasoning = 'Momentum is low (RSI < 40). Good entry zone for long term.';
  } else if (rsi > 70 && currentPrice < ema) {
    signal = 'STRONG SELL';
    color = 'text-red-400';
    bg = 'bg-red-500/10 border-red-500/30';
    reasoning = 'Overbought (RSI > 70) and price is below trend. High risk of a crash!';
  } else if (rsi > 60) {
    signal = 'SELL';
    color = 'text-red-300';
    bg = 'bg-red-500/10 border-red-500/30';
    reasoning = 'Momentum is high (RSI > 60). Consider taking profits.';
  }

  return { signal, color, bg, reasoning, rsi: rsi.toFixed(1), ema: ema.toFixed(2) };
}