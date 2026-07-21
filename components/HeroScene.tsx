"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

/* ─── Shared styles ─── */
const glassCard = (accent: string): React.CSSProperties => ({
  background: "rgba(255,255,255,0.95)",
  backdropFilter: "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
  borderRadius: 18,
  border: "1px solid rgba(255,255,255,0.9)",
  boxShadow: `0 12px 40px rgba(0,0,0,0.10), 0 0 0 1px ${accent}22, inset 0 1px 0 rgba(255,255,255,1)`,
  overflow: "hidden",
  position: "relative",
});

const AccentBar = ({ color }: { color: string }) => (
  <div style={{
    position: "absolute", top: 0, left: 0, right: 0, height: 3,
    background: `linear-gradient(90deg,${color},${color}66,transparent)`,
  }} />
);

const PulseDot = ({ color = "#22C55E", delay = 0 }: { color?: string; delay?: number }) => (
  <span style={{ position: "relative", display: "inline-flex", width: 14, height: 14, alignItems: "center", justifyContent: "center" }}>
    <motion.span
      animate={{ scale: [1, 2.6, 1], opacity: [0.5, 0, 0.5] }}
      transition={{ duration: 1.9, repeat: Infinity, ease: "easeOut", delay }}
      style={{ position: "absolute", inset: 0, borderRadius: "50%", background: color }}
    />
    <span style={{ width: 7, height: 7, borderRadius: "50%", background: color, position: "relative" }} />
  </span>
);

/* ── Continuous float wrapper ── */
function Float({ dy, dur, delay, children }: {
  dy: number; dur: number; delay: number; children: React.ReactNode;
}) {
  return (
    <motion.div
      animate={{ y: [0, -dy, 0] }}
      transition={{ duration: dur, repeat: Infinity, ease: "easeInOut", delay }}
    >
      {children}
    </motion.div>
  );
}

/* ── Data ── */
const IPS      = ["192.168.1.1", "10.0.0.254", "172.16.4.8", "192.168.0.1"];
const BAR_BASE = [3, 5, 4, 7, 6, 8, 5, 9, 7, 8];
const PKT_VALS = ["724K", "731K", "718K", "745K", "712K"];
/* ── Terminal script: cmd lines type char-by-char; output appears instantly ── */
type TermSegment = {
  kind: "cmd" | "out";
  prompt?: string;
  text: string;
  color: string;
  bold?: boolean;
  pauseAfter?: number; // ms to wait before next segment
};
const TERM_SCRIPT: TermSegment[] = [
  { kind: "cmd", prompt: "root@kali:~$", text: " nmap -sS 192.168.1.0/24",     color: "#E2E8F0", pauseAfter: 120 },
  { kind: "out", text: "Starting Nmap 7.94…",                                    color: "#64748B", pauseAfter: 80  },
  { kind: "out", text: "[+] 192.168.1.1 — ports: 22, 80, 443",                  color: "#60A5FA", pauseAfter: 80  },
  { kind: "out", text: "[+] 22/tcp  open  ssh   OpenSSH 8.9p1",                  color: "#60A5FA", pauseAfter: 200 },
  { kind: "cmd", prompt: "root@kali:~$", text: " ssh root@192.168.1.1",          color: "#E2E8F0", pauseAfter: 100 },
  { kind: "out", text: "root@192.168.1.1's password: ••••••••",                  color: "#94A3B8", pauseAfter: 80  },
  { kind: "out", text: "Welcome to Kali GNU/Linux 2024.1",                       color: "#4ADE80", pauseAfter: 200 },
  { kind: "cmd", prompt: "root@192.168.1.1:~$", text: " cat /root/flag.txt",     color: "#E2E8F0", pauseAfter: 80  },
  { kind: "out", text: "TWH{4cc3ss_gr4nt3d_m4st3r!}",                            color: "#4ADE80", bold: true, pauseAfter: 2800 },
];

