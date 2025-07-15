"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CirclePlus, CircleX } from "lucide-react";
import { useCursorHover } from "./custom-cursor";

interface FAQItemProps {
  question: string;
  answer: string;
}

export default function FAQItem({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { onMouseEnter, onMouseLeave } = useCursorHover();

  return (
    <div className="w-full border-b border-neutral-200 last:border-b-0">
      <motion.button
        className="flex items-center justify-between w-full py-6 text-left group"
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.99 }}
        onMouseEnter={() => onMouseEnter('hover')}
        onMouseLeave={onMouseLeave}
      >
        <motion.h4 
          className="heading-4 text-black group-hover:text-sky-400 transition-colors duration-200 w-full"
          layout
        >
          {question}
        </motion.h4>
        
        <motion.div
          className="flex-shrink-0 ml-4 w-fit"
          animate={{ rotate: isOpen ? -45 : 0 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 200, damping: 30 }}
        >
          <CirclePlus 
            size={20} 
            className="text-neutral-400 group-hover:text-sky-400 transition-colors duration-200" 
          />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ 
              duration: 0.3, 
              type: "spring",
              stiffness: 200,
              damping: 30,
              opacity: { duration: 0.2 }
            }}
            className="overflow-hidden w-full"
          >
            <motion.div 
              className="pb-6"
              initial={{ y: -10 }}
              animate={{ y: 0 }}
              exit={{ y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <p className="paragraph-1 text-neutral-400 leading-relaxed w-full">
                {answer}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 