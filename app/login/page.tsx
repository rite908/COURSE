"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, ArrowRight } from "lucide-react";
import ParticlesCanvas from "@/components/ParticlesCanvas";
import { setCurrentUser, type UserName } from "@/lib/storage";

const USERS: {
  name: UserName;
  role: string;
  avatar: string;
  color: string;
  glow: string;
  desc: string;
}[] = [
  {
    name: "TWH",
    role: "Course Creator",
    avatar: "⚡",
    color: "#00E5FF",
    glow: "rgba(0,229,255,0.3)",
    desc: "Afsar Ali — Technical White Hat",
  },
  {
    name: "Prince",
    role: "Student",
    avatar: "🎯",
    color: "#8A5CFF",
    glow: "rgba(138,92,255,0.3)",
    desc: "Apna journey shuru karo",
  },
  {
    name: "Ashish",
    role: "Student",
    avatar: "🚀",
    color: "#00FF95",
    glow: "rgba(0,255,149,0.3)",
    desc: "Apna journey shuru karo",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const handleSelect = (user: UserName) => {
    setCurrentUser(user);
    router.push("/dashboard");
  };

  return (
    <main className="min-h-screen bg-bg-primary flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 cyber-grid-bg" />
      <ParticlesCanvas color="138, 92, 255" count={40} className="z-0" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(138,92,255,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 w-full max-w-4xl">
        {/* Header */}
        <motion.div
          initial={mounted ? { opacity: 0, y: -20 } : false}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2.5 mb-5">
            <div className="relative">
              <Shield size={28} className="text-accent-cyan" />
              <div className="absolute inset-0 blur-lg bg-accent-cyan/30 scale-150" />
            </div>
            <span className="text-xl font-black">
              <span className="text-accent-cyan">TWH</span>
              <span className="text-white/60 font-normal"> Academy</span>
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
            Kaun ho tum?
          </h1>
          <p className="text-white/40 text-base">
            Apna card select karo — aur apna journey continue karo.
          </p>
        </motion.div>

        {/* User cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {USERS.map((u, i) => (
            <motion.button
              key={u.name}
              initial={mounted ? { opacity: 0, y: 30 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: mounted ? i * 0.1 + 0.2 : 0 }}
              whileHover={{ y: -6, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSelect(u.name)}
              className="relative glass rounded-2xl p-8 border border-white/8 hover:border-white/25 transition-all text-left group overflow-hidden"
              style={{
                boxShadow: `0 0 0 0 ${u.glow}`,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = `0 0 30px ${u.glow}`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = `0 0 0 0 ${u.glow}`;
              }}
            >
              {/* Glow blob */}
              <div
                className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: u.color + "20" }}
              />

              {/* Avatar */}
              <motion.div
                className="text-5xl mb-5 w-16 h-16 flex items-center justify-center rounded-xl"
                style={{ background: `${u.color}15` }}
                whileHover={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.3 }}
              >
                {u.avatar}
              </motion.div>

              {/* Name */}
              <h3
                className="text-2xl font-black mb-1 transition-all"
                style={{ color: u.color }}
              >
                {u.name}
              </h3>
              <p className="text-white/40 text-xs font-mono uppercase tracking-widest mb-2">
                {u.role}
              </p>
              <p className="text-white/30 text-sm">{u.desc}</p>

              {/* Arrow */}
              <div
                className="mt-6 flex items-center gap-2 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all translate-y-1 group-hover:translate-y-0"
                style={{ color: u.color }}
              >
                Enter Academy
                <ArrowRight size={15} />
              </div>
            </motion.button>
          ))}
        </div>

        <motion.p
          initial={mounted ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          transition={{ delay: mounted ? 0.7 : 0 }}
          className="text-center text-white/20 text-xs mt-10 font-mono"
        >
          No password required · Progress automatically saved
        </motion.p>
      </div>
    </main>
  );
}