/* ══════════════════════════════════════════════════════ */

export default function HeroScene() {
  const [mounted, setMounted] = useState(false);

  /* IP scanner */
  const [ipIdx,      setIpIdx]      = useState(0);
  const [ipKey,      setIpKey]      = useState(0);   // increments on every change
  const [scanPct,    setScanPct]    = useState(100);
  const [scanning,   setScanning]   = useState(false);

  /* Packets */
  const [bars,     setBars]    = useState(BAR_BASE);
  const [pktIdx,   setPktIdx]  = useState(0);
  const [pktFlash, setPktFlash]= useState(false);

  /* Terminal — char-by-char typewriter */
  type DoneLine = { seg: TermSegment; text: string };
  const [doneLines,  setDoneLines]  = useState<DoneLine[]>([]);
  const [activeText, setActiveText] = useState("");   // chars revealed so far on current seg
  const [activeSeg,  setActiveSeg]  = useState<TermSegment | null>(null);
  

  /* ── Mount ── */
  useEffect(() => { setMounted(true); }, []);

  /* ── IP scanning loop ── */
  useEffect(() => {
    if (!mounted) return;
    let active = true;

    const tick = () => {
      if (!active) return;
      setScanning(true);
      setScanPct(0);
      let p = 0;
      const interval = setInterval(() => {
        if (!active) { clearInterval(interval); return; }
        p += 5 + Math.random() * 8;
        setScanPct(Math.min(p, 100));
        if (p >= 100) {
          clearInterval(interval);
          if (!active) return;
          setIpIdx(i => (i + 1) % IPS.length);
          setIpKey(k => k + 1);
          setScanning(false);
        }
      }, 55);
    };

    const id = setInterval(tick, 4200);
    return () => { active = false; clearInterval(id); };
  }, [mounted]);

  /* ── Packet bars ── */
  useEffect(() => {
    if (!mounted) return;
    let active = true;
    const id = setInterval(() => {
      if (!active) return;
      setBars(BAR_BASE.map(h => Math.max(2, h + Math.floor(Math.random() * 5) - 2)));
      setPktIdx(i => (i + 1) % PKT_VALS.length);
      setPktFlash(true);
      setTimeout(() => { if (active) setPktFlash(false); }, 320);
    }, 1900);
    return () => { active = false; clearInterval(id); };
  }, [mounted]);

  /* ── Terminal — char-by-char typewriter, StrictMode-safe ── */
  useEffect(() => {
    if (!mounted) return;
    let active = true;
    const T: ReturnType<typeof setTimeout>[] = [];

    const sched = (fn: () => void, ms: number) => {
      const id = setTimeout(() => { if (active) fn(); }, ms);
      T.push(id);
    };

    const runScript = () => {
      if (!active) return;
      setDoneLines([]);
      setActiveText("");
      setActiveSeg(null);

      let segIdx = 0;

      const nextSeg = () => {
        if (!active || segIdx >= TERM_SCRIPT.length) {
          /* loop back after pause */
          sched(runScript, 1200);
          return;
        }
        const seg = TERM_SCRIPT[segIdx++];
        setActiveSeg(seg);
        setActiveText("");

        if (seg.kind === "out") {
          /* output lines appear all-at-once then pause */
          setActiveText(seg.text);
          sched(() => {
            setDoneLines(prev => [...prev, { seg, text: seg.text }]);
            setActiveText("");
            setActiveSeg(null);
            sched(nextSeg, seg.pauseAfter ?? 100);
          }, 80);
        } else {
          /* command lines type char-by-char at ~38 ms/char */
          let c = 0;
          const full = seg.text;
          const typeChar = () => {
            if (!active) return;
            c++;
            setActiveText(full.slice(0, c));
            if (c < full.length) {
              sched(typeChar, 36 + Math.random() * 24);
            } else {
              /* finished typing — commit, then move on */
              sched(() => {
                setDoneLines(prev => [...prev, { seg, text: full }]);
                setActiveText("");
                setActiveSeg(null);
                sched(nextSeg, seg.pauseAfter ?? 120);
              }, 160);
            }
          };
          sched(typeChar, 36);
        }
      };

      nextSeg();
    };

    sched(runScript, 300);
    return () => { active = false; T.forEach(clearTimeout); };
  }, [mounted]);

  

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", minHeight: 520 }}>

      {/* Ambient glow */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 0 }}>
        <div style={{
          width: "85%", height: "85%", borderRadius: "50%",
          background: "radial-gradient(circle,rgba(99,60,220,0.26) 0%,rgba(37,99,235,0.12) 45%,transparent 70%)",
          filter: "blur(50px)",
        }} />
      </div>

      {/* Hacker circle */}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1, pointerEvents: "none" }}>
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "relative", width: "min(100%,720px)", aspectRatio: "1" }}
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
            <Image src="/hacker.png" alt="TWH Hacker" fill
              sizes="(max-width:768px) 360px,(max-width:1024px) 500px,750px"
              style={{ objectFit: "cover", objectPosition: "center 20%" }} priority />
          </div>
        </motion.div>
      </div>

      {/* Particles */}
      {Array.from({ length: 10 }).map((_, i) => (
        <motion.div key={`p${i}`} style={{
          position: "absolute",
          width: i % 3 === 0 ? 3 : 2, height: i % 3 === 0 ? 3 : 2, borderRadius: "50%",
          left: `${8 + (i * 77) % 80}%`, top: `${5 + (i * 51) % 86}%`,
          background: i % 2 === 0 ? "rgba(96,165,250,0.75)" : "rgba(192,132,252,0.60)",
          pointerEvents: "none", zIndex: 1,
        }}
          animate={{ opacity: [0.2, 0.9, 0.2], scale: [1, 1.7, 1] }}
          transition={{ duration: 2.0 + (i % 5) * 0.45, repeat: Infinity, delay: (i * 0.17) % 3 }}
        />
      ))}

      {/* ══════════════════════════════════════
          CARD 1 — IP SCANNING  (top-right)
      ══════════════════════════════════════ */}
      <div style={{ position: "absolute", top: "4%", right: "0%", zIndex: 30 }}>
        <Float dy={8} dur={4.2} delay={0.5}>
          <div style={glassCard("#2563EB")}>
            <AccentBar color="#2563EB" />
            <div style={{ padding: "14px 18px", minWidth: 172 }}>

              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  {/* Spinning radar */}
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(37,99,235,0.10)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ overflow: "visible" }}>
                      <circle cx="7" cy="7" r="5.5" stroke="#2563EB" strokeWidth="1.1" opacity="0.35"/>
                      <circle cx="7" cy="7" r="3"   stroke="#2563EB" strokeWidth="1.1" strokeDasharray="1.8 1.5" opacity="0.6"/>
                      <circle cx="7" cy="7" r="1"   fill="#2563EB"/>
                      {/* Sweep arm — wrapped in foreignObject trick won't work; use a div overlay instead */}
                    </svg>
                    {/* CSS-rotated sweep arm */}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      style={{
                        position: "absolute",
                        width: 1.5, height: 7,
                        background: "#2563EB",
                        borderRadius: 1,
                        transformOrigin: "50% 100%",
                        marginTop: -14,
                      }}
                    />
                  </div>
                  <span style={{ fontSize: 9.5, fontWeight: 800, color: "#2563EB", textTransform: "uppercase", letterSpacing: "0.11em" }}>IP Scanning</span>
                </div>
                <PulseDot color="#22C55E" />
              </div>

              {/* IP address — visible immediately, crossfades on change */}
              <div style={{ height: 22, overflow: "hidden", marginBottom: 8 }}>
                <motion.div
                  key={ipKey}
                  initial={ipKey === 0 ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ fontFamily: "monospace", fontSize: 15, fontWeight: 800, color: "#0F172A" }}
                >
                  {IPS[ipIdx]}
                </motion.div>
              </div>

              {/* Progress bar */}
              <div style={{ height: 4, borderRadius: 99, background: "rgba(37,99,235,0.10)", overflow: "hidden", marginBottom: 8 }}>
                <motion.div
                  animate={{ width: scanning ? `${scanPct}%` : "100%" }}
                  transition={{ duration: 0.08 }}
                  style={{ height: "100%", borderRadius: 99, background: "linear-gradient(90deg,#2563EB,#60A5FA)" }}
                />
              </div>

              <span style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: scanning ? "#F59E0B" : "#22C55E" }}>
                {scanning ? "● Scanning…" : "● Active"}
              </span>
            </div>
          </div>
        </Float>
      </div>

      {/* ══════════════════════════════════════
          CARD 2 — ENCRYPTION  (left-center)
      ══════════════════════════════════════ */}
      <div style={{ position: "absolute", top: "32%", left: "0%", zIndex: 30 }}>
        <Float dy={7} dur={3.8} delay={1.2}>
          <div style={glassCard("#7C3AED")}>
            <AccentBar color="#7C3AED" />
            <div style={{ padding: "14px 18px", minWidth: 156 }}>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: 9.5, fontWeight: 800, color: "#7C3AED", textTransform: "uppercase", letterSpacing: "0.11em" }}>Encryption</span>
                <PulseDot color="#22C55E" delay={0.6} />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                {/* Glowing lock box */}
                <motion.div
                  animate={{ boxShadow: [
                    "0 0 0px rgba(124,58,237,0)",
                    "0 0 16px rgba(124,58,237,0.75)",
                    "0 0 0px rgba(124,58,237,0)",
                  ]}}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                  style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(124,58,237,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
                >
                  <svg width="14" height="16" viewBox="0 0 14 16" fill="none">
                    <rect x="1.5" y="7" width="11" height="8.5" rx="2.2" stroke="#7C3AED" strokeWidth="1.4"/>
                    <path d="M4 7V5a3 3 0 0 1 6 0v2" stroke="#7C3AED" strokeWidth="1.4" strokeLinecap="round"/>
                    <circle cx="7" cy="11.2" r="1.3" fill="#7C3AED"/>
                  </svg>
                </motion.div>
                <div>
                  <div style={{ fontFamily: "monospace", fontSize: 16, fontWeight: 900, color: "#0F172A", lineHeight: 1 }}>AES-256</div>
                  <div style={{ fontSize: 9, color: "#9CA3AF", fontWeight: 600, marginTop: 3 }}>256-bit key</div>
                </div>
              </div>

              {/* Strength bar — animates in once on load */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 8.5, color: "#9CA3AF", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em" }}>Strength</span>
                  <span style={{ fontSize: 8.5, color: "#7C3AED", fontWeight: 800 }}>100%</span>
                </div>
                <div style={{ height: 5, borderRadius: 99, background: "rgba(124,58,237,0.10)", overflow: "hidden" }}>
                  {mounted && (
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      style={{ height: "100%", borderRadius: 99, background: "linear-gradient(90deg,#7C3AED,#A78BFA)" }}
                    />
                  )}
                </div>
              </div>

            </div>
          </div>
        </Float>
      </div>

      {/* ══════════════════════════════════════
          CARD 3 — PACKETS  (right-center)
      ══════════════════════════════════════ */}
      <div style={{ position: "absolute", top: "47%", right: "0%", zIndex: 30, transform: "translateY(-50%)" }}>
        <Float dy={9} dur={3.4} delay={0.8}>
          <div style={glassCard("#0EA5E9")}>
            <AccentBar color="#0EA5E9" />
            <div style={{ padding: "14px 18px", minWidth: 156 }}>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 9.5, fontWeight: 800, color: "#0EA5E9", textTransform: "uppercase", letterSpacing: "0.11em" }}>Packets</span>
                <span style={{ fontSize: 10, fontWeight: 800, color: "#22C55E", display: "flex", alignItems: "center", gap: 2 }}>
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <path d="M1 6L4 2L7 6" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  12.5%
                </span>
              </div>

              {/* Live counter — flashes on update */}
              <motion.div
                animate={{ color: pktFlash ? "#0EA5E9" : "#0F172A" }}
                transition={{ duration: 0.2 }}
                style={{ fontSize: 28, fontWeight: 900, lineHeight: 1, marginBottom: 10 }}
              >
                {PKT_VALS[pktIdx]}
              </motion.div>

              {/* Animated bars */}
              <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 34 }}>
                {bars.map((h, i) => (
                  <motion.div key={i}
                    animate={{ height: h * 3.6 }}
                    initial={{ height: BAR_BASE[i] * 3.6 }}
                    transition={{ duration: 0.5, ease: "easeInOut", delay: i * 0.03 }}
                    style={{ flex: 1, borderRadius: 3, background: `linear-gradient(180deg,#0EA5E9,rgba(14,165,233,${0.25 + h * 0.07}))` }}
                  />
                ))}
              </div>

            </div>
          </div>
        </Float>
      </div>

      {/* ══════════════════════════════════════
          CARD 4 — TERMINAL  (bottom-left)
      ══════════════════════════════════════ */}
      <div style={{ position: "absolute", top: "63%", left: "0%", zIndex: 30 }}>
        <Float dy={6} dur={4.8} delay={0.3}>
          <div style={{
            background: "rgba(8,12,24,0.97)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(59,130,246,0.25)",
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: "0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(59,130,246,0.12), 0 0 28px rgba(37,99,235,0.08)",
            minWidth: 208,
          }}>
            {/* macOS title bar */}
            <div style={{ padding: "8px 12px", background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", gap: 6 }}>
              {(["#FF5F57","#FEBC2E","#28C840"] as const).map((c, i) => (
                <span key={i} style={{ width: 9, height: 9, borderRadius: "50%", background: c, display: "block" }} />
              ))}
              <span style={{ fontSize: 9, color: "rgba(255,255,255,0.28)", fontFamily: "monospace", marginLeft: 5 }}>twh@kali — bash</span>
            </div>

            {/* Terminal lines */}
            <div style={{ padding: "10px 14px", minHeight: 112, overflow: "hidden" }}>

              {/* Completed lines */}
              {doneLines.map(({ seg, text }, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.14 }}
                  style={{ fontFamily: "monospace", fontSize: 11, lineHeight: 1.85, display: "flex", gap: 0, flexWrap: "nowrap" }}
                >
                  {seg.kind === "cmd" ? (
                    <>
                      <span style={{ color: "#22C55E", fontWeight: 700, flexShrink: 0, marginRight: 4 }}>{seg.prompt}</span>
                      <span style={{ color: seg.color }}>{text}</span>
                    </>
                  ) : (
                    <span style={{ color: seg.color, fontWeight: seg.bold ? 700 : 400, paddingLeft: 4 }}>{text}</span>
                  )}
                </motion.div>
              ))}

              {/* Currently typing line */}
              {activeSeg && (
                <div style={{ fontFamily: "monospace", fontSize: 11, lineHeight: 1.85, display: "flex", flexWrap: "nowrap" }}>
                  {activeSeg.kind === "cmd" ? (
                    <>
                      <span style={{ color: "#22C55E", fontWeight: 700, flexShrink: 0, marginRight: 4 }}>{activeSeg.prompt}</span>
                      <span style={{ color: activeSeg.color }}>{activeText}</span>
                    </>
                  ) : (
                    <span style={{ color: activeSeg.color, paddingLeft: 4 }}>{activeText}</span>
                  )}
                  {/* blinking cursor */}
                  <motion.span
                    animate={{ opacity: [1, 1, 0, 0] }}
                    transition={{ duration: 1.04, repeat: Infinity, ease: "linear", times: [0, 0.48, 0.5, 0.98] }}
                    style={{ color: "#3B82F6", fontWeight: 900, fontSize: 12, marginLeft: 1, filter: "drop-shadow(0 0 5px #3B82F6)" }}
                  >▋</motion.span>
                </div>
              )}

              {/* Idle cursor when nothing is typing */}
              {!activeSeg && doneLines.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  style={{ fontFamily: "monospace", fontSize: 11, lineHeight: 1.85, display: "flex", gap: 4, alignItems: "center" }}
                >
                  <motion.span
                    animate={{ textShadow: ["0 0 0px #22C55E", "0 0 8px #22C55E, 0 0 18px rgba(34,197,94,0.45)", "0 0 0px #22C55E"] }}
                    transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                    style={{ color: "#22C55E", fontWeight: 700 }}
                  >root@kali:~$</motion.span>
                  <motion.span
                    animate={{ opacity: [1, 1, 0, 0] }}
                    transition={{ duration: 1.04, repeat: Infinity, ease: "linear", times: [0, 0.48, 0.5, 0.98] }}
                    style={{ color: "#3B82F6", fontWeight: 900, fontSize: 12, filter: "drop-shadow(0 0 6px #3B82F6) drop-shadow(0 0 12px rgba(59,130,246,0.5))" }}
                  >▋</motion.span>
                </motion.div>
              )}
            </div>
          </div>
        </Float>
      </div>

      {/* ══════════════════════════════════════
          CARD 5 — ACCESS GRANTED  (bottom)
      ══════════════════════════════════════ */}
      <div style={{ position: "absolute", top: "77%", left: "50%", transform: "translateX(-50%)", zIndex: 30, whiteSpace: "nowrap" }}>
        <Float dy={6} dur={3.8} delay={1.5}>
          <div style={{ position: "relative", display: "inline-block" }}>
            {/* Triple ripple rings */}
            {[0, 1, 2].map(i => (
              <motion.div key={i}
                animate={{ scale: [1, 1.45 + i * 0.22, 1], opacity: [0.45 - i * 0.1, 0, 0.45 - i * 0.1] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut", delay: i * 0.38 }}
                style={{
                  position: "absolute", inset: -(5 + i * 8),
                  borderRadius: 999,
                  border: `1.5px solid rgba(22,163,74,${0.48 - i * 0.1})`,
                  pointerEvents: "none",
                }}
              />
            ))}

            {/* Badge */}
            <motion.div
              animate={{ boxShadow: [
                "0 4px 18px rgba(22,163,74,0.18), 0 0 0 1px rgba(22,163,74,0.22)",
                "0 4px 36px rgba(22,163,74,0.55), 0 0 0 1px rgba(22,163,74,0.50)",
                "0 4px 18px rgba(22,163,74,0.18), 0 0 0 1px rgba(22,163,74,0.22)",
              ]}}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 20px", borderRadius: 999,
                background: "rgba(255,255,255,0.97)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(22,163,74,0.30)",
              }}
            >
              <motion.div
                animate={{ scale: [1, 1.22, 1], background: ["#16A34A", "#22C55E", "#16A34A"] as string[] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                style={{ width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
              >
                <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                  <path d="M1 5L4.5 8.5L11 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 900, color: "#15803D", textTransform: "uppercase", letterSpacing: "0.12em", lineHeight: 1 }}>
                  Access Granted
                </div>
                <div style={{ fontSize: 8.5, color: "#86EFAC", fontWeight: 600, marginTop: 2, letterSpacing: "0.05em" }}>
                  Authentication complete
                </div>
              </div>
            </motion.div>
          </div>
        </Float>
      </div>

    </div>
  );
}
