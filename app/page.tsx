"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence,
} from "framer-motion";
import {
  ArrowRight, BookOpen, Layers, HelpCircle, Target, User, FlaskConical,
  Briefcase, TrendingUp, Award, Shield, Compass, ChevronDown, Terminal,
  Cpu, Wifi, Code2, Lock, ChevronRight, Star, Zap, Globe2, CheckCircle2,
} from "lucide-react";
import HeroScene from "@/components/HeroScene";
import { getCurrentUser } from "@/lib/storage";
import { useTheme } from "@/lib/theme";

/* ─── Course data ─── */
const CHAPTERS = [
  {
    num: 1, icon: <Shield size={22} />,
    color: "#2563EB", lightBg: "#EEF3FF", darkBg: "rgba(37,99,235,0.15)",
    title: "Startup", subtitle: "Hacker Ki Asli Duniya",
    desc: "Zero se shuru — hacker kaun hota hai, kaise sochta hai, aur ethical hacking ka asli matlab.",
    topics: ["Hacker Ka Asli Matlab","Hacker Hack Karta Kaise Hai?","Types of Hackers","Developer vs Hacker","Hacker Mindset","Ethical Hacking Kya Hai?"],
    mcqs: 90,
  },
  {
    num: 2, icon: <Cpu size={22} />,
    color: "#7C3AED", lightBg: "#F3EEFF", darkBg: "rgba(124,58,237,0.15)",
    title: "How Computer Works", subtitle: "Andar Se Bahar Tak",
    desc: "Computer ki aatma — binary se lekar OS tak, har ek cheez kaise kaam karti hai andar se.",
    topics: ["Computer Humari Basha Nahi Samajhta","Hardware — Computer Ka Sharir","CPU — Processing Kaise Hoti Hai","Memory — Data Kahan Rehta Hai","Data Storage — Har Cheez Ultimately Bits Hai","OS — Software Aur Hardware Ka Bridge","Program Execution — Code Kaise Chalta Hai","Boot — Computer Zinda Kaise Hota Hai","File System — Storage Ka Asli Kaam","I/O — Poora Picture Clear"],
    mcqs: 150,
  },
  {
    num: 3, icon: <Wifi size={22} />,
    color: "#0EA5E9", lightBg: "#F0F9FF", darkBg: "rgba(14,165,233,0.15)",
    title: "Networking", subtitle: "Computers Baat Kaise Karte Hain",
    desc: "IP address se lekar firewall tak — networks ka poora system, bilkul simple language mein.",
    topics: ["Network Kya Hai — Computers Ka Mohalla","IP Address — Har Device Ka Ghar Ka Pata","MAC Address — Hardware Ki Asli Pehchaan","Protocols — Computers Ki Agreed Bhasha","Ports — Ek Ghar Ke Alag Alag Darwaze","DNS — Internet Ka Phone Book","HTTP vs HTTPS — Web Request Ka Safar","Router & Switch — Data Kahan Jaaye?","Packets — Data Toot Ke Kaise Bheji Jaati Hai","Firewall & Basic Network Security"],
    mcqs: 150,
  },
  {
    num: 4, icon: <Terminal size={22} />,
    color: "#059669", lightBg: "#ECFDF5", darkBg: "rgba(5,150,105,0.15)",
    title: "Linux & Command Line", subtitle: "Hacker Ka Terminal",
    desc: "Linux kya hai, kyun zaroori hai, aur terminal se pehla rishta — Termux se shuru karo.",
    topics: ["Linux Kya Hai — Windows Se Kyun Alag Hai","Termux — Android Pe Linux","Terminal Ki Pehli Class — Package, Repository, Update"],
    mcqs: 45,
  },
  {
    num: 5, icon: <Code2 size={22} />,
    color: "#DC2626", lightBg: "#FEF2F2", darkBg: "rgba(220,38,38,0.15)",
    title: "Kali Linux", subtitle: "Hacker Ka Ghar",
    desc: "Kali Linux install karo, seekho, aur master karo — terminal navigation se lekar bash scripting tak.",
    topics: ["Kali Linux Kya Hai — Poori Kahani","Kali Linux Kaise Laayein — Installation Methods","VirtualBox Pe Kali Install Karna — Step by Step","Kali Ka Desktop — Pehli Baar Seedha Dekho","Terminal Navigation — File System Mein Chalna","Files Dekhna aur Edit Karna","Users aur Permissions — Kaun Kya Kar Sakta Hai","Networking Commands — Network Ko Terminal Se Dekhna","Piping aur Redirection — Commands Ko Milao","Process Management — System Pe Kya Chal Raha Hai","File Search — Kuch Bhi Dhundho","Bash Scripting Basics — Terminal Ko Automatic Karo"],
    mcqs: 180,
  },
];

const STATS = [
  { icon: <BookOpen size={22} />,    value: "10,000+", label: "Active Students",    color: "#2563EB", darkBg: "rgba(37,99,235,0.15)",  lightBg: "#EEF3FF" },
  { icon: <Layers size={22} />,      value: "500+",    label: "Chapters & Lessons", color: "#7C3AED", darkBg: "rgba(124,58,237,0.15)", lightBg: "#F3EEFF" },
  { icon: <Shield size={22} />,      value: "100%",    label: "Free Forever",       color: "#059669", darkBg: "rgba(5,150,105,0.15)",  lightBg: "#ECFDF5" },
  { icon: <Star size={22} />,        value: "4.9/5",   label: "Student Rating",     color: "#D97706", darkBg: "rgba(217,119,6,0.15)",  lightBg: "#FFFBEB" },
  { icon: <HelpCircle size={22} />,  value: "24/7",    label: "Community Support",  color: "#0EA5E9", darkBg: "rgba(14,165,233,0.15)", lightBg: "#F0F9FF" },
];

const FOR_WHOM = [
  { icon: "🎓", title: "Students",         desc: "CS, IT, ya koi bhi stream — background matters nahi. Zero se shuru karo." },
  { icon: "💼", title: "Working People",   desc: "9-to-5 job hai? Self-paced format — apni speed pe seekho." },
  { icon: "🤔", title: "Curious Minds",    desc: "Sirf jaanna chahte ho computers kaise kaam karte hain? Sahi jagah hai." },
  { icon: "🔄", title: "Career Switchers", desc: "Cybersecurity mein aana chahte ho? Yahan se shuru karo — zero assumptions." },
];

