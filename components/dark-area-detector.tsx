'use client';

import React, { useEffect, useRef } from 'react';
import { useCursor } from './cursor-context';

export const DarkAreaDetector: React.FC<{ 
  children: React.ReactNode;
  isDark?: boolean;
}> = ({ children, isDark = false }) => {
  const { setIsOnDarkBackground } = useCursor();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseEnter = () => {
      setIsOnDarkBackground(isDark);
    };

    const handleMouseLeave = () => {
      setIsOnDarkBackground(false);
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isDark, setIsOnDarkBackground]);

  return (
    <div ref={ref} className="contents">
      {children}
    </div>
  );
};

// Hook to easily mark dark areas
export const useDarkArea = (isDark: boolean = true) => {
  const { setIsOnDarkBackground } = useCursor();

  const onMouseEnter = () => {
    setIsOnDarkBackground(isDark);
  };

  const onMouseLeave = () => {
    setIsOnDarkBackground(false);
  };

  return { onMouseEnter, onMouseLeave };
}; 