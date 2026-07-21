"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

/* ─── Shared glass style ─── */
const glass = (accent: string) => ({
  background: "rgba(255,255,255,0.94)",
  backdropFilter: "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
  borderRadius: 18,
  border: `1px solid rgba(255,255,255,0.9)`,
  boxShadow: `0 12px 40px rgba(0,0,0,0.10), 0 0 0 1px ${accent}22, inset 0 1px 0 rgba(255,255,255,1)`,
  overflow: "hidden" as const,
  position: "relative" as const,
});

/* Accent top bar */
const AccentBar = ({ color }: { color: string }) => (
  <div style={{
    position: "absolute", top: 0, left: 0, right: 0, height: 3,
    background: `linear-gradient(90deg, ${color}, ${color}88, transparent)`,
    borderRadius: "18px 18px 0 0",
  }} />
);

/* Pulsing status dot */
const LiveDot = ({ color = "#22C55E", delay = 0 }: { color?: string; delay?: number }) => (
  <span style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", width: 14, height: 14 }}>
    <motion.span
      animate={{ scale: [1, 2.4, 1], opacity: [0.6, 0, 0.6] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut", delay }}
      style={{ position: "absolute", inset: 0, borderRadius: "50%", background: color }}
    />
    <span style={{ width: 7, height: 7, borderRadius: "50%", background: color, display: "block", position: "relative" }} />
  </span>
);

/* ── Data ── */
const IPS       = ["192.168.1.1", "10.0.0.254", "172.16.4.8", "192.168.0.1"];
const BAR_BASE  = [3, 5, 4, 7, 6, 8, 5, 9, 7, 8];
const PKT_VALS  = ["724K", "731K", "718K", "745K"];
const TERM_LINES = [
  { cmd: "whoami",         out: null,              outColor: "" },
  { cmd: "nmap -sV target",out: "Scanning ports…", outColor: "#94A3B8" },
  { cmd: "192.168.1.1",    out: "HOST UP",         outColor: "#4ADE80" },
  { cmd: "exploit --run",  out: "Connecting…",     outColor: "#F59E0B" },
  { cmd: "target_found",   out: "ACCESS GRANTED",  outColor: "#4ADE80" },
];

export default function HeroScene() {
  const [mounted, setMounted] = useState(false);

  /* IP cycle */
  const [ipIdx,     setIpIdx]     = useState(0);
  const [ipPhase,   setIpPhase]   = useState<"idle"|"scan">("idle");
  const [scanPct,   setScanPct]   = useState(0);

  /* Packets */
  const [bars,      setBars]      = useState(BAR_BASE);
  const [pktIdx,    setPktIdx]    = useState(0);
  const [pktFlash,  setPktFlash]  = useState(false);

  /* Terminal */
  const [termLines, setTermLines] = useState(0);
  const [blink,     setBlink]     = useState(true);

  useEffect(() => { setMounted(true); }, []);

  /* ── IP scanner: scan bar → flip IP ── */
  useEffect(() => {
    if (!mounted) return;
    const loop = () => {
      setIpPhase("scan");
      setScanPct(0);
      let p = 0;
      const step = setInterval(() => {
        p += 4 + Math.random() * 6;
        setScanPct(Math.min(p, 100));
        if (p >= 100) {
          clearInterval(step);
          setIpIdx(i => (i + 1) % IPS.length);
          setTimeout(() => { setIpPhase("idle"); setScanPct(0); }, 400);
        }
      }, 60);
    };
    const t = setInterval(loop, 3800);
    return () => clearInterval(t);
  }, [mounted]);

  /* ── Packet bars jitter ── */
  useEffect(() => {
    if (!mounted) return;
    const t = setInterval(() => {
      setBars(BAR_BASE.map(h => Math.max(2, h + Math.floor(Math.random() * 5) - 2)));
      setPktIdx(i => (i + 1) % PKT_VALS.length);
      setPktFlash(true);
      setTimeout(() => setPktFlash(false), 300);
    }, 2000);
    return () => clearInterval(t);
  }, [mounted]);

  /* ── Terminal typewriter ── */
  useEffect(() => {
    if (!mounted) return;
    setTermLines(0);
    let i = 0;
    const next = () => {
      i++;
      setTermLines(i);
      if (i < TERM_LINES.length) setTimeout(next, 600 + Math.random() * 300);
      else setTimeout(() => { setTermLines(0); i = 0; setTimeout(next, 1200); }, 4000);
    };
    const t = setTimeout(next, 600);
    return () => clearTimeout(t);
  }, [mounted]);

  /* ── Cursor blink ── */
  useEffect(() => {
    const t = setInterval(() => setBlink(b => !b), 520);
    return () => clearInterval(t);
  }, []);

  /* ── Card float variants ── */
  const float = (dy: number, dur: number, delay: number) => ({
    animate: { y: [0, -dy, 0] },
    transition: { duration: dur, repeat: Infinity, ease: "easeInOut" as const, delay },
  });

  /* ── Entry animation ── */
  const entry = (x: number, delay: number) =>
    mounted
      ? { initial: { opacity: 0, x, scale: 0.88 }, animate: { opacity: 1, x: 0, scale: 1 }, transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] } }
      : {};

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", minHeight: 520 }}>

      {/* ── Ambient glow ── */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 0 }}>
        <div style={{
          width: "85%", height: "85%", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,60,220,0.26) 0%, rgba(37,99,235,0.12) 45%, transparent 70%)",
          filter: "blur(50px)",
        }} />
      </div>

      {/* ── Hacker circle ── */}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1, pointerEvents: "none" }}>
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "relative", width: "min(100%, 720px)", aspectRatio: "1" }}
        >
          <motion.div
            animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.04, 0.4] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            style={{ position: "absolute", inset: -10, borderRadius: "50%", border: "1.5px solid rgba(124,58,237,0.55)" }}
          />
          <motion.div
            animate={{ scale: [1, 1.14, 1], opacity: [0.18, 0.02, 0.18] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            style={{ position: "absolute", inset: -24, borderRadius: "50%", border: "1px solid rgba(99,102,241,0.30)" }}
          />
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", overflow: "hidden", zIndex: 1 }}>
            <Image
              src="/hacker.png" alt="TWH Hacker" fill
              sizes="(max-width: 768px) 360px, (max-width: 1024px) 500px, 750px"
              style={{ objectFit: "cover", objectPosition: "center 20%" }}
              priority
            />
          </div>
        </motion.div>
      </div>

      {/* ── Particles ── */}
      {Array.from({ length: 10 }).map((_, i) => (
        <motion.div key={`p${i}`}
          style={{
            position: "absolute",
            width: i % 3 === 0 ? 3 : 2, height: i % 3 === 0 ? 3 : 2,
            borderRadius: "50%",
            left: `${8 + (i * 77) % 80}%`, top: `${5 + (i * 51) % 86}%`,
            background: i % 2 === 0 ? "rgba(96,165,250,0.75)" : "rgba(192,132,252,0.60)",
            pointerEvents: "none", zIndex: 1,
          }}
          animate={{ opacity: [0.2, 0.9, 0.2], scale: [1, 1.7, 1] }}
          transition={{ duration: 2.0 + (i % 5) * 0.45, repeat: Infinity, delay: (i * 0.17) % 3 }}
        />
      ))}

      {/* ════════════════════════════════════
          CARD 1 — IP SCANNING  (top-right)
      ════════════════════════════════════ */}
      <motion.div {...entry(40, 0.2)} {...float(8, 4.2, 0.5)}
        style={{ position: "absolute", top: "4%", right: "0%", zIndex: 30 }}
      >
        <div style={glass("#2563EB")}>
          <AccentBar color="#2563EB" />
          <div style={{ padding: "14px 18px", minWidth: 168 }}>

            {/* Header row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {/* Radar icon */}
                <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(37,99,235,0.10)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="6" stroke="#2563EB" strokeWidth="1.2"/>
                    <circle cx="7" cy="7" r="3.5" stroke="#2563EB" strokeWidth="1.2" strokeDasharray="2 2"/>
                    <circle cx="7" cy="7" r="1.2" fill="#2563EB"/>
                    <motion.line
                      x1="7" y1="7" x2="7" y2="1"
                      stroke="#2563EB" strokeWidth="1.4" strokeLinecap="round"
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
                      style={{ transformOrigin: "7px 7px" }}
                    />
                  </svg>
                </div>
                <span style={{ fontSize: 9.5, fontWeight: 800, color: "#2563EB", textTransform: "uppercase", letterSpacing: "0.11em" }}>IP Scanning</span>
              </div>
              <LiveDot color="#22C55E" />
            </div>

            {/* IP address */}
            <div style={{ fontFamily: "monospace", fontSize: 15, fontWeight: 800, color: "#0F172A", marginBottom: 8, letterSpacing: "0.02em" }}>
              <AnimatePresence mode="wait">
                <motion.span
                  key={ipIdx}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.3 }}
                  style={{ display: "block" }}
                >
                  {IPS[ipIdx]}
                </motion.span>
              </AnimatePresence>
            </div>

            {/* Scan progress bar */}
            <div style={{ height: 4, borderRadius: 99, background: "rgba(37,99,235,0.10)", overflow: "hidden", marginBottom: 8 }}>
              <motion.div
                animate={{ width: ipPhase === "scan" ? `${scanPct}%` : "100%" }}
                transition={{ duration: 0.1 }}
                style={{ height: "100%", borderRadius: 99, background: "linear-gradient(90deg, #2563EB, #60A5FA)" }}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ fontSize: 9, color: ipPhase === "scan" ? "#F59E0B" : "#6B7280", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                {ipPhase === "scan" ? "● Scanning…" : "● Active"}
              </span>
            </div>

          </div>
        </div>
      </motion.div>

      {/* ════════════════════════════════════
          CARD 2 — ENCRYPTION  (left-center)
      ════════════════════════════════════ */}
      <motion.div {...entry(-40, 0.35)} {...float(7, 3.8, 1.2)}
        style={{ position: "absolute", top: "33%", left: "0%", zIndex: 30 }}
      >
        <div style={glass("#7C3AED")}>
          <AccentBar color="#7C3AED" />
          <div style={{ padding: "14px 18px", minWidth: 152 }}>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 9.5, fontWeight: 800, color: "#7C3AED", textTransform: "uppercase", letterSpacing: "0.11em" }}>Encryption</span>
              <LiveDot color="#22C55E" delay={0.5} />
            </div>

            {/* Lock + label */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <motion.div
                animate={{ boxShadow: ["0 0 0px rgba(124,58,237,0)", "0 0 12px rgba(124,58,237,0.6)", "0 0 0px rgba(124,58,237,0)"] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(124,58,237,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
              >
                <svg width="13" height="15" viewBox="0 0 13 15" fill="none">
                  <rect x="1.5" y="6.5" width="10" height="8" rx="2" stroke="#7C3AED" strokeWidth="1.4"/>
                  <path d="M4 6.5V4.5a2.5 2.5 0 0 1 5 0v2" stroke="#7C3AED" strokeWidth="1.4" strokeLinecap="round"/>
                  <circle cx="6.5" cy="10.5" r="1" fill="#7C3AED"/>
                </svg>
              </motion.div>
              <div>
                <div style={{ fontFamily: "monospace", fontSize: 15, fontWeight: 900, color: "#0F172A", lineHeight: 1 }}>AES-256</div>
                <div style={{ fontSize: 9, color: "#9CA3AF", fontWeight: 600, marginTop: 2 }}>256-bit key</div>
              </div>
            </div>

            {/* Strength bar */}
            <div style={{ marginBottom: 4 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 8.5, color: "#9CA3AF", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em" }}>Strength</span>
                <span style={{ fontSize: 8.5, color: "#7C3AED", fontWeight: 700 }}>100%</span>
              </div>
              <div style={{ height: 4, borderRadius: 99, background: "rgba(124,58,237,0.10)", overflow: "hidden" }}>
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.4, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  style={{ height: "100%", borderRadius: 99, background: "linear-gradient(90deg,#7C3AED,#A78BFA)" }}
                />
              </div>
            </div>

          </div>
        </div>
      </motion.div>

      {/* ════════════════════════════════════
          CARD 3 — PACKETS  (right-center)
      ════════════════════════════════════ */}
      <motion.div {...entry(40, 0.25)} {...float(9, 3.4, 0.8)}
        style={{ position: "absolute", top: "46%", right: "0%", zIndex: 30, transform: "translateY(-50%)" }}
      >
        <div style={glass("#0EA5E9")}>
          <AccentBar color="#0EA5E9" />
          <div style={{ padding: "14px 18px", minWidth: 148 }}>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 9.5, fontWeight: 800, color: "#0EA5E9", textTransform: "uppercase", letterSpacing: "0.11em" }}>Packets</span>
              {/* Trend arrow */}
              <span style={{ fontSize: 10, fontWeight: 700, color: "#22C55E", display: "flex", alignItems: "center", gap: 2 }}>
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1 6L4 2L7 6" stroke="#22C55E" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                12.5%
              </span>
            </div>

            {/* Counter — always visible, flashes on update */}
            <motion.div
              animate={{ color: pktFlash ? "#0EA5E9" : "#0F172A" }}
              transition={{ duration: 0.2 }}
              style={{ fontSize: 26, fontWeight: 900, lineHeight: 1, marginBottom: 10, fontVariantNumeric: "tabular-nums" }}
            >
              {PKT_VALS[pktIdx]}
            </motion.div>

            {/* Animated bars */}
            <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 32 }}>
              {bars.map((h, i) => (
                <motion.div
                  key={i}
                  animate={{ height: h * 3.5 }}
                  transition={{ duration: 0.5, ease: "easeInOut", delay: i * 0.03 }}
                  style={{
                    flex: 1, borderRadius: 3,
                    background: `linear-gradient(180deg, #0EA5E9, rgba(14,165,233,${0.25 + h * 0.07}))`,
                  }}
                />
              ))}
            </div>

          </div>
        </div>
      </motion.div>

      {/* ════════════════════════════════════
          CARD 4 — TERMINAL  (bottom-left)
      ════════════════════════════════════ */}
      <motion.div {...entry(-40, 0.45)} {...float(6, 4.8, 0.3)}
        style={{ position: "absolute", top: "62%", left: "0%", zIndex: 30 }}
      >
        <div style={{
          background: "rgba(8,12,24,0.96)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(37,99,235,0.22)",
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 16px 48px rgba(0,0,0,0.45), 0 0 0 1px rgba(37,99,235,0.15), 0 0 24px rgba(37,99,235,0.08)",
          minWidth: 196,
        }}>
          {/* macOS-style titlebar */}
          <div style={{ padding: "8px 12px", background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#FF5F57", display: "block" }} />
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#FEBC2E", display: "block" }} />
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#28C840", display: "block" }} />
            <span style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", fontFamily: "monospace", marginLeft: 4 }}>twh@kali — bash</span>
          </div>

          {/* Lines */}
          <div style={{ padding: "10px 14px", minHeight: 80 }}>
            {TERM_LINES.slice(0, termLines).map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.18 }}
                style={{ fontFamily: "monospace", fontSize: 11, lineHeight: 1.85, display: "flex", alignItems: "baseline", gap: 5 }}
              >
                <span style={{ color: "#3B82F6", fontWeight: 700, flexShrink: 0 }}>❯</span>
                <span style={{ color: line.cmd === "target_found" ? "#4ADE80" : "#CBD5E1", fontWeight: line.cmd === "target_found" ? 700 : 400 }}>{line.cmd}</span>
                {/* Blinking cursor on last unfinished line */}
                {i === termLines - 1 && termLines < TERM_LINES.length && (
                  <motion.span
                    animate={{ opacity: blink ? 1 : 0 }}
                    transition={{ duration: 0 }}
                    style={{ color: "#3B82F6", fontWeight: 900, fontSize: 12 }}
                  >▋</motion.span>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ════════════════════════════════════
          CARD 5 — ACCESS GRANTED  (bottom)
      ════════════════════════════════════ */}
      <motion.div
        {...(mounted ? { initial: { opacity: 0, y: 16, scale: 0.9 }, animate: { opacity: 1, y: 0, scale: 1 }, transition: { duration: 0.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] } } : {})}
        {...float(6, 3.8, 1.5)}
        style={{ position: "absolute", top: "76%", left: "50%", transform: "translateX(-50%)", zIndex: 30, whiteSpace: "nowrap" }}
      >
        <div style={{ position: "relative", display: "inline-block" }}>
          {/* Ripple rings */}
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              animate={{ scale: [1, 1.5 + i * 0.25, 1], opacity: [0.45 - i * 0.1, 0, 0.45 - i * 0.1] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut", delay: i * 0.35 }}
              style={{
                position: "absolute",
                inset: -(6 + i * 7),
                borderRadius: 999,
                border: `1.5px solid rgba(22,163,74,${0.5 - i * 0.12})`,
                pointerEvents: "none",
              }}
            />
          ))}

          {/* Badge */}
          <motion.div
            animate={{ boxShadow: [
              "0 4px 20px rgba(22,163,74,0.18), 0 0 0 1px rgba(22,163,74,0.25)",
              "0 4px 32px rgba(22,163,74,0.55), 0 0 0 1px rgba(22,163,74,0.5)",
              "0 4px 20px rgba(22,163,74,0.18), 0 0 0 1px rgba(22,163,74,0.25)",
            ]}}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 20px", borderRadius: 999,
              background: "rgba(255,255,255,0.96)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(22,163,74,0.35)",
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.18, 1], background: ["#16A34A", "#22C55E", "#16A34A"] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              style={{ width: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
            >
              <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                <path d="M1 4.5L4 7.5L10 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 900, color: "#15803D", textTransform: "uppercase", letterSpacing: "0.12em", lineHeight: 1 }}>Access Granted</div>
              <div style={{ fontSize: 8.5, color: "#86EFAC", fontWeight: 600, marginTop: 2, letterSpacing: "0.06em" }}>Authentication complete</div>
            </div>
          </motion.div>
        </div>
      </motion.div>

    </div>
  );
}
