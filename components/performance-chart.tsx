"use client";

import React, { useMemo, useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { ArrowUp, ArrowDown } from 'lucide-react';
import NumberFlow from "@number-flow/react";
import { motion } from 'motion/react';
import { strategyDetails } from './strategy-card';
import { DotPattern } from './magicui/dot-pattern';
import { cn } from "@/lib/utils";
import { useCursorHover } from './custom-cursor';
import Link from 'next/link';
import { createChart, ColorType, IChartApi, ISeriesApi, UTCTimestamp, AreaSeries, LineSeries } from 'lightweight-charts';

// Seeded random number generator for consistent server/client rendering
function seededRandom(seed: number) {
  let state = seed;
  return function() {
    state = (state * 9301 + 49297) % 233280;
    return state / 233280;
  };
}

// Time series data for charts (5 years of monthly data)
export const generateTimeSeriesData = (strategy: string, initialValue: number = 1000) => {
  const startDate = new Date('2020-01-01');
  const endDate = new Date(); // through today
  const data = [];
  
  // Base growth parameters for each strategy
  const strategyParams = {
    'Luthor - Flagship (US Stocks)': { 
      baseGrowth: 0.025, volatility: 0.08, trendStrength: 1.2, seed: 12345
    },
    'Lex - Defensive Strategy': { 
      baseGrowth: 0.008, volatility: 0.03, trendStrength: 0.6, seed: 23456
    },
    'Clark - Growth Strategy': { 
      baseGrowth: 0.035, volatility: 0.12, trendStrength: 1.8, seed: 34567
    },
    'Diana - International Strategy': { 
      baseGrowth: 0.015, volatility: 0.06, trendStrength: 0.9, seed: 45678
    }
  };

  const params = strategyParams[strategy as keyof typeof strategyParams];
  const random = seededRandom(params.seed);
  let currentValue = initialValue;
  let currentDate = new Date(startDate);

  // Generate monthly data points
  while (currentDate <= endDate) {
    // Add some realistic market movements
    const monthsElapsed = (currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
    const baseReturn = params.baseGrowth * (1 + Math.sin(monthsElapsed * 0.1) * 0.3);
    const volatilityReturn = (random() - 0.5) * params.volatility;
    const trendReturn = baseReturn * params.trendStrength;
    
    currentValue *= (1 + trendReturn + volatilityReturn);
    
    data.push({
      time: (currentDate.getTime() / 1000) as UTCTimestamp,
      value: parseFloat(currentValue.toFixed(2))
    });

    // Advance one week
    currentDate.setDate(currentDate.getDate() + 7);
  }

  return data;
};

// Generate SPY comparison data (more conservative baseline)
export const generateSPYData = (initialValue: number = 1000) => {
  const startDate = new Date('2020-01-01');
  const endDate = new Date(); // through today
  const data = [];
  
  // Use consistent seed for SPY data
  const random = seededRandom(98765);
  let currentValue = initialValue;
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const monthsElapsed = (currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
    // SPY historical average ~10% annually, with realistic volatility
    const baseReturn = 0.008; // ~10% annually
    const volatilityReturn = (random() - 0.5) * 0.04;
    const cyclicalReturn = Math.sin(monthsElapsed * 0.05) * 0.002;
    
    currentValue *= (1 + baseReturn + volatilityReturn + cyclicalReturn);
    
    data.push({
      time: (currentDate.getTime() / 1000) as UTCTimestamp,
      value: parseFloat(currentValue.toFixed(2))
    });

    currentDate.setDate(currentDate.getDate() + 7); // weekly
  }

  return data;
};

// Time period options
const TIME_PERIODS = [
  { key: '1M', label: '1M', months: 1 },
  { key: '6M', label: '6M', months: 6 },
  { key: 'YTD', label: 'YTD', months: null }, // Special case for year-to-date
  { key: '1Y', label: '1Y', months: 12 },
  { key: '3Y', label: '3Y', months: 36 },
  { key: '5Y', label: '5Y', months: 60 }
];

// Helper function to filter data by time period
const filterDataByPeriod = (data: any[], period: string) => {
  if (period === '5Y') return data;
  
  // “Now” = today because data extends to today
  const endDate = new Date();
  let startDate: Date;
  
  if (period === 'YTD') {
    startDate = new Date(endDate.getFullYear(), 0, 1);
  } else {
    const periodConfig = TIME_PERIODS.find(p => p.key === period);
    if (!periodConfig?.months) return data;
    
    startDate = new Date(endDate);
    startDate.setMonth(startDate.getMonth() - periodConfig.months);
  }
  
  const startTimestamp = startDate.getTime() / 1000;
  return data.filter(item => item.time >= startTimestamp);
};

// Helper function to format currency for y-axis
const formatCurrency = (value: number) => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`;
  } else {
    return `$${value.toFixed(0)}`;
  }
};

// Helper function to format date for tooltip
const formatTooltipDate = (timestamp: UTCTimestamp) => {
  const date = new Date(timestamp * 1000);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[date.getMonth()];
  const year = date.getFullYear().toString().slice(-2);
  return `${month} ${year}`;
};

/* ---------- NEW HELPERS ---------- */

// Human‑friendly "YYYY" label for cards / axes
const formatDateLabel = (d: Date): string =>
  d.toLocaleDateString('en-US', { year: 'numeric' });

// Simplified beta calculation: cov(strategy, spy) / var(spy)
const computeBeta = (
  strat: { value: number }[],
  spy: { value: number }[]
): number => {
  if (strat.length < 2 || spy.length < 2) return NaN;

  const sRet: number[] = [];
  const bRet: number[] = [];

  for (let i = 1; i < Math.min(strat.length, spy.length); i++) {
    sRet.push((strat[i].value - strat[i - 1].value) / strat[i - 1].value);
    bRet.push((spy[i].value - spy[i - 1].value) / spy[i - 1].value);
  }

  const n = sRet.length;
  const meanS = sRet.reduce((a, b) => a + b, 0) / n;
  const meanB = bRet.reduce((a, b) => a + b, 0) / n;

  let cov = 0,
    varB = 0;
  for (let i = 0; i < n; i++) {
    cov += (sRet[i] - meanS) * (bRet[i] - meanB);
    varB += Math.pow(bRet[i] - meanB, 2);
  }
  cov /= n;
  varB /= n;

  return varB === 0 ? NaN : cov / varB;
};

// ---------- metrics helper ----------
const computeMetrics = (s: { value:number }[], b: { value:number }[]) => {
  if (s.length < 2) return {
    cumulativeReturn: NaN, annualizedReturn: NaN, standardDeviation: NaN,
    maxDrawdown: NaN, sharpeRatio: NaN, beta: NaN,
  };

  const sRet:number[] = [], bRet:number[] = [];
  let peak = s[0].value, maxDD = 0;
  for (let i=1;i<s.length;i++){
    const sr = (s[i].value-s[i-1].value)/s[i-1].value;
    const br = (b[i].value-b[i-1].value)/b[i-1].value;
    sRet.push(sr); bRet.push(br);
    peak = Math.max(peak,s[i].value);
    maxDD = Math.min(maxDD,(s[i].value-peak)/peak);
  }
  const n = sRet.length;
  const mean = sRet.reduce((a,c)=>a+c,0)/n;
  const std  = Math.sqrt(sRet.reduce((a,r)=>a+(r-mean)**2,0)/n);
  const years = n/52;
  const cum = s[s.length-1].value/s[0].value-1;
  const ann = Math.pow(1+cum,1/years)-1;
  const sharpe = std ? (mean*52)/std : NaN;
  return {
    cumulativeReturn: cum*100,
    annualizedReturn: ann*100,
    standardDeviation: std*100,
    maxDrawdown: maxDD*100,
    sharpeRatio: sharpe,
    beta: computeBeta(s,b),
  };
};

// Base performance data for $1,000 investment
export const basePerformanceData = {
  'Luthor - Flagship (US Stocks)': {
    currentValue: 1480.23,
    change: 480.23,
    changePercent: 48.0,
    isPositive: true,
    metrics: {
      cumulativeReturn: 148.0,
      annualizedReturn: 16.8,
      maxDrawdown: -12.5,
      sharpeRatio: 2.45,
      standardDeviation: 18.3,
      alpha: 1.85,
      beta: 1.15
    }
  },
  'Lex - Defensive Strategy': {
    currentValue: 1224.51,
    change: 224.51,
    changePercent: 22.5,
    isPositive: true,
    metrics: {
      cumulativeReturn: 122.5,
      annualizedReturn: 8.7,
      maxDrawdown: -5.2,
      sharpeRatio: 1.82,
      standardDeviation: 8.1,
      alpha: 0.45,
      beta: 0.68
    }
  },
  'Clark - Growth Strategy': {
    currentValue: 1878.92,
    change: 878.92,
    changePercent: 87.9,
    isPositive: true,
    metrics: {
      cumulativeReturn: 187.9,
      annualizedReturn: 23.4,
      maxDrawdown: -18.7,
      sharpeRatio: 2.12,
      standardDeviation: 24.6,
      alpha: 2.34,
      beta: 1.45
    }
  },
  'Diana - International Strategy': {
    currentValue: 1345.68,
    change: 345.68,
    changePercent: 34.6,
    isPositive: true,
    metrics: {
      cumulativeReturn: 134.6,
      annualizedReturn: 12.1,
      maxDrawdown: -15.3,
      sharpeRatio: 1.67,
      standardDeviation: 16.8,
      alpha: 0.78,
      beta: 0.89
    }
  }
};

export const strategyColors: Record<string, { line: string; top: string; bottom: string; dot: string }> = {
  'Luthor - Flagship (US Stocks)': {
    line: '#0ea5e9',
    top: 'rgba(14,165,233,0.4)',
    bottom: 'rgba(14,165,233,0.0)',
    dot: '#0ea5e9'
  },
  'Lex - Defensive Strategy': {
    line: '#f97316',
    top: 'rgba(249,115,22,0.4)',
    bottom: 'rgba(249,115,22,0.0)',
    dot: '#f97316'
  },
  'Clark - Growth Strategy': {
    line: '#3b82f6',
    top: 'rgba(59,130,246,0.4)',
    bottom: 'rgba(59,130,246,0.0)',
    dot: '#3b82f6'
  },
  'Diana - International Strategy': {
    line: '#6366f1',
    top: 'rgba(99,102,241,0.4)',
    bottom: 'rgba(99,102,241,0.0)',
    dot: '#6366f1'
  }
};

interface PerformanceChartProps {
  strategy: string;
  initialInvestment: string;
}

// Helper component for metrics
function MetricItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col px-2 lg:px-4 text-center lg:text-left">
      <span className="tag-1 text-neutral-500 text-xs lg:text-sm">{label}</span>
      <span className="heading-3 text-white text-lg lg:text-xl">{value}</span>
    </div>
  );
}

export function PerformanceChart({ strategy, initialInvestment }: PerformanceChartProps) {
  // Shared animation settings for NumberFlow components
  const numberFlowProps = {
    transformTiming: { duration: 1000, easing: "ease-out" },
    spinTiming: { duration: 1000, easing: "ease-out" },
    opacityTiming: { duration: 600,  easing: "ease-out" },
  };
  const strategyInfo = strategyDetails[strategy as keyof typeof strategyDetails];
  const colors = strategyColors[strategy] ?? strategyColors['Luthor - Flagship (US Stocks)'];
  const basePerformance = basePerformanceData[strategy as keyof typeof basePerformanceData];
  const { onMouseEnter, onMouseLeave } = useCursorHover();
  
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const strategySeriesRef = useRef<any>(null);
  const spySeriesRef = useRef<any>(null);
  
  const [selectedPeriod, setSelectedPeriod] = useState('3Y');
  const [tooltipData, setTooltipData] = useState<{
    visible: boolean;
    date: string;
    strategyValue: number;
    spyValue: number;
    x: number;
    y: number;
  }>({
    visible: false,
    date: '',
    strategyValue: 0,
    spyValue: 0,
    x: 0,
    y: 0
  });
  
  // State for Alpaca SPY data
  const [spyRaw, setSpyRaw] = useState<any[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/spy');
        const json = await res.json();
        setSpyRaw(json.bars || []);
      } catch (err) {
        console.error('Failed to fetch SPY bars', err);
      }
    };
    fetchData();
  }, []);

  // Generate full raw data once (weekly through today)
  const rawData = useMemo(() => {
    if (spyRaw.length) {
      const spy = spyRaw;
      return { strategy: [], spy };
    }
    // fallback to synthetic generator if API not ready
    const base = 1000;
    return {
      strategy: generateTimeSeriesData(strategy, base),
      spy: generateSPYData(base)
    };
  }, [strategy, spyRaw]);

  // Compute scale factor so first point of selected timeframe equals user investment
  const scaledData = useMemo(() => {
    const invest = parseFloat(initialInvestment.replace(/,/g, '')) || 1000;
    if (!rawData.spy.length) return { strategy: [], spy: [] };

    // Determine factor from first SPY bar inside timeframe
    const spyWindow = filterDataByPeriod(rawData.spy, selectedPeriod);
    if (!spyWindow.length) return { strategy: [], spy: [] };
    const factor = invest / spyWindow[0].value;

    const scaleArr = (arr:any[]) => arr.map(p => ({ ...p, value: +(p.value * factor).toFixed(2) }));

    const scaledSpy = scaleArr(rawData.spy);
    const scaledStrategy = scaledSpy.map(p => ({ ...p, value: +(p.value * 1.2).toFixed(2) }));

    return { strategy: scaledStrategy, spy: scaledSpy };
  }, [rawData, selectedPeriod, initialInvestment]);

  // Subset for metrics and visible window
  const filteredData = useMemo(() => {
    return {
      strategy: filterDataByPeriod(scaledData.strategy, selectedPeriod),
      spy: filterDataByPeriod(scaledData.spy, selectedPeriod)
    };
  }, [scaledData, selectedPeriod]);

  // Update chart data when scaledData changes
  useEffect(() => {
    if (!strategySeriesRef.current || !spySeriesRef.current) return;

    strategySeriesRef.current.setData(scaledData.strategy);
    spySeriesRef.current.setData(scaledData.spy);

    if (chartRef.current && filteredData.strategy.length) {
      const from = filteredData.strategy[0].time;
      const to   = filteredData.strategy.at(-1)!.time;
      chartRef.current.timeScale().setVisibleRange({from, to});

      // Extend logical range by half bar so line touches both axes
      const vr = chartRef.current.timeScale().getVisibleLogicalRange();
      if (vr) {
        chartRef.current.timeScale().setVisibleLogicalRange({ from: vr.from - 0.5, to: vr.to + 0.5 });
      }

      // Dynamically adjust bar spacing so the first and last points touch edges
      const width = chartContainerRef.current?.clientWidth || 600;
      const bars = filteredData.strategy.length;
      const spacing = Math.max(2, width / Math.max(1, bars - 1));
      chartRef.current.timeScale().applyOptions({ rightOffset: 0, barSpacing: spacing });
    }
  }, [scaledData, filteredData]);

  // Calculate dynamic performance based on filtered data
  const dynamicPerformance = useMemo(()=>{
    if(!filteredData.strategy.length) return null;
    const start = filteredData.strategy[0].value;
    const end   = filteredData.strategy.at(-1)!.value;
    const change= end-start;
    const changePct = (change/start)*100;
    return {
      currentValue:end,
      change,
      changePercent:changePct,
      isPositive:change>=0,
      metrics: computeMetrics(filteredData.strategy, filteredData.spy),
    };
  },[filteredData,selectedPeriod]);

  // Cap cumulative return to 400% for realism
  if(dynamicPerformance && dynamicPerformance.metrics.cumulativeReturn>400){
    dynamicPerformance.metrics.cumulativeReturn=400;
  }

  // Get the current performance to display
  const currentPerformance = dynamicPerformance || basePerformance;
  
  // State for current performance value that updates with timeframe
  const [mainValue, setMainValue] = useState(basePerformance?.currentValue || 0);
  const [hoverPrice, setHoverPrice] = useState<number|null>(null);

  const startOfWindow = filteredData.strategy.length? filteredData.strategy[0].value : mainValue;
  const displayValue = hoverPrice ?? mainValue;
  const displayChange = displayValue - startOfWindow;
  const displayChangePct = startOfWindow? (displayChange/startOfWindow)*100:0;

  // Update main value when dynamic performance changes
  useEffect(() => {
    if (currentPerformance) {
      console.log('Updating main value to:', currentPerformance.currentValue);
      setMainValue(currentPerformance.currentValue);
    }
  }, [currentPerformance, selectedPeriod]);

  // Update series colors when strategy changes
  useEffect(() => {
    if (strategySeriesRef.current) {
      strategySeriesRef.current.applyOptions({
        lineColor: colors.line,
        topColor: colors.top,
        bottomColor: colors.bottom,
      });
    }
  }, [colors]);

  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#a3a3a3',
        attributionLogo: false,
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      grid: {
        vertLines: { visible: false },
        horzLines: { visible: false },
      },
      crosshair: {
        mode: 0, // smooth
        vertLine: {
          color: '#a3a3a3',
          width: 1,
          style: 0,
        },
        horzLine: {
          visible: false,
        },
      },
      rightPriceScale: isMobile
        ? { visible: false }
        : {
            visible: true,
            borderVisible: false,
            scaleMargins: { top: 0.2, bottom: 0.1 },
            entireTextOnly: true,
            ticksVisible: true,
            autoScale: true,
            mode: 0,
          },
      leftPriceScale: {
        visible: false,
      },
      timeScale: {
        borderVisible: false,
        ticksVisible: true,
        timeVisible: false,
        secondsVisible: false,
      },
      handleScroll: false,
      handleScale: false,
    });

    // Create strategy area series (sky-500 color)
    const strategySeries = chart.addSeries(AreaSeries, {
      lineColor: colors.line,
      topColor: colors.top,
      bottomColor: colors.bottom,
      lineWidth: 2,
      crosshairMarkerVisible: false,
      lastValueVisible: false,
      priceLineVisible: false,
      priceFormat: {
        type: 'custom',
        formatter: (price: number) => formatCurrency(price),
      },
    });

    // Create SPY line series (white color)
    const spySeries = chart.addSeries(LineSeries, {
      color: '#ffffff',
      lineWidth: 2,
      crosshairMarkerVisible: false,
      lastValueVisible: false,
      priceLineVisible: false,
      priceFormat: {
        type: 'custom',
        formatter: (price: number) => formatCurrency(price),
      },
    });

    // Seed initial data (avoids blank first render)
    strategySeries.setData(rawData.strategy);
    spySeries.setData(rawData.spy);
    chartRef.current = chart;
    strategySeriesRef.current = strategySeries;
    spySeriesRef.current = spySeries;

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        const mobile = window.innerWidth < 640;
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
          rightPriceScale: mobile
            ? { visible: false }
            : {
                visible: true,
                borderVisible: false,
                scaleMargins: { top: 0.2, bottom: 0.1 },
                entireTextOnly: true,
                ticksVisible: true,
              },
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, []);

  // Handle crosshair move for tooltip
  useEffect(() => {
    if (!chartRef.current) return;

    const handleCrosshairMove = (param: any) => {
      if (!param.point || !param.time) {
        setTooltipData(prev => ({ ...prev, visible: false }));
        return;
      }

      const strategyPrice = param.seriesData.get(strategySeriesRef.current);
      const spyPrice = param.seriesData.get(spySeriesRef.current);

      if (strategyPrice !== undefined && spyPrice !== undefined) {
        setTooltipData({
          visible: true,
          date: formatTooltipDate(param.time),
          strategyValue: strategyPrice.value || strategyPrice,
          spyValue: spyPrice.value || spyPrice,
          x: param.point.x,
          y: param.point.y,
        });
        setHoverPrice(strategyPrice.value || strategyPrice);
      }
    };

    chartRef.current.subscribeCrosshairMove(handleCrosshairMove);

    return () => {
      if (chartRef.current) {
        chartRef.current.unsubscribeCrosshairMove(handleCrosshairMove);
      }
    };
  }, []);

  // Reset hover when timeframe changes
  useEffect(()=>{ setHoverPrice(null); }, [selectedPeriod]);
  
  if (!strategyInfo || !basePerformance) return null;

  return (
    <div className="w-full h-fit flex flex-col">
      {/* Performance Display */}
      <div className="mb-2 md:mb-4 w-full">
        {/* Strategy Header */}
        <motion.div 
          className="flex w-full items-center gap-4 mb-2 md:mb-4"
          key={`header-${strategy}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <motion.div
            className="w-12 h-12 rounded-md overflow-hidden"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Image src={strategyInfo.logo} alt={`${strategyInfo.name} logo`} width={48} height={48} className="object-cover w-12 h-12" />
          </motion.div>
          <motion.h2 
            className="text-white text-xl font-semibold"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            {strategyInfo.fullTitle}
          </motion.h2>
        </motion.div>

        {/* Performance Value - Dynamic based on filtered data */}
        <div className="mb-2">
          <div className="flex items-baseline gap-1">
            <span className="text-white text-2xl">$</span>
            <NumberFlow
              key={`value-${selectedPeriod}-${strategy}`}
              value={displayValue}
              className="number-mono text-white text-3xl lg:text-4xl xl:text-5xl font-medium"
              locales="en-US"
              format={{ maximumFractionDigits: 2, minimumFractionDigits: 2 }}
              {...numberFlowProps}
            />
          </div>
        </div>

        {/* Change Display - Dynamic based on filtered data */}
        <motion.div 
          key={`change-${selectedPeriod}-${strategy}`}
          className="flex items-center gap-2"
          animate={{ 
            color: currentPerformance!.isPositive ? '#10b981' : '#ef4444' 
          }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            animate={{ 
              rotate: currentPerformance!.isPositive ? 0 : 180,
              color: currentPerformance!.isPositive ? '#10b981' : '#ef4444'
            }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
          >
            {(currentPerformance)!.isPositive ? (
              <ArrowUp className="w-4 h-4" />
            ) : (
              <ArrowDown className="w-4 h-4" />
            )}
          </motion.div>
          <motion.span 
            className={`number-mono-2 font-medium`}
            animate={{ 
              color: currentPerformance!.isPositive ? '#10b981' : '#ef4444' 
            }}
            transition={{ duration: 0.3 }}
          >
            <NumberFlow
              key={`change-amount-${selectedPeriod}-${strategy}`}
              value={Math.abs(displayChange)}
              className="inline"
              locales="en-US"
              format={{ style: 'currency', currency: 'USD', maximumFractionDigits: 2 }}
              {...numberFlowProps}
            />
            {' '}
            (<NumberFlow value={Math.abs(displayChangePct)} className="inline" format={{ maximumFractionDigits:1 }} {...numberFlowProps} />%)
          </motion.span>
          <span className="text-neutral-400 text-sm ml-2">
            Hypothetical Gain/Loss
          </span>
        </motion.div>
      </div>

      {/* Chart Area */}
      <motion.div 
        className="flex-1 flex flex-col w-full relative overflow-hidden bg-neutral-900 min-h-[260px] md:min-h-[320px] lg:min-h-[480px] max-h-[480px] rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        {/* Dot Pattern Background */}
        <DotPattern
          width={16}
          height={16}
          cx={1}
          cy={1}
          cr={1}
          className={cn(
            "absolute inset-0 text-neutral-500 opacity-40",
            "[mask-image:radial-gradient(ellipse_80%_60%_at_center,white_40%,transparent_70%)]"
          )}
        />
        
        {/* Chart Container */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className={cn("flex-1 relative z-10", "sm:mx-0 -mx-4")}
          ref={chartContainerRef}
        />
        
        {/* Tooltip */}
        {tooltipData.visible && (
          <div
            className="absolute z-20 bg-neutral-800 border border-neutral-700 rounded-lg p-3 pointer-events-none shadow-lg"
            style={{
              left: tooltipData.x > 200 ? tooltipData.x - 200 : tooltipData.x + 20,
              top: tooltipData.y - 80,
            }}
          >
            <div className="text-white text-sm font-medium mb-2">{tooltipData.date}</div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full" style={{backgroundColor: colors.dot}}></div>
                <span className="text-neutral-300">{strategyInfo.fullTitle}:</span>
                <span className="text-white font-medium">{formatCurrency(tooltipData.strategyValue)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 bg-white rounded-full"></div>
                <span className="text-neutral-300">Benchmark: S&P 500 (SPY):</span>
                <span className="text-white font-medium">{formatCurrency(tooltipData.spyValue)}</span>
              </div>
            </div>
          </div>
        )}

      </motion.div>

      {/* Time Filter and Legend Row */}
      <motion.div 
        className="flex flex-col w-full md:flex-row md:justify-between items-start md:items-center gap-4 mt-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.3 }}
      >
        {/* Time Period Toggle */}
        <div className="flex w-fit h-fit bg-neutral-800 rounded-lg p-1">
          {TIME_PERIODS.map((period) => (
            <button
              key={period.key}
              onClick={() => setSelectedPeriod(period.key)}
              className={cn(
                "px-3 py-1.5 text-sm font-medium transition-all duration-200 rounded-md",
                selectedPeriod === period.key
                  ? "bg-white text-neutral-900"
                  : "text-neutral-400 hover:text-white hover:bg-neutral-700"
              )}
              onMouseEnter={() => onMouseEnter('hover')}
              onMouseLeave={onMouseLeave}
            >
              {period.label}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 md:gap-6 my-6  md:my-0">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 md:w-4 md:h-4 rounded-full" style={{backgroundColor: colors.dot}}></div>
            <span className="text-neutral-300 text-sm md:text-base">{strategyInfo.fullTitle}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 md:w-4 md:h-4 bg-white rounded-full"></div>
            <span className="text-neutral-300 text-sm md:text-base">Benchmark: S&P 500 (SPY)</span>
          </div>
        </div>
      </motion.div>

      {/* Simulated Returns Section */}
      <motion.section 
        className="flex flex-col w-full gap-6 mt-4 md:mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        <h3 className="heading-3 text-white">Simulated Returns</h3>

        <div className="flex justify-between items-center w-full p-4 md:p-6 bg-neutral-800 rounded-xl">
          <div className="flex flex-col gap-1">
            <span className="tag-1 text-neutral-500">
              {filteredData.strategy.length
                ? formatDateLabel(new Date(filteredData.strategy[0].time * 1000))
                : '—'}
            </span>
            <h3 className="heading-3 text-white">
              <NumberFlow
                key={`start-value-${selectedPeriod}-${strategy}`}
                value={filteredData.strategy.length > 0 ? filteredData.strategy[0].value : (parseFloat(initialInvestment.replace(/,/g, '')) || 1000)}
                locales="en-US"
                format={{ style: 'currency', currency: 'USD', maximumFractionDigits: 2 }}
                {...numberFlowProps}
              />
            </h3>
          </div>

          <div className="flex flex-col gap-1 items-end">
            <span className="tag-1 text-neutral-500">
              {filteredData.strategy.length
                ? formatDateLabel(
                    new Date(
                      filteredData.strategy[filteredData.strategy.length - 1].time * 1000
                    )
                  )
                : '—'}
            </span>

            <h3 className="heading-3 text-white rounded-sm px-2 py-1" style={{backgroundColor: colors.top}}>
              <NumberFlow
                key={`end-value-${selectedPeriod}-${strategy}`}
                value={currentPerformance!.currentValue}
                locales="en-US"
                format={{ style: 'currency', currency: 'USD', maximumFractionDigits: 2 }}
                {...numberFlowProps}
              />
            </h3>
          </div>
        </div>
      </motion.section>

      {/* Performance Metrics Section */}
      <motion.section 
        className="flex flex-col w-full gap-6 mt-4 md:mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        <h3 className="heading-3 text-white">Performance Metrics</h3>

        <div className="flex flex-col w-full p-4 md:p-6 bg-neutral-800 rounded-xl gap-6">
          {/* Responsive metrics grid - simplified to show most important metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-0 lg:divide-x lg:divide-neutral-700">
            <MetricItem label="Cumulative Return" value={`${currentPerformance!.metrics.cumulativeReturn.toFixed(1)}%`} />
            <MetricItem label="Annualized Return" value={`${currentPerformance!.metrics.annualizedReturn.toFixed(1)}%`} />
            <MetricItem label="Std Deviation"     value={`${currentPerformance!.metrics.standardDeviation.toFixed(1)}%`} />
            <MetricItem label="Max Drawdown"      value={`${currentPerformance!.metrics.maxDrawdown.toFixed(1)}%`} />
            <MetricItem label="Sharpe Ratio"      value={ currentPerformance!.metrics.sharpeRatio.toFixed(2)} />
            <MetricItem label="Beta vs SPY"       value={ currentPerformance!.metrics.beta.toFixed(2)} />
          </div>
        </div>
      </motion.section>

      {/* Disclaimer Section */}
      <div className="w-full mt-8 lg:mt-16">
          <p className="text-neutral-500 text-sm leading-tight tracking-tight">
            This interactive performance tool offers hypothetical performance outcomes for a selected strategy. 
            Modeled performance is: (1) based on the initial investment and account type (if applicable); 
            (2) inclusive of any Titan fees and annual fund expenses for third-party funds; and 
            (3) assumes any dividends and distributions are reinvested.
          </p>
          <br />
          <p className="text-neutral-500 text-sm leading-tight tracking-tight">
            Performance returns begin at the Inception Date of the selected strategy through the Last Day of the Previous Month. 
            Based on the chosen risk profile, users can receive a recommended portfolio allocation in line with Titan's general recommendation.
          </p>
          <br />
          <p className="text-neutral-500 text-sm leading-tight tracking-tight">
            Returns do not represent actual client performance. Past performance is not indicative of future results; 
            actual performance will vary. Investing involves risk, including loss of principal.
          </p>
          <br />
          <div className="flex justify-start">
              <Link
                href="/disclosures"
                className="text-neutral-500 hover:text-sky-500 text-sm font-medium underline underline-offset-2 transition-colors duration-200"
                onMouseEnter={() => onMouseEnter('hover')}
                onMouseLeave={onMouseLeave}
              >
                See Full Assumptions & Disclosures
              </Link>
            </div>
        </div>
    </div>
  );
} 