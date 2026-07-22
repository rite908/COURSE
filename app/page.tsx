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
  { icon: "🎓", title: "Students",         color: "#2563EB", lightBg: "#EEF3FF", darkBg: "rgba(37,99,235,0.15)",  desc: "CS, IT, ya koi bhi stream — background matters nahi. Zero se shuru karo." },
  { icon: "💼", title: "Working People",   color: "#7C3AED", lightBg: "#F3EEFF", darkBg: "rgba(124,58,237,0.15)", desc: "9-to-5 job hai? Self-paced format — apni speed pe seekho." },
  { icon: "🤔", title: "Curious Minds",    color: "#0EA5E9", lightBg: "#F0F9FF", darkBg: "rgba(14,165,233,0.15)", desc: "Sirf jaanna chahte ho computers kaise kaam karte hain? Sahi jagah hai." },
  { icon: "🔄", title: "Career Switchers", color: "#059669", lightBg: "#ECFDF5", darkBg: "rgba(5,150,105,0.15)",  desc: "Cybersecurity mein aana chahte ho? Yahan se shuru karo — zero assumptions." },
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
  { num: 1, label: "Hacker Mindset",     sub: "Chapter 1", color: "#2563EB", darkBg: "rgba(37,99,235,0.12)",  lightBg: "#EEF3FF", icon: <Shield size={20}/>,   topics: 6,  mcqs: 90  },
  { num: 2, label: "Computer Internals", sub: "Chapter 2", color: "#7C3AED", darkBg: "rgba(124,58,237,0.12)", lightBg: "#F3EEFF", icon: <Cpu size={20}/>,      topics: 10, mcqs: 150 },
  { num: 3, label: "Networking",         sub: "Chapter 3", color: "#0EA5E9", darkBg: "rgba(14,165,233,0.12)", lightBg: "#F0F9FF", icon: <Wifi size={20}/>,     topics: 10, mcqs: 150 },
  { num: 4, label: "Linux Basics",       sub: "Chapter 4", color: "#059669", darkBg: "rgba(5,150,105,0.12)",  lightBg: "#ECFDF5", icon: <Terminal size={20}/>, topics: 3,  mcqs: 45  },
  { num: 5, label: "Kali Linux",         sub: "Chapter 5", color: "#DC2626", darkBg: "rgba(220,38,38,0.12)",  lightBg: "#FEF2F2", icon: <Code2 size={20}/>,    topics: 12, mcqs: 180 },
];

