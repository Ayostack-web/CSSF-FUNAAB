"use client";
import { useEffect, useState } from "react";
import type { FC } from "react";

const verses = [
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

const Verse: FC = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => setCurrent((prev) => (prev + 1) % verses.length),
      10000
    );
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="text-center py-5 px-5 bg-blue-50 backdrop-blur-md rounded-2xl">
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
