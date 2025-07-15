"use client";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, ChevronFirst } from "lucide-react";

export function HeroGlassCard() {
  return (
    <div
      className="relative z-10 flex flex-col items-center gap-2 px-4 py-4 md:px-8 mt-8 rounded-xl bg-neutral-200/50 backdrop-blur-md shadow-2xl w-fit border-t-2 border-white pointer-events-auto"
    >
      <p className="subtitle-1 drop-shadow-md text-lg w-full text-center max-w-[240px] md:max-w-[340px]">
        AI-powered trading strategies, fully automated for accredited investors.
      </p>
      <div className="flex flex-row items-center justify-center gap-4 mt-2 w-full">
        <Button variant="default" className="shadow-md">
          APPLY TO JOIN
          <ArrowRightIcon 
            size={14}
          />
        </Button>
        <Button variant="link" className="button-2">
          EXPLORE STRATEGIES
          <ChevronFirst
            size={14}
            className="rotate-270 transition-colors duration-300"
          />
        </Button>
      </div>
    </div>
  );
} 