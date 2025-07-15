"use client";
import { useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";

export function HeroHeadings() {
  const { scrollYProgress } = useScroll();

  // Use desktop values for SSR, update to mobile on client
  const leftXRaw = useTransform(
    scrollYProgress,
    [0, 0.3],
    ["0vw", "-8vw"]
  );
  const rightXRaw = useTransform(
    scrollYProgress,
    [0, 0.3],
    ["0vw", "10vw"]
  );
  const leftX = useSpring(leftXRaw, { stiffness: 80, damping: 18 });
  const rightX = useSpring(rightXRaw, { stiffness: 80, damping: 18 });

  // Optionally, fade in headings after mount to avoid jump
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex flex-col items-center w-full overflow-visible relative gap-1 z-10">
      <motion.h1
        style={{ x: leftX, position: "relative", zIndex: 20, opacity: mounted ? 1 : 0 }}
        className="heading-gradient-black heading-1 w-fit text-center text-[clamp(2rem,8vw,3.5rem)]"
      >
        We Turn Information
      </motion.h1>
      <motion.h1
        style={{ x: rightX, position: "relative", zIndex: 20, opacity: mounted ? 1 : 0 }}
        className="heading-gradient-grey heading-1 w-fit text-center text-[clamp(2rem,8vw,3.5rem)]"
      >
        Into Performance
      </motion.h1>
    </div>
  );
}