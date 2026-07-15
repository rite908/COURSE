"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import {
  ArrowRight, BookOpen, Layers, HelpCircle, Target,
  User, FlaskConical, Briefcase, TrendingUp, Award, Shield,
} from "lucide-react";
import HeroScene from "@/components/HeroScene";
import { CHAPTERS } from "@/lib/chapters";
import { getCurrentUser } from "@/lib/storage";

/* ─────────────── Data ─────────────── */

const STATS = [
  { icon: <BookOpen size={22} />,  value: "5+",   label: "Chapters",  color: "#2563EB", bg: "#EEF3FF" },
  { icon: <Layers   size={22} />,  value: "30+",  label: "Topics",    color: "#7C3AED", bg: "#F3EEFF" },
  { icon: <HelpCircle size={22}/>, value: "450+", label: "MCQs",      color: "#0EA5E9", bg: "#F0F9FF" },
  { icon: <Target   size={22} />,  value: "100%", label: "Practical", color: "#059669", bg: "#ECFDF5" },
];

const WHY_CARDS = [
  {
    icon: <User size={18} />,
    color: "#2563EB", bg: "#EEF3FF",
    title: "Beginner Friendly",
    desc: "Start from zero. No prior knowledge required.",
  },
  {
    icon: <FlaskConical size={18} />,
    color: "#7C3AED", bg: "#F3EEFF",
    title: "Practical Learning",
    desc: "Real world labs, tools and projects.",
  },
  {
    icon: <Briefcase size={18} />,
    color: "#0EA5E9", bg: "#F0F9FF",
    title: "Industry Relevant",
    desc: "Skills that are in demand in cybersecurity industry.",
  },
  {
    icon: <TrendingUp size={18} />,
    color: "#059669", bg: "#ECFDF5",
    title: "Progress Tracking",
    desc: "Track your progress and measure your mastery.",
  },
  {
    icon: <Award size={18} />,
    color: "#D97706", bg: "#FFFBEB",
    title: "Certificate Ready",
    desc: "Earn certificate and showcase your skills.",
  },
];

/* ─────────────── Page ─────────────── */

