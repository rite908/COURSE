"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Shield, ChevronDown, ArrowRight, Lock, Unlock, CheckCircle,
  Zap, Target, Brain
} from "lucide-react";
import ParticlesCanvas from "@/components/ParticlesCanvas";
import BinaryRain from "@/components/BinaryRain";
import { CHAPTERS } from "@/lib/chapters";
import { getCurrentUser } from "@/lib/storage";

export default function LandingPage() {
  const router = useRouter();
  const [user, setUser] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setUser(getCurrentUser());
    setMounted(true);
  }, []);

  const handleStart = () => {
    if (user) router.push("/dashboard");
    else router.push("/login");
  };

  return (
    <main className="min-h-screen bg-bg-primary overflow-x-hidden">
      {/* ── Hero ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Layered backgrounds */}
        <div className="absolute inset-0 cyber-grid-bg" />
        <BinaryRain color="#00E5FF" opacity={0.06} className="z-0" />
        <ParticlesCanvas color="0, 229, 255" count={60} className="z-0" />

        {/* Radial glow */}
        <div className="absolute inset-0 pointer-events-none z-0"
          style={{ background: "radial-gradient(ellipse 80% 50% at 50% 60%, rgba(0,229,255,0.08) 0%, transparent 70%)" }}
        />
        <div className="absolute inset-0 pointer-events-none z-0"
          style={{ background: "radial-gradient(ellipse 40% 40% at 70% 30%, rgba(138,92,255,0.06) 0%, transparent 70%)" }}
        />

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={mounted ? { opacity: 0, y: -20 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-accent-cyan/20 text-xs font-mono font-bold text-accent-cyan mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" />
            TECHNICAL WHITE HAT · ETHICAL HACKING COURSE
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={mounted ? { opacity: 0, y: 30 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-none tracking-tight mb-6"
          >
            <span className="block text-white">Technical</span>
            <span
              className="block glow-cyan"
              style={{ color: "#00E5FF" }}
            >
              White Hat
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={mounted ? { opacity: 0, y: 20 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg sm:text-xl md:text-2xl text-white/50 font-light max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Learn Computers From{" "}
            <span className="text-white/80 font-medium">Zero</span> To{" "}
            <span style={{ color: "#00E5FF" }} className="font-semibold">
              Ethical Hacking
            </span>{" "}
            Like Never Before.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={mounted ? { opacity: 0, y: 20 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: "0 0 30px rgba(0,229,255,0.5)" }}
              whileTap={{ scale: 0.97 }}
              onClick={handleStart}
              className="px-8 py-3.5 rounded-xl font-bold text-base text-bg-primary flex items-center gap-2"
              style={{ background: "#00E5FF", boxShadow: "0 0 20px rgba(0,229,255,0.3)" }}
            >
              Start Learning
              <ArrowRight size={18} />
            </motion.button>
            <Link
              href="/chapters"
              className="px-8 py-3.5 rounded-xl font-semibold text-base text-white/70 hover:text-white glass border border-white/10 hover:border-white/25 transition-all flex items-center gap-2"
            >
              View Chapters
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm"
          >
            {[
              { value: "5", label: "Chapters" },
              { value: "30+", label: "Topics" },
              { value: "450+", label: "MCQs" },
              { value: "100%", label: "Free" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-black text-white">{s.value}</div>
                <div className="text-xs text-white/40 mt-0.5 font-medium tracking-wide uppercase">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20"
        >
          <span className="text-xs tracking-widest uppercase font-mono">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown size={18} />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Features ── */}
      <section className="relative py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              Kyun <span style={{ color: "#00E5FF" }}>TWH Academy?</span>
            </h2>
            <p className="text-white/40 max-w-xl mx-auto">
              Yeh sirf ek course nahi — yeh ek transformation hai.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: <Brain size={22} />,
                color: "#00E5FF",
                title: "Hinglish Mein Seekho",
                desc: "Complex topics asaan Hinglish mein — jaise koi dost samjha raha ho.",
              },
              {
                icon: <Lock size={22} />,
                color: "#8A5CFF",
                title: "Progress Lock System",
                desc: "MCQ pass karo, next topic kholo. Concepts ko genuinely samjho bina pass kiye nahi chalega.",
              },
              {
                icon: <Target size={22} />,
                color: "#00FF95",
                title: "Hands-On Tasks",
                desc: "Har topic ke baad ek practical task — curiosity jagaane wala, rote learning nahi.",
              },
              {
                icon: <Zap size={22} />,
                color: "#FF7A00",
                title: "Smooth Experience",
                desc: "Fast, buttery animations. Premium feel. Padhai boring nahi lagegi.",
              },
              {
                icon: <CheckCircle size={22} />,
                color: "#00FF95",
                title: "Structured Path",
                desc: "Computer fundamentals se ethical hacking tak — ek clear learning path.",
              },
              {
                icon: <Shield size={22} />,
                color: "#00E5FF",
                title: "Beginner Friendly",
                desc: "Zero knowledge assumed. Tum kahan bhi ho — yahan se shuru kar sakte ho.",
              },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ y: -4 }}
                className="glass rounded-xl p-6 border border-white/8 hover:border-white/15 transition-all"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                  style={{ background: `${f.color}15`, color: f.color }}
                >
                  {f.icon}
                </div>
                <h3 className="text-white font-semibold mb-2">{f.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Chapters preview ── */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              Course <span style={{ color: "#00E5FF" }}>Chapters</span>
            </h2>
            <p className="text-white/40">Zero se shuru karke expert tak ka safar.</p>
          </motion.div>

          <div className="space-y-4">
            {CHAPTERS.map((ch, i) => (
              <motion.div
                key={ch.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ x: 6 }}
              >
                <Link href={`/chapter/${ch.id}`}>
                  <div className="glass rounded-xl p-5 border border-white/8 hover:border-white/20 transition-all flex items-center gap-5 group">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 font-bold"
                      style={{ background: `${ch.accentColor}15` }}
                    >
                      {ch.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="text-xs font-mono font-bold"
                          style={{ color: ch.accentColor }}
                        >
                          CHAPTER {ch.number}
                        </span>
                      </div>
                      <h3 className="text-white font-bold text-base">{ch.title}</h3>
                      <p className="text-white/40 text-sm truncate">{ch.description}</p>
                    </div>
                    <ArrowRight
                      size={18}
                      className="text-white/20 group-hover:text-white/60 transition-all shrink-0"
                      style={{ color: ch.accentColor + "80" }}
                    />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-10"
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleStart}
              className="px-8 py-3 rounded-xl font-bold text-bg-primary"
              style={{ background: "#00E5FF", boxShadow: "0 0 20px rgba(0,229,255,0.25)" }}
            >
              {user ? "Continue Learning" : "Get Started Now"}
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 py-10 px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Shield size={16} className="text-accent-cyan" />
          <span className="font-bold text-white/80">TWH Academy</span>
        </div>
        <p className="text-white/30 text-sm">
          Built by{" "}
          <span className="text-accent-cyan font-semibold">Afsar Ali</span>{" "}
          — Technical White Hat
        </p>
      </footer>
    </main>
  );
}
