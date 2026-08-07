"use client";

import type { FC } from "react";

interface GiveProps {
  onOpenPledge: () => void;
}

const Give: FC<GiveProps> = ({ onOpenPledge }) => {
  return (
    <section className="section-shell py-10 text-center">
      <h2 className="section-title text-4xl text-center mb-12">
        Support Our Mission
      </h2>
      <p className="font-bold text-blue-950 mb-8">
        Your donation helps us continue making a positive impact.
        Every contribution counts thank you for your support!
      </p>
      <button
        onClick={onOpenPledge}
        className="btn-cta px-8 py-3 mt-3"
      >
        DONATE
      </button>
    </section>
  );
};

export default Give;
