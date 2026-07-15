"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import {
  ArrowRight, BookOpen, Layers, HelpCircle, Target,
  User, FlaskConical, Briefcase, TrendingUp, Shield, Award,
} from "lucide-react";
import HeroScene from "@/components/HeroScene";
import { getCurrentUser } from "@/lib/storage";

/* ───────── Data ───────── */

const STATS = [
  { icon: <BookOpen  size={24} />, value: "5+",   label: "Chapters",  color: "#2563EB", bg: "#EEF3FF" },
  { icon: <Layers    size={24} />, value: "30+",  label: "Topics",    color: "#7C3AED", bg: "#F3EEFF" },
  { icon: <HelpCircle size={24}/>, value: "450+", label: "MCQs",      color: "#0EA5E9", bg: "#F0F9FF" },
  { icon: <Target    size={24} />, value: "100%", label: "Practical", color: "#059669", bg: "#ECFDF5" },
];

const WHY_CARDS = [
  {
    icon: <User size={20} />,
    color: "#2563EB", bg: "#EEF3FF",
    title: "Beginner Friendly",
    desc: "Start from zero. No prior knowledge required.",
  },
  {
    icon: <FlaskConical size={20} />,
    color: "#7C3AED", bg: "#F3EEFF",
    title: "Practical Learning",
    desc: "Real world labs, tools and projects.",
  },
  {
    icon: <Briefcase size={20} />,
    color: "#0EA5E9", bg: "#F0F9FF",
    title: "Industry Relevant",
    desc: "Skills that are in demand in cybersecurity industry.",
  },
  {
    icon: <TrendingUp size={20} />,
    color: "#059669", bg: "#ECFDF5",
    title: "Progress Tracking",
    desc: "Track your progress and measure your mastery.",
  },
  {
    icon: <Award size={20} />,
    color: "#D97706", bg: "#FFFBEB",
    title: "Certificate",
    desc: "Earn certificate and showcase your skills.",
  },
];

/* ───────── Page ───────── */

