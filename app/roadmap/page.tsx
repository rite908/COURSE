"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { BookOpen, Cpu, Wifi, Terminal, Zap, CheckCircle, ArrowRight, Target } from "lucide-react";
import { useTheme } from "@/lib/theme";

const PHASES = [
  {
    phase: "01", icon: <BookOpen size={20} />, color: "#2563EB", darkBg: "rgba(37,99,235,0.15)", lightBg: "#EEF3FF",
    chapter: "Chapter 1", title: "Ethical Hacking ki Duniya", subtitle: "Foundation — Mindset & Basics",
    desc: "Hacker ka asli matlab kya hota hai? Types of hackers, developer vs hacker ki soch ka fark, aur ethical hacking ka pura picture — yahan se shuru hota hai asli safar.",
    topics: ["Hacker Ka Asli Matlab","Hack Kaise Hota Hai?","Types of Hackers","Developer vs Hacker","Hacker Mindset — 12 Traits","Ethical Hacking Kya Hai?"],
    skills: ["Critical Thinking","Recon Mindset","Legal Awareness"],
  },
  {
    phase: "02", icon: <Cpu size={20} />, color: "#7C3AED", darkBg: "rgba(124,58,237,0.15)", lightBg: "#F3EEFF",
    chapter: "Chapter 2", title: "Computer Ka Andar Ka Sach", subtitle: "How Computers Work — Hardware to OS",
    desc: "Ek hacker ke liye computer sirf tool nahi — battlefield hai. CPU, RAM, storage, OS internals, binary aur hex — andar se samjho toh attack aur defence dono zyada powerful ho jaate hain.",
    topics: ["CPU Kya Hai aur Kaise Kaam Karta Hai?","RAM aur Storage ka Rishta","Operating System Internals","Binary & Hexadecimal","Boot Process Step-by-Step","Processes, Threads & Memory"],
    skills: ["OS Internals","Binary Logic","System Architecture"],
  },
  {
    phase: "03", icon: <Wifi size={20} />, color: "#0EA5E9", darkBg: "rgba(14,165,233,0.15)", lightBg: "#F0F9FF",
    chapter: "Chapter 3", title: "Network Ka Jaadu", subtitle: "Networking — TCP/IP to Packet Sniffing",
    desc: "Internet kaise kaam karta hai yeh samjhna har hacker ke liye zaroori hai. Packets kahan jaate hain, DNS kya karta hai, ports aur protocols — aur kahan chhupa hota hai vulnerability.",
    topics: ["IP Address & Subnetting","TCP/IP Model — Layer by Layer","DNS Kaise Kaam Karta Hai?","Ports & Common Protocols","Packet Sniffing with Wireshark","Wi-Fi Security & WPA Basics"],
    skills: ["Network Analysis","Wireshark","Protocol Understanding"],
  },
  {
    phase: "04", icon: <Terminal size={20} />, color: "#059669", darkBg: "rgba(5,150,105,0.15)", lightBg: "#ECFDF5",
    chapter: "Chapter 4", title: "Linux — Hacker Ka Ghar", subtitle: "Linux & Command Line — Your Primary Weapon",
    desc: "Agar tum Linux nahi jaante, tum hacker nahi ho. Bash shell, file system ka structure, permissions, scripting — yeh woh foundation hai jiske bina Kali Linux bhi bekar hai.",
    topics: ["Linux Kyu? Windows se Better Kyu?","File System Navigation","File Permissions & chmod","Bash Scripting Basics","Process Management","Networking Commands — netstat, nmap, curl"],
    skills: ["Bash Scripting","File Permissions","Linux CLI"],
  },
  {
    phase: "05", icon: <Zap size={20} />, color: "#D97706", darkBg: "rgba(217,119,6,0.15)", lightBg: "#FFFBEB",
    chapter: "Chapter 5", title: "Kali Linux & Real Pentesting", subtitle: "Tools, Techniques & Your First Pentest",
    desc: "Ab sab kuch ek jagah aata hai. Kali Linux setup se lekar Nmap, Metasploit, Burp Suite tak — aur pehla real pentest karte karte seekhoge ki professional pentester kaise sochta hai.",
    topics: ["Kali Linux Installation & Setup","Nmap — Recon & Port Scanning","Metasploit Framework Basics","Burp Suite — Web App Testing","First Pentest Workflow","Pentest Report Kaise Likhein"],
    skills: ["Nmap","Metasploit","Burp Suite","Report Writing"],
  },
];

