"use client"

import { useEffect, useState, useRef, useCallback } from "react";

export default function WhyAdaNumbers() {
  const [tradingVolume, setTradingVolume] = useState(0);
  const [ordersExecuted, setOrdersExecuted] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  // Optimized intersection observer with debounced callback
  useEffect(() => {
    const currentRef = containerRef.current;
    if (!currentRef) return;

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

    observer.observe(currentRef);

    return () => {
      observer.disconnect();
    };
  }, [isVisible]);

  // Optimized animation with single RAF loop
  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const targetTrading = 12000000;
    const targetOrders = 500000;
    const startTime = performance.now();

    // More efficient easing function
    const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5);

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuint(progress);

      // Batch state updates to prevent multiple renders
      const currentTrading = Math.floor(targetTrading * easedProgress);
      const currentOrders = Math.floor(targetOrders * easedProgress);

      setTradingVolume(currentTrading);
      setOrdersExecuted(currentOrders);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        animationRef.current = null;
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isVisible]);

  // Optimized number formatting functions
  const formatTradingVolume = useCallback((value: number) => {
    if (value >= 1000000) {
      const millions = value / 1000000;
      return `$${millions.toFixed(1)}M+`;
    }
    return `$${value.toLocaleString()}+`;
  }, []);

  const formatOrdersExecuted = useCallback((value: number) => {
    if (value >= 1000) {
      const thousands = value / 1000;
      return `${thousands.toFixed(0)}K+`;
    }
    return `${value.toLocaleString()}+`;
  }, []);

  return (
    <div 
      ref={containerRef}
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