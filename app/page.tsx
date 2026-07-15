"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Layers,
  HelpCircle,
  Target,
  User,
  FlaskConical,
  Briefcase,
  TrendingUp,
  Award,
  Shield,
  Compass,
  ChevronDown,
} from "lucide-react";
import HeroScene from "@/components/HeroScene";
import { getCurrentUser } from "@/lib/storage";

/* ── Inline brand SVGs (lucide-react doesn't ship these) ── */
const YoutubeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.4 3.5 12 3.5 12 3.5s-7.4 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c2 .6 9.4.6 9.4.6s7.4 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" />
  </svg>
);
const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
  </svg>
);
const GithubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.6-4-1.6-.6-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.4-1.3-5.4-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.6.1-3.2 0 0 1-.3 3.3 1.2a11 11 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.7 5.6-5.4 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .5Z" />
  </svg>
);

/* ── Static data ── */
const STATS = [
  { icon: <BookOpen size={20} />,   value: "5+",   label: "Chapters",  color: "#2563EB", bg: "#EEF3FF" },
  { icon: <Layers size={20} />,     value: "30+",  label: "Topics",    color: "#7C3AED", bg: "#F3EEFF" },
  { icon: <HelpCircle size={20} />, value: "450+", label: "MCQs",      color: "#0EA5E9", bg: "#F0F9FF" },
  { icon: <Target size={20} />,     value: "100%", label: "Practical", color: "#059669", bg: "#ECFDF5" },
];

const WHY_CARDS = [
  { icon: <User size={20} />,        color: "#2563EB", bg: "#EEF3FF", title: "Beginner Friendly",  desc: "Start from zero. No prior knowledge required."          },
  { icon: <FlaskConical size={20} />,color: "#7C3AED", bg: "#F3EEFF", title: "Practical Learning", desc: "Real world labs, tools and projects."                    },
  { icon: <Briefcase size={20} />,   color: "#0EA5E9", bg: "#F0F9FF", title: "Industry Relevant",  desc: "Skills in demand across the cybersecurity industry."    },
  { icon: <TrendingUp size={20} />,  color: "#059669", bg: "#ECFDF5", title: "Progress Tracking",  desc: "Track your progress and measure your mastery."          },
  { icon: <Award size={20} />,       color: "#D97706", bg: "#FFFBEB", title: "Certificate",        desc: "Earn a certificate and showcase your skills."           },
];

const SOCIAL_LINKS = [
  { label: "YouTube",   href: "https://twh-osint.vercel.app/twh", icon: <YoutubeIcon />  },
  { label: "Instagram", href: "https://twh-osint.vercel.app/twh", icon: <InstagramIcon />},
  { label: "GitHub",    href: "https://twh-osint.vercel.app/twh", icon: <GithubIcon />   },
];

