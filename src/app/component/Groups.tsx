"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import type { MouseEvent, ReactNode } from "react";
import {
  Music,
  HeartHandshake,
  Clapperboard,
  Heart,
  Camera,
  Swords,
  ExternalLink,
} from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export interface GroupRow {
  id: string;
  name: string;
  about: string;
  image: string;
  link?: string | null;
}

const fallbackGroups: GroupRow[] = [
  {
    id: "prayer",
    name: "Prayer Unit",
    about: "Connecting hearts to heaven through prayer. Join us in faith and fellowship!",
    image: "/img/IMG_20251102_233014_825.jpg",
  },
  {
    id: "choir",
    name: "Choir",
    about: "Lifting hearts with every note! Join our choir and feel the joy of worship.",
    image: "/img/IMG_20251102_163931_572.jpg",
  },
  {
    id: "drama",
    name: "Drama unit",
    about: "Bringing God's word to life through creativity and performance!",
    image: "/img/IMG_20251102_232336_623.jpg",
  },
  {
    id: "evangelical",
    name: "Evangelical Unit",
    about: "Sharing God's love with the world, one heart at a time!",
    image: "/img/IMG_20251102_232759_670.jpg",
  },
  {
    id: "media",
    name: "Media Unit",
    about: "Capturing and sharing the message of God through creativity and technology.",
    image: "/img/IMG_20251102_221019_834.jpg",
  },
  {
    id: "levite",
    name: "Levite Unit",
    about: "To create an atmosphere where God's presence is honoured and His people are lifted.",
    image: "/img/IMG_20251103_132510_405~2.jpg",
  },
];

function iconForGroup(name: string): ReactNode {
  const n = name.toLowerCase();
  if (n.includes("choir")) return <Music size={18} className="inline-block ml-2" />;
  if (n.includes("drama")) return <Clapperboard size={18} className="inline-block ml-2" />;
  if (n.includes("evangel")) return <Heart size={18} className="inline-block ml-2" />;
  if (n.includes("media")) return <Camera size={18} className="inline-block ml-2" />;
  return <HeartHandshake size={18} className="inline-block ml-2" />;
}

interface GroupsProps {
  serverGroups?: GroupRow[];
}

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.5,
      ease: "easeOut" as const,
    },
  }),
};

function SpotlightCard({ children }: { children: ReactNode }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [opacity, setOpacity] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="group relative section-shell rounded-lg shadow-lg shadow-blue-950 hover:shadow-xl transition-shadow overflow-hidden"
    >
      {children}
      <div
        className="pointer-events-none absolute inset-0 z-10 rounded-lg"
        style={{
          opacity,
          background: `radial-gradient(360px circle at ${position.x}px ${position.y}px, rgba(37, 99, 235, 0.16), transparent 45%)`,
        }}
      />
    </motion.div>
  );
}

export default function Groups({ serverGroups }: GroupsProps = {}) {
  const items = serverGroups && serverGroups.length > 0 ? serverGroups : fallbackGroups;

  return (
    <section id="Group" className="py-8 px-4 section-shell text-black">
      <h2 className="section-title text-4xl text-center mb-12">
        KINGDOM BUILDERS
      </h2>

      <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-10">
        {items.map((grp, idx) => (
          <motion.div
            key={grp.id || idx}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={cardVariants}
            custom={idx}
          >
            <SpotlightCard>
              <div className="relative w-full h-80 overflow-hidden bg-blue-100">
                {grp.image ? (
                  <Image
                    src={grp.image}
                    alt={grp.name}
                    fill
                    className="object-cover saturate-100 transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    {iconForGroup(grp.name)}
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="default" className="bg-blue-900 text-white font-extrabold">
                    {grp.name}
                  </Badge>
                  <span className="text-blue-800 text-lg font-bold">{iconForGroup(grp.name)}</span>
                </div>
                <p className="mt-2">{grp.about}</p>
                <br />
                {grp.link && grp.link !== "#" && (
                  <a
                    href={grp.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Learn More <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </SpotlightCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
