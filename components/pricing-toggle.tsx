"use client";

import { motion } from "motion/react";
import { useCursorHover } from "./custom-cursor";

interface PricingToggleProps {
  isAnnual: boolean;
  onToggle: (isAnnual: boolean) => void;
}

export default function PricingToggle({ isAnnual, onToggle }: PricingToggleProps) {
  const { onMouseEnter, onMouseLeave } = useCursorHover();
  
  return (
    <div className="flex items-center gap-4">
      <span className={`text-sm font-medium ${!isAnnual ? 'text-white' : 'text-neutral-500'}`}>
        Monthly
      </span>
      
      <motion.button
        className="relative w-12 h-6 bg-neutral-700 rounded-full p-1 cursor-pointer"
        onClick={() => onToggle(!isAnnual)}
        whileTap={{ scale: 0.95 }}
        onMouseEnter={() => onMouseEnter('hover')}
        onMouseLeave={onMouseLeave}
      >
        <motion.div
          className="w-4 h-4 bg-sky-400 rounded-full"
          animate={{
            x: isAnnual ? 24 : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
        />
      </motion.button>
      
      <div className="flex items-center gap-2">
        <span className={`text-sm font-medium ${isAnnual ? 'text-sky-400' : 'text-neutral-500'}`}>
          Annual
        </span>
        <span className="text-xs bg-gradient-to-r from-sky-900/40 to-sky-800/40 text-sky-400 px-2 py-1 rounded-sm font-bold">
          -17%
        </span>
      </div>
    </div>
  );
} 