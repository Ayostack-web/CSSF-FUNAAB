// src/app/component/PledgeSection.jsx
"use client";

import { useState } from 'react';
import Give from './Give';
import Donate from './DonateCTA';

export default function PledgeSection() {
  const [showPledge, setShowPledge] = useState(false);

  return (
    <>
      <Give onOpenPledge={() => setShowPledge(true)} />
      {showPledge && <Donate onClose={() => setShowPledge(false)} />}
    </>
  );
}