/* ─── Count-up animation component ─── */
function CountUp({ to, suffix = "", duration = 1.4, delay = 0 }: { to: number; suffix?: string; duration?: number; delay?: number }) {
  const [val, setVal] = useState(0);
  const ref  = useRef<HTMLSpanElement>(null);
  const ran  = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || ran.current) return;
      ran.current = true;
      const t0 = performance.now() + delay * 1000;
      const tick = (now: number) => {
        if (now < t0) { requestAnimationFrame(tick); return; }
        const p = Math.min((now - t0) / (duration * 1000), 1);
        setVal(Math.round((1 - Math.pow(1 - p, 3)) * to));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      obs.disconnect();
    }, { threshold: 0.4 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [to, duration, delay]);
  return <span ref={ref}>{val}{suffix}</span>;
}

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
    <main style={{ background: T.heroBg, minHeight: "100vh", overflowX: "hidden" }}>

      {/* Full-page animated dot grid */}
      <div
        className="dot-grid-bg"
        style={{ backgroundImage: `radial-gradient(circle, ${T.dot} 1.5px, transparent 1.5px)` }}
      />

      {/* ══════════════════════════
          HERO
      ══════════════════════════ */}
      <section style={{
        position: "relative",
        background: "transparent",
        paddingTop: `calc(72px + ${isLg ? 20 : 14}px)`,
        paddingBottom: isLg ? 32 : 36,
        overflow: "hidden",
        display: "flex", flexDirection: "column",
      }}>
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
                  height: isLg ? "clamp(420px,44vw,520px)" : isMd ? 350 : 280,
                }}>
                  <HeroScene />
                </div>
              </motion.div>
            </div>,
            { maxWidth: 1500, padding: `0 ${isLg ? 60 : sp}px` }
          )}
        </div>

        {/* Scroll cue */}
        {isLg && mounted && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "12px 0 24px" }}>
            <span style={{ fontSize: "10px", fontWeight: 600, color: T.muted, textTransform: "uppercase", letterSpacing: "0.14em" }}>Scroll</span>
            <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
              <ChevronDown size={14} color={T.muted} />
            </motion.div>
          </motion.div>
        )}
      </section>

      {/* Chapter marquee strip — outside hero so overflow:hidden doesn't clip it */}
      <div style={{
        position: "relative",
        overflowX: "hidden",
        padding: "24px 0",
        background: T.bg,
      }}>
        {/* Fade edges */}
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 120, zIndex: 2, background: isDark ? "linear-gradient(to right,#0A0E1A,transparent)" : "linear-gradient(to right,#F8FAFF,transparent)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 120, zIndex: 2, background: isDark ? "linear-gradient(to left,#0A0E1A,transparent)" : "linear-gradient(to left,#F8FAFF,transparent)", pointerEvents: "none" }} />

        <div className="chapter-marquee-track">
          {[...CHAPTERS, ...CHAPTERS].map((ch, i) => (
            <div key={i} style={{
              display: "inline-flex", alignItems: "center", gap: 14,
              padding: "10px 20px",
              marginRight: 12,
              flexShrink: 0,
              borderRadius: 16,
              background: isDark ? "#0D1117" : "#FFFFFF",
              border: `1px solid ${isDark ? "#1E2433" : "#E5E7EB"}`,
              boxShadow: isDark ? `0 4px 24px ${ch.color}30` : `0 2px 16px rgba(0,0,0,0.07)`,
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

      {/* ══════════════════════════
          STATS STRIP
      ══════════════════════════ */}
      <div style={{
        background: "transparent",
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
                {/* Full-width accent line — animated scaleX in */}
                <motion.span
                  initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 + 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: 3,
                    background: s.color, transformOrigin: "left",
                    boxShadow: isDark ? `0 0 12px ${s.color}CC, 0 0 28px ${s.color}66` : "none",
                  }}
                />

                {/* Subtle top colour wash for depth */}
                <span style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: 72,
                  background: `linear-gradient(180deg,${s.color}18 0%,transparent 100%)`,
                  pointerEvents: "none",
                }} />

                <div style={{ position: "relative", width: 52, height: 52, borderRadius: 16, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: isDark ? s.darkBg : s.lightBg, color: s.color }}>
                  {s.icon}
                </div>
                <div style={{ position: "relative", minWidth: 0, flex: 1 }}>
                  <div style={{ fontWeight: 900, fontSize: "clamp(1.1rem, 1.3vw, 1.6rem)", color: T.text, lineHeight: 1.15 }}>{s.value}</div>
                  <div style={{ fontSize: "10px", color: T.muted, fontWeight: 700, marginTop: 5, textTransform: "uppercase", letterSpacing: "0.08em", lineHeight: 1.4 }}>{s.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* ══════════════════════════
          CHAPTERS ACCORDION
      ══════════════════════════ */}
      <section style={{ background: "transparent", padding: `${vp}px 0`, position: "relative", overflow: "hidden" }}>
        {/* Section glow blobs — like hero */}
        <div style={{ position: "absolute", left: "-8%", top: "15%", width: "42%", height: "65%", background: "radial-gradient(ellipse,rgba(37,99,235,0.07) 0%,transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: "-8%", bottom: "10%", width: "42%", height: "65%", background: "radial-gradient(ellipse,rgba(124,58,237,0.07) 0%,transparent 70%)", pointerEvents: "none" }} />

        {W(
          <>
            {/* ── Header ── */}
            <div style={{ textAlign: "center", marginBottom: 60 }}>
              <motion.div {...inView()}>
                <Chip icon={<BookOpen size={12} color="#3B82F6" />} label="Course Content" />
              </motion.div>

              {/* Animated stat bubbles — count-up numbers */}
              <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap", marginBottom: 28 }}>
                {[
                  { to: 5,   suffix: "",  label: "Chapters", color: "#2563EB", lightBg: "#EEF3FF", darkBg: "rgba(37,99,235,0.12)" },
                  { to: 41,  suffix: "",  label: "Topics",   color: "#7C3AED", lightBg: "#F3EEFF", darkBg: "rgba(124,58,237,0.12)" },
                  { to: 615, suffix: "+", label: "MCQs",     color: "#0EA5E9", lightBg: "#F0F9FF", darkBg: "rgba(14,165,233,0.12)" },
                ].map((stat, i) => (
                  <motion.div key={stat.label}
                    initial={mounted ? { opacity: 0, scale: 0.75, y: 14 } : false}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ scale: 1.06, boxShadow: isDark ? `0 8px 32px ${stat.color}40` : `0 8px 24px ${stat.color}20`, transition: { duration: 0.18 } }}
                    style={{
                      position: "relative", overflow: "hidden",
                      display: "inline-flex", flexDirection: "column", alignItems: "center",
                      padding: "14px 28px", borderRadius: 18,
                      background: isDark ? stat.darkBg : stat.lightBg,
                      border: `1px solid ${stat.color}30`,
                      boxShadow: isDark ? `0 4px 24px ${stat.color}25, 0 0 0 1px ${stat.color}15` : `0 4px 16px ${stat.color}12`,
                      cursor: "default",
                    }}
                  >
                    {/* Shimmer sweep on hover */}
                    <motion.div
                      variants={{ hovered: { x: "300%", transition: { duration: 0.55, ease: "easeInOut" } } }}
                      initial={{ x: "-100%" }}
                      style={{
                        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
                        background: `linear-gradient(90deg,transparent 20%,${stat.color}18 50%,transparent 80%)`,
                        transform: "skewX(-20deg)",
                      }}
                    />
                    <span style={{
                      position: "relative", zIndex: 1,
                      fontSize: isLg ? "2.2rem" : "1.8rem", fontWeight: 900, lineHeight: 1,
                      background: `linear-gradient(135deg,${stat.color},${stat.color}bb)`,
                      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                    }}>
                      {mounted ? <CountUp to={stat.to} suffix={stat.suffix} delay={i * 0.15} /> : `${stat.to}${stat.suffix}`}
                    </span>
                    <span style={{ position: "relative", zIndex: 1, fontSize: "11px", fontWeight: 700, color: stat.color, opacity: 0.75, textTransform: "uppercase", letterSpacing: "0.09em", marginTop: 5 }}>{stat.label}</span>
                  </motion.div>
                ))}
              </div>

              <motion.h2
                initial={mounted ? { opacity: 0, y: 16 } : false}
                whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  fontWeight: 900, color: T.text,
                  fontSize: isLg ? "2.4rem" : isMd ? "2rem" : "1.6rem",
                  letterSpacing: "-0.025em", marginBottom: 14,
                }}
              >
                Zero Se{" "}
                <span style={{ background: "linear-gradient(130deg,#2563EB,#7C3AED)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  Ethical Hacker
                </span>
                {" "}Tak — Chapter by Chapter
              </motion.h2>

              <motion.p
                initial={mounted ? { opacity: 0, y: 12 } : false}
                whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: 0.38, duration: 0.5 }}
                style={{ color: T.text2, fontSize: isMd ? "16px" : "14px", maxWidth: 540, margin: "0 auto", lineHeight: 1.75 }}
              >
                Ek structured path jo tumhe zero se ethical hacker banata hai — computers ke andar se lekar Kali Linux tak.
              </motion.p>
            </div>

            {/* ── Chapter cards ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {CHAPTERS.map((ch, i) => {
                const isOpen = openCh === ch.num;
                return (
                  <motion.div key={ch.num}
                    initial={mounted ? { opacity: 0, y: 20 } : false}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    whileHover="hovered"
                    style={{
                      position: "relative",
                      borderRadius: 20, background: T.card,
                      border: `1px solid ${isOpen ? ch.color + "55" : T.border}`,
                      boxShadow: isOpen
                        ? `0 8px 48px ${ch.color}22, 0 0 0 1px ${ch.color}18`
                        : `0 2px 14px rgba(0,0,0,${isDark ? 0.2 : 0.04})`,
                      overflow: "hidden",
                      transition: "border-color 0.3s, box-shadow 0.3s",
                    }}
                  >
                    {/* Shimmer sweep on hover */}
                    <motion.div
                      variants={{ hovered: { x: "260%", transition: { duration: 0.6, ease: "easeInOut" } } }}
                      initial={{ x: "-100%" }}
                      style={{
                        position: "absolute", inset: 0, zIndex: 4, pointerEvents: "none",
                        background: `linear-gradient(90deg,transparent 20%,${ch.color}0E 50%,transparent 80%)`,
                        transform: "skewX(-18deg)",
                      }}
                    />
                    {/* Left border strip — animated height */}
                    <motion.div
                      animate={{
                        height: isOpen ? "100%" : "52%",
                        opacity: isOpen ? 1 : 0.55,
                      }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      style={{
                        position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)",
                        width: 4, borderRadius: "0 3px 3px 0",
                        background: `linear-gradient(180deg,${ch.color},${ch.color}88)`,
                        boxShadow: isDark ? `0 0 16px ${ch.color}90` : `0 0 8px ${ch.color}40`,
                      }}
                    />

                    {/* Background colour wash — fades in on open */}
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          transition={{ duration: 0.35 }}
                          style={{
                            position: "absolute", inset: 0, pointerEvents: "none",
                            background: isDark
                              ? `radial-gradient(ellipse at 0% 0%, ${ch.color}0D 0%, transparent 55%)`
                              : `radial-gradient(ellipse at 0% 0%, ${ch.color}09 0%, transparent 55%)`,
                          }}
                        />
                      )}
                    </AnimatePresence>

                    {/* Large faded watermark number */}
                    <div style={{
                      position: "absolute", right: isMd ? 24 : 12, top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: "7rem", fontWeight: 900, lineHeight: 1,
                      color: ch.color, opacity: isDark ? 0.05 : 0.04,
                      pointerEvents: "none", userSelect: "none",
                    }}>
                      {String(ch.num).padStart(2, "0")}
                    </div>

                    {/* ── Header button ── */}
                    <button
                      onClick={() => setOpenCh(isOpen ? null : ch.num)}
                      style={{
                        width: "100%", background: "none", border: "none", cursor: "pointer",
                        display: "flex", alignItems: "center", gap: isMd ? 20 : 14,
                        padding: isMd ? "24px 28px 24px 24px" : "18px 20px",
                        textAlign: "left", position: "relative",
                      }}
                    >
                      {/* Icon — glows on open */}
                      <motion.div
                        animate={{
                          boxShadow: isOpen
                            ? `0 0 0 4px ${ch.color}20, 0 0 24px ${ch.color}50`
                            : `0 0 0 0px transparent`,
                        }}
                        whileHover={{ scale: 1.08, boxShadow: `0 0 0 4px ${ch.color}20, 0 0 20px ${ch.color}45` }}
                        transition={{ duration: 0.3 }}
                        style={{
                          width: 56, height: 56, borderRadius: 16, flexShrink: 0,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          background: isDark ? ch.darkBg : ch.lightBg, color: ch.color,
                          border: `1px solid ${ch.color}35`,
                        }}
                      >
                        {ch.icon}
                      </motion.div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        {/* Title row */}
                        <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 6 }}>
                          {/* Solid coloured badge */}
                          <span style={{
                            fontSize: "10px", fontWeight: 800, color: "white",
                            background: ch.color, padding: "3px 9px", borderRadius: 7,
                            textTransform: "uppercase", letterSpacing: "0.08em",
                            boxShadow: isDark ? `0 0 12px ${ch.color}80` : `0 2px 8px ${ch.color}40`,
                          }}>Ch {ch.num}</span>
                          <span style={{ fontWeight: 800, fontSize: isMd ? "17px" : "15px", color: T.text }}>
                            {ch.title}
                          </span>
                          {isMd && (
                            <span style={{
                              fontSize: "11px", fontWeight: 700, padding: "3px 11px", borderRadius: 999,
                              background: isDark ? ch.darkBg : ch.lightBg, color: ch.color,
                              border: `1px solid ${ch.color}28`,
                            }}>
                              {ch.subtitle}
                            </span>
                          )}
                        </div>

                        {/* Description */}
                        <p style={{ color: T.text2, fontSize: "13.5px", lineHeight: 1.65, marginBottom: 10 }}>
                          {ch.desc}
                        </p>

                        {/* Stats row */}
                        <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                          {[
                            { icon: <Layers size={11} color={ch.color} />,     text: `${ch.topics.length} topics`, color: ch.color },
                            { icon: <HelpCircle size={11} color={ch.color} />, text: `${ch.mcqs} MCQs`,            color: ch.color },
                          ].map(({ icon, text, color }) => (
                            <span key={text} style={{ fontSize: "12px", color, display: "flex", alignItems: "center", gap: 5, fontWeight: 600 }}>
                              {icon}{text}
                            </span>
                          ))}
                          {/* Pulsing live "Available" dot */}
                          <span style={{ fontSize: "12px", color: "#059669", display: "flex", alignItems: "center", gap: 6, fontWeight: 600 }}>
                            <span style={{ position: "relative", display: "inline-flex", width: 10, height: 10 }}>
                              <motion.span
                                animate={{ scale: [1, 2.2, 1], opacity: [0.7, 0, 0.7] }}
                                transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                                style={{
                                  position: "absolute", inset: 0, borderRadius: "50%",
                                  background: "#059669", display: "block",
                                }}
                              />
                              <span style={{ position: "relative", width: 10, height: 10, borderRadius: "50%", background: "#059669", display: "block" }} />
                            </span>
                            Available
                          </span>

                          {/* MCQ content bar — real weight out of 615 total */}
                          <div style={{ display: "flex", alignItems: "center", gap: 7, marginLeft: "auto" }}>
                            <div style={{
                              width: 72, height: 4, borderRadius: 3,
                              background: isDark ? "rgba(255,255,255,0.07)" : "#E5E7EB",
                              overflow: "hidden",
                            }}>
                              <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: `${Math.round((ch.mcqs / 615) * 100)}%` }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 + 0.4, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                                style={{
                                  height: "100%", borderRadius: 3,
                                  background: `linear-gradient(90deg,${ch.color},${ch.color}cc)`,
                                  boxShadow: isDark ? `0 0 6px ${ch.color}80` : "none",
                                }}
                              />
                            </div>
                            <span style={{ fontSize: "10px", color: ch.color, fontWeight: 700 }}>
                              {ch.mcqs} MCQs
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Chevron */}
                      <motion.div
                        animate={{ rotate: isOpen ? 90 : 0 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        style={{ flexShrink: 0 }}
                      >
                        <ChevronRight size={20} color={isOpen ? ch.color : T.muted} />
                      </motion.div>
                    </button>

                    {/* ── Expandable topics ── */}
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                          style={{ overflow: "hidden" }}
                        >
                          <div style={{
                            borderTop: `1px solid ${ch.color}28`,
                            padding: isMd ? "24px 28px 30px 28px" : "18px 20px 24px",
                          }}>
                            {/* Topics label */}
                            <div style={{
                              display: "flex", alignItems: "center", gap: 8, marginBottom: 18,
                            }}>
                              <span style={{
                                fontSize: "11px", fontWeight: 800, color: ch.color,
                                textTransform: "uppercase", letterSpacing: "0.1em",
                              }}>
                                {ch.topics.length} Topics in this chapter
                              </span>
                              <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg,${ch.color}30,transparent)` }} />
                            </div>

                            {/* Topic grid — staggered slide-in */}
                            <div style={{
                              display: "grid",
                              gridTemplateColumns: isLg ? "repeat(2,1fr)" : isSm ? "repeat(2,1fr)" : "1fr",
                              gap: "10px 32px",
                              marginBottom: 26,
                            }}>
                              {ch.topics.map((topic, ti) => (
                                <motion.div key={ti}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: ti * 0.045, duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                                  style={{ display: "flex", alignItems: "flex-start", gap: 10 }}
                                >
                                  <div style={{
                                    width: 24, height: 24, borderRadius: "50%", flexShrink: 0, marginTop: 2,
                                    background: isDark ? ch.darkBg : ch.lightBg,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    border: `1px solid ${ch.color}30`,
                                    boxShadow: isDark ? `0 0 8px ${ch.color}30` : "none",
                                  }}>
                                    <span style={{ fontSize: "9px", fontWeight: 800, color: ch.color }}>{ch.num}.{ti + 1}</span>
                                  </div>
                                  <span style={{ fontSize: "13.5px", color: T.text2, lineHeight: 1.65, paddingTop: 3 }}>{topic}</span>
                                </motion.div>
                              ))}
                            </div>

                            {/* Gradient CTA button — matches chapter color */}
                            <Link href="/chapters">
                              <motion.div
                                whileHover={{ scale: 1.04, boxShadow: `0 8px 28px ${ch.color}50` }}
                                whileTap={{ scale: 0.97 }}
                                transition={{ duration: 0.18 }}
                                style={{
                                  display: "inline-flex", alignItems: "center", gap: 10,
                                  padding: "13px 28px", borderRadius: 14,
                                  background: `linear-gradient(135deg,${ch.color} 0%,${ch.color}cc 100%)`,
                                  color: "white", fontSize: "14px", fontWeight: 700,
                                  cursor: "pointer",
                                  boxShadow: `0 4px 18px ${ch.color}45`,
                                }}
                              >
                                Start Chapter {ch.num} — {ch.title}
                                <ArrowRight size={15} />
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
      <section style={{ position:"relative", overflow:"hidden", padding:`${vp}px 0`, background:"transparent" }}>

        {W(
          <div style={{ position:"relative", zIndex:1 }}>

            {/* ── Header ── */}
            <motion.div {...inView()} style={{ textAlign:"center", marginBottom: isLg ? 64 : 44 }}>
              <Chip icon={<Compass size={12} color="#3B82F6" />} label="Learning Path" />
              <h2 style={{
                fontWeight:900, color:T.text, margin:"0 0 14px",
                fontSize: isLg ? "2.4rem" : isMd ? "2rem" : "1.6rem",
                letterSpacing:"-0.025em",
              }}>
                Zero Se{" "}
                <span style={{ background:"linear-gradient(130deg,#2563EB,#7C3AED)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
                  Ethical Hacker
                </span>{" "}Tak
              </h2>
              <p style={{ color:T.text2, fontSize: isMd ? "16px" : "14px", maxWidth:460, margin:"0 auto", lineHeight:1.75 }}>
                Ek clear step-by-step path. Koi confusion nahi — bas ek ke baad ek chapter.
              </p>
            </motion.div>

            {/* ── Desktop ── */}
            {isLg ? (
              <>{/* ── Desktop: step nodes + cards ── */}
              {/* paddingTop makes room for the node circles that sit on top of each card */}
              <div style={{ display:"flex", gap:12, position:"relative", paddingTop:30 }}>

                {/* Track line — sits at y=0 of this container, which = center of node circles */}
                <div style={{
                  position:"absolute", top:0, left:"10%", right:"10%", height:1,
                  background: T.border, borderRadius:1,
                }} />
                <motion.div
                  initial={{ scaleX:0 }} whileInView={{ scaleX:1 }} viewport={{ once:true }}
                  transition={{ duration:1.2, ease:[0.22,1,0.36,1], delay:0.05 }}
                  style={{
                    position:"absolute", top:0, left:"10%", right:"10%", height:1,
                    background:"linear-gradient(90deg,#2563EB,#7C3AED,#0EA5E9,#059669,#DC2626)",
                    transformOrigin:"left", borderRadius:1,
                  }}
                />
                {/* Travelling dot */}
                <div style={{ position:"absolute", top:-3, left:"10%", right:"10%", overflow:"hidden", height:7, pointerEvents:"none" }}>
                  <motion.div
                    animate={{ x:["-5%","105%"] }}
                    transition={{ repeat:Infinity, duration:4, ease:"linear", repeatDelay:3 }}
                    style={{
                      position:"absolute", top:0, left:0, width:"15%", height:"100%",
                      background:`linear-gradient(90deg,transparent,${isDark?"rgba(255,255,255,0.55)":"rgba(37,99,235,0.5)"},transparent)`,
                    }}
                  />
                </div>

                {ROADMAP.map((step, i) => (
                  <div key={step.num} style={{ flex:1, position:"relative" }}>
                    {/* Node circle — centered on the track line */}
                    <motion.div
                      initial={mounted ? { scale:0 } : false}
                      whileInView={{ scale:1 }}
                      viewport={{ once:true }}
                      transition={{ delay: i * 0.12 + 0.3, type:"spring", stiffness:400, damping:20 }}
                      style={{
                        position:"absolute", top:-26, left:"50%", transform:"translateX(-50%)",
                        width:52, height:52, borderRadius:"50%", zIndex:2,
                        background:`linear-gradient(135deg,${step.color},${step.color}cc)`,
                        boxShadow:`0 4px 20px ${step.color}45`,
                        display:"flex", alignItems:"center", justifyContent:"center",
                        color:"white", fontWeight:800, fontSize:"16px",
                      }}
                    >
                      {step.num}
                    </motion.div>

                    {/* Card */}
                    <motion.div
                      initial={mounted ? { opacity:0, y:18 } : false}
                      whileInView={{ opacity:1, y:0 }}
                      viewport={{ once:true }}
                      transition={{ delay: i * 0.1 + 0.5, duration:0.5, ease:[0.22,1,0.36,1] }}
                      whileHover={{ y:-5, transition:{ duration:0.2 } }}
                      style={{
                        borderRadius:16, overflow:"hidden", cursor:"pointer",
                        background:T.card,
                        border:`1px solid ${T.border}`,
                        boxShadow: isDark
                          ? `0 2px 16px rgba(0,0,0,0.3)`
                          : `0 2px 16px rgba(0,0,0,0.06)`,
                        paddingTop:40, padding:"40px 20px 22px",
                        display:"flex", flexDirection:"column", alignItems:"center",
                        textAlign:"center", gap:10,
                        transition:"box-shadow 0.2s",
                      }}
                    >
                      {/* Colored top stripe */}
                      <div style={{
                        position:"absolute", top:0, left:0, right:0, height:3,
                        background:`linear-gradient(90deg,${step.color},${step.color}88)`,
                      }} />

                      {/* Icon */}
                      <motion.div
                        whileInView={{ scale:[0.7,1.1,1] }}
                        viewport={{ once:true }}
                        transition={{ delay: i * 0.1 + 0.6, duration:0.4, ease:[0.22,1,0.36,1] }}
                        style={{
                          width:46, height:46, borderRadius:"50%",
                          background: isDark ? step.darkBg : step.lightBg,
                          border:`1.5px solid ${step.color}35`,
                          display:"flex", alignItems:"center", justifyContent:"center",
                          color:step.color,
                        }}
                      >
                        {step.icon}
                      </motion.div>

                      {/* Text */}
                      <div>
                        <div style={{ fontWeight:700, fontSize:"14px", color:T.text, lineHeight:1.3 }}>
                          {step.label}
                        </div>
                        <div style={{ fontSize:"12px", color:T.muted, marginTop:3 }}>
                          {step.sub}
                        </div>
                      </div>

                      {/* Topics count */}
                      <div style={{
                        fontSize:"11px", fontWeight:600, color:step.color,
                        padding:"3px 10px", borderRadius:999,
                        background: isDark ? step.darkBg : step.lightBg,
                      }}>
                        {step.topics} topics · {step.mcqs} MCQs
                      </div>
                    </motion.div>
                  </div>
                ))}
              </div>
              </>
            ) : (
              /* ── Mobile: vertical timeline ── */
              <div style={{ position:"relative", paddingLeft:32 }}>
                {/* Track */}
                <div style={{
                  position:"absolute", left:10, top:6, bottom:6, width:1,
                  background:T.border, borderRadius:1,
                }} />
                <motion.div
                  initial={{ scaleY:0 }} whileInView={{ scaleY:1 }} viewport={{ once:true }}
                  transition={{ duration:1.4, ease:[0.22,1,0.36,1] }}
                  style={{
                    position:"absolute", left:10, top:6, bottom:6, width:1,
                    background:"linear-gradient(180deg,#2563EB,#7C3AED,#0EA5E9,#059669,#DC2626)",
                    transformOrigin:"top", borderRadius:1,
                  }}
                />

                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {ROADMAP.map((step, i) => (
                    <motion.div key={step.num}
                      initial={mounted ? { opacity:0, x:16 } : false}
                      whileInView={{ opacity:1, x:0 }}
                      viewport={{ once:true }}
                      transition={{ delay: i * 0.09, duration:0.45, ease:[0.22,1,0.36,1] }}
                      style={{ position:"relative", display:"flex", alignItems:"center", gap:14 }}
                    >
                      {/* Timeline dot */}
                      <motion.div
                        initial={mounted ? { scale:0 } : false}
                        whileInView={{ scale:1 }}
                        viewport={{ once:true }}
                        transition={{ delay: i * 0.09 + 0.15, type:"spring", stiffness:400, damping:18 }}
                        style={{
                          position:"absolute", left:-32, top:"50%", transform:"translateY(-50%)",
                          width:22, height:22, borderRadius:"50%", zIndex:2,
                          background:`linear-gradient(135deg,${step.color},${step.color}cc)`,
                          boxShadow:`0 2px 10px ${step.color}50`,
                          display:"flex", alignItems:"center", justifyContent:"center",
                          color:"white", fontWeight:800, fontSize:"10px",
                          border: `2px solid ${T.bg}`,
                        }}
                      >
                        {step.num}
                      </motion.div>

                      {/* Card */}
                      <div style={{
                        flex:1, borderRadius:14, overflow:"hidden",
                        background:T.card, border:`1px solid ${T.border}`,
                        padding:"14px 16px",
                        display:"flex", alignItems:"center", gap:12,
                        boxShadow: isDark ? `0 2px 12px rgba(0,0,0,0.25)` : `0 2px 12px rgba(0,0,0,0.05)`,
                      }}>
                        {/* Left color bar */}
                        <div style={{
                          position:"absolute", left:0, top:0, bottom:0, width:3,
                          background:`linear-gradient(180deg,${step.color},${step.color}88)`,
                        }} />
                        <div style={{
                          width:40, height:40, borderRadius:"50%", flexShrink:0,
                          background: isDark ? step.darkBg : step.lightBg,
                          border:`1.5px solid ${step.color}30`,
                          display:"flex", alignItems:"center", justifyContent:"center",
                          color:step.color,
                        }}>
                          {step.icon}
                        </div>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontWeight:700, fontSize:"14px", color:T.text }}>{step.label}</div>
                          <div style={{ fontSize:"12px", color:T.muted, marginTop:2 }}>{step.sub}</div>
                          <div style={{ fontSize:"11px", fontWeight:600, color:step.color, marginTop:5 }}>
                            {step.topics} topics · {step.mcqs} MCQs
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* ══════════════════════════
          WHO IS THIS FOR
      ══════════════════════════ */}
      <section style={{ background: "transparent", padding: `${vp}px 0` }}>
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
                  whileHover={{ y: -8, boxShadow: isDark ? `0 12px 40px ${card.color}25, 0 0 0 1px ${card.color}40` : `0 12px 36px ${card.color}18, 0 0 0 1px ${card.color}30`, transition: { duration: 0.2 } }}
                  style={{
                    position: "relative", borderRadius: 20, background: T.card,
                    border: `1px solid ${T.border}`,
                    padding: isMd ? "32px 24px" : "24px 18px",
                    boxShadow: `0 2px 14px rgba(0,0,0,${isDark ? 0.22 : 0.04})`,
                    textAlign: "center", overflow: "hidden",
                  }}
                >
                  {/* Animated top accent bar */}
                  <motion.span
                    initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 + 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      position: "absolute", top: 0, left: 0, right: 0, height: 3,
                      background: card.color, transformOrigin: "left",
                      boxShadow: isDark ? `0 0 12px ${card.color}99` : "none",
                    }}
                  />
                  {/* Subtle top colour wash */}
                  <span style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: 80,
                    background: `linear-gradient(180deg,${card.color}12 0%,transparent 100%)`,
                    pointerEvents: "none",
                  }} />
                  {/* Icon bubble with colour */}
                  <div style={{
                    width: 64, height: 64, borderRadius: 20, margin: "0 auto 18px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: isDark ? card.darkBg : card.lightBg,
                    fontSize: "2rem",
                    boxShadow: isDark ? `0 0 20px ${card.color}40` : `0 4px 16px ${card.color}20`,
                    border: `1px solid ${card.color}25`,
                    position: "relative",
                  }}>{card.icon}</div>
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
      <section style={{ background: "transparent", padding: `${vp}px 0` }}>
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
                {/* Pulsing outer glow ring */}
                <motion.div
                  animate={{ opacity: [0.35, 0.75, 0.35], scale: [1, 1.08, 1] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                  style={{
                    position: "absolute", inset: -8, borderRadius: 36,
                    border: "2px solid #2563EB",
                    boxShadow: "0 0 20px rgba(37,99,235,0.45)",
                    pointerEvents: "none",
                  }}
                />
                {/* Slow rotating gradient ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  style={{
                    position: "absolute", inset: -4, borderRadius: 32,
                    background: "conic-gradient(from 0deg, #2563EB, #7C3AED, #0EA5E9, transparent, transparent, #2563EB)",
                    opacity: 0.5, pointerEvents: "none",
                  }}
                />
                <div style={{
                  position: "relative",
                  width: 110, height: 110, borderRadius: 28,
                  background: "linear-gradient(135deg,#2563EB 0%,#7C3AED 100%)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 8px 32px rgba(37,99,235,0.38)",
                  fontSize: "2.8rem", fontWeight: 900, color: "white", zIndex: 1,
                }}>A</div>
                <div style={{
                  position: "absolute", bottom: -6, right: -6,
                  width: 26, height: 26, borderRadius: "50%",
                  background: "#059669", border: `3px solid ${T.altBg}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  zIndex: 2,
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
      <section style={{ background: "transparent", padding: `${vp}px 0` }}>
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
                  <motion.div
                    whileHover={{ scale: 1.15, boxShadow: `0 0 28px ${f.color}70` }}
                    transition={{ duration: 0.22 }}
                    style={{
                      width: 48, height: 48, borderRadius: 14, marginBottom: 18,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: isDark ? f.darkBg : f.lightBg, color: f.color,
                      boxShadow: isDark ? `0 0 12px ${f.color}30` : "none",
                    }}>{f.icon}</motion.div>
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
      <section style={{ background: "transparent", padding: `${vp}px 0` }}>
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
            {/* Floating animated rings */}
            {[
              { size: 90,  x: "8%",  y: "15%", delay: 0 },
              { size: 50,  x: "82%", y: "60%", delay: 0.6 },
              { size: 130, x: "65%", y: "5%",  delay: 1.1 },
              { size: 40,  x: "25%", y: "70%", delay: 0.3 },
              { size: 70,  x: "90%", y: "25%", delay: 0.9 },
            ].map((ring, i) => (
              <motion.div key={i}
                animate={{ y: [0, -14, 0], opacity: [0.12, 0.28, 0.12] }}
                transition={{ duration: 4 + i, repeat: Infinity, delay: ring.delay, ease: "easeInOut" }}
                style={{
                  position: "absolute", left: ring.x, top: ring.y,
                  width: ring.size, height: ring.size, borderRadius: "50%",
                  border: "1px solid rgba(255,255,255,0.25)",
                  pointerEvents: "none",
                }}
              />
            ))}
            {/* Floating dots */}
            {[
              { x: "15%", y: "40%", delay: 0.2 },
              { x: "55%", y: "75%", delay: 0.7 },
              { x: "75%", y: "20%", delay: 1.4 },
              { x: "40%", y: "85%", delay: 0.5 },
            ].map((dot, i) => (
              <motion.div key={`dot-${i}`}
                animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 2.5 + i * 0.4, repeat: Infinity, delay: dot.delay, ease: "easeInOut" }}
                style={{
                  position: "absolute", left: dot.x, top: dot.y,
                  width: 6, height: 6, borderRadius: "50%",
                  background: "rgba(255,255,255,0.5)", pointerEvents: "none",
                }}
              />
            ))}
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
      <footer style={{ background: "transparent", position: "relative", overflow: "hidden" }}>
        {/* Animated gradient top border */}
        <motion.div
          initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          style={{
            height: 2, transformOrigin: "left",
            background: "linear-gradient(90deg,#2563EB,#7C3AED,#0EA5E9,#059669)",
            boxShadow: "0 0 24px rgba(37,99,235,0.55)",
          }}
        />

        {/* Subtle glow blobs */}
        <div style={{ position: "absolute", left: "-10%", bottom: 0, width: "35%", height: "100%", background: "radial-gradient(ellipse,rgba(37,99,235,0.05) 0%,transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: "-10%", bottom: 0, width: "35%", height: "100%", background: "radial-gradient(ellipse,rgba(124,58,237,0.05) 0%,transparent 70%)", pointerEvents: "none" }} />

        {W(
          <motion.div
            initial={mounted ? { opacity: 0, y: 28 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* ── Main 3-column grid ── */}
            <div style={{
              display: "grid",
              gridTemplateColumns: isLg ? "2fr 1fr 1fr" : isMd ? "1fr 1fr" : "1fr",
              gap: isLg ? 64 : isMd ? 40 : 36,
              padding: `${isLg ? 60 : 44}px 0 ${isLg ? 52 : 40}px`,
            }}>

              {/* Col 1 — Brand */}
              <motion.div
                initial={mounted ? { opacity: 0, y: 16 } : false}
                whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                  {/* Pulsing logo */}
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <motion.div
                      animate={{ boxShadow: ["0 0 0 0 rgba(37,99,235,0.5)","0 0 0 10px rgba(37,99,235,0)","0 0 0 0 rgba(37,99,235,0)"] }}
                      transition={{ duration: 2.6, repeat: Infinity, ease: "easeOut" }}
                      style={{ borderRadius: "50%", width: 48, height: 48 }}
                    >
                      <img src="/twh-logo.png" alt="TWH Academy" style={{
                        width: 48, height: 48, borderRadius: "50%", objectFit: "cover",
                        border: "2px solid rgba(37,99,235,0.4)",
                        display: "block",
                      }} />
                    </motion.div>
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: "17px", color: T.text, lineHeight: 1.3 }}>TWH Academy</div>
                    <div style={{ fontSize: "12px", color: T.muted, lineHeight: 1.3 }}>by Technical White Hat</div>
                  </div>
                </div>

                <p style={{ color: T.text2, fontSize: "14px", lineHeight: 1.85, maxWidth: 300, marginBottom: 24 }}>
                  India ka premier ethical hacking course. Zero se Kali Linux tak —{" "}
                  <strong style={{ color: T.text }}>bilkul free, hamesha ke liye.</strong>
                </p>

                {/* Trust badges */}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {[
                    { label: "✓ 100% Free",  color: "#059669", lightBg: "#ECFDF5", darkBg: "rgba(5,150,105,0.15)" },
                    { label: "✓ No Ads",     color: "#2563EB", lightBg: "#EEF3FF", darkBg: "rgba(37,99,235,0.15)" },
                    { label: "✓ No Paywall", color: "#7C3AED", lightBg: "#F3EEFF", darkBg: "rgba(124,58,237,0.15)" },
                  ].map((badge, bi) => (
                    <motion.span key={badge.label}
                      initial={mounted ? { opacity: 0, scale: 0.85 } : false}
                      whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                      transition={{ delay: 0.25 + bi * 0.07, duration: 0.4 }}
                      style={{
                        fontSize: "11px", fontWeight: 700, padding: "4px 12px", borderRadius: 999,
                        background: isDark ? badge.darkBg : badge.lightBg,
                        color: badge.color,
                        border: `1px solid ${badge.color}25`,
                      }}
                    >{badge.label}</motion.span>
                  ))}
                </div>
              </motion.div>

              {/* Col 2 — Explore */}
              <motion.div
                initial={mounted ? { opacity: 0, y: 16 } : false}
                whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <div style={{ fontWeight: 800, fontSize: "11px", color: T.muted, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 22 }}>
                  Explore
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {[
                    { label: "Home",           href: "/",         icon: "🏠" },
                    { label: "Chapters",        href: "/chapters", icon: "📚" },
                    { label: "Roadmap",         href: "/roadmap",  icon: "🗺️" },
                    { label: "About",           href: "/about",    icon: "👤" },
                    { label: "Contact",         href: "/contact",  icon: "📬" },
                  ].map(({ label, href, icon }, li) => (
                    <motion.div key={label}
                      initial={mounted ? { opacity: 0, x: -12 } : false}
                      whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                      transition={{ delay: 0.25 + li * 0.06, duration: 0.4 }}
                    >
                      <Link href={href}
                        style={{ color: T.muted, textDecoration: "none", fontSize: "14px", fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 9, padding: "7px 0", transition: "color 0.2s, gap 0.2s" }}
                        onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = T.chipTxt; el.style.gap = "13px"; }}
                        onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = T.muted; el.style.gap = "9px"; }}
                      >
                        <span style={{ fontSize: "13px" }}>{icon}</span>
                        {label}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Col 3 — Legal + Creator card */}
              <motion.div
                initial={mounted ? { opacity: 0, y: 16 } : false}
                whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <div style={{ fontWeight: 800, fontSize: "11px", color: T.muted, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 22 }}>
                  Legal
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 32 }}>
                  {[
                    { label: "Privacy Policy", href: "/privacy", icon: "🔒" },
                    { label: "Terms of Use",   href: "/terms",   icon: "📄" },
                  ].map(({ label, href, icon }, li) => (
                    <motion.div key={label}
                      initial={mounted ? { opacity: 0, x: -12 } : false}
                      whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                      transition={{ delay: 0.35 + li * 0.07, duration: 0.4 }}
                    >
                      <Link href={href}
                        style={{ color: T.muted, textDecoration: "none", fontSize: "14px", fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 9, padding: "7px 0", transition: "color 0.2s" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = T.chipTxt; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = T.muted; }}
                      >
                        <span style={{ fontSize: "13px" }}>{icon}</span>
                        {label}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Creator card */}
                <motion.div
                  whileHover={{ y: -3, boxShadow: isDark ? "0 8px 32px rgba(37,99,235,0.18)" : "0 8px 28px rgba(37,99,235,0.12)", transition: { duration: 0.2 } }}
                  style={{
                    padding: "18px 20px", borderRadius: 18,
                    background: isDark ? "rgba(37,99,235,0.08)" : "#EEF3FF",
                    border: `1px solid ${isDark ? "rgba(37,99,235,0.22)" : "#DBEAFE"}`,
                    boxShadow: `0 2px 12px rgba(37,99,235,${isDark ? 0.1 : 0.06})`,
                  }}
                >
                  <div style={{ fontSize: "10px", fontWeight: 800, color: T.chipTxt, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
                    Created by
                  </div>
                  <div style={{ fontWeight: 800, fontSize: "15px", color: T.text, marginBottom: 4 }}>Afsar Ali</div>
                  <div style={{ fontSize: "12px", color: T.muted, lineHeight: 1.7 }}>
                    Technical White Hat<br />
                    <span style={{ color: T.chipTxt, fontWeight: 600 }}>Legend of Indian Cybersecurity</span>
                  </div>
                  <a href="https://twh-osint.vercel.app/twh" target="_blank" rel="noopener noreferrer"
                    style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 12, fontSize: "12px", fontWeight: 700, color: T.chipTxt, textDecoration: "none" }}
                  >
                    <Globe2 size={12} /> Visit OSINT Platform <ArrowRight size={11} />
                  </a>
                </motion.div>
              </motion.div>
            </div>

            {/* ── Divider ── */}
            <div style={{ height: 1, background: T.border }} />

            {/* ── Bottom bar ── */}
            <div style={{
              padding: "20px 0",
              display: "flex", flexDirection: isLg ? "row" : "column",
              alignItems: isLg ? "center" : "flex-start",
              justifyContent: "space-between", gap: 12,
            }}>
              <span style={{ fontSize: "13px", color: T.muted }}>
                © 2026 TWH Academy · Built with ❤️ by{" "}
                <strong style={{ color: T.chipTxt }}>Afsar Ali</strong>
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {/* Live pulse dot */}
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  style={{ width: 7, height: 7, borderRadius: "50%", background: "#059669", flexShrink: 0 }}
                />
                <span style={{ fontSize: "12px", color: T.muted, fontWeight: 600 }}>
                  Free Forever · No Ads · No Bullshit
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </footer>
    </main>
  );
}
