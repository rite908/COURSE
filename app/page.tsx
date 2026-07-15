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
  ArrowRight, BookOpen, Layers, HelpCircle, Target,
  User, FlaskConical, Briefcase, TrendingUp, Award,
  Shield, Compass, ChevronDown,
} from "lucide-react";
import HeroScene from "@/components/HeroScene";
import { getCurrentUser } from "@/lib/storage";

/* ── Brand SVGs ── */
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

/* ── Data ── */
const STATS = [
  { icon: <BookOpen size={22} />,   value: "5+",   label: "Chapters",  color: "#2563EB", bg: "#EEF3FF" },
  { icon: <Layers size={22} />,     value: "30+",  label: "Topics",    color: "#7C3AED", bg: "#F3EEFF" },
  { icon: <HelpCircle size={22} />, value: "450+", label: "MCQs",      color: "#0EA5E9", bg: "#F0F9FF" },
  { icon: <Target size={22} />,     value: "100%", label: "Practical", color: "#059669", bg: "#ECFDF5" },
];

const WHY_CARDS = [
  { icon: <User size={20} />,        color: "#2563EB", bg: "#EEF3FF", title: "Beginner Friendly",  desc: "Start from zero. No prior knowledge required."       },
  { icon: <FlaskConical size={20} />,color: "#7C3AED", bg: "#F3EEFF", title: "Practical Learning", desc: "Real world labs, tools and projects."                 },
  { icon: <Briefcase size={20} />,   color: "#0EA5E9", bg: "#F0F9FF", title: "Industry Relevant",  desc: "Skills in demand across the cybersecurity industry."  },
  { icon: <TrendingUp size={20} />,  color: "#059669", bg: "#ECFDF5", title: "Progress Tracking",  desc: "Track your progress and measure your mastery."        },
  { icon: <Award size={20} />,       color: "#D97706", bg: "#FFFBEB", title: "Certificate",        desc: "Earn a certificate and showcase your skills."         },
];

const SOCIAL_LINKS = [
  { label: "YouTube",   href: "https://twh-osint.vercel.app/twh", icon: <YoutubeIcon />   },
  { label: "Instagram", href: "https://twh-osint.vercel.app/twh", icon: <InstagramIcon /> },
  { label: "GitHub",    href: "https://twh-osint.vercel.app/twh", icon: <GithubIcon />    },
];

/* ── Shared layout constants ── */
const CONTENT_MAX   = 1280;   // max content width (matches navbar)
const CONTENT_PAD   = 40;     // horizontal padding inside content wrapper
const BREAK_MD      = 768;    // tablet breakpoint
const BREAK_LG      = 1024;   // desktop breakpoint