export default function LandingPage() {
  const router  = useRouter();
  const [user,    setUser]    = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Parallax
  const { scrollY } = useScroll();
  const leftY  = useTransform(scrollY, [0, 600], [0, 40]);
  const rightY = useTransform(scrollY, [0, 600], [0, -30]);

  // Magnetic mouse effect for primary CTA
  const btnRef   = useRef<HTMLButtonElement>(null);
  const btnX     = useMotionValue(0);
  const btnY     = useMotionValue(0);
  const springX  = useSpring(btnX, { stiffness: 300, damping: 30 });
  const springY  = useSpring(btnY, { stiffness: 300, damping: 30 });

  const handleMagnet = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!btnRef.current) return;
    const rect   = btnRef.current.getBoundingClientRect();
    const cx     = rect.left + rect.width  / 2;
    const cy     = rect.top  + rect.height / 2;
    btnX.set((e.clientX - cx) * 0.35);
    btnY.set((e.clientY - cy) * 0.35);
  };
  const handleMagnetLeave = () => { btnX.set(0); btnY.set(0); };

  useEffect(() => {
    setUser(getCurrentUser());
    setMounted(true);
  }, []);

  const handleStart = () => router.push(user ? "/dashboard" : "/login");

  return (
    <main className="min-h-screen bg-white overflow-x-hidden">

      {/* ═══════════════════════════════
          HERO
      ═══════════════════════════════ */}
      <section
        className="relative min-h-[100svh] flex items-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, #FFFFFF 0%, #F5F8FF 50%, #EEF3FF 100%)" }}
      >
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Dot grid */}
          <div className="absolute inset-0 opacity-[0.45]"
            style={{
              backgroundImage: "radial-gradient(circle, #C7D2FE 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
          {/* Blue radial glow — left */}
          <div className="absolute -left-48 top-1/4"
            style={{ width: 680, height: 680, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 70%)" }} />
          {/* Purple radial glow — right */}
          <div className="absolute -right-40 top-0"
            style={{ width: 600, height: 600, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%)" }} />
          {/* Bottom-left subtle */}
          <div className="absolute -bottom-40 left-1/4"
            style={{ width: 500, height: 500, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(14,165,233,0.05) 0%, transparent 70%)" }} />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 pt-[80px] pb-12
          grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-8 items-center min-h-[100svh]">

          {/* ── Left: Content ── */}
          <motion.div style={{ y: leftY }} className="flex flex-col justify-center">

            {/* Badge */}
            <motion.div
              initial={mounted ? { opacity: 0, y: -16 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 self-start px-4 py-1.5 rounded-full
                border border-blue-200 bg-white/80 backdrop-blur-sm text-xs font-semibold text-blue-700 mb-8
                shadow-sm"
            >
              <Shield size={11} className="text-blue-500" />
              India's Premier Ethical Hacking{" "}
              <span className="text-blue-500">Academy</span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={mounted ? { opacity: 0, y: 32 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
              className="font-black leading-[0.95] tracking-tight mb-6"
              style={{ fontSize: "clamp(2.4rem, 5vw, 4.2rem)", letterSpacing: "-0.035em" }}
            >
              <span className="text-gray-900">Master Computers.</span>
              <br />
              <span
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
              initial={mounted ? { opacity: 0, y: 20 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.55 }}
              className="text-[1.05rem] text-gray-500 leading-relaxed mb-10 max-w-[440px]"
            >
              From zero to ethical hacking hero.
              <br />
              A complete roadmap for future cybersecurity experts.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={mounted ? { opacity: 0, y: 20 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-3 mb-16"
            >
              {/* Primary — magnetic */}
              <motion.button
                ref={btnRef}
                style={{ x: springX, y: springY }}
                onMouseMove={handleMagnet}
                onMouseLeave={handleMagnetLeave}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleStart}
                className="relative flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl
                  text-[15px] font-bold text-white overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)",
                  boxShadow: "0 8px 32px rgba(37,99,235,0.32), 0 2px 8px rgba(0,0,0,0.06)",
                }}
              >
                {/* Shimmer */}
                <motion.div
                  className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)",
                  }}
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 2 }}
                />
                <span className="relative z-10">
                  {user ? "Continue Learning" : "Start Your Journey"}
                </span>
                <motion.div
                  className="relative z-10 w-7 h-7 rounded-full bg-white/20 flex items-center justify-center"
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight size={14} />
                </motion.div>
              </motion.button>

              {/* Secondary */}
              <Link href="/chapters">
                <motion.div
                  whileHover={{ scale: 1.02, borderColor: "rgba(37,99,235,0.3)" }}
                  className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl
                    text-[15px] font-semibold text-gray-600 bg-white border border-gray-200
                    hover:bg-gray-50 transition-all cursor-pointer"
                  style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
                >
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-gray-400" />
                  </div>
                  Explore Chapters
                </motion.div>
              </Link>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-4 gap-3 max-w-[420px]"
            >
              {STATS.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={mounted ? { opacity: 0, y: 12 } : false}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.07 }}
                  whileHover={{ y: -4, boxShadow: "0 8px 24px rgba(37,99,235,0.1)" }}
                  className="flex flex-col items-center justify-center py-3 px-2 rounded-2xl
                    bg-white border border-gray-100 cursor-default transition-shadow"
                  style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
                >
                  <span style={{ color: s.color }} className="mb-1.5">{s.icon}</span>
                  <div className="font-black text-xl text-gray-900 leading-none">{s.value}</div>
                  <div className="text-[10px] text-gray-400 font-medium mt-0.5">{s.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── Right: Hero Scene ── */}
          <motion.div
            style={{ y: rightY }}
            className="relative flex items-center justify-center"
          >
            <div className="relative w-full" style={{ paddingBottom: "100%" }}>
              <div className="absolute inset-0">
                <HeroScene />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════
          WHY CHOOSE TWH ACADEMY
      ═══════════════════════════════ */}
      <section className="py-20 px-4 bg-white" id="features">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-4 mb-14"
          >
            <div className="flex-1 max-w-[100px] h-px bg-gradient-to-r from-transparent to-gray-200" />
            <div className="flex flex-col items-center gap-2">
              <Shield size={18} className="text-blue-500" />
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 text-center" style={{ letterSpacing: "-0.02em" }}>
                Why Choose TWH Academy?
              </h2>
            </div>
            <div className="flex-1 max-w-[100px] h-px bg-gradient-to-l from-transparent to-gray-200" />
          </motion.div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {WHY_CARDS.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                whileHover={{ y: -6, boxShadow: `0 12px 32px ${card.color}14` }}
                className="flex flex-col items-start gap-3 bg-white rounded-2xl p-5
                  border border-gray-100 shadow-sm hover:border-blue-100 transition-all cursor-default"
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: card.bg, color: card.color }}
                >
                  {card.icon}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm leading-snug mb-1">{card.title}</h3>
                  <p className="text-gray-400 text-xs leading-relaxed">{card.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════
          CTA BANNER
      ═══════════════════════════════ */}
      <section className="py-20 px-4 bg-[#F5F8FF]">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-3xl p-12 overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)",
              boxShadow: "0 24px 64px rgba(37,99,235,0.28)",
            }}
          >
            {/* Decoration bubbles */}
            <div className="absolute top-0 right-0 w-56 h-56 rounded-full -translate-y-1/2 translate-x-1/2
              bg-white/5" />
            <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full translate-y-1/2 -translate-x-1/2
              bg-white/5" />

            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield size={22} className="text-white" />
              </div>
              <h2 className="text-3xl font-black text-white mb-3" style={{ letterSpacing: "-0.025em" }}>
                Ready to become a
                <br />White Hat Hacker?
              </h2>
              <p className="text-blue-200 mb-8 text-base">
                Join the academy. Start free. Master everything.
              </p>
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}
                whileTap={{ scale: 0.97 }}
                onClick={handleStart}
                className="inline-flex items-center gap-2.5 px-10 py-3.5 rounded-2xl
                  bg-white text-blue-600 font-bold text-[15px] shadow-lg"
              >
                {user ? "Go to Dashboard" : "Start Learning — It's Free"}
                <ArrowRight size={16} />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════
          FOOTER
      ═══════════════════════════════ */}
      <footer className="border-t border-gray-100 py-8 px-4 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #2563EB, #7C3AED)" }}>
              <Shield size={13} className="text-white" />
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
