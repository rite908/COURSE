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
import { getCurrentUser } from "@/lib/storage";

/* ─── Data ─────────────────────────────────── */

const STATS = [
  { icon: <BookOpen  size={22} />, value: "5+",   label: "Chapters",  color: "#2563EB", bg: "#EEF3FF" },
  { icon: <Layers    size={22} />, value: "30+",  label: "Topics",    color: "#7C3AED", bg: "#F3EEFF" },
  { icon: <HelpCircle size={22}/>, value: "450+", label: "MCQs",      color: "#0EA5E9", bg: "#F0F9FF" },
  { icon: <Target    size={22} />, value: "100%", label: "Practical", color: "#059669", bg: "#ECFDF5" },
];

const WHY_CARDS = [
  { icon: <User size={22} />,        color: "#2563EB", bg: "#EEF3FF", title: "Beginner Friendly",   desc: "Start from zero. No prior knowledge required."            },
  { icon: <FlaskConical size={22} />,color: "#7C3AED", bg: "#F3EEFF", title: "Practical Learning",  desc: "Real world labs, tools and projects."                     },
  { icon: <Briefcase size={22} />,   color: "#0EA5E9", bg: "#F0F9FF", title: "Industry Relevant",   desc: "Skills that are in demand in cybersecurity industry."     },
  { icon: <TrendingUp size={22} />,  color: "#059669", bg: "#ECFDF5", title: "Progress Tracking",   desc: "Track your progress and measure your mastery."            },
  { icon: <Award size={22} />,       color: "#D97706", bg: "#FFFBEB", title: "Certificate",         desc: "Earn certificate and showcase your skills."              },
];


/* ─── Page ──────────────────────────────────── */

