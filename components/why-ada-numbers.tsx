"use client"

export default function WhyAdaNumbers() {
  // Static values without animations for better performance
  const tradingVolume = 12000000; // $12.0M+
  const ordersExecuted = 500000;  // 500K+

  // Optimized number formatting functions
  const formatTradingVolume = (value: number) => {
    if (value >= 1000000) {
      const millions = value / 1000000;
      return `$${millions.toFixed(1)}M+`;
    }
    return `$${value.toLocaleString()}+`;
  };

  const formatOrdersExecuted = (value: number) => {
    if (value >= 1000) {
      const thousands = value / 1000;
      return `${thousands.toFixed(0)}K+`;
    }
    return `${value.toLocaleString()}+`;
  };

  return (
    <div 
      className="flex flex-col md:flex-row w-fit items-center justify-center gap-6 md:gap-0"
    >
      {/* TRADING VOLUME */}
      <div className="flex flex-col items-center gap-2 lg:gap-3 min-w-[140px] lg:min-w-[180px] w-full lg:w-auto">
        <span className="tag-1 text-neutral-500 text-end md:text-center w-full text-base lg:text-sm tracking-wide">TRADING VOLUME</span>
        <span className="number-mono text-white block w-full min-w-[5ch] max-w-full text-3xl lg:text-4xl xl:text-5xl text-end md:text-center font-medium">
          {formatTradingVolume(tradingVolume)}
        </span>
      </div>
      {/* ORDERS EXECUTED */}
      <div className="flex flex-col items-center gap-2 lg:gap-3 min-w-[140px] lg:min-w-[180px] w-full lg:w-auto">
        <span className="tag-1 text-neutral-500 text-end md:text-center w-full text-base lg:text-sm tracking-wide">ORDERS EXECUTED</span>
        <span className="number-mono text-white block w-full min-w-[5ch] max-w-full text-3xl lg:text-4xl xl:text-5xl text-end md:text-center font-medium">
          {formatOrdersExecuted(ordersExecuted)}
        </span>
      </div>
    </div>
  );
} 