const FEATURES = [
  { icon: <User size={20} />,        color: "#2563EB", darkBg: "rgba(37,99,235,0.15)",  lightBg: "#EEF3FF", title: "Beginner Friendly",  desc: "Zero knowledge assumed. Ekdum first principles se shuru." },
  { icon: <FlaskConical size={20}/>, color: "#7C3AED", darkBg: "rgba(124,58,237,0.15)", lightBg: "#F3EEFF", title: "Practical Labs",      desc: "Har topic ke baad real hands-on task. Sirf theory nahi." },
  { icon: <Briefcase size={20} />,   color: "#0EA5E9", darkBg: "rgba(14,165,233,0.15)", lightBg: "#F0F9FF", title: "Industry Relevant",   desc: "Jo industry mein actually use hota hai, wahi sikhate hain." },
  { icon: <Lock size={20} />,        color: "#DC2626", darkBg: "rgba(220,38,38,0.15)",  lightBg: "#FEF2F2", title: "Ethical Only",        desc: "Poora course legal, ethical aur responsible hacking pe focused." },
  { icon: <TrendingUp size={20} />,  color: "#059669", darkBg: "rgba(5,150,105,0.15)",  lightBg: "#ECFDF5", title: "Progress Tracking",   desc: "MCQ scores se apna mastery level check karo har topic pe." },
  { icon: <Award size={20} />,       color: "#D97706", darkBg: "rgba(217,119,6,0.15)",  lightBg: "#FFFBEB", title: "Free Forever",        desc: "Koi paywall nahi. Poora course bilkul free — hamesha ke liye." },
];

const ROADMAP = [
  { num: 1, label: "Hacker Mindset",     sub: "Chapter 1", color: "#2563EB" },
  { num: 2, label: "Computer Internals", sub: "Chapter 2", color: "#7C3AED" },
  { num: 3, label: "Networking",         sub: "Chapter 3", color: "#0EA5E9" },
  { num: 4, label: "Linux Basics",       sub: "Chapter 4", color: "#059669" },
  { num: 5, label: "Kali Linux",         sub: "Chapter 5", color: "#DC2626" },
];

/* ─── Max-width content container ─── */
const MAX = 1180;


