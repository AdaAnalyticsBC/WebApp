"use client";

import React, { useMemo } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import NumberFlow from "@number-flow/react";
import { motion } from 'motion/react';
import { strategyDetails } from './strategy-card';
import { DotPattern } from './magicui/dot-pattern';
import { cn } from "@/lib/utils";
import { useCursorHover } from './custom-cursor';
import Link from 'next/link';

// Time series data for charts (5 years of monthly data)
export const generateTimeSeriesData = (strategy: string, initialValue: number = 1000) => {
  const startDate = new Date('2020-01-01');
  const endDate = new Date('2024-12-31');
  const data = [];
  
  // Base growth parameters for each strategy
  const strategyParams = {
    'Luthor - Flagship (US Stocks)': { 
      baseGrowth: 0.025, volatility: 0.08, trendStrength: 1.2 
    },
    'Lex - Defensive Strategy': { 
      baseGrowth: 0.008, volatility: 0.03, trendStrength: 0.6 
    },
    'Clark - Growth Strategy': { 
      baseGrowth: 0.035, volatility: 0.12, trendStrength: 1.8 
    },
    'Diana - International Strategy': { 
      baseGrowth: 0.015, volatility: 0.06, trendStrength: 0.9 
    }
  };

  const params = strategyParams[strategy as keyof typeof strategyParams];
  let currentValue = initialValue;
  let currentDate = new Date(startDate);

  // Generate monthly data points
  while (currentDate <= endDate) {
    // Add some realistic market movements
    const monthsElapsed = (currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
    const baseReturn = params.baseGrowth * (1 + Math.sin(monthsElapsed * 0.1) * 0.3);
    const volatilityReturn = (Math.random() - 0.5) * params.volatility;
    const trendReturn = baseReturn * params.trendStrength;
    
    currentValue *= (1 + trendReturn + volatilityReturn);
    
    data.push({
      time: currentDate.toISOString().split('T')[0],
      value: parseFloat(currentValue.toFixed(2))
    });

    // Move to next month
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  return data;
};

// Generate SPY comparison data (more conservative baseline)
export const generateSPYData = (initialValue: number = 1000) => {
  const startDate = new Date('2020-01-01');
  const endDate = new Date('2024-12-31');
  const data = [];
  
  let currentValue = initialValue;
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const monthsElapsed = (currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
    // SPY historical average ~10% annually, with realistic volatility
    const baseReturn = 0.008; // ~10% annually
    const volatilityReturn = (Math.random() - 0.5) * 0.04;
    const cyclicalReturn = Math.sin(monthsElapsed * 0.05) * 0.002;
    
    currentValue *= (1 + baseReturn + volatilityReturn + cyclicalReturn);
    
    data.push({
      time: currentDate.toISOString().split('T')[0],
      value: parseFloat(currentValue.toFixed(2))
    });

    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  return data;
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
  const strategyInfo = strategyDetails[strategy as keyof typeof strategyDetails];
  const basePerformance = basePerformanceData[strategy as keyof typeof basePerformanceData];
  const { onMouseEnter, onMouseLeave } = useCursorHover();
  
  // Calculate scaled performance based on initial investment
  const scaledPerformance = useMemo(() => {
    if (!basePerformance) return null;
    
    // Parse initial investment (remove commas and convert to number)
    const investmentAmount = parseFloat(initialInvestment.replace(/,/g, '')) || 1000;
    const baseAmount = 1000; // Base amount for our calculations
    const scaleFactor = investmentAmount / baseAmount;
    
    return {
      currentValue: basePerformance.currentValue * scaleFactor,
      change: basePerformance.change * scaleFactor,
      changePercent: basePerformance.changePercent,
      isPositive: basePerformance.isPositive,
      metrics: basePerformance.metrics
    };
  }, [basePerformance, initialInvestment]);

  // Generate chart data
  const chartData = useMemo(() => {
    const investmentAmount = parseFloat(initialInvestment.replace(/,/g, '')) || 1000;
    return {
      strategy: generateTimeSeriesData(strategy, investmentAmount),
      spy: generateSPYData(investmentAmount)
    };
  }, [strategy, initialInvestment]);
  
  if (!strategyInfo || !scaledPerformance) return null;

  return (
    <div className="w-full h-full flex flex-col">
      {/* Performance Display */}
      <div className="mb-2 md:mb-4">
        {/* Strategy Header */}
        <motion.div 
          className="flex items-center gap-4 mb-2 md:mb-4"
          key={`header-${strategy}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <motion.div 
            className="w-12 h-12 max-w-12 max-h-12 bg-gradient-to-br from-purple-400 to-blue-400 rounded-md flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <span className="text-lg">💎</span>
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

        {/* Performance Value - Persistent NumberFlow */}
        <div className="mb-2">
          <div className="flex items-baseline gap-1">
            <span className="text-white text-2xl">$</span>
            <NumberFlow
              value={scaledPerformance.currentValue}
              className="number-mono text-white text-3xl lg:text-4xl xl:text-5xl font-medium"
              locales="en-US"
              format={{ maximumFractionDigits: 2, minimumFractionDigits: 2 }}
            />
          </div>
        </div>

        {/* Change Display - Persistent with animated color changes */}
        <motion.div 
          className="flex items-center gap-2"
          animate={{ 
            color: scaledPerformance.isPositive ? '#10b981' : '#ef4444' 
          }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            animate={{ 
              rotate: scaledPerformance.isPositive ? 0 : 180,
              color: scaledPerformance.isPositive ? '#10b981' : '#ef4444'
            }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
          >
            {scaledPerformance.isPositive ? (
              <ArrowUp className="w-4 h-4" />
            ) : (
              <ArrowDown className="w-4 h-4" />
            )}
          </motion.div>
          <motion.span 
            className={`number-mono-2 font-medium`}
            animate={{ 
              color: scaledPerformance.isPositive ? '#10b981' : '#ef4444' 
            }}
            transition={{ duration: 0.3 }}
          >
            <NumberFlow
              value={Math.abs(scaledPerformance.change)}
              className="inline"
              locales="en-US"
              format={{ style: 'currency', currency: 'USD', maximumFractionDigits: 2 }}
            />
            {' '}
            ({scaledPerformance.isPositive ? '+' : ''}{scaledPerformance.changePercent}%)
          </motion.span>
          <span className="text-neutral-400 text-sm ml-2">
            Hypothetical Gain/Loss
          </span>
        </motion.div>
      </div>

      {/* Chart Area with Dot Pattern Background */}
      <motion.div 
        className="flex-1 flex items-center justify-center relative overflow-hidden bg-neutral-900 min-h-[260px] md:min-h-[320px] lg:min-h-[480px] max-h-[480px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <DotPattern
          width={16}
          height={16}
          cx={1}
          cy={1}
          cr={1}
          className={cn(
            "text-neutral-500 opacity-60",
            "[mask-image:radial-gradient(ellipse_80%_60%_at_center,white_40%,transparent_70%)]"
          )}
        />
        <motion.div 
          className="text-neutral-600 text-center relative z-10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          <div className="text-lg mb-2">📊</div>
          <p className="text-sm mb-1">Lightweight Chart Integration Ready</p>
          <p className="text-xs text-neutral-700">
            {chartData.strategy.length} data points • Area + Line series
          </p>
        </motion.div>
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
            <span className="tag-1 text-neutral-500">2020</span>
            <h3 className="heading-3 text-white">
              <NumberFlow
                value={parseFloat(initialInvestment.replace(/,/g, '')) || 1000}
                locales="en-US"
                format={{ style: 'currency', currency: 'USD', maximumFractionDigits: 2 }}
              />
            </h3>
          </div>

          <div className="flex flex-col gap-1 items-end">
            <span className="tag-1 text-neutral-500">2025</span>

            <h3 className="heading-3 text-white bg-sky-500/30 rounded-sm px-2 py-1">
              <NumberFlow
                value={scaledPerformance.currentValue}
                locales="en-US"
                format={{ style: 'currency', currency: 'USD', maximumFractionDigits: 2 }}
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
          {/* Responsive metrics grid - wraps on smaller screens */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-0 lg:divide-x lg:divide-neutral-700">
            <MetricItem 
              label="Cumulative Return" 
              value={`${scaledPerformance.metrics.cumulativeReturn.toFixed(1)}%`} 
            />
            <MetricItem 
              label="Annualized Return" 
              value={`${scaledPerformance.metrics.annualizedReturn.toFixed(1)}%`} 
            />
            <MetricItem 
              label="Max Drawdown" 
              value={`${scaledPerformance.metrics.maxDrawdown.toFixed(1)}%`} 
            />
            <MetricItem 
              label="Sharpe Ratio" 
              value={scaledPerformance.metrics.sharpeRatio.toFixed(2)} 
            />
            <MetricItem 
              label="Standard Deviation" 
              value={`${scaledPerformance.metrics.standardDeviation.toFixed(1)}%`} 
            />
            <MetricItem 
              label="Alpha" 
              value={scaledPerformance.metrics.alpha.toFixed(2)} 
            />
          </div>

          {/* Beta - separate row for better spacing */}
          <div className="pt-2 border-t border-neutral-700">
            <MetricItem 
              label="Beta vs SPY" 
              value={scaledPerformance.metrics.beta.toFixed(2)} 
            />
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