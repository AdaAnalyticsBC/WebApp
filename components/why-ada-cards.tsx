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
}

const WhyAdaCard: React.FC<WhyAdaCardProps> = ({ data }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);
  const { setCursorState, setCursorText } = useCursor();

  // Check if device is mobile/tablet (hover state default for touch devices)
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobileOrTablet(window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

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

  // For mobile/tablet, always show hover state
  const shouldShowHoverState = isMobileOrTablet || isHovered;

  const IconComponent = data.icon;

  return (
    <motion.div
      className="relative group cursor-pointer h-[320px] lg:h-[500px] border border-neutral-700 overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 64%, transparent 100%)'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: shouldShowHoverState ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Content Container */}
      <div className="relative z-20 h-full flex flex-col items-center justify-start lg:justify-center p-3 pt-22 lg:p-8">
        {/* Icon */}
        <motion.div 
          className="flex items-center justify-start"
          animate={{
            scale: shouldShowHoverState ? 0.8 : 1, 
            y: shouldShowHoverState ? -30 : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          <IconComponent 
            size={isMobileOrTablet ? 56 : 80} 
            className={cn(
              "transition-colors duration-300",
              shouldShowHoverState ? data.iconColor : "text-neutral-500"
            )} 
          />
        </motion.div>

        {/* Text Content */}
        <motion.div 
          className="text-center space-y-3 flex flex-col items-center justify-start"
          initial={{ opacity: 0 }}
          animate={{ opacity: shouldShowHoverState ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="heading-4 text-white text-lg lg:text-xl font-semibold leading-tight">
            {data.title}
          </h3>
          <p className="subtitle-1 w-full text-center max-w-[300px]">
            {data.description}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default function WhyAdaCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full">
      {cardData.map((card, index) => (
        <WhyAdaCard key={index} data={card} index={index} />
      ))}
    </div>
  );
} 