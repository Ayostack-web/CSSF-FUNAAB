"use client";
import { useEffect, useState, useCallback } from "react";
import type { FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { createClient } from "../utils/supabase/client";

const fallbackVerses = [
  {
    quote: "Let your kingdom come. Let your pleasure be done, as in heaven, so on earth.",
    name: "Matthew 6:10 (NIV)",
  },
  {
    quote: "But let your first care be for his kingdom and his righteousness; and all these other things will be given to you in addition.",
    name: "Matthew 6:33 (NIV)",
  },
  {
    quote: "For the earth will be full of knowledge of the glory of the Lord as the sea is covered by the waters.",
    name: "Habakkuk 2:14 (NIV)",
  },
];

interface Verse {
  quote: string;
  name: string;
}

const Verse: FC = () => {
  const [verses, setVerses] = useState<Verse[]>(fallbackVerses);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let mounted = true;
    const supabase = createClient();

    (async () => {
      const { data } = await supabase
        .from("memory_verses")
        .select("quote, reference")
        .order("created_at", { ascending: false });

      if (!mounted || !data || data.length === 0) return;
      setVerses(data.map((v) => ({ quote: v.quote, name: v.reference })));
      setCurrent(0);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const goTo = useCallback(
    (index: number) => {
      if (verses.length === 0) return;
      setCurrent(((index % verses.length) + verses.length) % verses.length);
    },
    [verses.length]
  );

  useEffect(() => {
    const interval = setInterval(() => goTo(current + 1), 10000);
    return () => clearInterval(interval);
  }, [goTo, current]);

  const active = verses[current] || fallbackVerses[0];

  return (
    <section className="text-center py-12 px-4 section-shell">
      <h2 className="section-title text-3xl mb-8">Memory Verse</h2>

      <div className="relative max-w-3xl mx-auto px-6 py-8">
        <Quote
          className="mx-auto mb-6 text-blue-300 rotate-180"
          size={48}
          strokeWidth={1.5}
        />

        <div className="relative min-h-[160px] md:min-h-[140px] flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.45, ease: "easeInOut" }}
            >
              <p className="italic text-xl md:text-2xl font-medium text-blue-950 leading-relaxed tracking-wide">
                &ldquo;{active.quote}&rdquo;
              </p>
              <h4 className="mt-6 font-bold text-blue-900 text-lg tracking-wide">
                {active.name}
              </h4>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={() => goTo(current - 1)}
            aria-label="Previous verse"
            className="p-2 rounded-full border border-blue-300 bg-white/60 text-blue-700 hover:text-blue-900 hover:border-blue-400 hover:bg-white transition-all duration-300 cursor-pointer"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex items-center gap-2">
            {verses.map((_, index) => (
              <button
                key={index}
                onClick={() => goTo(index)}
                aria-label={`Go to verse ${index + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  index === current ? "w-8 bg-blue-500" : "w-2.5 bg-blue-300 hover:bg-blue-400"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => goTo(current + 1)}
            aria-label="Next verse"
            className="p-2 rounded-full border border-blue-300 bg-white/60 text-blue-700 hover:text-blue-900 hover:border-blue-400 hover:bg-white transition-all duration-300 cursor-pointer"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Verse;
