"use client";

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

// Strategy details data
export const strategyDetails = {
  'Luthor - Flagship (US Stocks)': {
    name: 'Luthor',
    fullTitle: 'Luthor - Flagship (US Stocks)',
    description: "Luthor is Ada Analytics' flagship equity strategy—an AI-driven portfolio engine that fuses real-time congressional trading disclosures, insider 13F filings, and social sentiment signals into a single dynamic market view. By weighting positions according to the strength, recency, and alignment of influential activity, Luthor seeks to front-run shifts in institutional conviction while damping headline noise through adaptive risk controls. In short: it doesn't just trade—it strategizes.",
    dataSources: [
      { name: 'Reddit.com', icon: '🔴' },
      { name: 'U.S Securities and Exchange Commission', icon: '🏛️' },
      { name: 'QuiverQuant', icon: '📊' },
      { name: 'X.com', icon: '❌' },
      { name: 'Google Trends', icon: '📈' }
    ]
  },
  'Lex - Defensive Strategy': {
    name: 'Lex',
    fullTitle: 'Lex - Defensive Strategy',
    description: "Lex is Ada Analytics' defensive equity strategy—a risk-first portfolio engine designed for capital preservation and steady growth. By analyzing volatility patterns, credit spreads, and macro-economic indicators, Lex identifies undervalued dividend aristocrats and quality companies with strong balance sheets. The strategy employs dynamic hedging techniques and sector rotation to weather market downturns while capturing upside during stable periods. Think of it as your portfolio's insurance policy that actually pays dividends.",
    dataSources: [
      { name: 'Federal Reserve Economic Data', icon: '🏦' },
      { name: 'Bloomberg Terminal', icon: '💹' },
      { name: 'S&P Global Market Intelligence', icon: '📊' },
      { name: 'Morningstar Direct', icon: '⭐' },
      { name: 'CBOE Volatility Index', icon: '📉' }
    ]
  },
  'Clark - Growth Strategy': {
    name: 'Clark',
    fullTitle: 'Clark - Growth Strategy',
    description: "Clark is Ada Analytics' high-growth equity strategy—an innovation-focused portfolio engine that targets disruptive companies and emerging technologies. By monitoring patent filings, venture capital flows, startup accelerator programs, and technological breakthrough signals, Clark identifies tomorrow's market leaders before they become household names. The strategy emphasizes companies with exponential revenue growth potential, strong moats, and visionary leadership teams. It's not just about finding growth—it's about finding the next Tesla.",
    dataSources: [
      { name: 'Crunchbase', icon: '🚀' },
      { name: 'PitchBook', icon: '💰' },
      { name: 'IEEE Xplore', icon: '🔬' },
      { name: 'AngelList', icon: '👼' },
      { name: 'Product Hunt', icon: '🎯' }
    ]
  },
  'Diana - International Strategy': {
    name: 'Diana',
    fullTitle: 'Diana - International Strategy',
    description: "Diana is Ada Analytics' global equity strategy—a geographically diversified portfolio engine that capitalizes on international market inefficiencies and cross-border opportunities. By analyzing currency flows, sovereign risk indicators, international trade data, and regional economic cycles, Diana identifies undervalued markets and companies poised to benefit from global trends. The strategy provides exposure to emerging markets, developed international markets, and currency hedging to optimize risk-adjusted returns across time zones.",
    dataSources: [
      { name: 'International Monetary Fund', icon: '🌍' },
      { name: 'World Bank Data', icon: '🏛️' },
      { name: 'MSCI Global Indices', icon: '🌐' },
      { name: 'Trading Economics', icon: '📊' },
      { name: 'OECD Data', icon: '🏢' }
    ]
  }
};

interface StrategyCardProps {
  strategy: string;
}

export function StrategyCard({ strategy }: StrategyCardProps) {
  const strategyInfo = strategyDetails[strategy as keyof typeof strategyDetails];
  
  if (!strategyInfo) return null;

  return (
    <div className="bg-neutral-800 rounded-xl p-4 md:p-6 w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={strategy} // This ensures the component re-animates when strategy changes
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ 
            duration: 0.3,
            ease: "easeInOut"
          }}
          className="space-y-6"
        >
          {/* Strategy Header with Icon */}
          <div className="flex items-center gap-4">
            <motion.div 
              className="w-12 h-12 max-w-12 max-h-12 bg-gradient-to-br from-purple-400 to-blue-400 rounded-md flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-lg">💎</span>
            </motion.div>
            <motion.h3 
              className="text-white text-xl font-semibold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.2 }}
            >
              {strategyInfo.fullTitle}
            </motion.h3>
          </div>

          {/* Strategy Description */}
          <motion.p 
            className="text-neutral-300 text-sm leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.25 }}
          >
            {strategyInfo.description}
          </motion.p>

          {/* Data Sources */}
          <div>
            <motion.h4 
              className="text-neutral-400 text-xs font-medium mb-3 uppercase tracking-wider"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.2 }}
            >
              Data Sources
            </motion.h4>
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.25 }}
            >
              {strategyInfo.dataSources.map((source, index) => (
                <motion.div
                  key={`${strategy}-${source.name}`} // Unique key including strategy
                  className="flex items-center gap-3 text-sm text-neutral-400"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    delay: 0.3 + (index * 0.05), 
                    duration: 0.2,
                    ease: "easeOut"
                  }}
                >
                  <span className="text-base">{source.icon}</span>
                  <span>{source.name}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
} 