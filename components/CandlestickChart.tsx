'use client';

import { useEffect, useRef, useState } from 'react';

export default function CandlestickChart({ data }: { data: any[] }) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [chartStatus, setChartStatus] = useState('Initializing...');
  const [error, setError] = useState('');

  useEffect(() => {
    // Safety checks
    if (!chartContainerRef.current) {
      setChartStatus('No container reference');
      return;
    }

    if (!data || data.length === 0) {
      setChartStatus('No data provided');
      return;
    }

    setChartStatus(`Loading ${data.length} candles...`);

    // Clear any old chart
    chartContainerRef.current.innerHTML = '';

    // Try to create the chart
    const initChart = async () => {
      try {
        // Dynamic import to ensure it only runs on client
        const { createChart, ColorType } = await import('lightweight-charts');
        
        setChartStatus('Creating chart...');

        const chart = createChart(chartContainerRef.current!, {
          layout: {
            background: { type: ColorType.Solid, color: '#1E2329' },
            textColor: '#9CA3AF',
          },
          grid: {
            vertLines: { color: '#2B3139' },
            horzLines: { color: '#2B3139' },
          },
          width: chartContainerRef.current!.clientWidth,
          height: 300,
          crosshair: { mode: 0 },
          rightPriceScale: { borderColor: '#2B3139' },
          timeScale: { borderColor: '#2B3139', timeVisible: true },
        });
        const candleSeries = chart.addCandlestickSeries({
          upColor: '#0ECB81',
          downColor: '#F6465D',
          borderUpColor: '#0ECB81',
          borderDownColor: '#F6465D',
          wickUpColor: '#0ECB81',
          wickDownColor: '#F6465D',
        });

        const formattedData = data.map((d) => ({
          time: Math.floor(d.time / 1000),
          open: d.open,
          high: d.high,
          low: d.low,
          close: d.close,
        }));

        setChartStatus('Setting data...');
        candleSeries.setData(formattedData);
        setChartStatus('Chart rendered successfully!');

        // Handle resize
        const handleResize = () => {
          if (chartContainerRef.current) {
            chart.applyOptions({ width: chartContainerRef.current.clientWidth });
          }
        };

        window.addEventListener('resize', handleResize);

        return () => {
          window.removeEventListener('resize', handleResize);
          chart.remove();
        };
      } catch (err) {
        console.error('Chart error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setChartStatus('Failed to create chart');
      }
    };

    initChart();
  }, [data]);

  // Show debug info
  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
        <p className="text-red-400 font-bold mb-2">Chart Error</p>
        <p className="text-red-300 text-sm">{error}</p>        <p className="text-gray-500 text-xs mt-2">Data count: {data.length}</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Debug Status */}
      <div className="bg-[#0B0E11] border border-[#2B3139] rounded-lg p-2 mb-2">
        <p className="text-[#F3BA2F] text-xs">
          Chart Status: <span className="text-white">{chartStatus}</span>
        </p>
        <p className="text-gray-500 text-xs">
          Data Points: {data.length}
        </p>
      </div>
      
      {/* Chart Container */}
      <div ref={chartContainerRef} className="rounded-xl overflow-hidden border border-[#2B3139]" />
      
      {/* If chart is empty, show this */}
      {data.length > 0 && chartStatus === 'Chart rendered successfully!' && (
        <p className="text-green-400 text-xs text-center mt-2">✓ Chart is ready! Swipe to explore.</p>
      )}
    </div>
  );
}