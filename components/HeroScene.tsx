"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

/* ─────────────────────────────────────────
   GLASS CARD — dark frosted glass
   lets the hero image bleed through
───────────────────────────────────────── */
const glass = (accentRgb: string): React.CSSProperties => ({
  background: "rgba(6, 9, 22, 0.48)",
  backdropFilter: "blur(22px) saturate(1.6)",
  WebkitBackdropFilter: "blur(22px) saturate(1.6)",
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,0.09)",
  boxShadow: `0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06), 0 0 0 1px rgba(${accentRgb},0.12)`,
  overflow: "hidden",
  position: "relative",
});

/* Hairline top accent — 1 px, not a chunky bar */
const TopLine = ({ color }: { color: string }) => (
  <div style={{
    position: "absolute", top: 0, left: 0, right: 0, height: 1,
    background: `linear-gradient(90deg, ${color}cc 0%, ${color}44 60%, transparent 100%)`,
  }} />
);

/* Live dot */
const Dot = ({ color = "#22C55E", delay = 0 }: { color?: string; delay?: number }) => (
  <span style={{ position: "relative", display: "inline-flex", width: 8, height: 8 }}>
    <motion.span
      animate={{ scale: [1, 2.8, 1], opacity: [0.6, 0, 0.6] }}
      transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut", delay }}
      style={{ position: "absolute", inset: 0, borderRadius: "50%", background: color, opacity: 0.5 }}
    />
    <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, position: "relative", flexShrink: 0 }} />
  </span>
);

/* Float wrapper */
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

