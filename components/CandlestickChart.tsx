'use client';

import { useEffect, useRef } from 'react';
import { createChart, ColorType, IChartApi } from 'lightweight-charts';

interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export default function CandlestickChart({ data }: { data: Candle[] }) {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create the chart
    const chart: IChartApi = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#1E2329' }, // Dark card background
        textColor: '#9CA3AF', // Gray text
      },
      grid: {
        vertLines: { color: '#2B3139' }, // Subtle grid lines
        horzLines: { color: '#2B3139' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 300, // Fixed height for mobile
      crosshair: {
        mode: 0, // Normal crosshair
      },
      rightPriceScale: {
        borderColor: '#2B3139',
      },
      timeScale: {
        borderColor: '#2B3139',
        timeVisible: true,
      },
    });

    // Add the candlestick series
    const candleSeries = chart.addCandlestickSeries({
      upColor: '#0ECB81', // Binance Green
      downColor: '#F6465D', // Binance Red
      borderUpColor: '#0ECB81',
      borderDownColor: '#F6465D',
      wickUpColor: '#0ECB81',
      wickDownColor: '#F6465D',
    });

    // Format the data for the chart (Lightweight charts needs time in seconds, not milliseconds)
    const formattedData = data.map(d => ({
      time: Math.floor(d.time / 1000), 
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
    }));

    candleSeries.setData(formattedData);

    // Make it responsive
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [data]);

  return (
    <div className="w-full">
      <div ref={chartContainerRef} className="rounded-xl overflow-hidden border border-[#2B3139]" />
    </div>
  );
}