/* ══════════════════════════════════════════════════════════
   Page
══════════════════════════════════════════════════════════ */
export default function LandingPage() {
  const router  = useRouter();
  const [user,    setUser]    = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [vw,      setVw]      = useState(1280); // viewport width for inline responsive

  /* Viewport tracker — drives all responsive inline styles */
  useEffect(() => {
    const update = () => setVw(window.innerWidth);
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);

  const isMd = vw >= BREAK_MD;
  const isLg = vw >= BREAK_LG;

  /* Parallax */
  const { scrollY } = useScroll();
  const leftY  = useTransform(scrollY, [0, 400], [0, 28]);
  const rightY = useTransform(scrollY, [0, 400], [0, -18]);

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

  /* Fade-up animation helper */
  const fadeUp = (delay = 0) => ({
    initial: mounted ? { opacity: 0, y: 24 } : false,
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] },
  });

  /* ── Shared container style (matches navbar alignment) ── */
  const container: React.CSSProperties = {
    maxWidth: CONTENT_MAX,
    margin:   "0 auto",
    padding:  `0 ${CONTENT_PAD}px`,
    width:    "100%",
    boxSizing: "border-box",
  };

  return (
    <main style={{ background: "#F8FAFF", minHeight: "100vh", overflowX: "hidden" }}>

      {/* ═══════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════ */}
      <section
        style={{
          position:       "relative",
          overflow:       "hidden",
          background:     "linear-gradient(150deg, #FFFFFF 0%, #F5F8FF 55%, #EEF2FF 100%)",
          paddingTop:     `calc(72px + ${isLg ? 56 : 40}px)`,
          paddingBottom:  isLg ? 56 : 40,
        }}
      >
        {/* Dot grid bg */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "radial-gradient(circle, rgba(148,163,254,0.25) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }} />
        {/* Blue glow */}
        <div style={{ position:"absolute", left:"-8%", top:"10%", width:700, height:700, borderRadius:"50%", background:"radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 65%)", pointerEvents:"none" }} />
        {/* Purple glow */}
        <div style={{ position:"absolute", right:"-6%", top:"-5%", width:600, height:600, borderRadius:"50%", background:"radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 65%)", pointerEvents:"none" }} />

        {/* Content wrapper */}
        <div style={{ ...container, position: "relative", zIndex: 10 }}>

          {/* Two-column hero — flex row on desktop, col on mobile */}
          <div style={{
            display:        "flex",
            flexDirection:  isLg ? "row" : "column",
            alignItems:     isLg ? "center" : "stretch",
            gap:            isLg ? 32 : 40,
          }}>

            {/* ── LEFT: text (takes 48% on desktop) ── */}
            <motion.div
              style={{ y: leftY, flex: isLg ? "0 0 48%" : "unset", display: "flex", flexDirection: "column" }}
            >
              {/* Badge */}
              <motion.div {...fadeUp(0)} style={{ display: "inline-flex", alignItems: "center", gap: 8, alignSelf: "flex-start", marginBottom: 24 }}>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "6px 16px 6px 10px", borderRadius: 999,
                  background: "rgba(255,255,255,0.92)",
                  border: "1px solid rgba(37,99,235,0.20)",
                  boxShadow: "0 2px 12px rgba(37,99,235,0.08)",
                }}>
                  <span style={{ width: 20, height: 20, borderRadius: "50%", background: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Shield size={10} color="white" />
                  </span>
                  <span style={{ fontSize: "12.5px", fontWeight: 600, color: "#4B5563", letterSpacing: "0.02em" }}>
                    India's Premier Ethical Hacking{" "}
                    <span style={{ color: "#2563EB", fontWeight: 700 }}>Academy</span>
                  </span>
                </div>
              </motion.div>

              {/* Headline */}
              <motion.h1
                {...fadeUp(0.08)}
                style={{
                  fontWeight: 900,
                  lineHeight: 1.05,
                  letterSpacing: "-0.03em",
                  fontSize: isLg ? "clamp(2.8rem, 3.8vw, 4.2rem)" : isLg ? "2.6rem" : "2.2rem",
                  marginBottom: 20,
                }}
              >
                <span className="font-display" style={{ color: "#111827", display: "block" }}>Master Computers.</span>
                <span
                  className="font-display"
                  style={{
                    display: "block",
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
                style={{ color: "#6B7280", lineHeight: 1.7, marginBottom: 32, maxWidth: 420, fontSize: "1.05rem" }}
              >
                From zero to ethical hacking hero.{" "}
                A complete roadmap for future cybersecurity experts.
              </motion.p>

              {/* CTA buttons */}
              <motion.div {...fadeUp(0.28)} style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12, marginBottom: 28 }}>
                {/* Primary */}
                <motion.button
                  ref={btnRef}
                  onMouseMove={onMagnet}
                  onMouseLeave={onLeave}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={goStart}
                  style={{
                    x: springX, y: springY,
                    position: "relative",
                    display: "inline-flex", alignItems: "center", gap: 12,
                    padding: "14px 28px",
                    borderRadius: 16,
                    fontSize: "15px", fontWeight: 700, color: "white",
                    border: "none", cursor: "pointer", flexShrink: 0,
                    background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)",
                    boxShadow: "0 8px 28px rgba(37,99,235,0.38), 0 2px 8px rgba(0,0,0,0.06)",
                    overflow: "hidden",
                  }}
                >
                  <motion.span
                    style={{ position: "absolute", inset: 0, background: "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.18) 50%, transparent 65%)" }}
                    animate={{ x: ["-120%", "220%"] }}
                    transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 2.8 }}
                  />
                  <span style={{ position: "relative", zIndex: 1 }}>{user ? "Continue Learning" : "Start Your Journey"}</span>
                  <motion.span
                    style={{ position: "relative", zIndex: 1, width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
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
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 8,
                      padding: "14px 28px", borderRadius: 16,
                      fontSize: "15px", fontWeight: 600, color: "#374151",
                      background: "white", border: "1px solid #E5E7EB",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
                      cursor: "pointer", flexShrink: 0,
                    }}
                  >
                    <Compass size={16} color="#2563EB" />
                    Explore Chapters
                  </motion.div>
                </Link>
              </motion.div>

              {/* Social proof */}
              <motion.div {...fadeUp(0.40)} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ display: "flex", marginRight: 0 }}>
                  {(["#2563EB","#7C3AED","#0EA5E9","#059669"] as string[]).map((c, i) => (
                    <div key={i} style={{
                      width: 28, height: 28, borderRadius: "50%",
                      border: "2px solid white", marginLeft: i > 0 ? -8 : 0,
                      background: c, display: "flex", alignItems: "center",
                      justifyContent: "center", color: "white", fontSize: "10px", fontWeight: 700,
                    }}>
                      {["A","S","R","K"][i]}
                    </div>
                  ))}
                </div>
                <span style={{ fontSize: "12.5px", color: "#9CA3AF", fontWeight: 500 }}>
                  <span style={{ color: "#374151", fontWeight: 700 }}>500+</span> students already enrolled
                </span>
              </motion.div>
            </motion.div>

            {/* ── RIGHT: globe (takes remaining 52% on desktop) ── */}
            <motion.div
              style={{
                y: rightY,
                flex:    isLg ? "1 1 52%" : "unset",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <div style={{
                position: "relative",
                width:    "100%",
                maxWidth: isLg ? "none" : 500,
                margin:   isLg ? "0" : "0 auto",
                height:   isLg ? "clamp(360px, 44vw, 520px)" : "340px",
              }}>
                <HeroScene />
              </div>
            </motion.div>
          </div>

          {/* Scroll cue */}
          {isMd && (
            <motion.div
              initial={mounted ? { opacity: 0 } : false}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, marginTop: 28 }}
            >
              <span style={{ fontSize: "10.5px", fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.12em" }}>Scroll</span>
              <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}>
                <ChevronDown size={16} color="#9CA3AF" />
              </motion.div>
            </motion.div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          STATS STRIP
      ═══════════════════════════════════════════════════ */}
      <div style={{ background: "linear-gradient(180deg, #EEF2FF 0%, #FFFFFF 100%)", padding: "40px 0" }}>
        <div style={container}>
          {/* 4-col on desktop, 2-col on mobile */}
          <div style={{
            display: "grid",
            gridTemplateColumns: isMd ? "repeat(4, 1fr)" : "repeat(2, 1fr)",
            gap: 16,
          }}>
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={mounted ? { opacity: 0, y: 16 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.45 }}
                whileHover={{ y: -4 }}
                style={{
                  position:   "relative",
                  display:    "flex",
                  flexDirection: isMd ? "row" : "column",
                  alignItems: isMd ? "center" : "center",
                  textAlign:  isMd ? "left" : "center",
                  gap:        isMd ? 16 : 10,
                  padding:    isMd ? "20px 24px" : "20px 16px",
                  borderRadius: 20,
                  background: "white",
                  border:     "1px solid #F1F5F9",
                  boxShadow:  "0 2px 16px rgba(0,0,0,0.05)",
                  overflow:   "hidden",
                  cursor:     "default",
                }}
              >
                {/* Accent top bar */}
                <span style={{
                  position:   "absolute", top: 0, left: 0, right: 0, height: 3,
                  background: `linear-gradient(90deg, ${s.color}, transparent)`,
                }} />
                {/* Icon */}
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: s.bg, color: s.color, flexShrink: 0,
                }}>
                  {s.icon}
                </div>
                {/* Text */}
                <div>
                  <div style={{ fontWeight: 900, fontSize: "1.6rem", color: "#111827", lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: "11px", color: "#9CA3AF", fontWeight: 700, marginTop: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          WHY TWH ACADEMY
      ═══════════════════════════════════════════════════ */}
      <section id="features" style={{ background: "white", padding: "72px 0" }}>
        <div style={container}>

          {/* Header */}
          <motion.div
            initial={mounted ? { opacity: 0, y: 20 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ textAlign: "center", marginBottom: 48 }}
          >
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "6px 16px", borderRadius: 999,
              background: "#EFF6FF", border: "1px solid #DBEAFE",
              marginBottom: 20,
            }}>
              <Shield size={12} color="#3B82F6" />
              <span style={{ fontSize: "11.5px", fontWeight: 700, color: "#2563EB", textTransform: "uppercase", letterSpacing: "0.08em" }}>Why TWH Academy</span>
            </div>
            <h2 style={{
              fontWeight: 900, color: "#111827",
              fontSize: isLg ? "2.1rem" : isMd ? "1.8rem" : "1.55rem",
              letterSpacing: "-0.025em", marginBottom: 16,
            }}>
              Everything you need to become a{" "}
              <span style={{
                background: "linear-gradient(130deg,#2563EB,#7C3AED)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>
                Cybersecurity Expert
              </span>
            </h2>
            <p style={{ color: "#9CA3AF", fontSize: "15px", maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
              Structured curriculum, hands-on labs, and a community built for the next generation of ethical hackers.
            </p>
          </motion.div>

          {/* Cards grid: 1-col mobile · 2-col tablet · 3-col desktop */}
          <div style={{
            display: "grid",
            gridTemplateColumns: isLg ? "repeat(3, 1fr)" : isMd ? "repeat(2, 1fr)" : "1fr",
            gap: 20,
          }}>
            {WHY_CARDS.map((card, i) => (
              <motion.div
                key={card.title}
                initial={mounted ? { opacity: 0, y: 24 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.45 }}
                whileHover={{ y: -6 }}
                style={{
                  position:     "relative",
                  display:      "flex",
                  flexDirection:"column",
                  gap:          16,
                  background:   "white",
                  borderRadius: 20,
                  padding:      24,
                  border:       "1px solid #F1F5F9",
                  boxShadow:    "0 2px 16px rgba(0,0,0,0.05)",
                  overflow:     "hidden",
                  cursor:       "default",
                  /* Center the 5th card on desktop 3-col grid */
                  ...(isLg && i === 4 ? { gridColumnStart: 2 } : {}),
                }}
              >
                <span style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: 3,
                  background: `linear-gradient(90deg, ${card.color}, transparent)`,
                }} />
                <div style={{
                  width: 44, height: 44, borderRadius: 14,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: card.bg, color: card.color, flexShrink: 0,
                }}>
                  {card.icon}
                </div>
                <div>
                  <h3 style={{ fontWeight: 700, color: "#111827", fontSize: "14px", marginBottom: 6 }}>{card.title}</h3>
                  <p style={{ color: "#9CA3AF", fontSize: "13px", lineHeight: 1.65 }}>{card.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          CTA BANNER
      ═══════════════════════════════════════════════════ */}
      <section style={{ background: "#F4F8FF", padding: "72px 0" }}>
        <div style={{ ...container, maxWidth: 700 }}>
          <motion.div
            initial={mounted ? { opacity: 0, y: 24 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            style={{
              position:     "relative",
              borderRadius: 28,
              padding:      isLg ? "64px 80px" : isMd ? "48px 56px" : "40px 32px",
              textAlign:    "center",
              overflow:     "hidden",
              background:   "linear-gradient(135deg, #1D4ED8 0%, #7C3AED 100%)",
              boxShadow:    "0 24px 64px rgba(37,99,235,0.30)",
            }}
          >
            <div style={{ position:"absolute", top:"-60px", right:"-60px", width:200, height:200, borderRadius:"50%", background:"rgba(255,255,255,0.05)", pointerEvents:"none" }} />
            <div style={{ position:"absolute", bottom:"-48px", left:"-48px", width:160, height:160, borderRadius:"50%", background:"rgba(255,255,255,0.05)", pointerEvents:"none" }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ width:56, height:56, borderRadius:16, background:"rgba(255,255,255,0.15)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 24px" }}>
                <Shield size={24} color="white" />
              </div>
              <h2 style={{ fontWeight:900, color:"white", fontSize: isLg ? "2.2rem" : "1.75rem", letterSpacing:"-0.025em", marginBottom:12 }}>
                Ready to become a<br />White Hat Hacker?
              </h2>
              <p style={{ color:"#BFDBFE", marginBottom:32, fontSize:"16px", lineHeight:1.65 }}>
                Join the academy. Start free. Master everything.
              </p>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={goStart}
                style={{
                  display:"inline-flex", alignItems:"center", gap:12,
                  padding:"14px 40px", borderRadius:16,
                  background:"white", color:"#2563EB",
                  fontWeight:700, fontSize:"15px",
                  border:"none", cursor:"pointer",
                  boxShadow:"0 8px 28px rgba(0,0,0,0.18)",
                }}
              >
                {user ? "Go to Chapters" : "Start Learning — It's Free"}
                <ArrowRight size={16} />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════════════ */}
      <footer style={{ background:"white", borderTop:"1px solid #F1F5F9" }}>
        <div style={{ ...container, padding: "32px 40px" }}>
          <div style={{
            display: "flex",
            flexDirection: isMd ? "row" : "column",
            alignItems: isMd ? "center" : "center",
            justifyContent: "space-between",
            gap: 20,
            textAlign: isMd ? "left" : "center",
          }}>
            {/* Brand */}
            <div style={{ display:"flex", alignItems:"center", gap:12, flexShrink:0 }}>
              <div style={{ width:36, height:36, borderRadius:12, background:"linear-gradient(135deg,#2563EB,#7C3AED)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Shield size={15} color="white" />
              </div>
              <div>
                <div style={{ fontWeight:700, fontSize:"14px", color:"#111827", lineHeight:1.3 }}>TWH Academy</div>
                <div style={{ fontSize:"10px", color:"#9CA3AF", lineHeight:1.3 }}>Ethical Hacking Academy</div>
              </div>
            </div>

            {/* Credit */}
            <p style={{ color:"#9CA3AF", fontSize:"14px", order: isMd ? 0 : 1 }}>
              Built with ❤️ by{" "}
              <span style={{ color:"#2563EB", fontWeight:600 }}>Afsar Ali</span>{" "}
              — Technical White Hat
            </p>

            {/* Links + social */}
            <div style={{ display:"flex", alignItems:"center", gap:16, flexWrap:"wrap", justifyContent: isMd ? "flex-end" : "center", flexShrink:0 }}>
              <div style={{ display:"flex", gap:8 }}>
                {SOCIAL_LINKS.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                    style={{ width:32, height:32, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", color:"#9CA3AF", textDecoration:"none", background:"transparent", border:"none" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color="#2563EB"; (e.currentTarget as HTMLElement).style.background="#EFF6FF"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color="#9CA3AF"; (e.currentTarget as HTMLElement).style.background="transparent"; }}
                  >{s.icon}</a>
                ))}
              </div>
              <div style={{ display:"flex", gap:20, fontSize:"14px", color:"#9CA3AF" }}>
                <Link href="/privacy" style={{ color:"#9CA3AF", textDecoration:"none" }}>Privacy</Link>
                <Link href="/terms"   style={{ color:"#9CA3AF", textDecoration:"none" }}>Terms</Link>
                <Link href="/contact" style={{ color:"#9CA3AF", textDecoration:"none" }}>Contact</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
