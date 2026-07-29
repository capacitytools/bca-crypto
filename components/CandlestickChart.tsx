'use client';

import { useEffect, useRef, useState } from 'react';
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
  const [error, setError] = useState('');

  useEffect(() => {
    if (!chartContainerRef.current || data.length === 0) return;

    try {
      // Clear previous chart
      chartContainerRef.current.innerHTML = '';

      // Create the chart
      const chart: IChartApi = createChart(chartContainerRef.current, {
        layout: {
          background: { type: ColorType.Solid, color: '#0B0E11' },
          textColor: '#9CA3AF',
        },
        grid: {
          vertLines: { color: '#2B3139' },
          horzLines: { color: '#2B3139' },
        },
        width: chartContainerRef.current.clientWidth,
        height: 300,
        crosshair: {
          mode: 0,
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
      const candleSeries = chart.addCandlestickSeries({        upColor: '#0ECB81',
        downColor: '#F6465D',
        borderUpColor: '#0ECB81',
        borderDownColor: '#F6465D',
        wickUpColor: '#0ECB81',
        wickDownColor: '#F6465D',
      });

      // Format the data
      const formattedData = data.map(d => ({
        time: Math.floor(d.time / 1000),
        open: d.open,
        high: d.high,
        low: d.low,
        close: d.close,
      }));

      candleSeries.setData(formattedData);

      // Fit content
      chart.timeScale().fitContent();

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
    } catch (err) {
      console.error('Chart error:', err);
      setError('Failed to render chart');
    }
  }, [data]);

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    );
  }
  return (
    <div className="w-full">
      <div ref={chartContainerRef} className="rounded-lg overflow-hidden" />
    </div>
  );
}