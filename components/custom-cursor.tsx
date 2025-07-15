'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCursor } from './cursor-context';

export const CustomCursor: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(true); // Start visible
  const { cursorState, cursorText, isDragging, isOnDarkBackground, customRingColor, isPressed, setIsPressed, isDarkButton } = useCursor();
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    const handleMouseDown = () => {
      setIsPressed(true);
    };

    const handleMouseUp = () => {
      setIsPressed(false);
    };

    // Use capture phase to ensure we catch events even when elements have user-select: none
    document.addEventListener('mousemove', updateMousePosition, { capture: true });
    document.addEventListener('mouseleave', handleMouseLeave, { capture: true });
    document.addEventListener('mouseenter', handleMouseEnter, { capture: true });
    document.addEventListener('mousedown', handleMouseDown, { capture: true });
    document.addEventListener('mouseup', handleMouseUp, { capture: true });

    return () => {
      document.removeEventListener('mousemove', updateMousePosition, { capture: true });
      document.removeEventListener('mouseleave', handleMouseLeave, { capture: true });
      document.removeEventListener('mouseenter', handleMouseEnter, { capture: true });
      document.removeEventListener('mousedown', handleMouseDown, { capture: true });
      document.removeEventListener('mouseup', handleMouseUp, { capture: true });
    };
  }, [setIsPressed]);

  // Hide default cursor and ensure our custom cursor works everywhere
  useEffect(() => {
    // Hide default cursor globally
    document.body.style.cursor = 'none';
    
    // Add global styles to ensure cursor works even on elements with user-select: none
    const style = document.createElement('style');
    style.textContent = `
      * {
        cursor: none !important;
      }
      *:hover {
        cursor: none !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.body.style.cursor = 'auto';
      if (style && document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  const getCursorSize = () => {
    switch (cursorState) {
      case 'hover':
        return 40;
      case 'drag':
        return 60;
      case 'move':
        return 80;
      default:
        return 12; // Simple 8x8 dot for default
    }
  };

  const getDotSize = () => {
    switch (cursorState) {
      case 'hover':
        return 6;
      case 'drag':
        return 8;
      case 'move':
        return 10;
      default:
        return 12; // Simple 8x8 dot for default
    }
  };

  const shouldShowText = cursorState === 'drag' || cursorState === 'move';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={cursorRef}
          className="fixed top-0 left-0 pointer-events-none z-[9999]"
          style={{
            left: mousePosition.x,
            top: mousePosition.y,
          }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ 
            opacity: 1, 
            scale: isPressed ? 0.8 : 1 
          }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: isPressed ? 0.1 : 0.2, ease: "easeOut" }}
        >
          {/* For default state, just show a simple dot */}
          {cursorState === 'default' ? (
            <motion.div
              className={`absolute rounded-full ${
                isOnDarkBackground || isDarkButton ? 'bg-white' : 'bg-black'
              }`}
              style={{
                width: getDotSize(),
                height: getDotSize(),
                left: -getDotSize() / 2,
                top: -getDotSize() / 2,
              }}
              initial={{ scale: 0.8, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          ) : (
            <>
              {/* Outer circle for hover/drag/move states */}
              <motion.div
                className={`absolute rounded-full border ${
                  !customRingColor && cursorState === 'drag' && cursorText === 'Drag' ? 'border-white' : 
                  !customRingColor ? 'border-sky-400' : ''
                }`}
                style={{
                  width: getCursorSize(),
                  height: getCursorSize(),
                  left: -getCursorSize() / 2,
                  top: -getCursorSize() / 2,
                  ...(customRingColor && { borderColor: customRingColor }),
                }}
                initial={{ scale: 0.8, opacity: 0.6 }}
                animate={{ 
                  scale: 1.2,
                  opacity: 1,
                  rotate: cursorState === 'move' ? 360 : 0
                }}
                transition={{ 
                  duration: 0.4, 
                  ease: "easeOut",
                  rotate: { duration: 2, repeat: cursorState === 'move' ? Infinity : 0, ease: "linear" }
                }}
              />

              {/* Inner dot for hover/drag/move states */}
              <motion.div
                className={`absolute rounded-full ${
                  isOnDarkBackground || isDarkButton ? 'bg-white' : 'bg-black'
                }`}
                style={{
                  width: getDotSize(),
                  height: getDotSize(),
                  left: -getDotSize() / 2,
                  top: -getDotSize() / 2,
                }}
                initial={{ scale: 1, opacity: 0.8 }}
                animate={{
                  scale: 1.5,
                  opacity: 1,
                }}
                transition={{ 
                  duration: 0.4, 
                  ease: "easeOut"
                }}
              />
            </>
          )}

          {/* Text for drag/move states */}
          <AnimatePresence>
            {shouldShowText && cursorText && (
              <motion.div
                className={`absolute text-sm font-medium whitespace-nowrap ${
                  isOnDarkBackground ? 'text-white' : 'text-black'
                }`}
                style={{
                  left: getCursorSize() / 2 + 12,
                  top: -8,
                }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                {cursorText}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Hook to easily add cursor hover effects to components
export const useCursorHover = () => {
  const { setCursorState, setCursorText, setCustomRingColor, setIsDarkButton } = useCursor();

  const onMouseEnter = (
    state: 'hover' | 'drag' | 'move' = 'hover', 
    text: string = '', 
    ringColor?: string,
    isDarkButton?: boolean
  ) => {
    setCursorState(state);
    setCursorText(text);
    if (ringColor) {
      setCustomRingColor(ringColor);
    }
    if (isDarkButton !== undefined) {
      setIsDarkButton(isDarkButton);
    }
  };

  const onMouseLeave = () => {
    setCursorState('default');
    setCursorText('');
    setCustomRingColor(null);
    setIsDarkButton(false);
  };

  return { onMouseEnter, onMouseLeave };
}; 