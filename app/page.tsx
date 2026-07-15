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

/* ═══════════════════════════════════════════
   COURSE DATA — all 5 chapters
═══════════════════════════════════════════ */
const CHAPTERS = [
  {
    num: 1, slug: "chapter-1",
    icon: <Shield size={22} />,
    color: "#2563EB", lightBg: "#EEF3FF", darkBg: "rgba(37,99,235,0.12)",
    title: "Startup",
    subtitle: "Hacker Ki Asli Duniya",
    desc: "Zero se shuru — hacker kaun hota hai, kaise sochta hai, aur ethical hacking ka asli matlab.",
    topics: [
      "Hacker Ka Asli Matlab",
      "Hacker Hack Karta Kaise Hai?",
      "Types of Hackers",
      "Developer vs Hacker",
      "Hacker Mindset",
      "Ethical Hacking Kya Hai?",
    ],
    mcqs: 90, status: "complete",
  },
  {
    num: 2, slug: "chapter-2",
    icon: <Cpu size={22} />,
    color: "#7C3AED", lightBg: "#F3EEFF", darkBg: "rgba(124,58,237,0.12)",
    title: "How Computer Works",
    subtitle: "Andar Se Bahar Tak",
    desc: "Computer ki aatma — binary se lekar OS tak, har ek cheez kaise kaam karti hai andar se.",
    topics: [
      "Computer Humari Basha Nahi Samajhta",
      "Hardware — Computer Ka Sharir",
      "CPU — Processing Kaise Hoti Hai",
      "Memory — Data Kahan Rehta Hai",
      "Data Storage — Har Cheez Ultimately Bits Hai",
      "OS — Software Aur Hardware Ka Bridge",
      "Program Execution — Code Kaise Chalta Hai",
      "Boot — Computer Zinda Kaise Hota Hai",
      "File System — Storage Ka Asli Kaam",
      "I/O — Poora Picture Clear",
    ],
    mcqs: 150, status: "complete",
  },
  {
    num: 3, slug: "chapter-3",
    icon: <Wifi size={22} />,
    color: "#0EA5E9", lightBg: "#F0F9FF", darkBg: "rgba(14,165,233,0.12)",
    title: "Networking",
    subtitle: "Computers Baat Kaise Karte Hain",
    desc: "IP address se lekar firewall tak — networks ka poora system, bilkul simple language mein.",
    topics: [
      "Network Kya Hai — Computers Ka Mohalla",
      "IP Address — Har Device Ka Ghar Ka Pata",
      "MAC Address — Hardware Ki Asli Pehchaan",
      "Protocols — Computers Ki Agreed Bhasha",
      "Ports — Ek Ghar Ke Alag Alag Darwaze",
      "DNS — Internet Ka Phone Book",
      "HTTP vs HTTPS — Web Request Ka Safar",
      "Router & Switch — Data Kahan Jaaye?",
      "Packets — Data Toot Ke Kaise Bheji Jaati Hai",
      "Firewall & Basic Network Security",
    ],
    mcqs: 150, status: "complete",
  },
  {
    num: 4, slug: "chapter-4",
    icon: <Terminal size={22} />,
    color: "#059669", lightBg: "#ECFDF5", darkBg: "rgba(5,150,105,0.12)",
    title: "Linux & Command Line",
    subtitle: "Hacker Ki Asli Duniya",
    desc: "Linux kya hai, kyun zaroori hai, aur terminal se pehla rishta — Termux se shuru karo.",
    topics: [
      "Linux Kya Hai — Windows Se Kyun Alag Hai",
      "Termux — Android Pe Linux",
      "Terminal Ki Pehli Class — Package, Repository, Update",
    ],
    mcqs: 45, status: "complete",
  },
  {
    num: 5, slug: "chapter-5",
    icon: <Code2 size={22} />,
    color: "#DC2626", lightBg: "#FEF2F2", darkBg: "rgba(220,38,38,0.12)",
    title: "Kali Linux",
    subtitle: "Hacker Ka Ghar",
    desc: "Kali Linux install karo, seekho, aur master karo — terminal navigation se lekar bash scripting tak.",
    topics: [
      "Kali Linux Kya Hai — Poori Kahani",
      "Kali Linux Kaise Laayein — Installation Methods",
      "VirtualBox Pe Kali Install Karna — Step by Step",
      "Kali Ka Desktop — Pehli Baar Seedha Dekho",
      "Terminal Navigation — File System Mein Chalna",
      "Files Dekhna aur Edit Karna",
      "Users aur Permissions — Kaun Kya Kar Sakta Hai",
      "Networking Commands — Network Ko Terminal Se Dekhna",
      "Piping aur Redirection — Commands Ko Milao",
      "Process Management — System Pe Kya Chal Raha Hai",
      "File Search — Kuch Bhi Dhundho",
      "Bash Scripting Basics — Terminal Ko Automatic Karo",
    ],
    mcqs: 180, status: "complete",
  },
];

const STATS = [
  { icon: <BookOpen size={20} />, value: "5",    label: "Chapters",    color: "#2563EB", lightBg: "#EEF3FF" },
  { icon: <Layers   size={20} />, value: "41",   label: "Topics",      color: "#7C3AED", lightBg: "#F3EEFF" },
  { icon: <HelpCircle size={20}/>, value: "615+", label: "MCQs",       color: "#0EA5E9", lightBg: "#F0F9FF" },
  { icon: <Target   size={20} />, value: "100%", label: "Free",        color: "#059669", lightBg: "#ECFDF5" },
];

