"use client";

import type { FC } from "react";

interface GiveProps {
  onOpenPledge: () => void;
}

const Give: FC<GiveProps> = ({ onOpenPledge }) => {
  return (
    <section className="bg-blue-50 py-10 text-center">
      <h2 className="text-4xl font-extrabold text-center mb-12 text-blue-900 drop-shadow-md">
        Support Our Mission
      </h2>
      <p className="font-bold text-blue-950 mb-8">
        Your donation helps us continue making a positive impact.
        Every contribution counts thank you for your support!
      </p>
      <button
        onClick={onOpenPledge}
        className="inline-block px-8 py-3 mt-3 text-lg font-bold text-black bg-gradient-to-tr from-blue-300 to-teal-50 rounded-full shadow-lg hover:from-blue-900 hover:to-white hover:-translate-y-1 transition"
      >
        DONATE
      </button>
    </section>
  );
};

export default Give;
