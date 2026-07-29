'use client';

import { useEffect, useRef } from 'react';
import { createChart, ColorType } from 'lightweight-charts';

export default function CandlestickChart({ data }: { data: any[] }) {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Safety check: Do not run if there is no container or no data
    if (!chartContainerRef.current || data.length === 0) return;

    // 2. Clear any old chart
    chartContainerRef.current.innerHTML = '';

    // 3. Create the chart (This ONLY runs in the browser because it's inside useEffect)
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#1E2329' }, // Dark card bg
        textColor: '#9CA3AF',
      },
      grid: {
        vertLines: { color: '#2B3139' },
        horzLines: { color: '#2B3139' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 300,
      crosshair: { mode: 0 },
      rightPriceScale: { borderColor: '#2B3139' },
      timeScale: { borderColor: '#2B3139', timeVisible: true },
    });

    // 4. Add the candlestick series (Green/Red colors)
    const candleSeries = chart.addCandlestickSeries({
      upColor: '#0ECB81',
      downColor: '#F6465D',
      borderUpColor: '#0ECB81',
      borderDownColor: '#F6465D',
      wickUpColor: '#0ECB81',
      wickDownColor: '#F6465D',
    });

    // 5. Format the data for the chart
    const formattedData = data.map((d) => ({
      time: Math.floor(d.time / 1000), // Chart needs seconds, API gives milliseconds
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
    }));

    candleSeries.setData(formattedData);

    // 6. Make it responsive
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);

    // 7. Cleanup when user leaves the page (prevents memory leaks)
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