const FOR_WHOM = [
  { icon: "🎓", title: "Students",        desc: "CS, IT, ya koi bhi stream — yeh course tumhare liye hai. Background matters nahi." },
  { icon: "💼", title: "Working People",  desc: "9-to-5 job hai? Koi baat nahi. Self-paced format — apni speed pe seekho." },
  { icon: "🤔", title: "Curious Minds",   desc: "Sirf jaanna chahte ho computers kaise kaam karte hain? Perfect jagah hai yeh." },
  { icon: "🔄", title: "Career Switchers", desc: "Cybersecurity mein aana chahte ho? Yahan se shuru karo, zero assumptions." },
];

const FEATURES = [
  { icon: <User size={18} />,        color: "#2563EB", lightBg: "#EEF3FF", title: "Beginner Friendly",   desc: "Zero knowledge assumed. Ekdum first principles se shuru." },
  { icon: <FlaskConical size={18}/>, color: "#7C3AED", lightBg: "#F3EEFF", title: "Practical Labs",       desc: "Har topic ke baad real hands-on task. Sirf theory nahi." },
  { icon: <Briefcase size={18} />,   color: "#0EA5E9", lightBg: "#F0F9FF", title: "Industry Relevant",   desc: "Jo industry mein actually use hota hai, wahi sikhate hain." },
  { icon: <Lock size={18} />,        color: "#DC2626", lightBg: "#FEF2F2", title: "Ethical Only",         desc: "Poora course legal, ethical aur responsible hacking pe focused." },
  { icon: <TrendingUp size={18} />,  color: "#059669", lightBg: "#ECFDF5", title: "Progress Tracking",   desc: "MCQ scores se apna mastery level check karo har topic pe." },
  { icon: <Award size={18} />,       color: "#D97706", lightBg: "#FFFBEB", title: "Free Forever",         desc: "Koi paywall nahi. Poora course bilkul free — hamesha ke liye." },
];

const ROADMAP_STEPS = [
  { num: 1, label: "Hacker Mindset",     sub: "Chapter 1",  color: "#2563EB" },
  { num: 2, label: "Computer Internals", sub: "Chapter 2",  color: "#7C3AED" },
  { num: 3, label: "Networking",         sub: "Chapter 3",  color: "#0EA5E9" },
  { num: 4, label: "Linux Basics",       sub: "Chapter 4",  color: "#059669" },
  { num: 5, label: "Kali Linux",         sub: "Chapter 5",  color: "#DC2626" },
];

/* ═══════════════════════════════════════════
   LAYOUT CONSTANTS
═══════════════════════════════════════════ */
const BREAK_MD = 768;
const BREAK_LG = 1024;

