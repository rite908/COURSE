"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ChapterViewer from "@/components/ChapterViewer";
import ParticlesCanvas from "@/components/ParticlesCanvas";
import { getChapter, type ChapterMeta } from "@/lib/chapters";
import { getCurrentUser, type UserName } from "@/lib/storage";

// Per-chapter hero themes
const CHAPTER_HEROES: Record<string, { label: string; particles: string; tagline: string }> = {
  "1": {
    label: "Hacker Ka Safar",
    particles: "0, 229, 255",
    tagline: "Pehle samjho, phir sikho, phir karo.",
  },
  "2": {
    label: "Hardware Se Software",
    particles: "59, 130, 246",
    tagline: "Computer ko andar se jaano — uska dost bano.",
  },
  "3": {
    label: "Data Ka Safar",
    particles: "138, 92, 255",
    tagline: "Internet mein har packet ek kahani sunata hai.",
  },
  "4": {
    label: "Terminal Ki Taqat",
    particles: "0, 255, 149",
    tagline: "Hacker ka asli weapon — command line.",
  },
  "5": {
    label: "Pentester Ka Toolkit",
    particles: "255, 59, 92",
    tagline: "Ethical hacking ka practical duniya.",
  },
};

export default function ChapterPage() {
  const params = useParams();
  const router = useRouter();
  const chapterId = params?.id as string;

  const [user, setUser] = useState<UserName | null>(null);
  const [chapter, setChapter] = useState<ChapterMeta | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const u = getCurrentUser();
    if (!u) { router.replace("/login"); return; }
    setUser(u);

    const ch = getChapter(chapterId);
    if (!ch) { router.replace("/chapters"); return; }
    setChapter(ch);
    setMounted(true);
  }, [chapterId, router]);

  if (!mounted || !user || !chapter) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-white/20 animate-pulse font-mono text-sm">Loading chapter...</div>
      </div>
    );
  }

  const hero = CHAPTER_HEROES[chapterId] || CHAPTER_HEROES["1"];

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />

      {/* Chapter Hero */}
      <div className={`relative pt-16 overflow-hidden`}>
        <div
          className={`relative bg-gradient-to-b ${chapter.bgGradient} overflow-hidden`}
          style={{ minHeight: "220px" }}
        >
          {/* Background effects */}
          <div className="absolute inset-0 cyber-grid-bg opacity-40" />
          <ParticlesCanvas
            color={hero.particles}
            count={35}
            className="opacity-60"
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 70% 80% at 30% 50%, ${chapter.accentColor}12 0%, transparent 65%)`,
            }}
          />

          <div className="relative z-10 px-4 sm:px-6 py-10 max-w-7xl mx-auto">
            {/* Breadcrumb */}
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs text-white/30 hover:text-white/70 transition-all mb-6 group"
            >
              <ArrowLeft
                size={13}
                className="group-hover:-translate-x-0.5 transition-transform"
              />
              Dashboard
            </Link>

            <div className="flex items-start gap-5">
              {/* Chapter icon */}
              <motion.div
                initial={mounted ? { scale: 0, rotate: -10 } : false}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", delay: 0.1 }}
                className="text-4xl sm:text-5xl w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-2xl shrink-0"
                style={{ background: `${chapter.accentColor}15`, fontSize: "2rem" }}
              >
                {chapter.icon}
              </motion.div>

              <div className="min-w-0">
                <motion.div
                  initial={mounted ? { opacity: 0, x: -10 } : false}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                  className="flex items-center gap-2 mb-1.5"
                >
                  <span
                    className="text-xs font-mono font-bold tracking-widest uppercase"
                    style={{ color: chapter.accentColor }}
                  >
                    Chapter {chapter.number}
                  </span>
                  <span className="text-white/20 text-xs">·</span>
                  <span className="text-white/40 text-xs">{hero.label}</span>
                </motion.div>

                <motion.h1
                  initial={mounted ? { opacity: 0, y: 10 } : false}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight"
                >
                  {chapter.title}
                </motion.h1>

                <motion.p
                  initial={mounted ? { opacity: 0 } : false}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-white/40 text-sm sm:text-base mt-2 italic"
                >
                  &ldquo;{hero.tagline}&rdquo;
                </motion.p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chapter viewer */}
      <ChapterViewer chapter={chapter} user={user} />
    </div>
  );
}
