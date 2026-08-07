"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import type { FC } from "react";

const Hero: FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative h-[80vh] flex items-center justify-center text-center text-white overflow-hidden"
    >
      <motion.div style={{ scale: videoScale }} className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/img/CSSF-FUNAAB-LOGO.jpg"
          className="w-full h-full object-cover"
        >
          <source src="/media/WhatsApp Video 2025-08-22 at 5.32.44 AM (1).mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50" />
      </motion.div>

      <motion.div style={{ y: contentY, opacity: contentOpacity }} className="relative z-10 px-4">
        <h1 className="text-4xl text-blue-200 md:text-6xl font-bold mb-4">
          A Family in Christ on Campus
        </h1>
        <p className="text-lg md:text-xl mb-8 text-blue-100">
          Join us for worship, prayer, and impact
        </p>
        <Link href="#about">
          <motion.span
            className="btn-cta px-8 py-3 cursor-pointer"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
          >
            Join Us
          </motion.span>
        </Link>
      </motion.div>
    </section>
  );
};

export default Hero;
