"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import { Landmark, BarChart3, Percent, TestTube2 } from "lucide-react";
import { useCursor } from "@/components/cursor-context";

interface CardData {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  description: string;
  color: string;
  iconColor: string;
}

const cardData: CardData[] = [
  {
    icon: Landmark,
    title: "Ada is the brokerage",
    description: "Fully automated trading execution, end-to-end. Create and fund your account in the app.",
    color: "rgb(20, 184, 166)", // teal-500
    iconColor: "text-teal-500"
  },
  {
    icon: BarChart3,
    title: "Back-tested",
    description: "See decade-deep performance stats before you commit, proving the strategy's rigor.",
    color: "rgb(56, 189, 248)", // sky-500
    iconColor: "text-sky-500"
  },
  {
    icon: Percent,
    title: "Low Fee",
    description: "Trade directly through Ada for a flat 0.2% fee, with zero hidden charges.",
    color: "rgb(59, 130, 246)", // blue-500
    iconColor: "text-blue-500"
  },
  {
    icon: TestTube2,
    title: "Research Edge",
    description: "In-house quant and fundamental teams continuously refine models so you benefit from the latest insights.",
    color: "rgb(147, 51, 234)", // purple-500
    iconColor: "text-purple-500"
  }
];

interface WhyAdaCardProps {
  data: CardData;
  index: number;
  isActive: boolean;
  isMobileOrTablet: boolean;
  onCardClick: (index: number) => void;
}

const WhyAdaCard: React.FC<WhyAdaCardProps> = ({ data, index, isActive, isMobileOrTablet, onCardClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { setCursorState, setCursorText } = useCursor();

  const handleMouseEnter = () => {
    if (!isMobileOrTablet) {
      setIsHovered(true);
      setCursorState('hover');
      setCursorText('View');
    }
  };

  const handleMouseLeave = () => {
    if (!isMobileOrTablet) {
      setIsHovered(false);
      setCursorState('default');
      setCursorText('');
    }
  };

  // Only the flicker/active state animates for the active card on mobile
  const shouldShowHoverState = isMobileOrTablet ? isActive : isHovered;

  const IconComponent = data.icon;

  return (
    <motion.div
      className={cn(
        "relative group cursor-pointer border border-neutral-700 overflow-hidden flex flex-col items-center justify-center transition-all duration-300",
        // Consistent height and padding for all breakpoints
        "h-[242px] md:h-[320px] lg:h-[500px] p-4 md:p-6",
        // Consistent gap between icon and text
        "gap-3 md:gap-4"
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => isMobileOrTablet && onCardClick(index)}
    >
      {/* Flickering Grid */}
      <motion.div 
        className="absolute top-0 left-[-4px] right-[-4px] bottom-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: shouldShowHoverState ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <FlickeringGrid
          squareSize={2}
          gridGap={4}
          flickerChance={0.18}
          color={data.color}
          maxOpacity={0.8}
          width={undefined}
          height={undefined}
          className="w-full h-full"
        />
      </motion.div>

      {/* Clerk-style Radial Gradient Overlay */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(85% 75% at 50% 60%, rgba(0, 0, 0, 0.5) 40%, rgba(0, 0, 0, 0) 100%)'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: shouldShowHoverState ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Bottom Gradient Overlay */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-20 md:h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 64%, transparent 100%)'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: shouldShowHoverState ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Content Container */}
      <div className="relative z-20 flex flex-col items-center justify-center w-full h-full gap-2 md:gap-4">
        {/* Icon */}
        <motion.div 
          className="flex items-center justify-center mb-2"
          animate={{
            scale: shouldShowHoverState ? 0.96 : 1, 
            y: shouldShowHoverState ? -8 : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          <IconComponent 
            size={isMobileOrTablet ? 36 : 56} 
            className={cn(
              "transition-colors duration-300",
              shouldShowHoverState ? data.iconColor : (isMobileOrTablet ? "text-white" : "text-neutral-500")
            )} 
          />
        </motion.div>

        {/* Text Content (always visible, just smaller on mobile) */}
        <div className="text-center flex flex-col items-center justify-center w-full">
          <h3 className={cn(
            "font-semibold leading-tight text-white",
            isMobileOrTablet ? "text-base" : "text-lg md:text-xl",
            "mb-1"
          )}>
            {data.title}
          </h3>
          <p className={cn(
            "subtitle-1 w-full text-center text-neutral-300",
            isMobileOrTablet ? "text-xs max-w-[264px]" : "text-sm max-w-[324px]"
          )}>
            {data.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default function WhyAdaCards() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);

  // Track viewport width to determine mobile/tablet state
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobileOrTablet(window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Automatically cycle the active card every 4 seconds on mobile/tablet
  useEffect(() => {
    if (!isMobileOrTablet) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % cardData.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isMobileOrTablet]);

  const handleCardClick = (index: number) => {
    if (isMobileOrTablet) {
      setActiveIndex(index);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full">
      {cardData.map((card, index) => (
        <WhyAdaCard
          key={index}
          data={card}
          index={index}
          isActive={index === activeIndex}
          isMobileOrTablet={isMobileOrTablet}
          onCardClick={handleCardClick}
        />
      ))}
    </div>
  );
} 