"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CirclePlus } from "lucide-react";
import { useCursorHover } from "./custom-cursor";

interface FAQItemProps {
  question: string;
  answer: string;
}

export default function FAQItem({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { onMouseEnter, onMouseLeave } = useCursorHover();

  const toggleOpen = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  const handleMouseEnter = useCallback(() => {
    onMouseEnter('hover');
  }, [onMouseEnter]);

  return (
    <div className="w-full border-b border-neutral-200 last:border-b-0">
      <motion.button
        className="flex items-center justify-between w-full py-6 text-left group"
        onClick={toggleOpen}
        whileTap={{ scale: 0.99 }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <h4 className="heading-4 text-black group-hover:text-sky-400 transition-colors duration-200 w-full will-change-auto">
          {question}
        </h4>
        
        <motion.div
          className="flex-shrink-0 ml-4 w-fit"
          animate={{ rotate: isOpen ? -45 : 0 }}
          transition={{ duration: 0.2, type: "tween", ease: "easeInOut" }}
        >
          <CirclePlus 
            size={20} 
            className="text-neutral-400 group-hover:text-sky-400 transition-colors duration-200" 
          />
        </motion.div>
      </motion.button>

      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ 
              duration: 0.25,
              ease: "easeInOut",
              opacity: { duration: 0.15, delay: isOpen ? 0.1 : 0 }
            }}
            className="overflow-hidden w-full will-change-transform"
          >
            <div className="pb-6">
              <p className="paragraph-1 text-neutral-400 leading-relaxed w-full">
                {answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 