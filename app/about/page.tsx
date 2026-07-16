"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Shield, Code2, Globe, Heart, ArrowRight, BookOpen, Award, Users, Zap, Target, Star } from "lucide-react";
import { useTheme } from "@/lib/theme";

const STATS = [
  { value: "2016", label: "Hacking Started",  color: "#2563EB", darkBg: "rgba(37,99,235,0.15)", lightBg: "#EEF3FF" },
  { value: "10+",  label: "Years Experience", color: "#7C3AED", darkBg: "rgba(124,58,237,0.15)",lightBg: "#F3EEFF" },
  { value: "500+", label: "Students Trained", color: "#0EA5E9", darkBg: "rgba(14,165,233,0.15)",lightBg: "#F0F9FF" },
  { value: "Free", label: "Always",           color: "#059669", darkBg: "rgba(5,150,105,0.15)", lightBg: "#ECFDF5" },
];

const VALUES = [
  { icon: <Heart size={20} />,   color: "#2563EB", darkBg: "rgba(37,99,235,0.15)",  lightBg: "#EEF3FF", title: "Education for Everyone",   desc: "Cybersecurity sirf expensive bootcamps ke liye nahi. TWH Academy mein sab kuch free hai — kyunki knowledge par kisi ka haq nahi hona chahiye." },
  { icon: <Shield size={20} />,  color: "#7C3AED", darkBg: "rgba(124,58,237,0.15)", lightBg: "#F3EEFF", title: "Ethics First",               desc: "Hacking sikhna ek responsibility hai. Yahan sikhaya jaata hai — permission ke saath, legally, aur doosron ki madad ke liye. Black hat nahi, White hat." },
  { icon: <Code2 size={20} />,   color: "#0EA5E9", darkBg: "rgba(14,165,233,0.15)", lightBg: "#F0F9FF", title: "Hinglish mein Seekho",       desc: "English barrier ki wajah se bahut log cybersecurity nahi seekh paate. Yeh course Hinglish mein hai — jaise Afsar khud baat karta hai." },
  { icon: <Globe size={20} />,   color: "#059669", darkBg: "rgba(5,150,105,0.15)",  lightBg: "#ECFDF5", title: "India ki Cybersecurity",     desc: "India ka digital infrastructure badh raha hai aur cybersecurity experts ki zaroorat bhi. TWH Academy yahan ki next generation tayaar kar raha hai." },
];

const JOURNEY = [
  { year: "2016", event: "12 saal ki umar mein pehli baar computer kholaa — aur seedha andar ghus gaya.", color: "#2563EB" },
  { year: "2018", event: "Ethical hacking ki duniya discover ki. Pehla CTF solve kiya. Addiction shuru.",  color: "#7C3AED" },
  { year: "2020", event: "OSINT mein specialization — India ka pehla free OSINT platform banaya: TWH OSINT.", color: "#0EA5E9" },
  { year: "2022", event: "Full-stack development seekha. Security aur software dono ek saath develop karna shuru kiya.", color: "#059669" },
  { year: "2024", event: "TWH Academy launch — pehla free Hinglish ethical hacking course India ke liye.", color: "#D97706" },
];