/* ══════════════════════════════════════════════════════════
   Page
══════════════════════════════════════════════════════════ */
export default function LandingPage() {
  const router  = useRouter();
  const [user,    setUser]    = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  /* Parallax */
  const { scrollY } = useScroll();
  const leftY  = useTransform(scrollY, [0, 400], [0, 30]);
  const rightY = useTransform(scrollY, [0, 400], [0, -20]);

  /* Magnetic CTA */
  const btnRef  = useRef<HTMLButtonElement>(null);
  const bx      = useMotionValue(0);
  const by      = useMotionValue(0);
  const springX = useSpring(bx, { stiffness: 300, damping: 30 });
  const springY = useSpring(by, { stiffness: 300, damping: 30 });

  const onMagnet = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    bx.set((e.clientX - (r.left + r.width  / 2)) * 0.25);
    by.set((e.clientY - (r.top  + r.height / 2)) * 0.25);
  };
  const onLeave = () => { bx.set(0); by.set(0); };

  useEffect(() => { setUser(getCurrentUser()); setMounted(true); }, []);
  const goStart = () => router.push(user ? "/chapters" : "/login");

  /* Stagger helpers */
  const fadeUp = (delay = 0) => ({
    initial: mounted ? { opacity: 0, y: 24 } : false,
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <main
      className="min-h-screen overflow-x-hidden"
      style={{ background: "#F8FAFF" }}
    >

      {/* ════════════════════════════════════════════════
          HERO — full-viewport, two-column
      ════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(150deg, #FFFFFF 0%, #F5F8FF 55%, #EEF2FF 100%)",
          paddingTop: "calc(72px + 48px)",
          paddingBottom: 48,
        }}
      >
        {/* Dot grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(148,163,254,0.25) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* Ambient glows */}
        <div className="absolute pointer-events-none" style={{ left: "-10%", top: "10%", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 65%)" }} />
        <div className="absolute pointer-events-none" style={{ right: "-8%",  top: "-5%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 65%)" }} />

        {/* ── Inner wrapper — constrained width, no overflow ── */}
        <div className="relative z-10" style={{ maxWidth: 1280, margin: "0 auto", padding: "0 40px" }}>

          {/* Two-column grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-6 items-center">

            {/* ── LEFT: text ── */}
            <motion.div style={{ y: leftY }} className="flex flex-col">

              {/* Badge */}
              <motion.div {...fadeUp(0)} className="inline-flex items-center gap-2 self-start mb-6">
                <div
                  className="inline-flex items-center gap-2 px-4 py-[6px] rounded-full"
                  style={{
                    background: "rgba(255,255,255,0.92)",
                    border: "1px solid rgba(37,99,235,0.20)",
                    boxShadow: "0 2px 12px rgba(37,99,235,0.08)",
                  }}
                >
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: "#2563EB" }}
                  >
                    <Shield size={10} className="text-white" />
                  </span>
                  <span className="text-[12.5px] font-semibold text-gray-600 tracking-wide">
                    India's Premier Ethical Hacking{" "}
                    <span className="text-blue-600 font-bold">Academy</span>
                  </span>
                </div>
              </motion.div>

              {/* Headline */}
              <motion.h1
                {...fadeUp(0.08)}
                className="font-black leading-[1.06] tracking-tight mb-6"
                style={{ fontSize: "clamp(2.6rem, 4.5vw, 4.2rem)", letterSpacing: "-0.03em" }}
              >
                <span className="text-gray-900 block font-display">Master Computers.</span>
                <span
                  className="block font-display"
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
                {...fadeUp(0.18)}
                className="text-gray-500 leading-relaxed mb-8 max-w-[420px]"
                style={{ fontSize: "1.05rem" }}
              >
                From zero to ethical hacking hero.{" "}
                A complete roadmap for future cybersecurity experts.
              </motion.p>

              {/* CTA row */}
              <motion.div {...fadeUp(0.28)} className="flex flex-wrap items-center gap-3 mb-8">
                {/* Primary */}
                <motion.button
                  ref={btnRef}
                  onMouseMove={onMagnet}
                  onMouseLeave={onLeave}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={goStart}
                  className="relative inline-flex items-center gap-3 px-7 py-[14px] rounded-2xl text-[15px] font-bold text-white overflow-hidden shrink-0"
                  style={{
                    x: springX,
                    y: springY,
                    background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)",
                    boxShadow: "0 8px 28px rgba(37,99,235,0.38), 0 2px 8px rgba(0,0,0,0.06)",
                  }}
                >
                  {/* Shimmer sweep */}
                  <motion.span
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.18) 50%, transparent 65%)" }}
                    animate={{ x: ["-120%", "220%"] }}
                    transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 2.8 }}
                  />
                  <span className="relative z-10">{user ? "Continue Learning" : "Start Your Journey"}</span>
                  <motion.span
                    className="relative z-10 w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(255,255,255,0.25)" }}
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity }}
                  >
                    <ArrowRight size={14} />
                  </motion.span>
                </motion.button>

                {/* Secondary */}
                <Link href="/chapters">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="inline-flex items-center gap-2 px-7 py-[14px] rounded-2xl text-[15px] font-semibold text-gray-700 bg-white border border-gray-200 shrink-0 cursor-pointer"
                    style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}
                  >
                    <Compass size={16} className="text-blue-600" />
                    Explore Chapters
                  </motion.div>
                </Link>
              </motion.div>

              {/* Social proof */}
              <motion.div
                {...fadeUp(0.40)}
                className="flex items-center gap-3"
              >
                <div className="flex -space-x-2">
                  {(["#2563EB","#7C3AED","#0EA5E9","#059669"] as string[]).map((c, i) => (
                    <div
                      key={i}
                      className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-white text-[10px] font-bold"
                      style={{ background: c }}
                    >
                      {["A","S","R","K"][i]}
                    </div>
                  ))}
                </div>
                <span className="text-[12.5px] text-gray-400 font-medium">
                  <span className="text-gray-700 font-bold">500+</span> students already enrolled
                </span>
              </motion.div>
            </motion.div>

            {/* ── RIGHT: hero scene ── */}
            <motion.div
              style={{ y: rightY }}
              className="relative w-full flex items-center justify-center"
            >
              {/*
                Constrained box — the HeroScene uses absolute-positioned
                children so we need an explicit height + overflow:hidden.
              */}
              <div
                className="relative w-full"
                style={{
                  height: "clamp(340px, 46vw, 520px)",
                  maxWidth: 520,
                  margin: "0 auto",
                  overflow: "visible",
                }}
              >
                <HeroScene />
              </div>
            </motion.div>
          </div>

          {/* Scroll cue */}
          <motion.div
            initial={mounted ? { opacity: 0 } : false}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="hidden sm:flex flex-col items-center gap-1 mt-8 self-center"
          >
            <span className="text-[10.5px] font-semibold text-gray-400 uppercase tracking-widest">Scroll</span>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown size={16} className="text-gray-400" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          STATS STRIP
      ════════════════════════════════════════════════ */}
      <div
        className="w-full"
        style={{ background: "linear-gradient(180deg, #EEF2FF 0%, #FFFFFF 100%)" }}
      >
        <div className="w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={mounted ? { opacity: 0, y: 16 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.45 }}
                whileHover={{ y: -4 }}
                className="relative flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left gap-3 sm:gap-4 px-4 py-5 rounded-2xl bg-white border border-gray-100 overflow-hidden"
                style={{ boxShadow: "0 2px 14px rgba(0,0,0,0.05)" }}
              >
                {/* Top accent line */}
                <span
                  className="absolute top-0 left-0 right-0 h-[3px]"
                  style={{ background: `linear-gradient(90deg, ${s.color}, transparent)` }}
                />
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: s.bg, color: s.color }}
                >
                  {s.icon}
                </div>
                <div>
                  <div className="font-black text-[1.4rem] text-gray-900 leading-none">{s.value}</div>
                  <div className="text-[10px] text-gray-400 font-semibold mt-1 uppercase tracking-wider">{s.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════
          WHY TWH ACADEMY
      ════════════════════════════════════════════════ */}
      <section
        id="features"
        className="w-full bg-white"
        style={{ padding: "72px 0" }}
      >
        <div style={{ maxWidth: 1152, margin: "0 auto", padding: "0 24px" }}>

          {/* Section header */}
          <motion.div
            initial={mounted ? { opacity: 0, y: 20 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-5">
              <Shield size={12} className="text-blue-500" />
              <span className="text-[11.5px] font-bold text-blue-600 uppercase tracking-wider">Why TWH Academy</span>
            </div>
            <h2
              className="font-black text-gray-900 mb-4"
              style={{ fontSize: "clamp(1.55rem, 3vw, 2.1rem)", letterSpacing: "-0.025em" }}
            >
              Everything you need to become a{" "}
              <span style={{
                background: "linear-gradient(130deg,#2563EB,#7C3AED)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                Cybersecurity Expert
              </span>
            </h2>
            <p className="text-gray-400 text-[15px] max-w-lg mx-auto leading-relaxed">
              Structured curriculum, hands-on labs, and a community built for the next generation of ethical hackers.
            </p>
          </motion.div>

          {/*
            5 cards — 1 col mobile · 2 col tablet · 3 col desktop.
            Last two cards on the 2-col row are centred with col-start trick.
          */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {WHY_CARDS.map((card, i) => (
              <motion.div
                key={card.title}
                initial={mounted ? { opacity: 0, y: 24 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.45 }}
                whileHover={{ y: -6 }}
                /* On lg screens the 5th card sits alone → center it */
                className={`relative flex flex-col gap-4 bg-white rounded-2xl p-6 border border-gray-100 overflow-hidden transition-all${
                  i === 4 ? " lg:col-start-2" : ""
                }`}
                style={{ boxShadow: "0 2px 14px rgba(0,0,0,0.05)" }}
              >
                <span
                  className="absolute top-0 left-0 right-0 h-[3px]"
                  style={{ background: `linear-gradient(90deg, ${card.color}, transparent)` }}
                />
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ background: card.bg, color: card.color }}
                >
                  {card.icon}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-[14px] mb-1.5">{card.title}</h3>
                  <p className="text-gray-400 text-[13px] leading-relaxed">{card.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          CTA BANNER
      ════════════════════════════════════════════════ */}
      <section
        className="w-full"
        style={{ background: "#F4F8FF", padding: "72px 0" }}
      >
        <div style={{ maxWidth: 672, margin: "0 auto", padding: "0 24px" }}>
          <motion.div
            initial={mounted ? { opacity: 0, y: 24 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="relative rounded-3xl p-10 sm:p-16 text-center overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #1D4ED8 0%, #7C3AED 100%)",
              boxShadow: "0 24px 64px rgba(37,99,235,0.30)",
            }}
          >
            {/* Decorative circles */}
            <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/5 pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-44 h-44 rounded-full bg-white/5 pointer-events-none" />

            <div className="relative z-10">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6"
                style={{ background: "rgba(255,255,255,0.15)" }}
              >
                <Shield size={24} className="text-white" />
              </div>
              <h2
                className="font-black text-white mb-3"
                style={{ fontSize: "clamp(1.7rem, 3vw, 2.2rem)", letterSpacing: "-0.025em" }}
              >
                Ready to become a<br />White Hat Hacker?
              </h2>
              <p className="text-blue-200 mb-8 text-base leading-relaxed">
                Join the academy. Start free. Master everything.
              </p>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={goStart}
                className="inline-flex items-center gap-3 px-10 py-4 rounded-2xl bg-white text-blue-600 font-bold text-[15px]"
                style={{ boxShadow: "0 8px 28px rgba(0,0,0,0.18)" }}
              >
                {user ? "Go to Chapters" : "Start Learning — It's Free"}
                <ArrowRight size={16} />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════════════ */}
      <footer className="w-full bg-white border-t border-gray-100">
        <div style={{ maxWidth: 1152, margin: "0 auto", padding: "32px 24px" }}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5">

            {/* Brand */}
            <div className="flex items-center gap-3 shrink-0">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #2563EB, #7C3AED)" }}
              >
                <Shield size={15} className="text-white" />
              </div>
              <div>
                <div className="font-bold text-sm text-gray-900 leading-tight">TWH Academy</div>
                <div className="text-[10px] text-gray-400 leading-tight">Ethical Hacking Academy</div>
              </div>
            </div>

            {/* Credit */}
            <p className="text-gray-400 text-sm text-center order-last sm:order-none">
              Built with ❤️ by{" "}
              <span className="text-blue-600 font-semibold">Afsar Ali</span>{" "}
              — Technical White Hat
            </p>

            {/* Links + social */}
            <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-end shrink-0">
              <div className="flex items-center gap-2">
                {SOCIAL_LINKS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <Link href="/privacy" className="hover:text-gray-600 transition-colors">Privacy</Link>
                <Link href="/terms"   className="hover:text-gray-600 transition-colors">Terms</Link>
                <Link href="/contact" className="hover:text-gray-600 transition-colors">Contact</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