/* Slide-in on mount */
function Enter({ from, delay, children }: {
  from: "left" | "right" | "bottom"; delay: number; children: React.ReactNode;
}) {
  const x = from === "left" ? -28 : from === "right" ? 28 : 0;
  const y = from === "bottom" ? 20 : 0;
  return (
    <motion.div
      initial={{ opacity: 0, x, y }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Data ─── */
const IPS      = ["192.168.1.1", "10.0.0.254", "172.16.4.8", "192.168.0.1"];
const BAR_BASE = [3, 5, 4, 7, 6, 8, 5, 9, 7, 8];
const PKT_VALS = ["724K", "731K", "718K", "745K", "712K"];

type TermSegment = {
  kind: "cmd" | "out" | "spin";
  prompt?: string;
  text: string;
  color: string;
  bold?: boolean;
  pauseAfter?: number;
  spinMs?: number;
};
const TERM_SCRIPT: TermSegment[] = [
  { kind: "cmd",  prompt: "root@kali:~$",   text: " nmap -sV 192.168.1.0/24",    color: "#e6edf3", pauseAfter: 60  },
  { kind: "spin", text: "[*] Nmap 7.94 — scanning /24…",     color: "#8b949e", spinMs: 1100, pauseAfter: 40 },
  { kind: "out",  text: "[+] 192.168.1.1 — ssh http https",  color: "#79c0ff", pauseAfter: 50  },
  { kind: "out",  text: "[+] 192.168.1.105 — ftp mysql",     color: "#79c0ff", pauseAfter: 50  },
  { kind: "out",  text: "[+] 192.168.1.200 — http mongo",    color: "#79c0ff", pauseAfter: 50  },
  { kind: "out",  text: "[!] vsftpd 2.3.4 — BACKDOOR!",     color: "#f85149", bold: true, pauseAfter: 100 },
  { kind: "cmd",  prompt: "root@kali:~$",   text: " python3 exploit.py",          color: "#e6edf3", pauseAfter: 60 },
  { kind: "spin", text: "[*] Loading exploit module…",       color: "#8b949e", spinMs: 900, pauseAfter: 40 },
  { kind: "out",  text: "[*] Triggering backdoor…",          color: "#8b949e", pauseAfter: 50  },
  { kind: "spin", text: "[*] Waiting for shell…",            color: "#8b949e", spinMs: 1200, pauseAfter: 40 },
  { kind: "out",  text: "[+] Shell! uid=0(root) gid=0",      color: "#00ff41", bold: true, pauseAfter: 80  },
  { kind: "cmd",  prompt: "root@victim:~$", text: " ls /var/www/html/",           color: "#e6edf3", pauseAfter: 50  },
  { kind: "out",  text: "admin.php config.php uploads/",     color: "#8b949e", pauseAfter: 40  },
  { kind: "cmd",  prompt: "root@victim:~$", text: " grep pass config.php",        color: "#e6edf3", pauseAfter: 60  },
  { kind: "out",  text: '$db_pass = "Sup3r$3cr3t!";',        color: "#ffa657", bold: true, pauseAfter: 80  },
  { kind: "cmd",  prompt: "root@victim:~$", text: " find / -name flag.txt",       color: "#e6edf3", pauseAfter: 50  },
  { kind: "spin", text: "[*] Searching filesystem…",         color: "#8b949e", spinMs: 1000, pauseAfter: 40 },
  { kind: "out",  text: "/root/flag.txt",                    color: "#8b949e", pauseAfter: 40  },
  { kind: "cmd",  prompt: "root@victim:~$", text: " cat /root/flag.txt",          color: "#e6edf3", pauseAfter: 60  },
  { kind: "out",  text: "TWH{pwn3d_by_4fs4r_4l1!}",         color: "#00ff41", bold: true, pauseAfter: 2200 },
];

/* ══════════════════════════════════════════════════════ */

export default function HeroScene() {
  const [mounted, setMounted] = useState(false);

  const [ipIdx,    setIpIdx]    = useState(0);
  const [ipKey,    setIpKey]    = useState(0);
  const [scanPct,  setScanPct]  = useState(100);
  const [scanning, setScanning] = useState(false);

  const [bars,     setBars]     = useState(BAR_BASE);
  const [pktIdx,   setPktIdx]   = useState(0);
  const [pktFlash, setPktFlash] = useState(false);

  type DoneLine = { seg: TermSegment; text: string };
  const MAX_LINES = 6;
  const [doneLines,  setDoneLines]  = useState<DoneLine[]>([]);
  const [activeText, setActiveText] = useState("");
  const [activeSeg,  setActiveSeg]  = useState<TermSegment | null>(null);
  const [spinnerOn,  setSpinnerOn]  = useState(false);
  const SPIN_FRAMES = ["⠋","⠙","⠹","⠸","⠼","⠴","⠦","⠧","⠇","⠏"];
  const [spinFrame,  setSpinFrame]  = useState(0);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    let active = true;
    const tick = () => {
      if (!active) return;
      setScanning(true); setScanPct(0);
      let p = 0;
      const iv = setInterval(() => {
        if (!active) { clearInterval(iv); return; }
        p += 5 + Math.random() * 8;
        setScanPct(Math.min(p, 100));
        if (p >= 100) {
          clearInterval(iv);
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

  useEffect(() => {
    if (!mounted) return;
    let active = true;
    const id = setInterval(() => {
      if (!active) return;
      setBars(BAR_BASE.map(h => Math.max(2, h + Math.floor(Math.random() * 5) - 2)));
      setPktIdx(i => (i + 1) % PKT_VALS.length);
      setPktFlash(true);
      setTimeout(() => { if (active) setPktFlash(false); }, 300);
    }, 1900);
    return () => { active = false; clearInterval(id); };
  }, [mounted]);

  useEffect(() => {
    if (!spinnerOn) return;
    const id = setInterval(() => setSpinFrame(f => (f + 1) % SPIN_FRAMES.length), 80);
    return () => clearInterval(id);
  }, [spinnerOn]);

  useEffect(() => {
    let active = true;
    const T: ReturnType<typeof setTimeout>[] = [];
    const sched = (fn: () => void, ms: number) => {
      const id = setTimeout(() => { if (active) fn(); }, ms);
      T.push(id);
    };
    const pushLine = (seg: TermSegment, text: string) => {
      setDoneLines(prev => {
        const next = [...prev, { seg, text }];
        return next.length > MAX_LINES ? next.slice(next.length - MAX_LINES) : next;
      });
    };
    const runScript = () => {
      if (!active) return;
      setDoneLines([]); setActiveText(""); setActiveSeg(null); setSpinnerOn(false);
      let segIdx = 0;
      const nextSeg = () => {
        if (!active || segIdx >= TERM_SCRIPT.length) { sched(runScript, 1200); return; }
        const seg = TERM_SCRIPT[segIdx++];
        setActiveSeg(seg); setActiveText("");
        if (seg.kind === "spin") {
          setActiveText(seg.text); setSpinnerOn(true);
          sched(() => {
            setSpinnerOn(false); pushLine(seg, seg.text);
            setActiveText(""); setActiveSeg(null);
            sched(nextSeg, seg.pauseAfter ?? 60);
          }, seg.spinMs ?? 800);
        } else if (seg.kind === "out") {
          setActiveText(seg.text);
          sched(() => {
            pushLine(seg, seg.text); setActiveText(""); setActiveSeg(null);
            sched(nextSeg, seg.pauseAfter ?? 60);
          }, 70);
        } else {
          let c = 0;
          const full = seg.text;
          const typeChar = () => {
            if (!active) return;
            c++; setActiveText(full.slice(0, c));
            if (c < full.length) {
              sched(typeChar, 28 + Math.random() * 22);
            } else {
              sched(() => {
                pushLine(seg, full); setActiveText(""); setActiveSeg(null);
                sched(nextSeg, seg.pauseAfter ?? 80);
              }, 140);
            }
          };
          sched(typeChar, 30);
        }
      };
      nextSeg();
    };
    sched(runScript, 100);
    return () => { active = false; T.forEach(clearTimeout); };
  }, []);

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
            animate={{ scale: [1, 1.08, 1], opacity: [0.35, 0.03, 0.35] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            style={{ position: "absolute", inset: -10, borderRadius: "50%", border: "1.5px solid rgba(124,58,237,0.50)" }}
          />
          <motion.div
            animate={{ scale: [1, 1.14, 1], opacity: [0.15, 0.02, 0.15] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            style={{ position: "absolute", inset: -24, borderRadius: "50%", border: "1px solid rgba(99,102,241,0.28)" }}
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
          background: i % 2 === 0 ? "rgba(96,165,250,0.7)" : "rgba(192,132,252,0.55)",
          pointerEvents: "none", zIndex: 1,
        }}
          animate={{ opacity: [0.15, 0.85, 0.15], scale: [1, 1.6, 1] }}
          transition={{ duration: 2.0 + (i % 5) * 0.45, repeat: Infinity, delay: (i * 0.17) % 3 }}
        />
      ))}

      {/* ── CARD 1 — IP SCANNING (top-right) ── */}
      <div style={{ position: "absolute", top: "4%", right: "1%", zIndex: 30 }}>
        <Enter from="right" delay={0.3}>
          <Float dy={7} dur={4.4} delay={0.5}>
            <div style={{ ...glass("59,130,246"), minWidth: 168 }}>
              <TopLine color="#3B82F6" />
              <div style={{ padding: "13px 16px" }}>

                {/* header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 11 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {/* radar icon */}
                    <div style={{ position: "relative", width: 26, height: 26, borderRadius: 8, background: "rgba(59,130,246,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                        <circle cx="6.5" cy="6.5" r="5" stroke="#3B82F6" strokeWidth="1" opacity="0.4"/>
                        <circle cx="6.5" cy="6.5" r="2.8" stroke="#3B82F6" strokeWidth="1" strokeDasharray="1.6 1.4" opacity="0.65"/>
                        <circle cx="6.5" cy="6.5" r="1" fill="#3B82F6"/>
                      </svg>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
                        style={{ position: "absolute", width: 1.5, height: 6, background: "linear-gradient(to top, #3B82F6, transparent)", borderRadius: 1, transformOrigin: "50% 100%", bottom: "50%", left: "calc(50% - 0.75px)" }}
                      />
                    </div>
                    <span style={{ fontSize: 9, fontWeight: 700, color: "rgba(147,197,253,0.85)", textTransform: "uppercase", letterSpacing: "0.12em" }}>IP Scanning</span>
                  </div>
                  <Dot color="#22C55E" />
                </div>

                {/* IP */}
                <div style={{ height: 20, overflow: "hidden", marginBottom: 9 }}>
                  <motion.div
                    key={ipKey}
                    initial={ipKey === 0 ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.28 }}
                    style={{ fontFamily: "monospace", fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.92)", letterSpacing: "0.02em" }}
                  >
                    {IPS[ipIdx]}
                  </motion.div>
                </div>

                {/* bar */}
                <div style={{ height: 3, borderRadius: 99, background: "rgba(59,130,246,0.14)", overflow: "hidden", marginBottom: 9 }}>
                  <motion.div
                    animate={{ width: scanning ? `${scanPct}%` : "100%" }}
                    transition={{ duration: 0.07 }}
                    style={{ height: "100%", borderRadius: 99, background: "linear-gradient(90deg,#3B82F6,#93C5FD)" }}
                  />
                </div>

                <span style={{ fontSize: 8.5, fontWeight: 600, letterSpacing: "0.07em", color: scanning ? "#FCD34D" : "#4ADE80" }}>
                  {scanning ? "● Scanning…" : "● Active"}
                </span>
              </div>
            </div>
          </Float>
        </Enter>
      </div>

      {/* ── CARD 2 — ENCRYPTION (left-center) ── */}
      <div style={{ position: "absolute", top: "30%", left: "1%", zIndex: 30 }}>
        <Enter from="left" delay={0.5}>
          <Float dy={7} dur={3.9} delay={1.2}>
            <div style={{ ...glass("139,92,246"), minWidth: 152 }}>
              <TopLine color="#8B5CF6" />
              <div style={{ padding: "13px 16px" }}>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <span style={{ fontSize: 9, fontWeight: 700, color: "rgba(196,181,253,0.85)", textTransform: "uppercase", letterSpacing: "0.12em" }}>Encryption</span>
                  <Dot color="#22C55E" delay={0.6} />
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 11 }}>
                  <motion.div
                    animate={{ boxShadow: [
                      "0 0 0 rgba(139,92,246,0)",
                      "0 0 14px rgba(139,92,246,0.65)",
                      "0 0 0 rgba(139,92,246,0)",
                    ]}}
                    transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                    style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(139,92,246,0.18)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "1px solid rgba(139,92,246,0.25)" }}
                  >
                    <svg width="13" height="15" viewBox="0 0 13 15" fill="none">
                      <rect x="1.5" y="6.5" width="10" height="7.5" rx="2" stroke="#A78BFA" strokeWidth="1.3"/>
                      <path d="M3.5 6.5V4.8a3 3 0 0 1 6 0v1.7" stroke="#A78BFA" strokeWidth="1.3" strokeLinecap="round"/>
                      <circle cx="6.5" cy="10.3" r="1.2" fill="#A78BFA"/>
                    </svg>
                  </motion.div>
                  <div>
                    <div style={{ fontFamily: "monospace", fontSize: 15, fontWeight: 800, color: "rgba(255,255,255,0.92)", lineHeight: 1 }}>AES-256</div>
                    <div style={{ fontSize: 8.5, color: "rgba(196,181,253,0.55)", fontWeight: 500, marginTop: 3 }}>256-bit key</div>
                  </div>
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 8, color: "rgba(255,255,255,0.35)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em" }}>Strength</span>
                    <span style={{ fontSize: 8, color: "#A78BFA", fontWeight: 700 }}>100%</span>
                  </div>
                  <div style={{ height: 3, borderRadius: 99, background: "rgba(139,92,246,0.15)", overflow: "hidden" }}>
                    {mounted && (
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        style={{ height: "100%", borderRadius: 99, background: "linear-gradient(90deg,#7C3AED,#C4B5FD)" }}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Float>
        </Enter>
      </div>

      {/* ── CARD 3 — PACKETS (right-center) ── */}
      <div style={{ position: "absolute", top: "46%", right: "1%", zIndex: 30, transform: "translateY(-50%)" }}>
        <Enter from="right" delay={0.6}>
          <Float dy={8} dur={3.5} delay={0.8}>
            <div style={{ ...glass("6,182,212"), minWidth: 148 }}>
              <TopLine color="#06B6D4" />
              <div style={{ padding: "13px 16px" }}>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 9, fontWeight: 700, color: "rgba(103,232,249,0.85)", textTransform: "uppercase", letterSpacing: "0.12em" }}>Packets</span>
                  <span style={{ fontSize: 9, fontWeight: 700, color: "#4ADE80", display: "flex", alignItems: "center", gap: 2 }}>
                    <svg width="7" height="7" viewBox="0 0 7 7" fill="none">
                      <path d="M1 5.5L3.5 2L6 5.5" stroke="#4ADE80" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    12.5%
                  </span>
                </div>

                <motion.div
                  animate={{ color: pktFlash ? "#22D3EE" : "rgba(255,255,255,0.92)" }}
                  transition={{ duration: 0.2 }}
                  style={{ fontSize: 26, fontWeight: 800, lineHeight: 1, marginBottom: 9, fontVariantNumeric: "tabular-nums" }}
                >
                  {PKT_VALS[pktIdx]}
                </motion.div>

                <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 32 }}>
                  {bars.map((h, i) => (
                    <motion.div key={i}
                      animate={{ height: h * 3.4 }}
                      initial={{ height: BAR_BASE[i] * 3.4 }}
                      transition={{ duration: 0.5, ease: "easeInOut", delay: i * 0.03 }}
                      style={{ flex: 1, borderRadius: 3, background: `linear-gradient(180deg,#06B6D4,rgba(6,182,212,${0.2 + h * 0.06}))` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </Float>
        </Enter>
      </div>

      {/* ── CARD 4 — TERMINAL (bottom-left) ── */}
      <div style={{ position: "absolute", top: "63%", left: "1%", zIndex: 30 }}>
        <Enter from="left" delay={0.4}>
          <Float dy={5} dur={4.9} delay={0.3}>
            <div style={{ position: "relative" }}>
              {/* Outer green glow */}
              <motion.div
                animate={{ opacity: [0.4, 0.75, 0.4] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  position: "absolute", inset: -1, borderRadius: 13, pointerEvents: "none",
                  boxShadow: "0 0 16px 2px rgba(0,255,65,0.18), 0 0 36px 4px rgba(0,255,65,0.06)",
                }}
              />
              <div style={{
                background: "rgba(6, 10, 18, 0.72)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(0,255,65,0.22)",
                borderRadius: 13,
                overflow: "hidden",
                width: 230,
                boxShadow: "0 16px 48px rgba(0,0,0,0.7)",
              }}>
                {/* Title bar */}
                <div style={{
                  padding: "6px 11px",
                  background: "rgba(0,0,0,0.35)",
                  borderBottom: "1px solid rgba(0,255,65,0.10)",
                  display: "flex", alignItems: "center", gap: 6,
                }}>
                  {(["#FF5F57","#FEBC2E","#28C840"] as const).map((c, i) => (
                    <span key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: c, display: "block", flexShrink: 0, opacity: 0.85 }} />
                  ))}
                  <span style={{ fontSize: 9.5, color: "rgba(0,255,65,0.45)", fontFamily: "monospace", marginLeft: 4 }}>root@kali: ~</span>
                  <span style={{ marginLeft: "auto", fontSize: 8.5, color: "rgba(0,255,65,0.22)", fontFamily: "monospace" }}>bash</span>
                </div>

                {/* Screen */}
                <div style={{ position: "relative", padding: "8px 10px 10px", minHeight: 110, overflow: "hidden" }}>
                  {/* Scanlines */}
                  <div style={{
                    position: "absolute", inset: 0, pointerEvents: "none", zIndex: 10,
                    backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.14) 2px,rgba(0,0,0,0.14) 4px)",
                  }} />

                  {/* Done lines */}
                  {doneLines.map(({ seg, text }, i) => (
                    <div key={i} style={{
                      fontFamily: "'Courier New',monospace",
                      fontSize: 9.5, lineHeight: 1.7,
                      display: "flex", flexWrap: "nowrap", whiteSpace: "nowrap",
                      animation: "fadeIn 0.1s ease-out",
                    }}>
                      {seg.kind === "cmd" ? (
                        <>
                          <span style={{ color: "#00ff41", fontWeight: 700, flexShrink: 0, marginRight: 4, textShadow: "0 0 6px rgba(0,255,65,0.6)" }}>{seg.prompt}</span>
                          <span style={{ color: "#c9d1d9" }}>{text}</span>
                        </>
                      ) : (
                        <span style={{ color: seg.color, fontWeight: seg.bold ? 700 : 400, textShadow: seg.bold ? `0 0 8px ${seg.color}80` : "none" }}>{text}</span>
                      )}
                    </div>
                  ))}

                  {/* Active line */}
                  {activeSeg && (
                    <div style={{
                      fontFamily: "'Courier New',monospace",
                      fontSize: 9.5, lineHeight: 1.7,
                      display: "flex", flexWrap: "nowrap", whiteSpace: "nowrap", alignItems: "center",
                    }}>
                      {activeSeg.kind === "cmd" ? (
                        <>
                          <span style={{ color: "#00ff41", fontWeight: 700, flexShrink: 0, marginRight: 4, textShadow: "0 0 6px rgba(0,255,65,0.6)" }}>{activeSeg.prompt}</span>
                          <span style={{ color: "#c9d1d9" }}>{activeText}</span>
                          <motion.span
                            animate={{ opacity: [1, 0, 1] }}
                            transition={{ duration: 1, repeat: Infinity, ease: "steps(1)" }}
                            style={{ display: "inline-block", width: 6, height: 11, background: "#00ff41", marginLeft: 1, verticalAlign: "middle", boxShadow: "0 0 5px rgba(0,255,65,0.8)" }}
                          />
                        </>
                      ) : activeSeg.kind === "spin" ? (
                        <>
                          <span style={{ color: "#00ff41", marginRight: 5, fontWeight: 700, fontSize: 10 }}>{SPIN_FRAMES[spinFrame]}</span>
                          <span style={{ color: "#8b949e" }}>{activeText}</span>
                        </>
                      ) : (
                        <span style={{ color: activeSeg.color }}>{activeText}</span>
                      )}
                    </div>
                  )}

                  {/* Idle prompt */}
                  {!activeSeg && doneLines.length === 0 && (
                    <div style={{ fontFamily: "'Courier New',monospace", fontSize: 9.5, lineHeight: 1.7, display: "flex", alignItems: "center", whiteSpace: "nowrap" }}>
                      <span style={{ color: "#00ff41", fontWeight: 700, textShadow: "0 0 7px rgba(0,255,65,0.7)" }}>root@kali:~$</span>
                      <motion.span
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 1, repeat: Infinity, ease: "steps(1)" }}
                        style={{ display: "inline-block", width: 6, height: 11, background: "#00ff41", marginLeft: 5, verticalAlign: "middle", boxShadow: "0 0 6px rgba(0,255,65,0.9)" }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Float>
        </Enter>
      </div>

      {/* ── CARD 5 — ACCESS GRANTED (bottom-center) ── */}
      <div style={{ position: "absolute", top: "78%", left: "50%", transform: "translateX(-50%)", zIndex: 30, whiteSpace: "nowrap" }}>
        <Enter from="bottom" delay={0.7}>
          <Float dy={5} dur={3.9} delay={1.5}>
            <div style={{ position: "relative", display: "inline-flex" }}>
              {/* Ripple rings */}
              {[0, 1].map(i => (
                <motion.div key={i}
                  animate={{ scale: [1, 1.5 + i * 0.25, 1], opacity: [0.35 - i * 0.1, 0, 0.35 - i * 0.1] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut", delay: i * 0.45 }}
                  style={{
                    position: "absolute", inset: -(6 + i * 9),
                    borderRadius: 999,
                    border: `1px solid rgba(16,185,129,${0.4 - i * 0.12})`,
                    pointerEvents: "none",
                  }}
                />
              ))}

              {/* Badge */}
              <motion.div
                animate={{ boxShadow: [
                  "0 4px 20px rgba(16,185,129,0.15), inset 0 1px 0 rgba(255,255,255,0.05)",
                  "0 4px 32px rgba(16,185,129,0.42), inset 0 1px 0 rgba(255,255,255,0.07)",
                  "0 4px 20px rgba(16,185,129,0.15), inset 0 1px 0 rgba(255,255,255,0.05)",
                ]}}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  display: "flex", alignItems: "center", gap: 9,
                  padding: "9px 18px", borderRadius: 999,
                  background: "rgba(6, 12, 24, 0.60)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "1px solid rgba(16,185,129,0.25)",
                }}
              >
                <motion.div
                  animate={{ scale: [1, 1.18, 1] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(16,185,129,0.2)", border: "1.5px solid rgba(16,185,129,0.6)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
                >
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.8 7L9 1" stroke="#34D399" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </motion.div>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 800, color: "#34D399", textTransform: "uppercase", letterSpacing: "0.14em", lineHeight: 1 }}>
                    Access Granted
                  </div>
                  <div style={{ fontSize: 8, color: "rgba(52,211,153,0.5)", fontWeight: 500, marginTop: 2.5, letterSpacing: "0.04em" }}>
                    Authentication complete
                  </div>
                </div>
              </motion.div>
            </div>
          </Float>
        </Enter>
      </div>

    </div>
  );
}