export default function LandingPage() {
  const router   = useRouter();
  const [user,    setUser]    = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const { scrollY } = useScroll();
  const heroLeftY  = useTransform(scrollY, [0, 500], [0, 40]);
  const heroRightY = useTransform(scrollY, [0, 500], [0, -30]);

  const btnRef  = useRef<HTMLButtonElement>(null);
  const btnX    = useMotionValue(0);
  const btnY    = useMotionValue(0);
  const springX = useSpring(btnX, { stiffness: 300, damping: 30 });
  const springY = useSpring(btnY, { stiffness: 300, damping: 30 });

  const handleMagnet = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    btnX.set((e.clientX - (r.left + r.width  / 2)) * 0.28);
    btnY.set((e.clientY - (r.top  + r.height / 2)) * 0.28);
  };
  const handleMagnetLeave = () => { btnX.set(0); btnY.set(0); };

  useEffect(() => { setUser(getCurrentUser()); setMounted(true); }, []);
  const goStart = () => router.push(user ? "/chapters" : "/login");

  return (
    <main className="min-h-screen overflow-x-hidden" style={{ background: "#F8FAFF" }}>

      {/* ════════════════════════════════════════
          HERO
      ════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden flex flex-col justify-center"
        style={{
          background: "linear-gradient(145deg, #FFFFFF 0%, #F5F8FF 50%, #EEF2FF 100%)",
          minHeight: "100vh",
          paddingTop: 72,
        }}
      >
        {/* Dot grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(148,163,254,0.28) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            opacity: 0.8,
          }}
        />
        {/* Blue left glow */}
        <div className="absolute pointer-events-none" style={{
          left: -200, top: "15%", width: 800, height: 800, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 65%)",
        }} />
        {/* Purple right glow */}
        <div className="absolute pointer-events-none" style={{
          right: -120, top: -80, width: 700, height: 700, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 65%)",
        }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 w-full flex flex-col">

          {/* ── Two-column split ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pt-10 pb-6">

            {/* LEFT ── Text */}
            <motion.div
              style={{ y: heroLeftY }}
              className="flex flex-col justify-center"
            >
              {/* Badge */}
              <motion.div
                initial={mounted ? { opacity: 0, y: -12 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="inline-flex items-center gap-2 self-start mb-8"
                style={{
                  background: "rgba(255,255,255,0.90)",
                  border: "1px solid rgba(37,99,235,0.20)",
                  boxShadow: "0 2px 12px rgba(37,99,235,0.08)",
                  borderRadius: 999,
                  padding: "6px 16px 6px 10px",
                }}
              >
                <span className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                  <Shield size={10} className="text-white" />
                </span>
                <span className="text-[12.5px] font-semibold text-gray-600 tracking-wide">
                  India's Premier Ethical Hacking{" "}
                  <span className="text-blue-600 font-bold">Academy</span>
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={mounted ? { opacity: 0, y: 32 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className="font-black leading-[1.05] tracking-tight mb-8"
                style={{ fontSize: "clamp(2.4rem, 4.2vw, 4rem)", letterSpacing: "-0.03em" }}
              >
                <span className="text-gray-900 block">Master Computers.</span>
                <span
                  className="block"
                  style={{
                    background: "linear-gradient(130deg, #2563EB 0%, #7C3AED 100%)",
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
                transition={{ delay: 0.20, duration: 0.50 }}
                className="text-gray-500 leading-relaxed mb-12 max-w-md"
                style={{ fontSize: "1.05rem" }}
              >
                From zero to ethical hacking hero.{" "}
                A complete roadmap for future cybersecurity experts.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={mounted ? { opacity: 0, y: 16 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.32, duration: 0.48 }}
                className="flex flex-wrap items-center gap-4"
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
                  className="relative flex items-center gap-3 px-8 py-4 rounded-2xl
                    text-[15px] font-bold text-white overflow-hidden shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)",
                    boxShadow: "0 8px 30px rgba(37,99,235,0.40), 0 2px 8px rgba(0,0,0,0.06)",
                  }}
                >
                  {/* Shimmer */}
                  <motion.span
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.18) 50%, transparent 65%)" }}
                    animate={{ x: ["-120%", "220%"] }}
                    transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 2.8 }}
                  />
                  <span className="relative z-10">{user ? "Continue Learning" : "Start Your Journey"}</span>
                  <motion.div
                    className="relative z-10 w-8 h-8 rounded-full bg-white/25 flex items-center justify-center"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity }}
                  >
                    <ArrowRight size={15} />
                  </motion.div>
                </motion.button>

                {/* Secondary */}
                <Link href="/chapters">
                  <motion.div
                    whileHover={{ scale: 1.02, borderColor: "rgba(37,99,235,0.30)" }}
                    className="flex items-center gap-3 px-8 py-4 rounded-2xl text-[15px] font-semibold
                      text-gray-600 bg-white border border-gray-200 transition-all cursor-pointer shrink-0"
                    style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
                  >
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-gray-300" />
                    </div>
                    Explore Chapters
                  </motion.div>
                </Link>
              </motion.div>

              {/* Trust line */}
              <motion.div
                initial={mounted ? { opacity: 0 } : false}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55, duration: 0.5 }}
                className="flex items-center gap-3 mt-10"
              >
                <div className="flex -space-x-2">
                  {["#2563EB","#7C3AED","#0EA5E9","#059669"].map((c,i) => (
                    <div key={i} className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-white text-[10px] font-bold"
                      style={{ background: c }}>
                      {["A","S","R","K"][i]}
                    </div>
                  ))}
                </div>
                <span className="text-[12.5px] text-gray-400 font-medium">
                  <span className="text-gray-700 font-bold">500+</span> students already enrolled
                </span>
              </motion.div>
            </motion.div>

            {/* RIGHT ── Globe */}
            <motion.div
              style={{ y: heroRightY, height: "clamp(380px, 50vh, 560px)" }}
              className="relative w-full flex items-center justify-center"
            >
              <HeroScene />
            </motion.div>
          </div>

          {/* ── Stats row ── */}
          <motion.div
            initial={mounted ? { opacity: 0, y: 24 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.55 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 pb-8"
          >
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={mounted ? { opacity: 0, y: 14 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.07 }}
                whileHover={{ y: -5, boxShadow: `0 12px 32px ${s.color}18` }}
                className="flex items-center gap-4 px-5 py-5 rounded-2xl bg-white border border-gray-100 transition-all cursor-default"
                style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: s.bg, color: s.color }}
                >
                  {s.icon}
                </div>
                <div>
                  <div className="font-black text-[1.6rem] text-gray-900 leading-none">{s.value}</div>
                  <div className="text-xs text-gray-400 font-semibold mt-1 uppercase tracking-wider">{s.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          WHY CHOOSE TWH ACADEMY
      ════════════════════════════════════════ */}
      <section className="py-24 px-6" style={{ background: "#FFFFFF" }} id="features">
        <div className="max-w-6xl mx-auto">

          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55 }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-5">
              <Shield size={13} className="text-blue-500" />
              <span className="text-[12px] font-bold text-blue-600 uppercase tracking-wider">Why TWH Academy</span>
            </div>
            <h2
              className="text-[2rem] font-black text-gray-900 mb-4"
              style={{ letterSpacing: "-0.025em" }}
            >
              Everything you need to become a{" "}
              <span style={{
                background: "linear-gradient(130deg,#2563EB,#7C3AED)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>
                Cybersecurity Expert
              </span>
            </h2>
            <p className="text-gray-400 text-base max-w-lg mx-auto">
              Structured curriculum, hands-on labs, and a community built for the next generation of ethical hackers.
            </p>
          </motion.div>

          {/* 5 cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {WHY_CARDS.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.45 }}
                whileHover={{ y: -8, boxShadow: `0 20px 48px ${card.color}1A` }}
                className="flex flex-col gap-4 bg-white rounded-2xl p-6 border border-gray-100 transition-all cursor-default"
                style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ background: card.bg, color: card.color }}
                >
                  {card.icon}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-[14px] mb-2 leading-snug">{card.title}</h3>
                  <p className="text-gray-400 text-[12.5px] leading-relaxed">{card.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          CTA BANNER
      ════════════════════════════════════════ */}
      <section className="py-20 px-6" style={{ background: "#F4F8FF" }}>
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="relative rounded-3xl p-14 text-center overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #1D4ED8 0%, #7C3AED 100%)",
              boxShadow: "0 28px 72px rgba(37,99,235,0.32)",
            }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full -translate-y-1/2 translate-x-1/2 bg-white/5" />
            <div className="absolute bottom-0 left-0 w-44 h-44 rounded-full translate-y-1/2 -translate-x-1/2 bg-white/5" />
            <div className="relative z-10">
              <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                <Shield size={24} className="text-white" />
              </div>
              <h2 className="text-3xl font-black text-white mb-3" style={{ letterSpacing: "-0.025em" }}>
                Ready to become a<br />White Hat Hacker?
              </h2>
              <p className="text-blue-200 mb-8 text-base leading-relaxed">
                Join the academy. Start free. Master everything.
              </p>
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: "0 10px 36px rgba(0,0,0,0.22)" }}
                whileTap={{ scale: 0.97 }}
                onClick={goStart}
                className="inline-flex items-center gap-3 px-10 py-4 rounded-2xl
                  bg-white text-blue-600 font-bold text-[15px] shadow-lg"
              >
                {user ? "Go to Chapters" : "Start Learning — It's Free"}
                <ArrowRight size={16} />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════ */}
      <footer className="border-t border-gray-100 py-8 px-6 bg-white" id="contact">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #2563EB, #7C3AED)" }}
            >
              <Shield size={15} className="text-white" />
            </div>
            <div>
              <div className="font-bold text-sm text-gray-900 leading-none">TWH Academy</div>
              <div className="text-[10px] text-gray-400 mt-0.5 leading-none">Ethical Hacking Academy</div>
            </div>
          </div>
          <p className="text-gray-400 text-sm text-center">
            Built with ❤️ by{" "}
            <span className="text-blue-600 font-semibold">Afsar Ali</span> — Technical White Hat
          </p>
          <div className="flex items-center gap-5 text-sm text-gray-400">
            <Link href="#" className="hover:text-gray-600 transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-gray-600 transition-colors">Terms</Link>
            <Link href="#contact" className="hover:text-gray-600 transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
