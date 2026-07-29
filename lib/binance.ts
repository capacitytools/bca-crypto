// Binance API Helper - Free, No Rate Limits for Public Data

const BASE_URL = 'https://api.binance.com/api/v3';

export interface Ticker {
  symbol: string;
  price: string;
  priceChangePercent: string;
  volume: string;
  quoteVolume: string;
}

export interface Kline {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export async function getExchangeInfo() {
  const res = await fetch(`${BASE_URL}/exchangeInfo`);
  const data = await res.json();
  return data;
}

export async function get24hTickers(): Promise<Ticker[]> {
  const res = await fetch(`${BASE_URL}/ticker/24hr`);
  const data = await res.json();
  return data;
}

export async function getKlines(symbol: string, interval: string = '1h', limit: number = 100): Promise<Kline[]> {
  const res = await fetch(`${BASE_URL}/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`);
  const data = await res.json();
  return data.map((k: any) => ({
    time: k[0],
    open: parseFloat(k[1]),
    high: parseFloat(k[2]),
    low: parseFloat(k[3]),
    close: parseFloat(k[4]),
    volume: parseFloat(k[5])
  }));
}

export async function getPrice(symbol: string): Promise<string> {
  const res = await fetch(`${BASE_URL}/ticker/price?symbol=${symbol}`);
  const data = await res.json();
  return data.price;
}

// Format symbol for display (BTCUSDT -> BTC/USDT)
export function formatSymbol(symbol: string): string {
  if (symbol.endsWith('USDT')) return symbol.replace('USDT', '/USDT');
  if (symbol.endsWith('BTC')) return symbol.replace('BTC', '/BTC');
  if (symbol.endsWith('ETH')) return symbol.replace('ETH', '/ETH');
  if (symbol.endsWith('BNB')) return symbol.replace('BNB', '/BNB');
  return symbol;
}

// Get base asset from symbol
export function getBaseAsset(symbol: string): string {
  if (symbol.endsWith('USDT')) return symbol.replace('USDT', '');
  if (symbol.endsWith('BTC')) return symbol.replace('BTC', '');
  if (symbol.endsWith('ETH')) return symbol.replace('ETH', '');
  if (symbol.endsWith('BNB')) return symbol.replace('BNB', '');
  return symbol;
}