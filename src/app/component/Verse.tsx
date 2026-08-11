"use client";
import { useEffect, useState } from "react";
import type { FC } from "react";
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

  useEffect(() => {
    const interval = setInterval(
      () => setCurrent((prev) => (prev + 1) % Math.max(verses.length, 1)),
      10000
    );
    return () => clearInterval(interval);
  }, [verses.length]);

  return (
    <section className="text-center py-5 px-5 section-shell backdrop-blur-md rounded-2xl">
      <h2 className="text-2xl mb-10 text-color">Memory Verse</h2>
      <div className="max-w-[700px] mx-auto animate-fadeIn">
        <p className="italic text-2xl text-color">
          &ldquo;{verses[current].quote}&rdquo;
        </p>
        <h4 className="mt-5 font-bold text-color">{verses[current].name}</h4>

        <div className="flex justify-center mt-6 gap-2">
          {verses.map((_, index) => (
            <span
              key={index}
              onClick={() => setCurrent(index)}
              className={`h-3 w-3 rounded-full cursor-pointer transition ${
                index === current ? "bg-sky-400" : "bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Verse;
