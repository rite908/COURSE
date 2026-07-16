"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Shield, BookOpen, HelpCircle, Target, TrendingUp, Award,
  FlaskConical, Smartphone, Lock, Zap, ArrowRight, CheckCircle,
  FileText, Star,
} from "lucide-react";
import { useTheme } from "@/lib/theme";

const MAIN_FEATURES = [
  { icon: <BookOpen size={22} />,    color: "#2563EB", darkBg: "rgba(37,99,235,0.15)",  lightBg: "#EEF3FF", title: "5 Complete Chapters",    desc: "Foundation se lekar Kali Linux tak — pura roadmap ek jagah. Har chapter professionally structured hai: Theory → Demo → MCQ → Hands-on Task.", points: ["6+ topics per chapter", "Hinglish language", "Progressive difficulty", "Real-world examples"] },
  { icon: <HelpCircle size={22} />,  color: "#7C3AED", darkBg: "rgba(124,58,237,0.15)", lightBg: "#F3EEFF", title: "615+ MCQ Questions",      desc: "Har topic ke baad MCQs — jo sirf memorization nahi, actual understanding test karte hain. Randomized positions, varied lengths, no trick questions.", points: ["15 MCQs per topic", "Randomized correct answers", "Instant feedback", "Score tracking"] },
  { icon: <Target size={22} />,      color: "#0EA5E9", darkBg: "rgba(14,165,233,0.15)", lightBg: "#F0F9FF", title: "Hands-on Tasks",          desc: "Sirf padhna kaafi nahi — har topic ke end mein ek practical task hota hai jo tum actually kar sakte ho.", points: ["Real tool usage", "Step-by-step guide", "Beginner-safe", "Pro tips included"] },
  { icon: <Lock size={22} />,        color: "#059669", darkBg: "rgba(5,150,105,0.15)",  lightBg: "#ECFDF5", title: "MCQ-Locked Topics",      desc: "Agle topic tab unlock hoga jab tum current MCQ pass karo. Solid foundation guaranteed.", points: ["Progressive unlocking", "No skipping ahead", "Mastery-based", "Score saved locally"] },
  { icon: <TrendingUp size={22} />,  color: "#D97706", darkBg: "rgba(217,119,6,0.15)",  lightBg: "#FFFBEB", title: "Progress Dashboard",     desc: "Ek clean dashboard jo tumhara poora progress dikhata hai — chapters started, topics completed, MCQ accuracy.", points: ["Per-chapter progress", "MCQ accuracy %", "Topics completed", "Time tracking"] },
  { icon: <FileText size={22} />,    color: "#DC2626", darkBg: "rgba(220,38,38,0.15)",  lightBg: "#FEF2F2", title: "Personal Notes System",  desc: "Har topic ke saath ek notepad — apne words mein likho, auto-save hoga. Private aur secure.", points: ["Per-topic notes", "Auto-save", "Private & local", "Rich text format"] },
  { icon: <Smartphone size={22} />,  color: "#0EA5E9", darkBg: "rgba(14,165,233,0.15)", lightBg: "#F0F9FF", title: "Mobile Friendly",        desc: "Chaahe laptop ho, phone ho ya tablet — TWH Academy har device par perfectly kaam karta hai.", points: ["Works on all devices", "Touch-friendly sidebar", "Fast loading", "Offline capable"] },
  { icon: <Award size={22} />,       color: "#7C3AED", darkBg: "rgba(124,58,237,0.15)", lightBg: "#F3EEFF", title: "Completion Certificate", desc: "Pura course complete karo aur apna certificate pao — jise tum LinkedIn par laga sakte ho. Coming soon.", points: ["PDF certificate", "Shareable link", "LinkedIn ready", "Coming soon"] },
];

const COMPARISON = [
  { feature: "Language",         twh: "Hinglish (easy to understand)", others: "English only" },
  { feature: "Cost",             twh: "100% Free",                     others: "₹5,000 – ₹50,000" },
  { feature: "MCQ Locking",      twh: "Yes — mastery enforced",        others: "No — skip anything" },
  { feature: "Hands-on Tasks",   twh: "Every topic",                   others: "Rare or paid" },
  { feature: "Notes System",     twh: "Built-in per topic",            others: "Not available" },
  { feature: "Progress Tracking",twh: "Detailed dashboard",            others: "Basic or none" },
  { feature: "Content Style",    twh: "Conversational, analogies",     others: "Dry, textbook-style" },
  { feature: "Prerequisites",    twh: "Zero — absolute beginner",      others: "Often need prior knowledge" },
];

