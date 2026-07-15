"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown, Shield, Brain, Lock, Zap, Target, CheckCircle } from "lucide-react";
import GlobeCanvas from "@/components/GlobeCanvas";
import { CHAPTERS } from "@/lib/chapters";
import { getCurrentUser } from "@/lib/storage";

const STATS = [
  { value: "5+",    label: "Chapters" },
  { value: "30+",   label: "Topics" },
  { value: "450+",  label: "MCQs" },
  { value: "100%",  label: "Practical" },
];

const FEATURES = [
  {
    icon: <Brain size={20} />,
    color: "#2563EB",
    bg: "#EEF3FF",
    title: "Hinglish Mein Seekho",
    desc: "Complex concepts asaan Hinglish mein — jaise dost samjha raha ho.",
  },
  {
    icon: <Lock size={20} />,
    color: "#7C3AED",
    bg: "#F3EEFF",
    title: "Smart Lock System",
    desc: "MCQ pass karo, next topic unlock karo. Genuine understanding mandatory.",
  },
  {
    icon: <Target size={20} />,
    color: "#059669",
    bg: "#ECFDF5",
    title: "Hands-On Tasks",
    desc: "Har topic ke baad ek real practical challenge. No rote learning.",
  },
  {
    icon: <Zap size={20} />,
    color: "#D97706",
    bg: "#FFFBEB",
    title: "Cinematic Experience",
    desc: "Premium animations, buttery smooth UI. Padhai boring nahi lagegi.",
  },
  {
    icon: <CheckCircle size={20} />,
    color: "#0EA5E9",
    bg: "#F0F9FF",
    title: "Structured Path",
    desc: "Computer fundamentals se ethical hacking tak — ek clear learning roadmap.",
  },
  {
    icon: <Shield size={20} />,
    color: "#2563EB",
    bg: "#EEF3FF",
    title: "Absolute Beginner",
    desc: "Zero knowledge assumed. Jahan bhi ho — yahan se shuru karo.",
  },
];

const CHAPTER_META: Record<string, { accent: string; tag: string; difficulty: string; hours: string }> = {
  "1": { accent: "#2563EB", tag: "🚀 STARTUP",    difficulty: "Easy",   hours: "2h" },
  "2": { accent: "#0EA5E9", tag: "💻 COMPUTER",   difficulty: "Easy",   hours: "3h" },
  "3": { accent: "#7C3AED", tag: "🌐 NETWORKING", difficulty: "Medium", hours: "4h" },
  "4": { accent: "#059669", tag: "🐧 LINUX",      difficulty: "Medium", hours: "4h" },
  "5": { accent: "#DC2626", tag: "⚔️ KALI",        difficulty: "Hard",   hours: "5h" },
};