export default function AboutPage() {
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
    heroBg:  isDark ? "linear-gradient(150deg,#060912 0%,#0A0E1A 100%)" : "linear-gradient(150deg,#FFFFFF 0%,#F5F8FF 100%)",
  };

  const Chip = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "5px 14px", borderRadius: 999, background: T.chipBg, border: `1px solid ${T.chipBdr}`, marginBottom: 18 }}>
      {icon}
      <span style={{ fontSize: "11px", fontWeight: 700, color: T.chipTxt, textTransform: "uppercase", letterSpacing: "0.09em" }}>{label}</span>
    </div>
  );

  const fade = (delay = 0) => ({
    initial: mounted ? { opacity: 0, y: 20 } : (false as const),
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-50px" },
    transition: { delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] },
  });

  return (
    <main style={{ minHeight: "100vh", background: T.bg, paddingTop: 68 }}>

      {/* ── Hero ── */}
      <section style={{ background: T.heroBg, padding: `${vp}px ${sp}px` }}>
        <div style={{ display: "flex", flexDirection: isLg ? "row" : "column", gap: isLg ? 64 : 40, alignItems: isLg ? "center" : "flex-start" }}>

          {/* Left text */}
          <motion.div initial={mounted ? { opacity: 0, y: 24 } : false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} style={{ flex: 1 }}>
            <Chip icon={<Star size={12} color="#3B82F6" />} label="About TWH Academy" />
            <h1 style={{ fontWeight: 900, color: T.text, fontSize: isLg ? "clamp(2rem,3.5vw,2.8rem)" : isMd ? "2.2rem" : "1.8rem", letterSpacing: "-0.03em", marginBottom: 20, lineHeight: 1.1 }}>
              India Ka{" "}
              <span style={{ background: "linear-gradient(130deg,#2563EB,#7C3AED)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Sabse Bada</span>
              {" "}Free Ethical Hacking Course
            </h1>
            <p style={{ color: T.text2, fontSize: "15px", lineHeight: 1.8, marginBottom: 16 }}>
              TWH Academy ek mission se bana hai — India mein cybersecurity education ko accessible banana. Afsar Ali ne yeh course isliye banaya kyunki woh khud chahte the ki unhe iske liye koi paisa na dena padta.
            </p>
            <p style={{ color: T.text2, fontSize: "15px", lineHeight: 1.8, marginBottom: 32 }}>
              Yahan sirf theory nahi — real-world skills, Hinglish mein, practical examples ke saath.
            </p>
            <Link href="/chapters">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "13px 28px", borderRadius: 14, background: "linear-gradient(135deg,#2563EB,#7C3AED)", color: "white", fontWeight: 700, fontSize: "14px", cursor: "pointer", boxShadow: "0 4px 20px rgba(37,99,235,0.30)" }}>
                Start the Course <ArrowRight size={15} />
              </motion.div>
            </Link>
          </motion.div>

          {/* Right stats grid */}
          <motion.div initial={mounted ? { opacity: 0, x: 24 } : false} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.55, delay: 0.1 }}
            style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12, flexShrink: 0, width: isLg ? 360 : "100%" }}>
            {STATS.map((s, i) => (
              <motion.div key={s.label}
                initial={mounted ? { opacity: 0, y: 16 } : false} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.08 }}
                whileHover={{ y: -4 }}
                style={{ background: T.card, borderRadius: 18, padding: "24px 20px", border: `1px solid ${T.border}`, textAlign: "center", boxShadow: `0 2px 16px rgba(0,0,0,${isDark ? 0.25 : 0.04})` }}
              >
                <div style={{ fontSize: "2rem", fontWeight: 900, color: s.color, lineHeight: 1, marginBottom: 6 }}>{s.value}</div>
                <div style={{ fontSize: "11px", color: T.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.09em" }}>{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Creator ── */}
      <section style={{ background: T.bg2, padding: `${vp}px ${sp}px` }}>
        <motion.div {...fade()} style={{ textAlign: "center", marginBottom: 48 }}>
          <Chip icon={<Users size={12} color="#3B82F6" />} label="The Creator" />
          <h2 style={{ fontWeight: 900, fontSize: isLg ? "2.2rem" : "1.8rem", color: T.text, letterSpacing: "-0.025em", marginBottom: 12 }}>
            Afsar Ali — Technical White Hat
          </h2>
          <p style={{ color: T.text2, fontSize: "15px", maxWidth: 520, margin: "0 auto", lineHeight: 1.75 }}>
            Ethical hacker, OSINT expert, full-stack developer — 12 saal ki umar se tech ki duniya mein.
          </p>
        </motion.div>

        <motion.div {...fade(0.1)}
          style={{ maxWidth: 860, margin: "0 auto", background: T.card, borderRadius: 24, border: `1px solid ${T.border}`, overflow: "hidden", boxShadow: `0 4px 32px rgba(0,0,0,${isDark ? 0.3 : 0.06})` }}>
          <div style={{ height: 4, background: "linear-gradient(90deg,#2563EB,#7C3AED,#0EA5E9)" }} />
          <div style={{ padding: isMd ? "40px" : "28px" }}>
            <div style={{ display: "flex", flexDirection: isMd ? "row" : "column", gap: 28, alignItems: "flex-start" }}>
              <div style={{ flexShrink: 0, width: 72, height: 72, borderRadius: 20, background: "linear-gradient(135deg,#2563EB,#7C3AED)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "1.9rem", fontWeight: 900, boxShadow: "0 4px 20px rgba(37,99,235,0.35)" }}>A</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <h3 style={{ fontWeight: 900, color: T.text, fontSize: "1.2rem" }}>Afsar Ali</h3>
                  {[["Technical White Hat","#2563EB","rgba(37,99,235,0.15)","#EEF3FF"],["OSINT Expert","#7C3AED","rgba(124,58,237,0.15)","#F3EEFF"]].map(([label,color,dBg,lBg]) => (
                    <span key={label} style={{ fontSize: "11px", fontWeight: 700, padding: "3px 11px", borderRadius: 999, color, background: isDark ? dBg : lBg }}>{label}</span>
                  ))}
                </div>
                <p style={{ color: T.text2, fontSize: "14px", lineHeight: 1.8, marginBottom: 14 }}>
                  Maine hacking 12 saal ki umar mein shuru ki — sirf curiosity se. Koi mentor nahi tha, koi course nahi tha Hinglish mein. Sab kuch self-taught hai. TWH Academy isliye banaya ki jo mushkilaat maine face ki, woh tumhe na ho.
                </p>
                <p style={{ color: T.text2, fontSize: "14px", lineHeight: 1.8, marginBottom: 20 }}>
                  Mera biggest project hai <strong style={{ color: T.text }}>TWH OSINT Platform</strong> — India ka sabse powerful free OSINT tool. Is experience ne mujhe yeh sikhaya ki technology ka use sirf ethical hona chahiye.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {["Ethical Hacking","OSINT","Penetration Testing","Full-Stack Dev","Cybersecurity Research"].map((skill) => (
                    <span key={skill} style={{ fontSize: "12px", fontWeight: 500, color: T.text2, background: isDark ? "rgba(255,255,255,0.06)" : "#F8FAFF", border: `1px solid ${T.border}`, borderRadius: 8, padding: "4px 12px" }}>{skill}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Journey Timeline ── */}
      <section style={{ background: T.altBg, padding: `${vp}px ${sp}px` }}>
        <motion.div {...fade()} style={{ textAlign: "center", marginBottom: 48 }}>
          <Chip icon={<Zap size={12} color="#3B82F6" />} label="The Journey" />
          <h2 style={{ fontWeight: 900, fontSize: isLg ? "2.2rem" : "1.8rem", color: T.text, letterSpacing: "-0.025em", marginBottom: 12 }}>2016 se Aaj Tak</h2>
          <p style={{ color: T.text2, fontSize: "15px", maxWidth: 420, margin: "0 auto", lineHeight: 1.75 }}>
            Curiosity se expert tak — ek simple ladke ki kahani jo computer ka dost ban gaya.
          </p>
        </motion.div>

        <div style={{ maxWidth: 760, margin: "0 auto", position: "relative" }}>
          <div style={{ position: "absolute", left: 21, top: 0, bottom: 0, width: 2, background: "linear-gradient(to bottom,#BFDBFE,#DDD6FE,#BAE6FD,#A7F3D0,#FDE68A)" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {JOURNEY.map((item, i) => (
              <motion.div key={item.year} {...fade(i * 0.07)}
                style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
                <div style={{ width: 44, height: 44, borderRadius: 14, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 900, fontSize: "11px", zIndex: 1, background: item.color, boxShadow: `0 3px 12px ${item.color}44` }}>
                  {item.year.slice(2)}
                </div>
                <div style={{ flex: 1, background: T.card, borderRadius: 18, padding: "18px 22px", border: `1px solid ${T.border}`, boxShadow: `0 2px 12px rgba(0,0,0,${isDark ? 0.22 : 0.04})` }}>
                  <div style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: item.color, marginBottom: 6 }}>{item.year}</div>
                  <p style={{ color: T.text2, fontSize: "14px", lineHeight: 1.75 }}>{item.event}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section style={{ background: T.bg2, padding: `${vp}px ${sp}px` }}>
        <motion.div {...fade()} style={{ textAlign: "center", marginBottom: 48 }}>
          <Chip icon={<Target size={12} color="#3B82F6" />} label="Our Values" />
          <h2 style={{ fontWeight: 900, fontSize: isLg ? "2.2rem" : "1.8rem", color: T.text, letterSpacing: "-0.025em" }}>
            TWH Academy kis cheez mein believe karta hai
          </h2>
        </motion.div>
        <div style={{ display: "grid", gridTemplateColumns: isMd ? "repeat(2,1fr)" : "1fr", gap: 16 }}>
          {VALUES.map((v, i) => (
            <motion.div key={v.title} {...fade(i * 0.08)}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              style={{ background: T.card, borderRadius: 20, padding: "28px", border: `1px solid ${T.border}`, display: "flex", gap: 20, alignItems: "flex-start", boxShadow: `0 2px 16px rgba(0,0,0,${isDark ? 0.22 : 0.04})` }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: isDark ? v.darkBg : v.lightBg, color: v.color }}>
                {v.icon}
              </div>
              <div>
                <h3 style={{ fontWeight: 700, fontSize: "15px", color: T.text, marginBottom: 8 }}>{v.title}</h3>
                <p style={{ color: T.text2, fontSize: "13.5px", lineHeight: 1.75 }}>{v.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: T.altBg, padding: `${vp}px ${sp}px` }}>
        <motion.div {...fade()}
          style={{ borderRadius: 24, background: "linear-gradient(135deg,#1D4ED8,#7C3AED)", padding: isMd ? "64px 10%" : "44px 28px", textAlign: "center", position: "relative", overflow: "hidden", boxShadow: "0 24px 64px rgba(37,99,235,0.30)" }}>
          <div style={{ position: "absolute", top: "-60px", right: "-60px", width: 220, height: 220, borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <h2 style={{ fontWeight: 900, color: "white", fontSize: isMd ? "2rem" : "1.6rem", letterSpacing: "-0.025em", marginBottom: 14 }}>
              Inspired? Ab course start karo.
            </h2>
            <p style={{ color: "#BFDBFE", fontSize: "15px", lineHeight: 1.75, marginBottom: 36, maxWidth: 460, margin: "0 auto 36px" }}>
              Chapter 1 se shuru karo — free hai, koi sign-up nahi.
            </p>
            <Link href="/chapters">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 40px", borderRadius: 14, background: "white", color: "#2563EB", fontWeight: 800, fontSize: "15px", cursor: "pointer", boxShadow: "0 8px 28px rgba(0,0,0,0.18)" }}>
                Start the Course <ArrowRight size={16} />
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