/* ═══════════════════════════════════════════
   PAGE COMPONENT
═══════════════════════════════════════════ */
export default function LandingPage() {
  const router  = useRouter();
  const { isDark } = useTheme();

  const [user,    setUser]    = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [vw,      setVw]      = useState(1280);
  const [openCh,  setOpenCh]  = useState<number | null>(null); // expanded chapter topics

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
  const leftY  = useTransform(scrollY, [0, 400], [0, 24]);
  const rightY = useTransform(scrollY, [0, 400], [0, -16]);

  /* Magnetic CTA */
  const btnRef  = useRef<HTMLButtonElement>(null);
  const bx = useMotionValue(0); const by = useMotionValue(0);
  const sx = useSpring(bx, { stiffness: 300, damping: 30 });
  const sy = useSpring(by, { stiffness: 300, damping: 30 });
  const onMag = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    bx.set((e.clientX - (r.left + r.width / 2)) * 0.25);
    by.set((e.clientY - (r.top + r.height / 2)) * 0.25);
  };

  useEffect(() => { setUser(getCurrentUser()); setMounted(true); }, []);
  const goStart = () => router.push(user ? "/chapters" : "/login");

  /* Theme-aware tokens */
  const T = {
    bg:       isDark ? "#060912"  : "#F8FAFF",
    bg2:      isDark ? "#0D1117"  : "#FFFFFF",
    bg3:      isDark ? "#0A0E1A"  : "#F4F8FF",
    text:     isDark ? "#F1F5F9"  : "#111827",
    text2:    isDark ? "#94A3B8"  : "#6B7280",
    muted:    isDark ? "#64748B"  : "#9CA3AF",
    border:   isDark ? "#1E2433"  : "#F1F5F9",
    border2:  isDark ? "#2D3748"  : "#E5E7EB",
    card:     isDark ? "#0D1117"  : "#FFFFFF",
    chipBg:   isDark ? "rgba(37,99,235,0.15)" : "#EFF6FF",
    chipBdr:  isDark ? "rgba(37,99,235,0.35)" : "#DBEAFE",
    chipTxt:  isDark ? "#60A5FA"  : "#2563EB",
    heroBg:   isDark
      ? "linear-gradient(150deg,#060912 0%,#0A0E1A 55%,#0D1320 100%)"
      : "linear-gradient(150deg,#FFFFFF 0%,#F5F8FF 55%,#EEF2FF 100%)",
    dot:      isDark ? "rgba(96,165,250,0.10)" : "rgba(148,163,254,0.22)",
    sectionBg:isDark ? "#0A0E1A"  : "#F4F8FF",
  };

  const fade = (delay = 0) => ({
    initial: mounted ? { opacity: 0, y: 20 } : false as const,
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] },
  });

  /* Shared full-width section container */
  const wrap: React.CSSProperties = { width: "100%", maxWidth: 1280, margin: "0 auto", boxSizing: "border-box" };

  return (
    <main style={{ background: T.bg, minHeight: "100vh", overflowX: "hidden" }}>

      {/* ═══════════════════════════════════════════
          HERO — full viewport, left flush / right flush
      ═══════════════════════════════════════════ */}
      <section style={{
        position: "relative", overflow: "hidden",
        background: T.heroBg,
        paddingTop: `calc(72px + ${isLg ? 64 : 44}px)`,
        paddingBottom: isLg ? 64 : 44,
      }}>
        {/* Dot grid */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: `radial-gradient(circle, ${T.dot} 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }} />
        {/* Glows */}
        <div style={{ position:"absolute", left:"-5%", top:"5%", width:700, height:700, borderRadius:"50%", background:"radial-gradient(circle,rgba(37,99,235,0.07) 0%,transparent 65%)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", right:"-4%", top:"-8%", width:600, height:600, borderRadius:"50%", background:"radial-gradient(circle,rgba(124,58,237,0.07) 0%,transparent 65%)", pointerEvents:"none" }} />

        {/* HERO INNER — no max-width padding, left column gets its own left padding */}
        <div style={{ ...wrap, position: "relative", zIndex: 10,
          display: "flex",
          flexDirection: isLg ? "row" : "column",
          alignItems: isLg ? "center" : "stretch",
          gap: 0,
        }}>

          {/* ── LEFT TEXT — left pad = 40px, right pad = 24px ── */}
          <motion.div style={{
            y: leftY,
            flex: isLg ? "0 0 46%" : "unset",
            paddingLeft: 40, paddingRight: isLg ? 24 : 40,
            display: "flex", flexDirection: "column",
          }}>
            {/* Badge */}
            <motion.div {...fade(0)} style={{ alignSelf: "flex-start", marginBottom: 22 }}>
              <div style={{
                display:"inline-flex", alignItems:"center", gap:8,
                padding:"6px 16px 6px 10px", borderRadius:999,
                background: T.chipBg, border:`1px solid ${T.chipBdr}`,
                boxShadow:"0 2px 12px rgba(37,99,235,0.08)",
              }}>
                <span style={{ width:20, height:20, borderRadius:"50%", background:"#2563EB", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <Shield size={10} color="white" />
                </span>
                <span style={{ fontSize:"12px", fontWeight:600, color:T.chipTxt, letterSpacing:"0.02em" }}>
                  India's Premier Ethical Hacking <strong>Academy</strong>
                </span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1 {...fade(0.06)} style={{
              fontWeight:900, lineHeight:1.05, letterSpacing:"-0.03em",
              fontSize: isLg ? "clamp(2.9rem,3.9vw,4.4rem)" : isMd ? "2.6rem" : "2.1rem",
              marginBottom:18,
            }}>
              <span className="font-display" style={{ color:T.text, display:"block" }}>Master Computers.</span>
              <span className="font-display" style={{
                display:"block",
                background:"linear-gradient(130deg,#2563EB 0%,#7C3AED 100%)",
                WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
              }}>Hack The World.</span>
            </motion.h1>

            {/* Sub */}
            <motion.p {...fade(0.14)} style={{ color:T.text2, lineHeight:1.75, marginBottom:28, maxWidth:430, fontSize:"1.05rem" }}>
              From zero to ethical hacking hero. A complete roadmap for future cybersecurity experts — in Hinglish, by{" "}
              <strong style={{ color:T.chipTxt }}>Afsar Ali (Technical White Hat)</strong>.
            </motion.p>

            {/* CTAs */}
            <motion.div {...fade(0.22)} style={{ display:"flex", flexWrap:"wrap", gap:12, marginBottom:26 }}>
              <motion.button
                ref={btnRef} onMouseMove={onMag} onMouseLeave={() => { bx.set(0); by.set(0); }}
                whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}
                onClick={goStart}
                style={{
                  x:sx, y:sy, position:"relative",
                  display:"inline-flex", alignItems:"center", gap:12,
                  padding:"14px 28px", borderRadius:16,
                  fontSize:"15px", fontWeight:700, color:"white",
                  border:"none", cursor:"pointer", flexShrink:0,
                  background:"linear-gradient(135deg,#2563EB 0%,#7C3AED 100%)",
                  boxShadow:"0 8px 28px rgba(37,99,235,0.38)",
                  overflow:"hidden",
                }}
              >
                <motion.span style={{ position:"absolute", inset:0, background:"linear-gradient(105deg,transparent 35%,rgba(255,255,255,0.18) 50%,transparent 65%)" }}
                  animate={{ x:["-120%","220%"] }} transition={{ duration:1.8, repeat:Infinity, repeatDelay:2.8 }} />
                <span style={{ position:"relative", zIndex:1 }}>{user ? "Continue Learning" : "Start Free — No Signup"}</span>
                <motion.span style={{ position:"relative", zIndex:1, width:28, height:28, borderRadius:"50%", background:"rgba(255,255,255,0.25)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}
                  animate={{ x:[0,4,0] }} transition={{ duration:1.6, repeat:Infinity }}>
                  <ArrowRight size={14} />
                </motion.span>
              </motion.button>

              <Link href="/chapters">
                <motion.div whileHover={{ scale:1.02 }} style={{
                  display:"inline-flex", alignItems:"center", gap:8,
                  padding:"14px 28px", borderRadius:16,
                  fontSize:"15px", fontWeight:600, color:T.text,
                  background:T.card, border:`1px solid ${T.border2}`,
                  boxShadow:`0 2px 10px rgba(0,0,0,${isDark?0.2:0.04})`,
                  cursor:"pointer", flexShrink:0,
                }}>
                  <Compass size={16} color="#2563EB" />Explore Chapters
                </motion.div>
              </Link>
            </motion.div>

            {/* Social proof */}
            <motion.div {...fade(0.32)} style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ display:"flex" }}>
                {(["#2563EB","#7C3AED","#0EA5E9","#059669"] as string[]).map((c,i) => (
                  <div key={i} style={{
                    width:28, height:28, borderRadius:"50%",
                    border:`2px solid ${T.bg}`, marginLeft:i>0?-8:0,
                    background:c, display:"flex", alignItems:"center",
                    justifyContent:"center", color:"white", fontSize:"10px", fontWeight:700,
                  }}>
                    {["A","S","R","K"][i]}
                  </div>
                ))}
              </div>
              <span style={{ fontSize:"12px", color:T.muted, fontWeight:500 }}>
                <strong style={{ color:T.text }}>500+</strong> students enrolled • <strong style={{ color:T.text }}>100%</strong> free
              </span>
            </motion.div>
          </motion.div>

          {/* ── RIGHT GLOBE — no right padding, fills edge ── */}
          <motion.div style={{
            y: rightY,
            flex: isLg ? "1 1 54%" : "unset",
            paddingLeft: isLg ? 0 : 40,
            paddingRight: 0,
            display:"flex", alignItems:"center", justifyContent:"flex-end",
          }}>
            <div style={{
              width:"100%",
              maxWidth: isLg ? "none" : 500,
              margin: isLg ? "0" : "0 auto",
              height: isLg ? "clamp(380px,46vw,540px)" : "320px",
            }}>
              <HeroScene />
            </div>
          </motion.div>
        </div>

        {/* Scroll cue */}
        {isMd && mounted && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.8 }}
            style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4, marginTop:32 }}>
            <span style={{ fontSize:"10px", fontWeight:600, color:T.muted, textTransform:"uppercase", letterSpacing:"0.14em" }}>Scroll</span>
            <motion.div animate={{ y:[0,5,0] }} transition={{ duration:1.6, repeat:Infinity }}>
              <ChevronDown size={15} color={T.muted} />
            </motion.div>
          </motion.div>
        )}
      </section>

      {/* ═══════════════════════════════════════════
          STATS STRIP
      ═══════════════════════════════════════════ */}
      <div style={{ background: isDark ? "linear-gradient(180deg,#0A0E1A 0%,#0D1117 100%)" : "linear-gradient(180deg,#EEF2FF 0%,#FFFFFF 100%)", padding:"40px 0" }}>
        <div style={{ ...wrap, padding:"0 40px" }}>
          <div style={{ display:"grid", gridTemplateColumns: isMd ? "repeat(4,1fr)" : "repeat(2,1fr)", gap:16 }}>
            {STATS.map((s,i) => (
              <motion.div key={s.label}
                initial={mounted?{opacity:0,y:16}:false} animate={{opacity:1,y:0}}
                transition={{delay:i*0.07,duration:0.45}} whileHover={{y:-4}}
                style={{
                  position:"relative", display:"flex",
                  flexDirection: isMd ? "row" : "column",
                  alignItems:"center", textAlign: isMd ? "left" : "center",
                  gap: isMd ? 16 : 10,
                  padding: isMd ? "20px 24px" : "20px 16px",
                  borderRadius:20, background:T.card,
                  border:`1px solid ${T.border}`,
                  boxShadow:`0 2px 16px rgba(0,0,0,${isDark?0.3:0.05})`,
                  overflow:"hidden",
                }}
              >
                <span style={{ position:"absolute", top:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${s.color},transparent)` }} />
                <div style={{ width:48, height:48, borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center", background: isDark ? `rgba(${s.color==="#2563EB"?"37,99,235":s.color==="#7C3AED"?"124,58,237":s.color==="#0EA5E9"?"14,165,233":"5,150,105"},0.18)` : s.lightBg, color:s.color, flexShrink:0 }}>
                  {s.icon}
                </div>
                <div>
                  <div style={{ fontWeight:900, fontSize:"1.65rem", color:T.text, lineHeight:1 }}>{s.value}</div>
                  <div style={{ fontSize:"10.5px", color:T.muted, fontWeight:700, marginTop:6, textTransform:"uppercase", letterSpacing:"0.09em" }}>{s.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          CHAPTERS SECTION
      ═══════════════════════════════════════════ */}
      <section id="chapters" style={{ background:T.bg2, padding:"80px 0" }}>
        <div style={{ ...wrap, padding:"0 40px" }}>

          {/* Header */}
          <motion.div {...fade()} style={{ textAlign:"center", marginBottom:52 }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"6px 16px", borderRadius:999, background:T.chipBg, border:`1px solid ${T.chipBdr}`, marginBottom:20 }}>
              <BookOpen size={12} color="#3B82F6" />
              <span style={{ fontSize:"11px", fontWeight:700, color:T.chipTxt, textTransform:"uppercase", letterSpacing:"0.09em" }}>Course Content</span>
            </div>
            <h2 style={{ fontWeight:900, color:T.text, fontSize: isLg?"2.2rem":isMd?"1.9rem":"1.6rem", letterSpacing:"-0.025em", marginBottom:14 }}>
              5 Chapters · 41 Topics · <span style={{ background:"linear-gradient(130deg,#2563EB,#7C3AED)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>615+ MCQs</span>
            </h2>
            <p style={{ color:T.text2, fontSize:"15px", maxWidth:540, margin:"0 auto", lineHeight:1.7 }}>
              Ek structured path jo tumhe zero se ethical hacker banata hai — computers ke andar se lekar Kali Linux tak.
            </p>
          </motion.div>

          {/* Chapter cards */}
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {CHAPTERS.map((ch, i) => {
              const isOpen = openCh === ch.num;
              return (
                <motion.div key={ch.num}
                  initial={mounted?{opacity:0,y:20}:false} animate={{opacity:1,y:0}}
                  transition={{delay:i*0.06,duration:0.45}}
                  style={{
                    borderRadius:20, background:T.card,
                    border:`1px solid ${T.border}`,
                    boxShadow:`0 2px 16px rgba(0,0,0,${isDark?0.25:0.04})`,
                    overflow:"hidden",
                  }}
                >
                  {/* Card header — always visible */}
                  <button
                    onClick={() => setOpenCh(isOpen ? null : ch.num)}
                    style={{
                      width:"100%", background:"none", border:"none", cursor:"pointer",
                      display:"flex", alignItems:"center", gap:20,
                      padding: isMd ? "24px 28px" : "20px 20px",
                      textAlign:"left",
                    }}
                  >
                    {/* Chapter number + icon */}
                    <div style={{ flexShrink:0, display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
                      <div style={{
                        width:52, height:52, borderRadius:16,
                        display:"flex", alignItems:"center", justifyContent:"center",
                        background: isDark ? ch.darkBg : ch.lightBg,
                        color:ch.color,
                      }}>
                        {ch.icon}
                      </div>
                      <span style={{ fontSize:"9px", fontWeight:800, color:ch.color, textTransform:"uppercase", letterSpacing:"0.1em" }}>Ch {ch.num}</span>
                    </div>

                    {/* Title + meta */}
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap", marginBottom:4 }}>
                        <span style={{ fontWeight:800, fontSize: isMd?"17px":"15px", color:T.text }}>{ch.title}</span>
                        <span style={{
                          fontSize:"10px", fontWeight:700, padding:"2px 10px", borderRadius:999,
                          background: isDark ? ch.darkBg : ch.lightBg, color:ch.color,
                          textTransform:"uppercase", letterSpacing:"0.08em",
                        }}>{ch.subtitle}</span>
                      </div>
                      <p style={{ color:T.text2, fontSize:"13.5px", lineHeight:1.6, marginBottom:8 }}>{ch.desc}</p>
                      <div style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
                        <span style={{ fontSize:"11.5px", color:T.muted, display:"flex", alignItems:"center", gap:5 }}>
                          <Layers size={11} color={ch.color} />{ch.topics.length} topics
                        </span>
                        <span style={{ fontSize:"11.5px", color:T.muted, display:"flex", alignItems:"center", gap:5 }}>
                          <HelpCircle size={11} color={ch.color} />{ch.mcqs} MCQs
                        </span>
                        <span style={{ fontSize:"11.5px", color:"#059669", display:"flex", alignItems:"center", gap:5 }}>
                          <CheckCircle2 size={11} color="#059669" />Complete
                        </span>
                      </div>
                    </div>

                    {/* Expand toggle */}
                    <motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration:0.25 }} style={{ flexShrink:0 }}>
                      <ChevronRight size={18} color={T.muted} />
                    </motion.div>
                  </button>

                  {/* Expandable topic list */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height:0, opacity:0 }}
                        animate={{ height:"auto", opacity:1 }}
                        exit={{ height:0, opacity:0 }}
                        transition={{ duration:0.3, ease:[0.22,1,0.36,1] }}
                        style={{ overflow:"hidden" }}
                      >
                        <div style={{ borderTop:`1px solid ${T.border}`, padding: isMd?"0 28px 24px":"0 20px 20px" }}>
                          <div style={{ paddingTop:20, display:"grid", gridTemplateColumns: isLg ? "repeat(2,1fr)" : "1fr", gap:"8px 32px" }}>
                            {ch.topics.map((topic, ti) => (
                              <div key={ti} style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
                                <div style={{ width:22, height:22, borderRadius:"50%", background: isDark ? ch.darkBg : ch.lightBg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1 }}>
                                  <span style={{ fontSize:"9px", fontWeight:800, color:ch.color }}>{ch.num}.{ti+1}</span>
                                </div>
                                <span style={{ fontSize:"13px", color:T.text2, lineHeight:1.6, paddingTop:2 }}>{topic}</span>
                              </div>
                            ))}
                          </div>
                          <Link href={`/chapters`}>
                            <motion.div whileHover={{ scale:1.02 }} style={{
                              display:"inline-flex", alignItems:"center", gap:8,
                              marginTop:20, padding:"10px 20px", borderRadius:12,
                              background: isDark ? ch.darkBg : ch.lightBg,
                              color:ch.color, fontSize:"13px", fontWeight:700,
                              cursor:"pointer",
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
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          LEARNING ROADMAP
      ═══════════════════════════════════════════ */}
      <section style={{ background:T.sectionBg, padding:"80px 0" }}>
        <div style={{ ...wrap, padding:"0 40px" }}>
          <motion.div {...fade()} style={{ textAlign:"center", marginBottom:52 }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"6px 16px", borderRadius:999, background:T.chipBg, border:`1px solid ${T.chipBdr}`, marginBottom:20 }}>
              <Compass size={12} color="#3B82F6" />
              <span style={{ fontSize:"11px", fontWeight:700, color:T.chipTxt, textTransform:"uppercase", letterSpacing:"0.09em" }}>Learning Path</span>
            </div>
            <h2 style={{ fontWeight:900, color:T.text, fontSize: isLg?"2.1rem":isMd?"1.8rem":"1.55rem", letterSpacing:"-0.025em", marginBottom:14 }}>
              Zero Se <span style={{ background:"linear-gradient(130deg,#2563EB,#7C3AED)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>Ethical Hacker</span> Tak
            </h2>
            <p style={{ color:T.text2, fontSize:"15px", maxWidth:520, margin:"0 auto", lineHeight:1.7 }}>
              Ek clear step-by-step roadmap. Koi confusion nahi — bas ek ke baad ek chapter.
            </p>
          </motion.div>

          {/* Horizontal steps */}
          <div style={{ display:"flex", flexDirection: isMd ? "row" : "column", alignItems: isMd ? "flex-start" : "stretch", gap: isMd ? 0 : 12, justifyContent:"center" }}>
            {ROADMAP_STEPS.map((step, i) => (
              <div key={step.num} style={{ display:"flex", flexDirection: isMd ? "column" : "row", alignItems:"center", flex: isMd ? 1 : "unset", position:"relative" }}>
                {/* Connector line */}
                {i < ROADMAP_STEPS.length - 1 && isMd && (
                  <div style={{
                    position:"absolute", top:26, left:"50%", width:"100%", height:2,
                    background:`linear-gradient(90deg,${step.color},${ROADMAP_STEPS[i+1].color})`,
                    zIndex:0,
                  }} />
                )}
                {i < ROADMAP_STEPS.length - 1 && !isMd && (
                  <div style={{ width:2, height:24, background:`linear-gradient(180deg,${step.color},${ROADMAP_STEPS[i+1].color})`, marginLeft:26 }} />
                )}

                <motion.div
                  initial={mounted?{opacity:0,y:20}:false} animate={{opacity:1,y:0}}
                  transition={{delay:i*0.1,duration:0.45}}
                  style={{ display:"flex", flexDirection: isMd ? "column" : "row", alignItems:"center", gap: isMd ? 14 : 14, zIndex:1, textAlign: isMd ? "center" : "left", padding: isMd ? "0 12px" : "0" }}
                >
                  <div style={{
                    width:52, height:52, borderRadius:"50%", flexShrink:0,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    background:`linear-gradient(135deg,${step.color},${step.color}cc)`,
                    boxShadow:`0 4px 20px ${step.color}44`,
                    color:"white", fontWeight:900, fontSize:"18px",
                  }}>{step.num}</div>
                  <div>
                    <div style={{ fontWeight:700, fontSize:"13.5px", color:T.text }}>{step.label}</div>
                    <div style={{ fontSize:"11px", color:T.muted, marginTop:2 }}>{step.sub}</div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          WHO IS THIS FOR
      ═══════════════════════════════════════════ */}
      <section style={{ background:T.bg2, padding:"80px 0" }}>
        <div style={{ ...wrap, padding:"0 40px" }}>
          <motion.div {...fade()} style={{ textAlign:"center", marginBottom:52 }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"6px 16px", borderRadius:999, background:T.chipBg, border:`1px solid ${T.chipBdr}`, marginBottom:20 }}>
              <User size={12} color="#3B82F6" />
              <span style={{ fontSize:"11px", fontWeight:700, color:T.chipTxt, textTransform:"uppercase", letterSpacing:"0.09em" }}>Yeh Course Kis Ke Liye Hai?</span>
            </div>
            <h2 style={{ fontWeight:900, color:T.text, fontSize: isLg?"2.1rem":isMd?"1.8rem":"1.55rem", letterSpacing:"-0.025em" }}>
              Har Koi Shuru Kar Sakta Hai — <span style={{ background:"linear-gradient(130deg,#2563EB,#7C3AED)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>Bilkul Zero Se</span>
            </h2>
          </motion.div>
          <div style={{ display:"grid", gridTemplateColumns: isLg ? "repeat(4,1fr)" : isMd ? "repeat(2,1fr)" : "1fr", gap:16 }}>
            {FOR_WHOM.map((card, i) => (
              <motion.div key={card.title}
                initial={mounted?{opacity:0,y:20}:false} animate={{opacity:1,y:0}}
                transition={{delay:i*0.08,duration:0.45}} whileHover={{y:-6}}
                style={{
                  borderRadius:20, background:T.card,
                  border:`1px solid ${T.border}`,
                  padding:"28px 24px",
                  boxShadow:`0 2px 16px rgba(0,0,0,${isDark?0.25:0.04})`,
                  textAlign:"center",
                }}
              >
                <div style={{ fontSize:"2.4rem", marginBottom:14 }}>{card.icon}</div>
                <h3 style={{ fontWeight:800, fontSize:"15px", color:T.text, marginBottom:10 }}>{card.title}</h3>
                <p style={{ color:T.text2, fontSize:"13px", lineHeight:1.7 }}>{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          ABOUT AFSAR — Course Creator
      ═══════════════════════════════════════════ */}
      <section style={{ background:T.sectionBg, padding:"80px 0" }}>
        <div style={{ ...wrap, padding:"0 40px" }}>
          <div style={{
            display:"flex", flexDirection: isLg ? "row" : "column",
            gap: isLg ? 64 : 40, alignItems: isLg ? "center" : "stretch",
          }}>
            {/* Left — Avatar + credentials */}
            <motion.div {...fade()} style={{ flexShrink:0, display:"flex", flexDirection:"column", alignItems: isLg ? "flex-start" : "center", gap:20 }}>
              {/* Avatar */}
              <div style={{ position:"relative" }}>
                <div style={{
                  width:120, height:120, borderRadius:28,
                  background:"linear-gradient(135deg,#2563EB 0%,#7C3AED 100%)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  boxShadow:"0 8px 32px rgba(37,99,235,0.40)",
                  fontSize:"3rem", fontWeight:900, color:"white",
                }}>A</div>
                <div style={{
                  position:"absolute", bottom:-6, right:-6,
                  width:28, height:28, borderRadius:"50%",
                  background:"#059669", border:`3px solid ${T.sectionBg}`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                }}>
                  <Star size={12} color="white" fill="white" />
                </div>
              </div>

              {/* Credential chips */}
              {[
                { label:"Ethical Hacker", color:"#2563EB", bg: isDark?"rgba(37,99,235,0.15)":"#EEF3FF" },
                { label:"OSINT Expert",   color:"#7C3AED", bg: isDark?"rgba(124,58,237,0.15)":"#F3EEFF" },
                { label:"Full-Stack Dev", color:"#0EA5E9", bg: isDark?"rgba(14,165,233,0.15)":"#F0F9FF" },
                { label:"Started at Age 12", color:"#059669", bg: isDark?"rgba(5,150,105,0.15)":"#ECFDF5" },
              ].map(chip => (
                <span key={chip.label} style={{
                  fontSize:"12px", fontWeight:700, padding:"5px 14px",
                  borderRadius:999, background:chip.bg, color:chip.color,
                  whiteSpace:"nowrap",
                }}>{chip.label}</span>
              ))}
            </motion.div>

            {/* Right — Bio */}
            <motion.div {...fade(0.1)} style={{ flex:1 }}>
              <div style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"6px 16px", borderRadius:999, background:T.chipBg, border:`1px solid ${T.chipBdr}`, marginBottom:20 }}>
                <Shield size={12} color="#3B82F6" />
                <span style={{ fontSize:"11px", fontWeight:700, color:T.chipTxt, textTransform:"uppercase", letterSpacing:"0.09em" }}>Course Creator</span>
              </div>
              <h2 style={{ fontWeight:900, fontSize: isLg?"2.1rem":"1.7rem", color:T.text, letterSpacing:"-0.025em", marginBottom:8 }}>
                Afsar Ali
              </h2>
              <p style={{ fontSize:"14px", fontWeight:600, color:T.chipTxt, marginBottom:20 }}>
                Technical White Hat · "Legend of Indian Cybersecurity"
              </p>
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                {[
                  { icon:"🚀", text:"22 saal ka ethical hacker — tech ki duniya mein 12 saal ki umar se kaam kar raha hai." },
                  { icon:"🛡️", text:"TWH OSINT Platform banaya — India ka sabse powerful free OSINT tool jo aaj bhi free hai." },
                  { icon:"📚", text:"Yeh course unka vision hai — Computer Expert + Ethical Hacker dono ek saath banana." },
                  { icon:"💬", text:"Hinglish mein likhta hai — real life analogies se, boring theory nahi." },
                ].map((item, i) => (
                  <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:14 }}>
                    <div style={{
                      width:36, height:36, borderRadius:12, flexShrink:0,
                      background: isDark?"rgba(37,99,235,0.12)":"#EEF3FF",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:"16px",
                    }}>{item.icon}</div>
                    <p style={{ color:T.text2, fontSize:"14px", lineHeight:1.7, paddingTop:8 }}>{item.text}</p>
                  </div>
                ))}
              </div>
              <a href="https://twh-osint.vercel.app/twh" target="_blank" rel="noopener noreferrer">
                <motion.div whileHover={{ scale:1.02 }} style={{
                  display:"inline-flex", alignItems:"center", gap:8,
                  marginTop:24, padding:"11px 22px", borderRadius:12,
                  background: isDark?"rgba(37,99,235,0.15)":"#EEF3FF",
                  color:"#2563EB", fontSize:"13.5px", fontWeight:700,
                  cursor:"pointer",
                }}>
                  <Globe2 size={15} />Visit TWH OSINT Platform <ArrowRight size={14} />
                </motion.div>
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          WHY TWH ACADEMY
      ═══════════════════════════════════════════ */}
      <section id="features" style={{ background:T.bg2, padding:"80px 0" }}>
        <div style={{ ...wrap, padding:"0 40px" }}>
          <motion.div {...fade()} style={{ textAlign:"center", marginBottom:52 }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"6px 16px", borderRadius:999, background:T.chipBg, border:`1px solid ${T.chipBdr}`, marginBottom:20 }}>
              <Zap size={12} color="#3B82F6" />
              <span style={{ fontSize:"11px", fontWeight:700, color:T.chipTxt, textTransform:"uppercase", letterSpacing:"0.09em" }}>Why TWH Academy</span>
            </div>
            <h2 style={{ fontWeight:900, color:T.text, fontSize: isLg?"2.1rem":isMd?"1.8rem":"1.55rem", letterSpacing:"-0.025em", marginBottom:14 }}>
              Sirf Theory Nahi — <span style={{ background:"linear-gradient(130deg,#2563EB,#7C3AED)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>Asli Samajh</span>
            </h2>
            <p style={{ color:T.text2, fontSize:"15px", maxWidth:500, margin:"0 auto", lineHeight:1.7 }}>
              Jo dusri jagah nahi milega — real understanding, practical labs, aur ek honest creator.
            </p>
          </motion.div>
          <div style={{ display:"grid", gridTemplateColumns: isLg ? "repeat(3,1fr)" : isMd ? "repeat(2,1fr)" : "1fr", gap:20 }}>
            {FEATURES.map((f, i) => (
              <motion.div key={f.title}
                initial={mounted?{opacity:0,y:24}:false} animate={{opacity:1,y:0}}
                transition={{delay:i*0.07,duration:0.45}} whileHover={{y:-6}}
                style={{
                  position:"relative", borderRadius:20, background:T.card,
                  border:`1px solid ${T.border}`, padding:"24px",
                  boxShadow:`0 2px 16px rgba(0,0,0,${isDark?0.25:0.04})`,
                  overflow:"hidden",
                  ...(isLg && i === 5 ? { gridColumnStart:3 } : {}),
                }}
              >
                <span style={{ position:"absolute", top:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${f.color},transparent)` }} />
                <div style={{ width:44, height:44, borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center", background: isDark ? `${f.lightBg.replace("#","rgba(").replace(/(..)(..)(..)/, (_,r,g,b)=>parseInt(r,16)+","+parseInt(g,16)+","+parseInt(b,16))},0.15)` : f.lightBg, color:f.color, marginBottom:16 }}>
                  {f.icon}
                </div>
                <h3 style={{ fontWeight:700, fontSize:"14.5px", color:T.text, marginBottom:8 }}>{f.title}</h3>
                <p style={{ color:T.text2, fontSize:"13px", lineHeight:1.7 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CTA BANNER
      ═══════════════════════════════════════════ */}
      <section style={{ background:T.sectionBg, padding:"80px 0" }}>
        <div style={{ ...wrap, padding:"0 40px", maxWidth:760 }}>
          <motion.div {...fade()}
            style={{
              position:"relative", borderRadius:28, textAlign:"center",
              padding: isLg ? "72px 80px" : isMd ? "52px 56px" : "44px 32px",
              background:"linear-gradient(135deg,#1D4ED8 0%,#7C3AED 100%)",
              boxShadow:"0 24px 64px rgba(37,99,235,0.35)", overflow:"hidden",
            }}
          >
            <div style={{ position:"absolute", top:"-60px", right:"-60px", width:220, height:220, borderRadius:"50%", background:"rgba(255,255,255,0.05)", pointerEvents:"none" }} />
            <div style={{ position:"absolute", bottom:"-48px", left:"-48px", width:180, height:180, borderRadius:"50%", background:"rgba(255,255,255,0.05)", pointerEvents:"none" }} />
            <div style={{ position:"relative", zIndex:1 }}>
              <div style={{ width:56, height:56, borderRadius:16, background:"rgba(255,255,255,0.18)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 24px" }}>
                <Shield size={24} color="white" />
              </div>
              <h2 style={{ fontWeight:900, color:"white", fontSize: isLg?"2.3rem":"1.8rem", letterSpacing:"-0.025em", marginBottom:14 }}>
                Ready to become a<br />White Hat Hacker?
              </h2>
              <p style={{ color:"#BFDBFE", marginBottom:36, fontSize:"16px", lineHeight:1.7 }}>
                Join TWH Academy. Start free — koi signup ki zaroorat nahi.<br />
                <strong style={{ color:"white" }}>Afsar Ali</strong> personally har chapter mein guide karta hai.
              </p>
              <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }} onClick={goStart}
                style={{
                  display:"inline-flex", alignItems:"center", gap:12,
                  padding:"15px 44px", borderRadius:16,
                  background:"white", color:"#2563EB",
                  fontWeight:800, fontSize:"15px",
                  border:"none", cursor:"pointer",
                  boxShadow:"0 8px 32px rgba(0,0,0,0.20)",
                }}
              >
                {user ? "Go to My Chapters" : "Start Learning — Free Forever"}
                <ArrowRight size={16} />
              </motion.button>
              <p style={{ color:"rgba(191,219,254,0.7)", fontSize:"12px", marginTop:16 }}>
                No ads · No paywall · No bullshit
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════ */}
      <footer style={{ background:T.bg2, borderTop:`1px solid ${T.border}` }}>
        <div style={{ ...wrap, padding:"32px 40px" }}>
          <div style={{
            display:"flex", flexDirection: isMd ? "row" : "column",
            alignItems:"center", justifyContent:"space-between",
            gap:20, textAlign: isMd ? "left" : "center",
          }}>
            {/* Brand */}
            <div style={{ display:"flex", alignItems:"center", gap:12, flexShrink:0 }}>
              <div style={{ width:36, height:36, borderRadius:12, background:"linear-gradient(135deg,#2563EB,#7C3AED)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Shield size={15} color="white" />
              </div>
              <div>
                <div style={{ fontWeight:700, fontSize:"14px", color:T.text, lineHeight:1.3 }}>TWH Academy</div>
                <div style={{ fontSize:"10px", color:T.muted, lineHeight:1.3 }}>by Technical White Hat</div>
              </div>
            </div>

            <p style={{ color:T.muted, fontSize:"13.5px" }}>
              Built with ❤️ by <strong style={{ color:T.chipTxt }}>Afsar Ali</strong> — Technical White Hat
            </p>

            <div style={{ display:"flex", gap:20, fontSize:"13.5px", color:T.muted, flexWrap:"wrap", justifyContent: isMd ? "flex-end" : "center" }}>
              {[["Privacy","/privacy"],["Terms","/terms"],["Contact","/contact"],["Chapters","/chapters"]].map(([label,href]) => (
                <Link key={label} href={href} style={{ color:T.muted, textDecoration:"none" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = T.chipTxt; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = T.muted; }}
                >{label}</Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