export default function LandingPage() {
  const router = useRouter();
  const [user, setUser] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 60]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  useEffect(() => {
    setUser(getCurrentUser());
    setMounted(true);
  }, []);

  const handleStart = () => router.push(user ? "/dashboard" : "/login");

  return (
    <main className="min-h-screen bg-white overflow-x-hidden">

      {/* ─────────────── HERO ─────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-white via-[#F5F8FF] to-[#EEF3FF]">

        {/* Dot grid */}
        <div className="absolute inset-0 dot-grid opacity-60 pointer-events-none" />

        {/* Blue radial glow top-left */}
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(37,99,235,0.06) 0%, transparent 70%)" }} />

        {/* Cyan glow bottom-right */}
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(14,165,233,0.07) 0%, transparent 70%)" }} />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 pt-24 pb-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen"
        >
          {/* Left — Text */}
          <div>
            {/* Badge */}
            <motion.div
              initial={mounted ? { opacity: 0, y: -16 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-200 bg-blue-50 text-xs font-semibold text-blue-600 mb-8"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              India's Premier Ethical Hacking Academy
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={mounted ? { opacity: 0, y: 30 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.65, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-5xl sm:text-6xl xl:text-7xl font-black leading-none tracking-tight text-gray-900 mb-6"
              style={{ letterSpacing: "-0.03em" }}
            >
              Master Computers.
              <br />
              <span className="text-blue-600">Hack The World.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={mounted ? { opacity: 0, y: 20 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="text-lg text-gray-500 leading-relaxed mb-10 max-w-lg"
            >
              Zero se shuru karo ethical hacking hero tak.{" "}
              <span className="text-gray-700 font-medium">A complete roadmap for future cybersecurity experts.</span>
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={mounted ? { opacity: 0, y: 20 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-3 mb-14"
            >
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: "0 8px 30px rgba(37,99,235,0.3)" }}
                whileTap={{ scale: 0.97 }}
                onClick={handleStart}
                className="flex items-center justify-center gap-2.5 px-8 py-3.5 bg-blue-600 text-white text-sm font-bold rounded-xl shadow-sm transition-all"
              >
                {user ? "Continue Learning" : "Start Your Journey"}
                <ArrowRight size={16} />
              </motion.button>
              <Link href="/chapters">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center justify-center gap-2 px-8 py-3.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all"
                >
                  Explore Chapters
                </motion.div>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex items-center gap-8 flex-wrap"
            >
              {STATS.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + i * 0.08 }}
                >
                  <div className="text-2xl font-black text-gray-900">{s.value}</div>
                  <div className="text-xs text-gray-400 font-medium mt-0.5">{s.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right — Globe */}
          <motion.div
            initial={mounted ? { opacity: 0, scale: 0.9 } : false}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative flex items-center justify-center"
          >
            {/* Outer decoration rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute w-[420px] h-[420px] rounded-full border border-blue-100"
                style={{ borderStyle: "dashed" }}
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute w-[340px] h-[340px] rounded-full border border-blue-100"
              />
            </div>

            {/* Floating badges */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-[15%] right-[5%] bg-white rounded-xl px-3.5 py-2.5 shadow-lg border border-gray-100 z-10"
            >
              <div className="text-xs font-bold text-gray-900">🔐 SSL Encrypted</div>
              <div className="text-[10px] text-gray-400 mt-0.5">Secure learning env</div>
            </motion.div>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute bottom-[15%] left-[5%] bg-white rounded-xl px-3.5 py-2.5 shadow-lg border border-gray-100 z-10"
            >
              <div className="text-xs font-bold text-gray-900">⚡ Live Progress</div>
              <div className="text-[10px] text-gray-400 mt-0.5">Track your mastery</div>
            </motion.div>
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute top-[50%] right-[-2%] bg-blue-600 rounded-xl px-3.5 py-2.5 shadow-lg z-10"
            >
              <div className="text-xs font-bold text-white">450+ MCQs</div>
              <div className="text-[10px] text-blue-200 mt-0.5">Quiz bank ready</div>
            </motion.div>

            {/* Globe */}
            <div className="relative w-[360px] h-[360px] sm:w-[420px] sm:h-[420px]">
              <GlobeCanvas />
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-gray-400"
        >
          <span className="text-[10px] font-semibold tracking-widest uppercase">Scroll</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
            <ChevronDown size={16} />
          </motion.div>
        </motion.div>
      </section>

      {/* ─────────────── CHAPTERS PREVIEW ─────────────── */}
      <section className="relative py-28 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-xs font-semibold text-blue-600 mb-5">
              Course Path
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-gray-900 mb-4" style={{ letterSpacing: "-0.025em" }}>
              Your Journey to{" "}
              <span className="text-blue-600">Ethical Hacking</span>
            </h2>
            <p className="text-gray-400 max-w-md mx-auto">
              Zero se shuru karke expert tak — ek structured learning path.
            </p>
          </motion.div>

          {/* Chapter grid — 2 col left, 3 col right, like reference */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CHAPTERS.map((ch, i) => {
              const meta = CHAPTER_META[ch.id];
              return (
                <motion.div
                  key={ch.id}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.09, duration: 0.5 }}
                >
                  <Link href={`/chapter/${ch.id}`}>
                    <motion.div
                      whileHover={{ y: -6, boxShadow: `0 12px 40px ${meta.accent}18` }}
                      transition={{ type: "spring", stiffness: 300, damping: 28 }}
                      className="group relative bg-white rounded-2xl border border-gray-100 p-6 overflow-hidden cursor-pointer h-full"
                      style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
                    >
                      {/* Gradient top bar */}
                      <div
                        className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                        style={{ background: `linear-gradient(90deg, ${meta.accent}, ${meta.accent}88)` }}
                      />

                      {/* Chapter number watermark */}
                      <div
                        className="absolute -right-3 -top-3 font-black text-6xl leading-none select-none"
                        style={{ color: `${meta.accent}08` }}
                      >
                        {String(ch.number).padStart(2, "0")}
                      </div>

                      {/* Tag */}
                      <div className="mb-5">
                        <span
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide"
                          style={{ color: meta.accent, background: `${meta.accent}10` }}
                        >
                          {meta.tag}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-bold text-gray-900 text-lg mb-1.5 leading-snug group-hover:text-blue-600 transition-colors">
                        {ch.title}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed mb-5">{ch.description}</p>

                      {/* Stats row */}
                      <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                        <span className="flex items-center gap-1">
                          <span className="font-bold text-gray-700">{ch.totalTopics}</span> Topics
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="font-bold text-gray-700">~{ch.totalTopics * 15}</span> MCQs
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="font-bold text-gray-700">{meta.hours}</span> read
                        </span>
                      </div>

                      {/* Difficulty */}
                      <div className="flex items-center justify-between">
                        <span
                          className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                          style={{
                            color: meta.difficulty === "Hard" ? "#DC2626" : meta.difficulty === "Medium" ? "#D97706" : "#059669",
                            background: meta.difficulty === "Hard" ? "#FEF2F2" : meta.difficulty === "Medium" ? "#FFFBEB" : "#ECFDF5",
                          }}
                        >
                          {meta.difficulty}
                        </span>
                        <ArrowRight size={14} className="text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: "0 8px 30px rgba(37,99,235,0.25)" }}
              whileTap={{ scale: 0.97 }}
              onClick={handleStart}
              className="inline-flex items-center gap-2 px-10 py-3.5 bg-blue-600 text-white text-sm font-bold rounded-xl shadow-sm"
            >
              {user ? "Continue Learning" : "Begin Training"}
              <ArrowRight size={15} />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* ─────────────── FEATURES ─────────────── */}
      <section className="py-28 px-4 bg-[#F5F8FF]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-blue-100 text-xs font-semibold text-blue-600 mb-5 shadow-sm">
              Why TWH Academy?
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-gray-900 mb-4" style={{ letterSpacing: "-0.025em" }}>
              Not just a course.
              <br />
              <span className="text-blue-600">A transformation.</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: f.bg, color: f.color }}
                >
                  {f.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────── CTA BANNER ─────────────── */}
      <section className="py-28 px-4 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-12 relative overflow-hidden"
            style={{ boxShadow: "0 20px 60px rgba(37,99,235,0.3)" }}
          >
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full -translate-y-1/2 translate-x-1/2"
              style={{ background: "rgba(255,255,255,0.05)" }} />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full translate-y-1/2 -translate-x-1/2"
              style={{ background: "rgba(255,255,255,0.05)" }} />

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4" style={{ letterSpacing: "-0.025em" }}>
                Ready to become a
                <br />
                White Hat Hacker?
              </h2>
              <p className="text-blue-200 mb-8 text-lg">
                Join the academy. Start free. Master everything.
              </p>
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: "0 8px 30px rgba(0,0,0,0.2)" }}
                whileTap={{ scale: 0.97 }}
                onClick={handleStart}
                className="inline-flex items-center gap-2 px-10 py-4 bg-white text-blue-600 font-bold rounded-xl text-sm shadow-lg"
              >
                {user ? "Go to Dashboard" : "Start Learning — It's Free"}
                <ArrowRight size={16} />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─────────────── FOOTER ─────────────── */}
      <footer className="border-t border-gray-100 py-10 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield size={13} className="text-white" />
            </div>
            <span className="font-bold text-sm text-gray-800">TWH Academy</span>
          </div>
          <p className="text-gray-400 text-sm">
            Built with ❤️ by{" "}
            <span className="text-blue-600 font-semibold">Afsar Ali</span> — Technical White Hat
          </p>
        </div>
      </footer>
    </main>
  );
}
