"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Props {
  color?: string;
}

export default function ReadingProgress({ color = "#00E5FF" }: Props) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      setProgress((window.scrollY / docHeight) * 100);
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-0.5 bg-transparent">
      <motion.div
        className="h-full origin-left"
        style={{
          scaleX: progress / 100,
          background: `linear-gradient(90deg, ${color}, ${color}80)`,
          boxShadow: `0 0 8px ${color}80`,
        }}
      />
    </div>
  );
}
