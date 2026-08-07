"use client";

import { motion, useScroll, useSpring } from "framer-motion";

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-1 origin-left z-[1100] bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 shadow-[0_0_8px_rgba(59,130,246,0.6)]"
    />
  );
};

export default ScrollProgress;
