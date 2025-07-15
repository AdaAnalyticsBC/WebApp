'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type CursorState = 'default' | 'hover' | 'drag' | 'move';

interface CursorContextType {
  cursorState: CursorState;
  setCursorState: (state: CursorState) => void;
  cursorText: string;
  setCursorText: (text: string) => void;
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
  isOnDarkBackground: boolean;
  setIsOnDarkBackground: (dark: boolean) => void;
  customRingColor: string | null;
  setCustomRingColor: (color: string | null) => void;
  isPressed: boolean;
  setIsPressed: (pressed: boolean) => void;
  isDarkButton: boolean;
  setIsDarkButton: (dark: boolean) => void;
}

const CursorContext = createContext<CursorContextType | undefined>(undefined);

export const useCursor = () => {
  const context = useContext(CursorContext);
  if (!context) {
    throw new Error('useCursor must be used within a CursorProvider');
  }
  return context;
};

interface CursorProviderProps {
  children: ReactNode;
}

export const CursorProvider: React.FC<CursorProviderProps> = ({ children }) => {
  const [cursorState, setCursorState] = useState<CursorState>('default');
  const [cursorText, setCursorText] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isOnDarkBackground, setIsOnDarkBackground] = useState<boolean>(false);
  const [customRingColor, setCustomRingColor] = useState<string | null>(null);
  const [isPressed, setIsPressed] = useState<boolean>(false);
  const [isDarkButton, setIsDarkButton] = useState<boolean>(false);

  const value = {
    cursorState,
    setCursorState,
    cursorText,
    setCursorText,
    isDragging,
    setIsDragging,
    isOnDarkBackground,
    setIsOnDarkBackground,
    customRingColor,
    setCustomRingColor,
    isPressed,
    setIsPressed,
    isDarkButton,
    setIsDarkButton,
  };

  return (
    <CursorContext.Provider value={value}>
      {children}
    </CursorContext.Provider>
  );
}; 