"use client";

import { motion, useScroll, useTransform } from "framer-motion";

const SideScrollIndicator = () => {
  // 1. Change to track horizontal scroll progress (scrollXProgress)
  const { scrollXProgress } = useScroll();

  // 2. Transform the progress (0 to 1) into a height percentage ("0%" to "100%")
  const heightProgress = useTransform(scrollXProgress, [0, 1], ["0%", "100%"]);

  return (
    <motion.div
      // Tailwind Classes for Styling and Positioning
      // Fixed to the top-left, set width (w-2) and background color
      className="fixed top-0 left-0 z-[999] w-2 bg-blue-400 shadow-xl"
      style={{
        // 3. Animate the 'height' instead of the 'width'
        height: heightProgress,
      }}
    />
  );
};

export default SideScrollIndicator;