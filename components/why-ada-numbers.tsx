"use client"

import NumberFlow from "@number-flow/react";
import { useEffect, useState, useRef } from "react";

export default function WhyAdaNumbers() {
  const [tradingVolume, setTradingVolume] = useState(0);
  const [ordersExecuted, setOrdersExecuted] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -20px 0px"
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000; // 2 seconds for smooth animation
    const targetTrading = 12000000; // 12M
    const targetOrders = 500000; // 500K
    const startTime = performance.now();

    // Smooth easing function (ease-out cubic)
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);

      // Ensure we start from 0 and animate to target
      const currentTrading = Math.floor(targetTrading * easedProgress);
      const currentOrders = Math.floor(targetOrders * easedProgress);

      setTradingVolume(currentTrading);
      setOrdersExecuted(currentOrders);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    // Start the animation
    requestAnimationFrame(animate);
  }, [isVisible]);

  return (
    <div 
      ref={containerRef}
      className="flex flex-col md:flex-row w-fit items-center justify-center gap-6 md:gap-0"
    >
      {/* TRADING VOLUME */}
      <div className="flex flex-col items-center gap-2 lg:gap-3 min-w-[140px] lg:min-w-[180px] w-full lg:w-auto">
        <span className="tag-1 text-neutral-500 text-end md:text-center w-full text-base lg:text-sm tracking-wide">TRADING VOLUME</span>
        <span className="number-mono text-white block w-full min-w-[5ch] max-w-full text-3xl lg:text-4xl xl:text-5xl text-end md:text-center font-medium">
          <NumberFlow
            value={tradingVolume}
            locales="en-US"
            format={{ notation: 'compact', style: 'currency', currency: 'USD', maximumFractionDigits: 1, trailingZeroDisplay: 'stripIfInteger' }}
            suffix="+"
            className="inline"
            style={{ '--number-flow-mask-height': '0em' } as any}
          />
        </span>
      </div>
      {/* ORDERS EXECUTED */}
      <div className="flex flex-col items-center gap-2 lg:gap-3 min-w-[140px] lg:min-w-[180px] w-full lg:w-auto">
        <span className="tag-1 text-neutral-500 text-end md:text-center w-full text-base lg:text-sm tracking-wide">ORDERS EXECUTED</span>
        <span className="number-mono text-white block w-full min-w-[5ch] max-w-full text-3xl lg:text-4xl xl:text-5xl text-end md:text-center font-medium">
          <NumberFlow
            value={ordersExecuted}
            locales="en-US"
            format={{ notation: 'compact', maximumFractionDigits: 1, trailingZeroDisplay: 'stripIfInteger' }}
            suffix="+"
            className="inline"
            style={{ '--number-flow-mask-height': '0em' } as any}
          />
        </span>
      </div>
    </div>
  );
} 