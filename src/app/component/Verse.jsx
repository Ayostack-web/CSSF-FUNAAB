"use client";
import { useEffect, useState } from "react";

const testimonials = [
  {
    quote:
      "For I know the plans I have for you,” declares the Lord, “plans to prosper you and not to harm you, plans to give you hope and a future.",
    name: "Jeremiah 29:11 (NIV)",

  },
  {
   quote:
      "Let your light shine before others, that they may see your good deeds and glorify your Father in heaven.",
    name: " Matthew 5:16 (NIV)", 
  },
  {
    quote:
      "And now these three remain: faith, hope and love. But the greatest of these is love.",
    name: " 1 Corinthians 13:13 (NIV)",
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => setCurrent((prev) => (prev + 1) % testimonials.length),
      5000
    );
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="text-center py-5 px-5 bg-blue-100 backdrop-blur-md rounded-2xl">
      <h2 className="text-2xl mb-10 text-color">💬 Memory Verse</h2>
      <div className="max-w-[700px] mx-auto animate-fadeIn">
        <p className="italic text-2xl text-color">
          “{testimonials[current].quote}”
        </p>
        <h4 className="mt-5 font-bold text-color">{testimonials[current].name}</h4>

        {/* Dots Navigation */}
        <div className="flex justify-center mt-6 gap-2">
          {testimonials.map((_, index) => (
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
}