export default function LandingPage() {
  const router = useRouter();
  const { isDark } = useTheme();

  const [user,    setUser]    = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [vw,      setVw]      = useState(1280);
  const [openCh,  setOpenCh]  = useState<number | null>(null);

  useEffect(() => {
    const update = () => setVw(window.innerWidth);
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);

  const isSm = vw >= 640;
  const isMd = vw >= 768;
  const isLg = vw >= 1024;

  /* Parallax on hero */
  const { scrollY } = useScroll();
  const leftY  = useTransform(scrollY, [0, 500], [0, 28]);
  const rightY = useTransform(scrollY, [0, 500], [0, -18]);

  /* CTA hover state */
  const btnRef = useRef<HTMLButtonElement>(null);
  const [btnHovered, setBtnHovered] = useState(false);
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);
  const mousePosRef       = useRef({ x: 0, y: 0 });
  const animFrameRef      = useRef<number>(0);

  useEffect(() => {
    if (!btnHovered) {
      cancelAnimationFrame(animFrameRef.current);
      const cv = particleCanvasRef.current;
      if (cv) cv.getContext("2d")?.clearRect(0, 0, cv.width, cv.height);
      return;
    }
    const cv  = particleCanvasRef.current;
    const btn = btnRef.current;
    if (!cv || !btn) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const PAD = 90;
    cv.width  = btn.offsetWidth  + PAD * 2;
    cv.height = btn.offsetHeight + PAD * 2;

    type Pt = { x: number; y: number; vx: number; vy: number; life: number; size: number; color: string };
    const pts: Pt[] = [];
    const COLS = ["#ffffff", "#93c5fd", "#c4b5fd", "#67e8f9", "#a5f3fc", "#e0e7ff"];
    let last = 0;
    let running = true;

    const tick = (t: number) => {
      if (!running) return;
      ctx.clearRect(0, 0, cv.width, cv.height);

      if (t - last > 26) {
        for (let s = 0; s < 3; s++) {
          pts.push({
            x:    mousePosRef.current.x + PAD + (Math.random() - 0.5) * 8,
            y:    mousePosRef.current.y + PAD + (Math.random() - 0.5) * 8,
            vx:   (Math.random() - 0.5) * 2.4,
            vy:   -(Math.random() * 2.6 + 0.5),
            life: 1,
            size: 1.5 + Math.random() * 2.8,
            color: COLS[Math.floor(Math.random() * COLS.length)],
          });
        }
        last = t;
      }

      for (let i = pts.length - 1; i >= 0; i--) {
        const p = pts[i];
        p.x  += p.vx;
        p.y  += p.vy;
        p.vy += 0.055;   // gentle gravity
        p.vx *= 0.97;
        p.life -= 0.024;
        if (p.life <= 0) { pts.splice(i, 1); continue; }
        ctx.globalAlpha = p.life * p.life;
        ctx.fillStyle   = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * Math.max(0.15, p.life), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);
    return () => { running = false; cancelAnimationFrame(animFrameRef.current); };
  }, [btnHovered]);

  useEffect(() => { setUser(getCurrentUser()); setMounted(true); }, []);
  const goStart = () => router.push(user ? "/chapters" : "/login");

  /* ─── Theme tokens ─── */
  const T = {
    bg:      isDark ? "#0A0E1A"  : "#F8FAFF",
    bg2:     isDark ? "#0A0E1A"  : "#FFFFFF",
    bg3:     isDark ? "#0A0E1A"  : "#F4F8FF",
    text:    isDark ? "#F1F5F9"  : "#111827",
    text2:   isDark ? "#94A3B8"  : "#6B7280",
    muted:   isDark ? "#64748B"  : "#9CA3AF",
    border:  isDark ? "#1E2433"  : "#E5E7EB",
    card:    isDark ? "#0D1117"  : "#FFFFFF",
    chipBg:  isDark ? "rgba(37,99,235,0.15)" : "#EFF6FF",
    chipBdr: isDark ? "rgba(37,99,235,0.35)" : "#DBEAFE",
    chipTxt: isDark ? "#60A5FA"  : "#2563EB",
    dot:     isDark ? "rgba(96,165,250,0.10)" : "rgba(148,163,254,0.22)",
    heroBg:  isDark
      ? "linear-gradient(150deg,#060912 0%,#0A0E1A 55%,#0D1320 100%)"
      : "linear-gradient(150deg,#FFFFFF 0%,#F5F8FF 55%,#EEF2FF 100%)",
    altBg:   isDark ? "#0A0E1A" : "#F0F5FF",
  };

  /* ─── Responsive padding ─── */
  const sp  = vw < 640 ? 16 : vw < 768 ? 24 : vw < 1024 ? 32 : 40;
  const vp  = vw < 768 ? 40 : vw < 1024 ? 56 : 70;

  /* ─── Centered content wrapper ─── */
  const W = (children: React.ReactNode, extraStyle: React.CSSProperties = {}) => (
    <div style={{ maxWidth: MAX, margin: "0 auto", padding: `0 ${sp}px`, ...extraStyle }}>
      {children}
    </div>
  );

  const fade = (delay = 0) => ({
    initial:    mounted ? { opacity: 0, y: 22 } : (false as const),
    animate:    { opacity: 1, y: 0 },
    transition: { delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  });

  const inView = (delay = 0) => ({
    initial:     mounted ? { opacity: 0, y: 22 } : (false as const),
    whileInView: { opacity: 1, y: 0 },
    viewport:    { once: true, margin: "-60px" },
    transition:  { delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  });

  const Chip = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 7,
      padding: "5px 14px", borderRadius: 999,
      background: T.chipBg, border: `1px solid ${T.chipBdr}`,
      marginBottom: 18,
    }}>
      {icon}
      <span style={{ fontSize: "11px", fontWeight: 700, color: T.chipTxt, textTransform: "uppercase", letterSpacing: "0.09em" }}>
        {label}
      </span>
    </div>
  );

  return (
    <main style={{ background: T.bg, minHeight: "100vh", overflowX: "hidden" }}>

      {/* ══════════════════════════
          HERO
      ══════════════════════════ */}
      <section style={{
        position: "relative",
        background: T.heroBg,
        paddingTop: `calc(72px + ${isLg ? 28 : 20}px)`,
        paddingBottom: isLg ? 36 : 40,
        overflow: "hidden",
        display: "flex", flexDirection: "column",
        minHeight: isLg ? "calc(100vh - 72px)" : "auto",
      }}>
        {/* Dot grid */}
        <div className="hero-dot-grid" style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: `radial-gradient(circle, ${T.dot} 1.5px, transparent 1.5px)`,
          backgroundSize: "30px 30px",
        }} />
        {/* Glow blobs */}
        <div style={{ position: "absolute", left: "-5%",  top: "5%",   width: "45%", height: "70%", background: "radial-gradient(ellipse,rgba(37,99,235,0.07) 0%,transparent 70%)",  pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: "-5%", top: "-5%",  width: "45%", height: "70%", background: "radial-gradient(ellipse,rgba(124,58,237,0.06) 0%,transparent 70%)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 10, flex: 1 }}>
          {W(
            <div style={{
              display: "flex",
              flexDirection: isLg ? "row" : "column",
              alignItems: isLg ? "center" : "flex-start",
              justifyContent: isLg ? "space-between" : "flex-start",
              gap: isLg ? 56 : 36,
            }}>
              {/* LEFT */}
              <motion.div style={{
                y: leftY,
                flex: isLg ? "0 0 44%" : "unset",
                width: isLg ? "44%" : "100%",
              }}>

                {/* Badge */}
                <motion.div {...fade(0)} style={{ marginBottom: 20 }}>
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    padding: "6px 16px 6px 10px", borderRadius: 999,
                    background: T.chipBg, border: `1px solid ${T.chipBdr}`,
                    boxShadow: "0 2px 12px rgba(37,99,235,0.10)",
                  }}>
                    <span style={{ width: 20, height: 20, borderRadius: "50%", background: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Shield size={10} color="white" />
                    </span>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: T.chipTxt, letterSpacing: "0.02em" }}>
                      India&apos;s Premier Ethical Hacking <strong>Academy</strong>
                    </span>
                  </div>
                </motion.div>

                {/* Headline */}
                <motion.h1 {...fade(0.07)} style={{
                  fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.03em",
                  marginBottom: 20, margin: 0, marginBottom: 20,
                  fontSize: isLg ? "clamp(2.9rem,3.2vw,4rem)" : isMd ? "2.6rem" : "2rem",
                }}>
                  <span style={{ color: T.text, display: "block", whiteSpace: "nowrap" }}>MCH —</span>
                  <span style={{ color: T.text, display: "block", whiteSpace: "nowrap" }}>Mastering Computer</span>
                  <span style={{
                    display: "block", whiteSpace: "nowrap",
                    background: "linear-gradient(130deg,#2563EB 0%,#7C3AED 100%)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                  }}>Hacking.</span>
                </motion.h1>

                {/* Sub */}
                <motion.p {...fade(0.15)} style={{
                  color: T.text2, lineHeight: 1.75, marginBottom: 32,
                  fontSize: isMd ? "1.05rem" : "0.95rem", maxWidth: 500,
                }}>
                  From zero to ethical hacking hero. A complete structured roadmap in Hinglish, by{" "}
                  <strong style={{ color: T.chipTxt }}>Afsar Ali (Technical White Hat)</strong>.
                </motion.p>

                {/* CTAs */}
                <motion.div {...fade(0.22)} style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 32 }}>
                  {/* Wrapper for overflow-visible canvas particles */}
                  <div style={{ position: "relative", display: "inline-flex" }}>

                    {/* Canvas — cursor-following particles, overflows the button */}
                    <canvas
                      ref={particleCanvasRef}
                      style={{
                        position: "absolute",
                        top: -90, left: -90,
                        pointerEvents: "none",
                        zIndex: 10,
                        opacity: btnHovered ? 1 : 0,
                      }}
                    />

                    {/* Outer glow — pulses on hover */}
                    <AnimatePresence>
                      {btnHovered && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0.55, 0.85, 0.55], scale: [1, 1.07, 1] }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                          style={{
                            position: "absolute", inset: -12, borderRadius: 24,
                            background: "radial-gradient(ellipse, rgba(124,58,237,0.40) 0%, rgba(37,99,235,0.22) 50%, transparent 75%)",
                            filter: "blur(12px)",
                            pointerEvents: "none",
                            zIndex: 0,
                          }}
                        />
                      )}
                    </AnimatePresence>

                    <motion.button
                      ref={btnRef}
                      onMouseEnter={() => setBtnHovered(true)}
                      onMouseLeave={() => setBtnHovered(false)}
                      onMouseMove={(e) => {
                        const rect = btnRef.current?.getBoundingClientRect();
                        if (rect) mousePosRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
                      }}
                      whileTap={{ scale: 0.97 }}
                      onClick={goStart}
                      style={{
                        position: "relative",
                        display: "inline-flex", alignItems: "center", gap: 12,
                        padding: "14px 28px", borderRadius: 14,
                        fontSize: "15px", fontWeight: 700, color: "white",
                        border: "none", cursor: "pointer",
                        background: btnHovered
                          ? "linear-gradient(135deg,#1a56db 0%,#6d28d9 100%)"
                          : "linear-gradient(135deg,#2563EB 0%,#7C3AED 100%)",
                        boxShadow: btnHovered
                          ? "0 0 32px rgba(124,58,237,0.70), 0 0 64px rgba(37,99,235,0.25), 0 10px 32px rgba(37,99,235,0.35)"
                          : "0 8px 28px rgba(37,99,235,0.40)",
                        overflow: "hidden",
                        transition: "background 0.4s ease, box-shadow 0.35s ease",
                        zIndex: 1,
                      }}
                    >
                      {/* Animated shifting gradient — always running, opacity fades in/out smoothly */}
                      <motion.span
                        animate={{ opacity: btnHovered ? 1 : 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}
                      >
                        <motion.span
                          animate={{ backgroundPosition: ["100% 50%", "0% 50%"] }}
                          transition={{ duration: 2.8, repeat: Infinity, ease: "linear" }}
                          style={{
                            position: "absolute", inset: 0,
                            background: "linear-gradient(270deg,#1D4ED8,#7C3AED,#0EA5E9,#6D28D9,#2563EB)",
                            backgroundSize: "300% 300%",
                          }}
                        />
                      </motion.span>

                      {/* Label */}
                      <span style={{ position: "relative", zIndex: 1 }}>
                        {user ? "Continue Learning" : "Start Free — No Signup"}
                      </span>

                      {/* Arrow circle */}
                      <span style={{
                        position: "relative", zIndex: 1,
                        width: 28, height: 28, borderRadius: "50%",
                        background: "rgba(255,255,255,0.25)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                      }}>
                        <ArrowRight size={14} />
                      </span>
                    </motion.button>
                  </div>

                  <Link href="/chapters">
                    <motion.div whileHover={{ scale: 1.02 }} style={{
                      display: "inline-flex", alignItems: "center", gap: 8,
                      padding: "14px 22px", borderRadius: 14,
                      fontSize: "15px", fontWeight: 600, color: T.text,
                      background: T.card, border: `1px solid ${T.border}`,
                      boxShadow: `0 2px 10px rgba(0,0,0,${isDark ? 0.20 : 0.05})`,
                      cursor: "pointer",
                    }}>
                      <Compass size={16} color="#2563EB" /> Explore Chapters
                    </motion.div>
                  </Link>
                </motion.div>

                {/* Social proof */}
                <motion.div {...fade(0.30)} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ display: "flex" }}>
                    {(["#2563EB", "#7C3AED", "#0EA5E9", "#059669"] as string[]).map((c, i) => (
                      <div key={i} style={{
                        width: 28, height: 28, borderRadius: "50%",
                        border: `2px solid ${T.bg}`, marginLeft: i > 0 ? -8 : 0,
                        background: c, display: "flex", alignItems: "center",
                        justifyContent: "center", color: "white",
                        fontSize: "10px", fontWeight: 700,
                      }}>{["A","S","R","K"][i]}</div>
                    ))}
                  </div>
                  <span style={{ fontSize: "12.5px", color: T.muted, fontWeight: 500 }}>
                    <strong style={{ color: T.text }}>10,000+</strong> students enrolled · <strong style={{ color: T.text }}>100%</strong> free
                  </span>
                </motion.div>
              </motion.div>

              {/* RIGHT — scene */}
              <motion.div style={{
                y: rightY,
                flex: isLg ? "1 1 0" : "unset",
                width: isLg ? "auto" : "100%",
                minWidth: isLg ? 0 : undefined,
                display: "flex", alignItems: "center", justifyContent: "flex-end",
              }}>
                <div style={{
                  width: "100%",
                  maxWidth: isLg ? "none" : 480,
                  height: isLg ? "clamp(460px,48vw,580px)" : isMd ? 380 : 300,
                }}>
                  <HeroScene />
                </div>
              </motion.div>
            </div>,
            { maxWidth: 1500, padding: `0 ${isLg ? 60 : sp}px` }
          )}
        </div>

        {/* Scroll cue — centered above marquee */}
        {isLg && mounted && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "12px 0 100px" }}>
            <span style={{ fontSize: "10px", fontWeight: 600, color: T.muted, textTransform: "uppercase", letterSpacing: "0.14em" }}>Scroll</span>
            <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
              <ChevronDown size={14} color={T.muted} />
            </motion.div>
          </motion.div>
        )}

        {/* Chapter marquee strip — pinned to bottom edge of hero */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          overflow: "hidden",
          padding: "16px 0 18px",
          zIndex: 20,
        }}>
          {/* Fade edges */}
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 140, zIndex: 2, background: isDark ? "linear-gradient(to right,#060912 20%,transparent)" : "linear-gradient(to right,#F5F8FF 20%,transparent)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 140, zIndex: 2, background: isDark ? "linear-gradient(to left,#060912 20%,transparent)" : "linear-gradient(to left,#F5F8FF 20%,transparent)", pointerEvents: "none" }} />

          <div className="chapter-marquee-track">
            {[...CHAPTERS, ...CHAPTERS].map((ch, i) => (
              <div key={i} style={{
                display: "inline-flex", alignItems: "center", gap: 14,
                padding: "10px 20px",
                marginRight: 12,
                flexShrink: 0,
                borderRadius: 16,
                background: isDark ? "#0D1117" : "#FFFFFF",
                border: `1px solid ${ch.color}35`,
                boxShadow: `0 0 18px ${ch.color}45, 0 0 40px ${ch.color}18`,
                cursor: "default",
              }}>
                {/* Icon bubble */}
                <div style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: isDark ? ch.darkBg : ch.lightBg,
                  color: ch.color,
                  boxShadow: `0 0 16px ${ch.color}40`,
                  border: `1px solid ${ch.color}30`,
                }}>
                  {ch.icon}
                </div>

                {/* Text block */}
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {/* Chapter number badge + title */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{
                      fontSize: "10px", fontWeight: 800, letterSpacing: "0.1em",
                      padding: "2px 7px", borderRadius: 6,
                      background: ch.color, color: "#fff",
                      lineHeight: 1.5, flexShrink: 0,
                    }}>
                      {String(ch.num).padStart(2, "0")}
                    </span>
                    <span style={{
                      fontSize: "14px", fontWeight: 700, color: T.text,
                      whiteSpace: "nowrap", lineHeight: 1,
                    }}>
                      {ch.title}
                    </span>
                  </div>
                  {/* Subtitle */}
                  <span style={{
                    fontSize: "11px", fontWeight: 500, color: ch.color,
                    whiteSpace: "nowrap", letterSpacing: "0.01em", opacity: 0.85,
                  }}>
                    {ch.subtitle}
                  </span>
                </div>

                {/* MCQ count chip */}
                <div style={{
                  display: "flex", alignItems: "center", gap: 4,
                  padding: "4px 10px", borderRadius: 20,
                  background: isDark ? "rgba(255,255,255,0.06)" : `${ch.color}12`,
                  border: `1px solid ${ch.color}25`,
                  marginLeft: 4,
                }}>
                  <span style={{ fontSize: "10px", fontWeight: 700, color: ch.color, whiteSpace: "nowrap" }}>
                    {ch.mcqs} MCQs
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════
          STATS STRIP
      ══════════════════════════ */}
      <div style={{
        background: isDark
          ? "#0A0E1A"
          : "linear-gradient(180deg,#E8EFFF 0%,#FFFFFF 100%)",
        padding: `${vp * 0.6}px 0`,
      }}>
        {W(
          <div style={{
            display: "grid",
            gridTemplateColumns: isLg ? "repeat(5,1fr)" : isMd ? "repeat(3,1fr)" : "repeat(2,1fr)",
            gap: 14,
          }}>
            {STATS.map((s, i) => (
              <motion.div key={s.label}
                initial={mounted ? { opacity: 0, y: 16 } : false} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.45 }}
                whileHover={{ y: -4, boxShadow: isDark ? `0 8px 32px rgba(0,0,0,0.38), 0 0 0 1px ${s.color}55` : `0 8px 28px rgba(0,0,0,0.10), 0 0 0 1px ${s.color}40`, transition: { duration: 0.2 } }}
                style={{
                  position: "relative",
                  display: "flex", flexDirection: isMd ? "row" : "column",
                  alignItems: "center", textAlign: isMd ? "left" : "center",
                  gap: isMd ? 18 : 10,
                  padding: isMd ? "22px 24px" : "20px 16px",
                  borderRadius: 20, background: T.card,
                  border: `1px solid ${T.border}`,
                  boxShadow: `0 2px 16px rgba(0,0,0,${isDark ? 0.28 : 0.05})`,
                  overflow: "hidden",
                }}
              >
                {/* Full-width accent line — solid colour + glow in dark mode */}
                <span style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: 3,
                  background: s.color,
                  boxShadow: isDark ? `0 0 12px ${s.color}CC, 0 0 28px ${s.color}66` : "none",
                }} />

                {/* Subtle top colour wash for depth */}
                <span style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: 72,
                  background: `linear-gradient(180deg,${s.color}18 0%,transparent 100%)`,
                  pointerEvents: "none",
                }} />

                <div style={{ position: "relative", width: 52, height: 52, borderRadius: 16, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: isDark ? s.darkBg : s.lightBg, color: s.color }}>
                  {s.icon}
                </div>
                <div style={{ position: "relative" }}>
                  <div style={{ fontWeight: 900, fontSize: "clamp(1.4rem, 1.6vw, 1.9rem)", color: T.text, lineHeight: 1.15, whiteSpace: "nowrap" }}>{s.value}</div>
                  <div style={{ fontSize: "11px", color: T.muted, fontWeight: 700, marginTop: 6, textTransform: "uppercase", letterSpacing: "0.09em" }}>{s.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* ══════════════════════════
          CHAPTERS ACCORDION
      ══════════════════════════ */}
      <section style={{ background: T.bg2, padding: `${vp}px 0` }}>
        {W(
          <>
            <motion.div {...inView()} style={{ textAlign: "center", marginBottom: 48 }}>
              <Chip icon={<BookOpen size={12} color="#3B82F6" />} label="Course Content" />
              <h2 style={{
                fontWeight: 900, color: T.text,
                fontSize: isLg ? "2.4rem" : isMd ? "2rem" : "1.6rem",
                letterSpacing: "-0.025em", marginBottom: 14,
              }}>
                5 Chapters · 41 Topics ·{" "}
                <span style={{ background: "linear-gradient(130deg,#2563EB,#7C3AED)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  615+ MCQs
                </span>
              </h2>
              <p style={{ color: T.text2, fontSize: isMd ? "16px" : "14px", maxWidth: 540, margin: "0 auto", lineHeight: 1.75 }}>
                Ek structured path jo tumhe zero se ethical hacker banata hai — computers ke andar se lekar Kali Linux tak.
              </p>
            </motion.div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {CHAPTERS.map((ch, i) => {
                const isOpen = openCh === ch.num;
                return (
                  <motion.div key={ch.num}
                    initial={mounted ? { opacity: 0, y: 16 } : false} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.05, duration: 0.4 }}
                    style={{
                      borderRadius: 18, background: T.card,
                      border: `1px solid ${isOpen ? ch.color + "44" : T.border}`,
                      boxShadow: isOpen
                        ? `0 4px 32px ${ch.color}20`
                        : `0 2px 10px rgba(0,0,0,${isDark ? 0.2 : 0.04})`,
                      overflow: "hidden",
                      transition: "border-color 0.25s, box-shadow 0.25s",
                    }}
                  >
                    {/* Header row */}
                    <button
                      onClick={() => setOpenCh(isOpen ? null : ch.num)}
                      style={{
                        width: "100%", background: "none", border: "none", cursor: "pointer",
                        display: "flex", alignItems: "center", gap: isMd ? 20 : 14,
                        padding: isMd ? "22px 26px" : "18px 18px", textAlign: "left",
                      }}
                    >
                      <div style={{
                        width: 52, height: 52, borderRadius: 15, flexShrink: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        background: isDark ? ch.darkBg : ch.lightBg, color: ch.color,
                      }}>
                        {ch.icon}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 4 }}>
                          <span style={{ fontSize: "10px", fontWeight: 800, color: ch.color, textTransform: "uppercase", letterSpacing: "0.1em" }}>Ch {ch.num}</span>
                          <span style={{ fontWeight: 800, fontSize: isMd ? "17px" : "15px", color: T.text }}>{ch.title}</span>
                          {isMd && (
                            <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 10px", borderRadius: 999, background: isDark ? ch.darkBg : ch.lightBg, color: ch.color }}>
                              {ch.subtitle}
                            </span>
                          )}
                        </div>
                        <p style={{ color: T.text2, fontSize: "13.5px", lineHeight: 1.6, marginBottom: 8 }}>{ch.desc}</p>
                        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                          {[
                            { icon: <Layers size={11} color={ch.color} />,     text: `${ch.topics.length} topics` },
                            { icon: <HelpCircle size={11} color={ch.color} />, text: `${ch.mcqs} MCQs` },
                            { icon: <CheckCircle2 size={11} color="#059669" />, text: "Available", green: true },
                          ].map(({ icon, text, green }) => (
                            <span key={text} style={{ fontSize: "12px", color: green ? "#059669" : T.muted, display: "flex", alignItems: "center", gap: 5 }}>
                              {icon}{text}
                            </span>
                          ))}
                        </div>
                      </div>
                      <motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.22 }} style={{ flexShrink: 0 }}>
                        <ChevronRight size={18} color={isOpen ? ch.color : T.muted} />
                      </motion.div>
                    </button>

                    {/* Expandable */}
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                          style={{ overflow: "hidden" }}
                        >
                          <div style={{ borderTop: `1px solid ${ch.color}33`, padding: isMd ? "20px 26px 26px" : "16px 18px 22px" }}>
                            <div style={{
                              display: "grid",
                              gridTemplateColumns: isLg ? "repeat(2,1fr)" : isSm ? "repeat(2,1fr)" : "1fr",
                              gap: "10px 28px", marginBottom: 20,
                            }}>
                              {ch.topics.map((topic, ti) => (
                                <div key={ti} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                                  <div style={{
                                    width: 22, height: 22, borderRadius: "50%", flexShrink: 0, marginTop: 1,
                                    background: isDark ? ch.darkBg : ch.lightBg,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                  }}>
                                    <span style={{ fontSize: "9px", fontWeight: 800, color: ch.color }}>{ch.num}.{ti + 1}</span>
                                  </div>
                                  <span style={{ fontSize: "13.5px", color: T.text2, lineHeight: 1.6, paddingTop: 1 }}>{topic}</span>
                                </div>
                              ))}
                            </div>
                            <Link href="/chapters">
                              <motion.div whileHover={{ scale: 1.02 }} style={{
                                display: "inline-flex", alignItems: "center", gap: 8,
                                padding: "10px 20px", borderRadius: 12,
                                background: isDark ? ch.darkBg : ch.lightBg,
                                color: ch.color, fontSize: "13.5px", fontWeight: 700, cursor: "pointer",
                              }}>
                                Start Chapter {ch.num} <ArrowRight size={14} />
                              </motion.div>
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}
      </section>

      {/* ══════════════════════════
          ROADMAP
      ══════════════════════════ */}
      <section style={{ background: T.altBg, padding: `${vp}px 0` }}>
        {W(
          <>
            <motion.div {...inView()} style={{ textAlign: "center", marginBottom: 52 }}>
              <Chip icon={<Compass size={12} color="#3B82F6" />} label="Learning Path" />
              <h2 style={{
                fontWeight: 900, color: T.text,
                fontSize: isLg ? "2.4rem" : isMd ? "2rem" : "1.6rem",
                letterSpacing: "-0.025em", marginBottom: 14,
              }}>
                Zero Se{" "}
                <span style={{ background: "linear-gradient(130deg,#2563EB,#7C3AED)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  Ethical Hacker
                </span>{" "}Tak
              </h2>
              <p style={{ color: T.text2, fontSize: isMd ? "16px" : "14px", maxWidth: 480, margin: "0 auto", lineHeight: 1.75 }}>
                Ek clear step-by-step path. Koi confusion nahi — bas ek ke baad ek chapter.
              </p>
            </motion.div>

            <div style={{
              display: "flex", flexDirection: isLg ? "row" : "column",
              alignItems: isLg ? "flex-start" : "stretch",
              gap: isLg ? 0 : 8, position: "relative",
            }}>
              {ROADMAP.map((step, i) => (
                <div key={step.num} style={{
                  flex: isLg ? 1 : "unset", position: "relative",
                  display: "flex", flexDirection: isLg ? "column" : "row",
                  alignItems: "center",
                }}>
                  {i < ROADMAP.length - 1 && isLg && (
                    <div style={{
                      position: "absolute", top: 26, left: "55%", width: "90%", height: 3,
                      background: `linear-gradient(90deg,${step.color},${ROADMAP[i + 1].color})`,
                      borderRadius: 2, zIndex: 0,
                    }} />
                  )}
                  {i < ROADMAP.length - 1 && !isLg && (
                    <div style={{
                      width: 3, height: 28, margin: "0 0 0 24px",
                      background: `linear-gradient(180deg,${step.color},${ROADMAP[i + 1].color})`,
                      borderRadius: 2, alignSelf: "flex-start",
                    }} />
                  )}
                  <motion.div
                    initial={mounted ? { opacity: 0, y: 20 } : false} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.45 }}
                    whileHover={{ y: isLg ? -6 : 0, transition: { duration: 0.2 } }}
                    style={{
                      zIndex: 1,
                      display: "flex", flexDirection: isLg ? "column" : "row",
                      alignItems: "center", gap: isLg ? 14 : 16,
                      textAlign: isLg ? "center" : "left",
                      padding: isLg ? "0 12px" : "14px 20px",
                      borderRadius: isLg ? 0 : 16,
                      background: !isLg ? T.card : "transparent",
                      border: !isLg ? `1px solid ${T.border}` : "none",
                      width: !isLg ? "100%" : "auto",
                    }}
                  >
                    <div style={{
                      width: 52, height: 52, borderRadius: "50%", flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: `linear-gradient(135deg,${step.color},${step.color}bb)`,
                      boxShadow: `0 4px 18px ${step.color}50`,
                      color: "white", fontWeight: 900, fontSize: "18px",
                    }}>{step.num}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "14px", color: T.text }}>{step.label}</div>
                      <div style={{ fontSize: "12px", color: T.muted, marginTop: 3 }}>{step.sub}</div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* ══════════════════════════
          WHO IS THIS FOR
      ══════════════════════════ */}
      <section style={{ background: T.bg2, padding: `${vp}px 0` }}>
        {W(
          <>
            <motion.div {...inView()} style={{ textAlign: "center", marginBottom: 48 }}>
              <Chip icon={<User size={12} color="#3B82F6" />} label="Yeh Course Kis Ke Liye Hai?" />
              <h2 style={{
                fontWeight: 900, color: T.text,
                fontSize: isLg ? "2.4rem" : isMd ? "2rem" : "1.6rem",
                letterSpacing: "-0.025em",
              }}>
                Har Koi Shuru Kar Sakta Hai —{" "}
                <span style={{ background: "linear-gradient(130deg,#2563EB,#7C3AED)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  Bilkul Zero Se
                </span>
              </h2>
            </motion.div>
            <div style={{
              display: "grid",
              gridTemplateColumns: isLg ? "repeat(4,1fr)" : isMd ? "repeat(2,1fr)" : "repeat(2,1fr)",
              gap: 16,
            }}>
              {FOR_WHOM.map((card, i) => (
                <motion.div key={card.title}
                  initial={mounted ? { opacity: 0, y: 20 } : false} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.4 }}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  style={{
                    borderRadius: 20, background: T.card,
                    border: `1px solid ${T.border}`,
                    padding: isMd ? "32px 24px" : "24px 18px",
                    boxShadow: `0 2px 14px rgba(0,0,0,${isDark ? 0.22 : 0.04})`,
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "2.6rem", marginBottom: 16 }}>{card.icon}</div>
                  <h3 style={{ fontWeight: 800, fontSize: "15px", color: T.text, marginBottom: 10 }}>{card.title}</h3>
                  <p style={{ color: T.text2, fontSize: "13px", lineHeight: 1.75 }}>{card.desc}</p>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* ══════════════════════════
          ABOUT AFSAR
      ══════════════════════════ */}
      <section style={{ background: T.altBg, padding: `${vp}px 0` }}>
        {W(
          <div style={{
            display: "flex", flexDirection: isLg ? "row" : "column",
            gap: isLg ? 72 : 40, alignItems: isLg ? "center" : "flex-start",
          }}>
            {/* Avatar + badges */}
            <motion.div {...inView()} style={{
              flexShrink: 0, display: "flex", flexDirection: "column",
              alignItems: "flex-start", gap: 14, minWidth: isLg ? 200 : "unset",
            }}>
              <div style={{ position: "relative", marginBottom: 4 }}>
                <div style={{
                  width: 110, height: 110, borderRadius: 28,
                  background: "linear-gradient(135deg,#2563EB 0%,#7C3AED 100%)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 8px 32px rgba(37,99,235,0.38)",
                  fontSize: "2.8rem", fontWeight: 900, color: "white",
                }}>A</div>
                <div style={{
                  position: "absolute", bottom: -6, right: -6,
                  width: 26, height: 26, borderRadius: "50%",
                  background: "#059669", border: `3px solid ${T.altBg}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Star size={10} color="white" fill="white" />
                </div>
              </div>
              {[
                { label: "Ethical Hacker",   color: "#2563EB", darkBg: "rgba(37,99,235,0.15)",  lightBg: "#EEF3FF" },
                { label: "OSINT Expert",     color: "#7C3AED", darkBg: "rgba(124,58,237,0.15)", lightBg: "#F3EEFF" },
                { label: "Full-Stack Dev",   color: "#0EA5E9", darkBg: "rgba(14,165,233,0.15)", lightBg: "#F0F9FF" },
                { label: "Started at Age 12",color: "#059669", darkBg: "rgba(5,150,105,0.15)",  lightBg: "#ECFDF5" },
              ].map(chip => (
                <span key={chip.label} style={{
                  fontSize: "12px", fontWeight: 700, padding: "5px 14px", borderRadius: 999,
                  background: isDark ? chip.darkBg : chip.lightBg, color: chip.color, whiteSpace: "nowrap",
                }}>{chip.label}</span>
              ))}
            </motion.div>

            {/* Bio */}
            <motion.div {...inView(0.1)} style={{ flex: 1, minWidth: 0 }}>
              <Chip icon={<Shield size={12} color="#3B82F6" />} label="Course Creator" />
              <h2 style={{
                fontWeight: 900,
                fontSize: isLg ? "2.4rem" : isMd ? "2rem" : "1.7rem",
                color: T.text, letterSpacing: "-0.025em", marginBottom: 6,
              }}>Afsar Ali</h2>
              <p style={{ fontSize: "14px", fontWeight: 600, color: T.chipTxt, marginBottom: 24 }}>
                Technical White Hat · &ldquo;Legend of Indian Cybersecurity&rdquo;
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 28 }}>
                {[
                  { icon: "🚀", text: "22 saal ka ethical hacker — tech ki duniya mein 12 saal ki umar se kaam kar raha hai." },
                  { icon: "🛡️", text: "TWH OSINT Platform banaya — India ka sabse powerful free OSINT tool." },
                  { icon: "📚", text: "Yeh course unka vision hai — Computer Expert + Ethical Hacker dono ek saath banana." },
                  { icon: "💬", text: "Hinglish mein likhta hai — real life analogies se, boring theory nahi." },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: 12, flexShrink: 0,
                      background: isDark ? "rgba(37,99,235,0.12)" : "#EEF3FF",
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: "17px",
                    }}>{item.icon}</div>
                    <p style={{ color: T.text2, fontSize: "14.5px", lineHeight: 1.75, paddingTop: 7 }}>{item.text}</p>
                  </div>
                ))}
              </div>
              <a href="https://twh-osint.vercel.app/twh" target="_blank" rel="noopener noreferrer">
                <motion.div whileHover={{ scale: 1.02 }} style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "11px 22px", borderRadius: 12,
                  background: isDark ? "rgba(37,99,235,0.15)" : "#EEF3FF",
                  color: "#2563EB", fontSize: "13.5px", fontWeight: 700, cursor: "pointer",
                }}>
                  <Globe2 size={15} /> Visit TWH OSINT Platform <ArrowRight size={14} />
                </motion.div>
              </a>
            </motion.div>
          </div>
        )}
      </section>

      {/* ══════════════════════════
          FEATURES
      ══════════════════════════ */}
      <section style={{ background: T.bg2, padding: `${vp}px 0` }}>
        {W(
          <>
            <motion.div {...inView()} style={{ textAlign: "center", marginBottom: 48 }}>
              <Chip icon={<Zap size={12} color="#3B82F6" />} label="Why TWH Academy" />
              <h2 style={{
                fontWeight: 900, color: T.text,
                fontSize: isLg ? "2.4rem" : isMd ? "2rem" : "1.6rem",
                letterSpacing: "-0.025em", marginBottom: 14,
              }}>
                Sirf Theory Nahi —{" "}
                <span style={{ background: "linear-gradient(130deg,#2563EB,#7C3AED)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  Asli Samajh
                </span>
              </h2>
              <p style={{ color: T.text2, fontSize: isMd ? "16px" : "14px", maxWidth: 480, margin: "0 auto", lineHeight: 1.75 }}>
                Jo dusri jagah nahi milega — real understanding, practical labs, aur ek honest creator.
              </p>
            </motion.div>
            <div style={{
              display: "grid",
              gridTemplateColumns: isLg ? "repeat(3,1fr)" : isMd ? "repeat(2,1fr)" : "1fr",
              gap: 16,
            }}>
              {FEATURES.map((f, i) => (
                <motion.div key={f.title}
                  initial={mounted ? { opacity: 0, y: 22 } : false} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.07, duration: 0.4 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  style={{
                    position: "relative", borderRadius: 20, background: T.card,
                    border: `1px solid ${T.border}`, padding: "26px",
                    boxShadow: `0 2px 14px rgba(0,0,0,${isDark ? 0.22 : 0.04})`,
                    overflow: "hidden",
                  }}
                >
                  <span style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${f.color},transparent)` }} />
                  <div style={{
                    width: 48, height: 48, borderRadius: 14, marginBottom: 18,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: isDark ? f.darkBg : f.lightBg, color: f.color,
                  }}>{f.icon}</div>
                  <h3 style={{ fontWeight: 700, fontSize: "15px", color: T.text, marginBottom: 8 }}>{f.title}</h3>
                  <p style={{ color: T.text2, fontSize: "13.5px", lineHeight: 1.75 }}>{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* ══════════════════════════
          CTA BANNER
      ══════════════════════════ */}
      <section style={{ background: T.altBg, padding: `${vp}px 0` }}>
        {W(
          <motion.div {...inView()}
            style={{
              position: "relative", borderRadius: 28, textAlign: "center",
              padding: isLg ? "80px 14%" : isMd ? "60px 10%" : "48px 28px",
              background: "linear-gradient(135deg,#1D4ED8 0%,#7C3AED 100%)",
              boxShadow: "0 24px 80px rgba(37,99,235,0.30)",
              overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", top: "-80px", right: "-80px", width: 280, height: 280, borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: "-60px", left: "-60px",  width: 220, height: 220, borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <img src="/twh-logo.png" alt="TWH Academy" style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", margin: "0 auto 24px", display: "block", boxShadow: "0 0 0 3px rgba(255,255,255,0.35), 0 8px 28px rgba(0,0,0,0.3)" }} />
              <h2 style={{
                fontWeight: 900, color: "white",
                fontSize: isLg ? "2.6rem" : isMd ? "2rem" : "1.6rem",
                letterSpacing: "-0.025em", marginBottom: 16,
              }}>
                Ready to become a<br />White Hat Hacker?
              </h2>
              <p style={{ color: "#BFDBFE", marginBottom: 40, fontSize: isMd ? "17px" : "15px", lineHeight: 1.75, maxWidth: 520, margin: "0 auto 40px" }}>
                Join TWH Academy. Start free — koi signup ki zaroorat nahi.<br />
                <strong style={{ color: "white" }}>Afsar Ali</strong> personally har chapter mein guide karta hai.
              </p>
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={goStart}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 12,
                  padding: "16px 48px", borderRadius: 16,
                  background: "white", color: "#2563EB",
                  fontWeight: 800, fontSize: "16px",
                  border: "none", cursor: "pointer",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.22)",
                }}
              >
                {user ? "Go to My Chapters" : "Start Learning — Free Forever"}
                <ArrowRight size={17} />
              </motion.button>
              <p style={{ color: "rgba(191,219,254,0.65)", fontSize: "12px", marginTop: 18 }}>
                No ads · No paywall · No bullshit
              </p>
            </div>
          </motion.div>
        )}
      </section>

      {/* ══════════════════════════
          FOOTER
      ══════════════════════════ */}
      <footer style={{ background: T.bg2, borderTop: `1px solid ${T.border}` }}>
        {W(
          <div style={{
            padding: `${isLg ? 36 : 28}px 0`,
            display: "flex", flexDirection: isLg ? "row" : "column",
            alignItems: isLg ? "center" : "flex-start",
            justifyContent: "space-between", gap: isLg ? 0 : 24,
          }}>
            {/* Brand */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
              <img src="/twh-logo.png" alt="TWH Academy" style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", boxShadow: "0 0 0 2px rgba(37,99,235,0.35)" }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: "15px", color: T.text, lineHeight: 1.3 }}>TWH Academy</div>
                <div style={{ fontSize: "11px", color: T.muted, lineHeight: 1.3 }}>by Technical White Hat</div>
              </div>
            </div>

            <p style={{ color: T.muted, fontSize: "13.5px", textAlign: isLg ? "center" : "left" }}>
              Built with ❤️ by{" "}
              <strong style={{ color: T.chipTxt }}>Afsar Ali</strong> — Technical White Hat
            </p>

            <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: isLg ? "flex-end" : "flex-start" }}>
              {[["Privacy","/privacy"],["Terms","/terms"],["Contact","/contact"],["Chapters","/chapters"]].map(([label, href]) => (
                <Link key={label} href={href}
                  style={{ color: T.muted, textDecoration: "none", fontSize: "13.5px", fontWeight: 500, transition: "color 0.2s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = T.chipTxt; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = T.muted; }}
                >{label}</Link>
              ))}
            </div>
          </div>
        )}
        <div style={{ borderTop: `1px solid ${T.border}`, padding: "12px 0", textAlign: "center" }}>
          <span style={{ fontSize: "12px", color: T.muted }}>© 2025 TWH Academy. All rights reserved.</span>
        </div>
      </footer>
    </main>
  );
}