export default function FeaturesPage() {
  const { isDark } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [vw,      setVw]      = useState(1280);

  useEffect(() => {
    setMounted(true);
    const u = () => setVw(window.innerWidth);
    u(); window.addEventListener("resize", u, { passive: true });
    return () => window.removeEventListener("resize", u);
  }, []);

  const isMd = vw >= 768;
  const isLg = vw >= 1024;
  const sp = vw < 640 ? 16 : vw < 768 ? 24 : vw < 1024 ? 40 : 64;
  const vp = isMd ? 80 : 52;

  const T = {
    bg:      isDark ? "#060912"  : "#F8FAFF",
    bg2:     isDark ? "#0D1117"  : "#FFFFFF",
    altBg:   isDark ? "#0A0E1A"  : "#F0F5FF",
    text:    isDark ? "#F1F5F9"  : "#111827",
    text2:   isDark ? "#94A3B8"  : "#6B7280",
    muted:   isDark ? "#64748B"  : "#9CA3AF",
    border:  isDark ? "#1E2433"  : "#E5E7EB",
    card:    isDark ? "#0D1117"  : "#FFFFFF",
    chipBg:  isDark ? "rgba(37,99,235,0.15)" : "#EFF6FF",
    chipBdr: isDark ? "rgba(37,99,235,0.35)" : "#DBEAFE",
    chipTxt: isDark ? "#60A5FA"  : "#2563EB",
    heroBg:  isDark ? "linear-gradient(150deg,#060912,#0A0E1A)" : "linear-gradient(150deg,#FFFFFF,#F5F8FF)",
    tableBg: isDark ? "#0A0E1A"  : "#F8FAFF",
    tableAlt:isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.015)",
  };

  const Chip = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "5px 14px", borderRadius: 999, background: T.chipBg, border: `1px solid ${T.chipBdr}`, marginBottom: 18 }}>
      {icon}<span style={{ fontSize: "11px", fontWeight: 700, color: T.chipTxt, textTransform: "uppercase", letterSpacing: "0.09em" }}>{label}</span>
    </div>
  );

  const fade = (delay = 0) => ({
    initial: mounted ? { opacity: 0, y: 20 } : (false as const),
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-40px" },
    transition: { delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] },
  });

  return (
    <main style={{ minHeight: "100vh", background: T.bg, paddingTop: 68 }}>

      {/* Hero */}
      <section style={{ background: T.heroBg, padding: `${vp}px ${sp}px`, textAlign: "center" }}>
        <motion.div initial={mounted ? { opacity: 0, y: 20 } : false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} style={{ maxWidth: 680, margin: "0 auto" }}>
          <Chip icon={<Star size={12} color="#3B82F6" />} label="Platform Features" />
          <h1 style={{ fontWeight: 900, color: T.text, fontSize: isLg ? "clamp(2rem,4vw,3rem)" : isMd ? "2.3rem" : "1.8rem", letterSpacing: "-0.03em", marginBottom: 18, lineHeight: 1.1 }}>
            Sab kuch jo tumhe chahiye{" "}
            <span style={{ background: "linear-gradient(130deg,#2563EB,#7C3AED)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>ek jagah mein</span>
          </h1>
          <p style={{ color: T.text2, fontSize: "15px", lineHeight: 1.75 }}>
            TWH Academy sirf ek course nahi — yeh ek complete learning platform hai. Chapters, MCQs, tasks, notes, progress tracking — sab built-in.
          </p>
        </motion.div>
      </section>

      {/* Feature grid */}
      <section style={{ background: T.bg2, padding: `${vp}px ${sp}px` }}>
        <div style={{ display: "grid", gridTemplateColumns: isLg ? "repeat(2,1fr)" : "1fr", gap: 16 }}>
          {MAIN_FEATURES.map((f, i) => (
            <motion.div key={f.title} {...fade(i * 0.06)}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              style={{ background: T.card, borderRadius: 20, padding: "26px", border: `1px solid ${T.border}`, display: "flex", gap: 20, alignItems: "flex-start", boxShadow: `0 2px 16px rgba(0,0,0,${isDark ? 0.22 : 0.04})` }}>
              <div style={{ width: 50, height: 50, borderRadius: 15, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: isDark ? f.darkBg : f.lightBg, color: f.color }}>
                {f.icon}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontWeight: 800, fontSize: "15px", color: T.text, marginBottom: 8 }}>{f.title}</h3>
                <p style={{ color: T.text2, fontSize: "13.5px", lineHeight: 1.75, marginBottom: 14 }}>{f.desc}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {f.points.map((p) => (
                    <span key={p} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "11.5px", fontWeight: 500, color: T.text2, background: isDark ? "rgba(255,255,255,0.05)" : "#F8FAFF", border: `1px solid ${T.border}`, borderRadius: 8, padding: "3px 10px" }}>
                      <CheckCircle size={8} color={f.color} />{p}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Comparison table */}
      <section style={{ background: T.altBg, padding: `${vp}px ${sp}px` }}>
        <motion.div {...fade()} style={{ textAlign: "center", marginBottom: 48 }}>
          <Chip icon={<Zap size={12} color="#3B82F6" />} label="TWH vs Others" />
          <h2 style={{ fontWeight: 900, fontSize: isLg ? "2.2rem" : "1.8rem", color: T.text, letterSpacing: "-0.025em" }}>
            Kyu TWH Academy{" "}
            <span style={{ background: "linear-gradient(130deg,#2563EB,#7C3AED)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>different hai</span>
          </h2>
        </motion.div>

        <motion.div {...fade(0.1)} style={{ maxWidth: 860, margin: "0 auto", background: T.card, borderRadius: 20, border: `1px solid ${T.border}`, overflow: "hidden", boxShadow: `0 4px 24px rgba(0,0,0,${isDark ? 0.3 : 0.06})` }}>
          {/* Header */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "16px 24px", background: T.tableBg, borderBottom: `1px solid ${T.border}` }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Feature</div>
            <div style={{ textAlign: "center" }}>
              <span style={{ fontSize: "12px", fontWeight: 800, color: "#2563EB", background: isDark ? "rgba(37,99,235,0.15)" : "#EFF6FF", border: "1px solid #BFDBFE", padding: "3px 14px", borderRadius: 999 }}>TWH Academy</span>
            </div>
            <div style={{ textAlign: "center" }}>
              <span style={{ fontSize: "12px", fontWeight: 600, color: T.muted }}>Other Courses</span>
            </div>
          </div>
          {COMPARISON.map((row, i) => (
            <div key={row.feature} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "14px 24px", alignItems: "center", borderBottom: `1px solid ${T.border}`, background: i % 2 === 0 ? "transparent" : T.tableAlt }}>
              <div style={{ fontSize: "13.5px", fontWeight: 600, color: T.text2 }}>{row.feature}</div>
              <div style={{ textAlign: "center", display: "flex", justifyContent: "center" }}>
                <span style={{ fontSize: "12.5px", fontWeight: 600, color: "#2563EB", display: "flex", alignItems: "center", gap: 6 }}>
                  <CheckCircle size={11} color="#2563EB" />{row.twh}
                </span>
              </div>
              <div style={{ textAlign: "center", fontSize: "12.5px", color: T.muted }}>{row.others}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <section style={{ background: T.bg2, padding: `${vp}px ${sp}px` }}>
        <motion.div {...fade()}
          style={{ maxWidth: 720, margin: "0 auto", borderRadius: 24, background: "linear-gradient(135deg,#1D4ED8,#7C3AED)", padding: isMd ? "64px 10%" : "44px 28px", textAlign: "center", position: "relative", overflow: "hidden", boxShadow: "0 24px 64px rgba(37,99,235,0.30)" }}>
          <div style={{ position: "absolute", top: "-50px", right: "-50px", width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <h2 style={{ fontWeight: 900, color: "white", fontSize: isMd ? "1.9rem" : "1.55rem", letterSpacing: "-0.025em", marginBottom: 12 }}>
              Features pasand aaye?<br />Ab try karo — free mein.
            </h2>
            <p style={{ color: "#BFDBFE", fontSize: "14px", lineHeight: 1.75, marginBottom: 32 }}>
              Koi sign-up nahi. Koi credit card nahi. Seedha Chapter 1 se shuru karo.
            </p>
            <Link href="/login">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "13px 36px", borderRadius: 14, background: "white", color: "#2563EB", fontWeight: 800, fontSize: "14px", cursor: "pointer", boxShadow: "0 8px 28px rgba(0,0,0,0.18)" }}>
                Start Learning <ArrowRight size={15} />
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