export default function RoadmapPage() {
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
  };

  const fade = (delay = 0) => ({
    initial: mounted ? { opacity: 0, x: -16 } : (false as const),
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true, margin: "-40px" },
    transition: { delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] },
  });

  return (
    <main style={{ minHeight: "100vh", background: T.bg, paddingTop: 68 }}>

      {/* Hero */}
      <section style={{ background: T.heroBg, padding: `${vp}px ${sp}px`, textAlign: "center" }}>
        <motion.div initial={mounted ? { opacity: 0, y: 20 } : false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "5px 14px", borderRadius: 999, background: T.chipBg, border: `1px solid ${T.chipBdr}`, marginBottom: 20 }}>
            <Target size={12} color="#3B82F6" />
            <span style={{ fontSize: "11px", fontWeight: 700, color: T.chipTxt, textTransform: "uppercase", letterSpacing: "0.09em" }}>Course Roadmap</span>
          </div>
          <h1 style={{ fontWeight: 900, color: T.text, fontSize: isLg ? "clamp(2rem,4vw,3rem)" : isMd ? "2.3rem" : "1.8rem", letterSpacing: "-0.03em", marginBottom: 18, lineHeight: 1.1 }}>
            Zero se Hero tak —{" "}
            <span style={{ background: "linear-gradient(130deg,#2563EB,#7C3AED)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>5 Chapters mein</span>
          </h1>
          <p style={{ color: T.text2, fontSize: "15px", lineHeight: 1.75, marginBottom: 36, maxWidth: 540, margin: "0 auto 36px" }}>
            Ek structured learning path jo tumhe absolute beginner se certified ethical hacker tak le jaati hai. Har chapter pehle wale ke upar build karta hai.
          </p>
          <Link href="/chapters">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 32px", borderRadius: 14, background: "linear-gradient(135deg,#2563EB,#7C3AED)", color: "white", fontWeight: 700, fontSize: "15px", cursor: "pointer", boxShadow: "0 4px 20px rgba(37,99,235,0.32)" }}>
              Start Learning Now <ArrowRight size={16} />
            </motion.div>
          </Link>
        </motion.div>
      </section>

      {/* Timeline */}
      <section style={{ background: T.bg, padding: `${vp}px ${sp}px` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 36 }}>
          <p style={{ fontSize: "13px", fontWeight: 600, color: T.muted, textTransform: "uppercase", letterSpacing: "0.09em" }}>Learning Path</p>
          <span style={{ fontSize: "12px", fontWeight: 700, color: T.chipTxt, background: T.chipBg, border: `1px solid ${T.chipBdr}`, padding: "4px 14px", borderRadius: 999 }}>5 / 5 Chapters Available</span>
        </div>

        <div style={{ position: "relative" }}>
          {/* Vertical line */}
          {isMd && (
            <div style={{ position: "absolute", left: 21, top: 0, bottom: 0, width: 2, background: "linear-gradient(to bottom,#BFDBFE,#DDD6FE,#BAE6FD,#A7F3D0,#FDE68A)" }} />
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {PHASES.map((item, i) => (
              <motion.div key={item.phase} {...fade(i * 0.07)}
                style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
                {/* Icon bubble */}
                <div style={{
                  width: 44, height: 44, borderRadius: 14, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1,
                  background: isDark ? item.darkBg : item.lightBg, color: item.color,
                  border: `1.5px solid ${item.color}40`,
                  boxShadow: `0 2px 10px ${item.color}30`,
                }}>
                  {item.icon}
                </div>

                {/* Card */}
                <motion.div whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  style={{ flex: 1, background: T.card, borderRadius: 20, border: `1px solid ${T.border}`, overflow: "hidden", boxShadow: `0 2px 16px rgba(0,0,0,${isDark ? 0.22 : 0.04})` }}>
                  <div style={{ padding: isMd ? "24px 28px 18px" : "20px 20px 16px" }}>
                    <div style={{ display: "flex", flexDirection: isMd ? "row" : "column", justifyContent: "space-between", gap: 12, marginBottom: 12, alignItems: isMd ? "flex-start" : "stretch" }}>
                      <div>
                        <div style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: item.color, marginBottom: 4 }}>Phase {item.phase} · {item.chapter}</div>
                        <h3 style={{ fontWeight: 900, color: T.text, fontSize: isMd ? "1.1rem" : "1rem", marginBottom: 3, letterSpacing: "-0.01em" }}>{item.title}</h3>
                        <p style={{ fontSize: "12px", color: T.muted, fontWeight: 500 }}>{item.subtitle}</p>
                      </div>
                      <span style={{ alignSelf: "flex-start", fontSize: "11px", fontWeight: 700, padding: "4px 12px", borderRadius: 999, background: isDark ? item.darkBg : item.lightBg, color: item.color, whiteSpace: "nowrap" }}>
                        ✓ Available
                      </span>
                    </div>
                    <p style={{ color: T.text2, fontSize: "13.5px", lineHeight: 1.75 }}>{item.desc}</p>
                  </div>

                  {/* Topics */}
                  <div style={{ padding: "0 28px 18px" }}>
                    <p style={{ fontSize: "10px", fontWeight: 800, color: T.muted, textTransform: "uppercase", letterSpacing: "0.09em", marginBottom: 10 }}>Topics Covered</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {item.topics.map((t) => (
                        <span key={t} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "12px", fontWeight: 500, color: T.text2, background: isDark ? "rgba(255,255,255,0.05)" : "#F8FAFF", border: `1px solid ${T.border}`, borderRadius: 8, padding: "4px 11px" }}>
                          <CheckCircle size={9} color={item.color} />{t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Skills footer */}
                  <div style={{ padding: "12px 28px", borderTop: `1px solid ${T.border}`, background: isDark ? item.darkBg : item.lightBg + "88", display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: "10px", fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Skills:</span>
                    {item.skills.map((s) => (
                      <span key={s} style={{ fontSize: "12px", fontWeight: 600, color: item.color }}>{s}</span>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: T.bg2, padding: `${vp}px ${sp}px` }}>
        <motion.div
          initial={mounted ? { opacity: 0, y: 20 } : false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
          style={{ maxWidth: 680, margin: "0 auto", borderRadius: 24, background: "linear-gradient(135deg,#1D4ED8,#7C3AED)", padding: isMd ? "60px 10%" : "44px 28px", textAlign: "center", position: "relative", overflow: "hidden", boxShadow: "0 24px 64px rgba(37,99,235,0.30)" }}>
          <div style={{ position: "absolute", top: "-50px", right: "-50px", width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <h2 style={{ fontWeight: 900, color: "white", fontSize: isMd ? "1.9rem" : "1.55rem", letterSpacing: "-0.025em", marginBottom: 12 }}>Roadmap clear hai?<br />Ab shuru karo.</h2>
            <p style={{ color: "#BFDBFE", fontSize: "14px", lineHeight: 1.75, marginBottom: 32 }}>Chapter 1 se start karo — free hai, koi sign-up nahi, koi credit card nahi.</p>
            <Link href="/chapters">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "13px 36px", borderRadius: 14, background: "white", color: "#2563EB", fontWeight: 800, fontSize: "14px", cursor: "pointer", boxShadow: "0 8px 28px rgba(0,0,0,0.18)" }}>
                Go to Chapters <ArrowRight size={15} />
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
