"use client";

import { useState } from "react";
import { motion } from "motion/react";
import NumberFlow from "@number-flow/react";
import { useCursorHover } from "./custom-cursor";

interface FeeCalculatorProps {
  isAnnual: boolean;
}

export default function FeeCalculator({ isAnnual }: FeeCalculatorProps) {
  const [investment, setInvestment] = useState(900000);
  const minInvestment = 1000;
  const maxInvestment = 1000000;
  const { onMouseEnter, onMouseLeave } = useCursorHover();

  // Calculate blended fee based on investment amount
  const calculateBlendedFee = (amount: number) => {
    const managementFee = 0.0012; // 0.12% annual
    const clientFee = isAnnual ? 250 : 300; // $250/year or $25/month * 12
    const totalFee = (amount * managementFee) + clientFee;
    return (totalFee / amount) * 100; // Convert to percentage
  };

  const blendedFee = calculateBlendedFee(investment);
  const sliderPercentage = ((investment - minInvestment) / (maxInvestment - minInvestment)) * 100;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-gradient-to-br from-sky-900/20 to-sky-800/20 border border-sky-400/30 rounded-2xl p-6 md:p-8 w-full h-fit lg:h-[600px] flex flex-col">
      <h3 className="heading-3 text-white mb-6">
        See How Your Blended Fee Decreases Based on Your Investment
      </h3>
      
      <div className="flex flex-col flex-1 gap-6">
        {/* Investment Amount with Horizontal Slider */}
        <div className="flex flex-col flex-shrink-0">
          <label className="block text-xs text-white uppercase tracking-wider mb-3">
            INVESTMENT
          </label>
          <div className="relative h-24 lg:h-32 bg-gradient-to-r from-sky-900/40 to-sky-800/40 border border-sky-400/20 rounded-lg overflow-hidden">
            {/* Bright blue section that moves left to right */}
            <motion.div
              className="absolute left-0 top-0 bottom-0 bg-sky-400 rounded-l-lg"
              style={{ width: `${sliderPercentage}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
            
            {/* Investment amount fixed in center */}
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
              <span className="text-2xl md:text-3xl font-mono text-white">
                {formatCurrency(investment)}
              </span>
            </div>
            
            {/* Invisible input for dragging */}
            <input
              type="range"
              min={minInvestment}
              max={maxInvestment}
              step={1000}
              value={investment}
              onChange={(e) => setInvestment(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
              onMouseEnter={() => onMouseEnter('drag', 'Drag')}
              onMouseLeave={onMouseLeave}
            />
          </div>
        </div>

        {/* Blended Fee Display - Takes remaining space */}
        <div className="flex flex-col flex-1 min-h-0">
          <label className="block text-xs text-white uppercase tracking-wider mb-3">
            BLENDED FEE
          </label>
          <div className="bg-gradient-to-r from-sky-900/40 to-sky-800/40 border border-sky-400/20 rounded-lg w-full flex items-center justify-center p-6 flex-1">
            <div className="text-center">
              <div className="flex items-baseline justify-center gap-1">
                <NumberFlow
                  value={blendedFee}
                  className="text-4xl md:text-5xl font-mono text-white"
                  format={{ maximumFractionDigits: 2, minimumFractionDigits: 2 }}
                />
                <span className="text-2xl text-white">%</span>
                <span className="text-sm text-neutral-400">/AUM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 