"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { setCurrentUser, type UserName } from "@/lib/storage";

const PROFILES: {
  name: UserName;
  title: string;
  role: string;
  color: string;
  bg: string;
  border: string;
  glow: string;
  emoji: string;
  level: string;
}[] = [
  {
    name: "TWH",
    title: "The White Hat",
    role: "Course Creator & Founder",
    color: "#2563EB",
    bg: "from-blue-50 to-indigo-50",
    border: "#BFDBFE",
    glow: "rgba(37,99,235,0.15)",
    emoji: "🛡️",
    level: "CREATOR",
  },
  {
    name: "Prince",
    title: "The Learner",
    role: "Student Operative",
    color: "#7C3AED",
    bg: "from-violet-50 to-purple-50",
    border: "#DDD6FE",
    glow: "rgba(124,58,237,0.15)",
    emoji: "🎯",
    level: "TRAINEE",
  },
  {
    name: "Ashish",
    title: "The Explorer",
    role: "Student Operative",
    color: "#059669",
    bg: "from-emerald-50 to-teal-50",
    border: "#A7F3D0",
    glow: "rgba(5,150,105,0.15)",
    emoji: "🚀",
    level: "TRAINEE",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selecting, setSelecting] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);

  const handleSelect = async (user: UserName) => {
    setSelecting(user);
    await new Promise((r) => setTimeout(r, 500));
    setCurrentUser(user);
    router.push("/dashboard");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-[#F5F8FF] to-[#EEF3FF] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Dot grid */}
      <div className="absolute inset-0 dot-grid opacity-50 pointer-events-none" />

      {/* Blue glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(37,99,235,0.07) 0%, transparent 70%)" }} />

      <div className="relative z-10 w-full max-w-4xl">
        {/* Header */}
        <motion.div
          initial={mounted ? { opacity: 0, y: -20 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          {/* Logo */}
          <div className="flex items-center justify-center gap-2.5 mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
                <path d="M9 0.5L17 4.5V11C17 15.1 13.4 18.8 9 19.5C4.6 18.8 1 15.1 1 11V4.5L9 0.5Z"
                  fill="none" stroke="white" strokeWidth="1.4"/>
                <path d="M6 10L8 12L12 8" stroke="white" strokeWidth="1.8"
                  strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="font-bold text-lg text-gray-900">
              TWH <span className="text-blue-600">Academy</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3" style={{ letterSpacing: "-0.025em" }}>
            Welcome Back, Hacker! 👋
          </h1>
          <p className="text-gray-400 text-base">
            Choose your identity to continue your learning journey.
          </p>
        </motion.div>

        {/* Profile cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
          {PROFILES.map((p, i) => {
            const isHovered  = hoveredId === p.name;
            const isSelecting = selecting === p.name;

            return (
              <motion.button
                key={p.name}
                initial={mounted ? { opacity: 0, y: 32, scale: 0.96 } : false}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: i * 0.1 + 0.2, duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onHoverStart={() => setHoveredId(p.name)}
                onHoverEnd={() => setHoveredId(null)}
                onClick={() => !selecting && handleSelect(p.name)}
                className="relative text-left rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer"
                style={{
                  background: "#FFFFFF",
                  border: `1.5px solid ${isHovered ? p.color + "50" : p.border}`,
                  boxShadow: isHovered
                    ? `0 12px 40px ${p.glow}, 0 2px 8px rgba(0,0,0,0.04)`
                    : "0 2px 16px rgba(0,0,0,0.05)",
                }}
              >
                {/* Selecting overlay */}
                <AnimatePresence>
                  {isSelecting && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-white/90"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
                          className="w-6 h-6 rounded-full border-2 border-gray-200"
                          style={{ borderTopColor: p.color }}
                        />
                        <span className="text-xs font-semibold text-gray-500">Entering...</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Gradient top bar */}
                <div
                  className="h-1 w-full"
                  style={{ background: `linear-gradient(90deg, ${p.color}, ${p.color}66)` }}
                />

                {/* Avatar section */}
                <div
                  className={`bg-gradient-to-br ${p.bg} px-6 pt-8 pb-6 flex flex-col items-center text-center`}
                >
                  {/* Avatar circle with emoji */}
                  <motion.div
                    animate={isHovered ? { scale: 1.08, rotate: [0, -5, 5, 0] } : { scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mb-4 shadow-sm"
                    style={{ background: "#FFFFFF", border: `2px solid ${p.border}` }}
                  >
                    {p.emoji}
                  </motion.div>

                  {/* Level badge */}
                  <span
                    className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest mb-3"
                    style={{ color: p.color, background: `${p.color}15` }}
                  >
                    {p.level}
                  </span>

                  <h3
                    className="font-black text-2xl mb-0.5"
                    style={{ color: p.color }}
                  >
                    {p.name}
                  </h3>
                  <p className="font-bold text-gray-600 text-sm">{p.title}</p>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 flex items-center justify-between">
                  <span className="text-xs text-gray-400">{p.role}</span>
                  <motion.div
                    animate={isHovered ? { x: 4, opacity: 1 } : { x: 0, opacity: 0.4 }}
                    className="text-sm font-bold"
                    style={{ color: p.color }}
                  >
                    Enter →
                  </motion.div>
                </div>
              </motion.button>
            );
          })}
        </div>

        <motion.p
          initial={mounted ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-gray-300 text-xs"
        >
          No password required · Progress automatically saved per profile
        </motion.p>
      </div>
    </main>
  );
}