export default function LandingPage() {
  const router  = useRouter();
  const [user,    setUser]    = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const { scrollY } = useScroll();
  const heroLeftY  = useTransform(scrollY, [0, 500], [0, 30]);
  const heroRightY = useTransform(scrollY, [0, 500], [0, -20]);

  const btnRef  = useRef<HTMLButtonElement>(null);
  const btnX    = useMotionValue(0);
  const btnY    = useMotionValue(0);
  const springX = useSpring(btnX, { stiffness: 300, damping: 30 });
  const springY = useSpring(btnY, { stiffness: 300, damping: 30 });

  const handleMagnet = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    btnX.set((e.clientX - (r.left + r.width  / 2)) * 0.3);
    btnY.set((e.clientY - (r.top  + r.height / 2)) * 0.3);
  };
  const handleMagnetLeave = () => { btnX.set(0); btnY.set(0); };

  useEffect(() => {
    setUser(getCurrentUser());
    setMounted(true);
  }, []);

  const goStart = () => router.push(user ? "/chapters" : "/login");

  return (
    <main className="min-h-screen overflow-x-hidden" style={{ background: "#F8FAFF" }}>

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(150deg, #FFFFFF 0%, #F4F8FF 45%, #EEF2FF 100%)",
          minHeight: "calc(100vh - 68px)",
          paddingTop: "68px",
        }}
      >
        {/* Background dot grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage: "radial-gradient(circle, #C7D2FE 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
        {/* Left blue glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            left: "-160px", top: "10%",
            width: 700, height: 700, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(37,99,235,0.06) 0%, transparent 65%)",
          }}
        />
        {/* Right purple glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            right: "-100px", top: "-60px",
            width: 600, height: 600, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 65%)",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 h-full">

          {/* ── Split row: Left text + Right globe ── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-0 items-center"
            style={{ minHeight: "calc(100vh - 68px - 160px)" }}>

            {/* LEFT */}
            <motion.div
              style={{ y: heroLeftY }}
              className="flex flex-col justify-center py-10 lg:py-0 pr-0 lg:pr-8"
            >
              {/* Badge */}
              <motion.div
                initial={mounted ? { opacity: 0, y: -14 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 self-start mb-7 px-4 py-1.5 rounded-full bg-white border border-blue-200 shadow-sm"
              >
                <Shield size={12} className="text-blue-500 shrink-0" />
                <span className="text-[12px] font-semibold text-gray-600">
                  India's Premier Ethical Hacking{" "}
                  <span className="text-blue-600">Academy</span>
                </span>
              </motion.div>

              {/* Heading */}
              <motion.h1
                initial={mounted ? { opacity: 0, y: 28 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.65, ease: [0.25, 0.1, 0.25, 1] }}
                className="font-black leading-[1.0] tracking-tight mb-5"
                style={{ fontSize: "clamp(2.6rem, 5.5vw, 4.5rem)", letterSpacing: "-0.03em" }}
              >
                <span className="text-gray-900 block">Master Computers.</span>
                <span
                  className="block"
                  style={{
                    background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Hack The World.
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={mounted ? { opacity: 0, y: 18 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22, duration: 0.5 }}
                className="text-gray-500 leading-relaxed mb-9"
                style={{ fontSize: "1.05rem" }}
              >
                From zero to ethical hacking hero.
                <br />
                A complete roadmap for future cybersecurity experts.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={mounted ? { opacity: 0, y: 16 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.34, duration: 0.48 }}
                className="flex flex-col sm:flex-row items-start gap-3"
              >
                {/* Primary */}
                <motion.button
                  ref={btnRef}
                  style={{ x: springX, y: springY }}
                  onMouseMove={handleMagnet}
                  onMouseLeave={handleMagnetLeave}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={goStart}
                  className="relative flex items-center gap-2.5 px-8 py-[14px] rounded-2xl
                    text-[15px] font-bold text-white overflow-hidden shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)",
                    boxShadow: "0 8px 28px rgba(37,99,235,0.38), 0 2px 6px rgba(0,0,0,0.06)",
                  }}
                >
                  <motion.span
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.18) 50%, transparent 65%)" }}
                    animate={{ x: ["-120%", "220%"] }}
                    transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 2.5 }}
                  />
                  <span className="relative z-10">{user ? "Continue Learning" : "Start Your Journey"}</span>
                  <motion.div
                    className="relative z-10 w-7 h-7 rounded-full bg-white/25 flex items-center justify-center"
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity }}
                  >
                    <ArrowRight size={14} />
                  </motion.div>
                </motion.button>

                {/* Secondary */}
                <Link href="/chapters">
                  <motion.div
                    whileHover={{ scale: 1.02, boxShadow: "0 4px 20px rgba(37,99,235,0.1)" }}
                    className="flex items-center gap-2.5 px-8 py-[14px] rounded-2xl text-[15px] font-semibold
                      text-gray-600 bg-white border border-gray-200 hover:border-blue-200 transition-all cursor-pointer shrink-0"
                    style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}
                  >
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-gray-400" />
                    </div>
                    Explore Chapters
                  </motion.div>
                </Link>
              </motion.div>
            </motion.div>

            {/* RIGHT — Globe */}
            <motion.div
              style={{ y: heroRightY, minHeight: 520 }}
              className="relative w-full"
            >
              <HeroScene />
            </motion.div>
          </div>

          {/* ── Stats row (full width, below split) ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-12"
          >
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={mounted ? { opacity: 0, y: 14 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.08 }}
                whileHover={{ y: -5, boxShadow: "0 10px 28px rgba(37,99,235,0.14)" }}
                className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-white border border-gray-100
                  transition-all cursor-default"
                style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: s.bg, color: s.color }}
                >
                  {s.icon}
                </div>
                <div>
                  <div className="font-black text-2xl text-gray-900 leading-none">{s.value}</div>
                  <div className="text-xs text-gray-400 font-medium mt-0.5">{s.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          WHY CHOOSE TWH ACADEMY
      ══════════════════════════════════════ */}
      <section className="py-20 px-6 bg-white" id="features">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55 }}
            className="flex items-center justify-center gap-5 mb-12"
          >
            <div className="flex-1 max-w-[90px] h-px bg-gradient-to-r from-transparent to-gray-200" />
            <div className="flex flex-col items-center gap-2">
              <Shield size={16} className="text-blue-500" />
              <h2
                className="text-[1.6rem] font-black text-gray-900 text-center"
                style={{ letterSpacing: "-0.02em" }}
              >
                Why Choose TWH Academy?
              </h2>
            </div>
            <div className="flex-1 max-w-[90px] h-px bg-gradient-to-l from-transparent to-gray-200" />
          </motion.div>

          {/* 5 Feature cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {WHY_CARDS.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.45 }}
                whileHover={{ y: -6, boxShadow: `0 14px 36px ${card.color}18` }}
                className="flex flex-col items-start gap-3 bg-white rounded-2xl p-5
                  border border-gray-100 shadow-sm hover:border-blue-100 transition-all cursor-default"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: card.bg, color: card.color }}
                >
                  {card.icon}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-[13.5px] leading-snug mb-1">{card.title}</h3>
                  <p className="text-gray-400 text-xs leading-relaxed">{card.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════ */}
      <section className="py-20 px-6" style={{ background: "#F4F8FF" }}>
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="relative rounded-3xl p-12 text-center overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)",
              boxShadow: "0 24px 64px rgba(37,99,235,0.3)",
            }}
          >
            <div className="absolute top-0 right-0 w-52 h-52 rounded-full -translate-y-1/2 translate-x-1/2 bg-white/5" />
            <div className="absolute bottom-0 left-0 w-36 h-36 rounded-full translate-y-1/2 -translate-x-1/2 bg-white/5" />
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield size={22} className="text-white" />
              </div>
              <h2 className="text-3xl font-black text-white mb-3" style={{ letterSpacing: "-0.025em" }}>
                Ready to become a<br />White Hat Hacker?
              </h2>
              <p className="text-blue-200 mb-8 text-base">Join the academy. Start free. Master everything.</p>
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}
                whileTap={{ scale: 0.97 }}
                onClick={goStart}
                className="inline-flex items-center gap-2.5 px-10 py-3.5 rounded-2xl
                  bg-white text-blue-600 font-bold text-[15px] shadow-lg"
              >
                {user ? "Go to Chapters" : "Start Learning — It's Free"}
                <ArrowRight size={16} />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FOOTER
      ══════════════════════════════════════ */}
      <footer className="border-t border-gray-100 py-8 px-6 bg-white" id="contact">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #2563EB, #7C3AED)" }}
            >
              <Shield size={14} className="text-white" />
            </div>
            <div>
              <div className="font-bold text-sm text-gray-900 leading-none">TWH Academy</div>
              <div className="text-[10px] text-gray-400 mt-0.5">Ethical Hacking Academy</div>
            </div>
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
