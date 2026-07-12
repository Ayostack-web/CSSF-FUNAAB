"use client";

import { useState } from "react";
import type { FC } from "react";
import Give from "./Give";
import Donate from "./DonateCTA";

const PledgeSection: FC = () => {
  const [showPledge, setShowPledge] = useState(false);

  return (
    <>
      <Give onOpenPledge={() => setShowPledge(true)} />
      {showPledge && <Donate onClose={() => setShowPledge(false)} />}
    </>
  );
};

export default PledgeSection;
