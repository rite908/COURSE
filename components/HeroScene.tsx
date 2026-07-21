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
/* ── Terminal script ── */
type TermSegment = {
  kind: "cmd" | "out" | "spin"; // spin = spinner then instant output
  prompt?: string;
  text: string;
  color: string;
  bold?: boolean;
  pauseAfter?: number;
  spinMs?: number; // how long spinner runs before line appears
};
const TERM_SCRIPT: TermSegment[] = [
  /* ── Scene 1: nmap scan ── */
  { kind: "cmd",  prompt: "root@kali:~$",          text: " nmap -sV -T4 192.168.1.0/24",          color: "#e6edf3", pauseAfter: 60  },
  { kind: "spin", text: "[*] Starting Nmap 7.94 — scanning /24…",                                  color: "#8b949e", spinMs: 1100, pauseAfter: 40 },
  { kind: "out",  text: "[+] 192.168.1.1 — 22/ssh 80/http 443/https",                              color: "#79c0ff", pauseAfter: 50  },
  { kind: "out",  text: "[+] 192.168.1.105 — 21/ftp 3306/mysql",                                  color: "#79c0ff", pauseAfter: 50  },
  { kind: "out",  text: "[+] 192.168.1.200 — 8080/http 27017/mongo",                              color: "#79c0ff", pauseAfter: 50  },
  { kind: "out",  text: "[!] vsftpd 2.3.4 — BACKDOOR CVE-2011-2523",                              color: "#f85149", bold: true, pauseAfter: 100 },

  /* ── Scene 2: exploit ── */
  { kind: "cmd",  prompt: "root@kali:~$",          text: " python3 exploit.py 192.168.1.105",          color: "#e6edf3", pauseAfter: 60 },
  { kind: "spin", text: "[*] Loading vsftpd_234_backdoor exploit…",                                color: "#8b949e", spinMs: 900, pauseAfter: 40 },
  { kind: "out",  text: "[*] Triggering backdoor on port 6200…",                                   color: "#8b949e", pauseAfter: 50  },
  { kind: "spin", text: "[*] Waiting for shell…",                                                  color: "#8b949e", spinMs: 1200, pauseAfter: 40 },
  { kind: "out",  text: "[+] Shell opened!  uid=0(root) gid=0(root)",                              color: "#00ff41", bold: true, pauseAfter: 80  },

  /* ── Scene 3: recon ── */
  { kind: "cmd",  prompt: "root@192.168.1.105:~$", text: " ls -la /var/www/html/",                 color: "#e6edf3", pauseAfter: 50  },
  { kind: "out",  text: "drwxr-xr-x  admin.php  config.php  uploads/",                             color: "#8b949e", pauseAfter: 40  },
  { kind: "cmd",  prompt: "root@192.168.1.105:~$", text: " cat config.php | grep pass",            color: "#e6edf3", pauseAfter: 60  },
  { kind: "out",  text: "$db_pass = \"Sup3r$3cr3t!\";",                                            color: "#ffa657", bold: true, pauseAfter: 80  },

  /* ── Scene 4: flag ── */
  { kind: "cmd",  prompt: "root@192.168.1.105:~$", text: " find / -name flag.txt 2>/dev/null",     color: "#e6edf3", pauseAfter: 50  },
  { kind: "spin", text: "[*] Searching filesystem…",                                               color: "#8b949e", spinMs: 1000, pauseAfter: 40 },
  { kind: "out",  text: "/root/flag.txt",                                                           color: "#8b949e", pauseAfter: 40  },
  { kind: "cmd",  prompt: "root@192.168.1.105:~$", text: " cat /root/flag.txt",                    color: "#e6edf3", pauseAfter: 60  },
  { kind: "out",  text: "TWH{pwn3d_by_4fs4r_4l1!}",                                               color: "#00ff41", bold: true, pauseAfter: 2200 },
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
  const MAX_LINES = 8;
  const [doneLines,  setDoneLines]  = useState<DoneLine[]>([]);
  const [activeText, setActiveText] = useState("");
  const [activeSeg,  setActiveSeg]  = useState<TermSegment | null>(null);
  const [spinnerOn,  setSpinnerOn]  = useState(false);
  const SPIN_FRAMES = ["⠋","⠙","⠹","⠸","⠼","⠴","⠦","⠧","⠇","⠏"];
  const [spinFrame,  setSpinFrame]  = useState(0);


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

  /* ── Spinner frame ticker ── */
  useEffect(() => {
    if (!spinnerOn) return;
    const id = setInterval(() => setSpinFrame(f => (f + 1) % SPIN_FRAMES.length), 80);
    return () => clearInterval(id);
  }, [spinnerOn]);

  /* ── Terminal — starts immediately on client mount ── */
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
      setDoneLines([]);
      setActiveText("");
      setActiveSeg(null);
      setSpinnerOn(false);

      let segIdx = 0;

      const nextSeg = () => {
        if (!active || segIdx >= TERM_SCRIPT.length) {
          sched(runScript, 1200);
          return;
        }
        const seg = TERM_SCRIPT[segIdx++];
        setActiveSeg(seg);
        setActiveText("");

        if (seg.kind === "spin") {
          /* show text immediately + spinner, then commit after spinMs */
          setActiveText(seg.text);
          setSpinnerOn(true);
          sched(() => {
            setSpinnerOn(false);
            pushLine(seg, seg.text);
            setActiveText("");
            setActiveSeg(null);
            sched(nextSeg, seg.pauseAfter ?? 60);
          }, seg.spinMs ?? 800);

        } else if (seg.kind === "out") {
          setActiveText(seg.text);
          sched(() => {
            pushLine(seg, seg.text);
            setActiveText("");
            setActiveSeg(null);
            sched(nextSeg, seg.pauseAfter ?? 60);
          }, 70);

        } else {
          /* cmd — type char-by-char */
          let c = 0;
          const full = seg.text;
          const typeChar = () => {
            if (!active) return;
            c++;
            setActiveText(full.slice(0, c));
            if (c < full.length) {
              sched(typeChar, 28 + Math.random() * 22);
            } else {
              sched(() => {
                pushLine(seg, full);
                setActiveText("");
                setActiveSeg(null);
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
          {/* Outer glow ring */}
          <div style={{ position: "relative" }}>
            <motion.div
              animate={{ opacity: [0.5, 0.9, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              style={{
                position: "absolute", inset: -1, borderRadius: 12,
                boxShadow: "0 0 18px 2px rgba(0,255,65,0.25), 0 0 40px 4px rgba(0,255,65,0.08)",
                pointerEvents: "none",
              }}
            />
            <div style={{
              background: "#0d1117",
              border: "1px solid rgba(0,255,65,0.35)",
              borderRadius: 12,
              overflow: "hidden",
              width: 320,
              boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
              animation: "termFlicker 8s ease-in-out infinite",
            }}>
              {/* Title bar */}
              <div style={{
                padding: "7px 12px",
                background: "#161b22",
                borderBottom: "1px solid rgba(0,255,65,0.15)",
                display: "flex", alignItems: "center", gap: 6,
              }}>
                {(["#FF5F57","#FEBC2E","#28C840"] as const).map((c, i) => (
                  <span key={i} style={{ width: 9, height: 9, borderRadius: "50%", background: c, display: "block", flexShrink: 0 }} />
                ))}
                <span style={{
                  fontSize: 10, color: "rgba(0,255,65,0.55)",
                  fontFamily: "monospace", marginLeft: 4, letterSpacing: "0.04em",
                }}>root@kali: ~</span>
                <span style={{ marginLeft: "auto", fontSize: 9, color: "rgba(0,255,65,0.25)", fontFamily: "monospace" }}>bash</span>
              </div>

              {/* Screen area */}
              <div style={{ position: "relative", padding: "10px 14px 12px", minHeight: 130, overflow: "hidden" }}>

                {/* CRT scanlines overlay */}
                <div style={{
                  position: "absolute", inset: 0, pointerEvents: "none", zIndex: 10,
                  backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.18) 2px, rgba(0,0,0,0.18) 4px)",
                }} />

                {/* Completed lines */}
                {doneLines.map(({ seg, text }, i) => (
                  <div key={i} style={{
                    fontFamily: "'Courier New', Courier, monospace",
                    fontSize: 11, lineHeight: 1.8,
                    display: "flex", flexWrap: "nowrap", whiteSpace: "nowrap",
                    animation: "fadeIn 0.12s ease-out",
                  }}>
                    {seg.kind === "cmd" ? (
                      <>
                        <span style={{
                          color: "#00ff41", fontWeight: 700, flexShrink: 0, marginRight: 4,
                          textShadow: "0 0 6px rgba(0,255,65,0.7)",
                        }}>{seg.prompt}</span>
                        <span style={{ color: "#e6edf3" }}>{text}</span>
                      </>
                    ) : (
                      <span style={{
                        color: seg.color,
                        fontWeight: seg.bold ? 700 : 400,
                        textShadow: seg.bold ? `0 0 10px ${seg.color}` : "none",
                      }}>{text}</span>
                    )}
                  </div>
                ))}

                {/* Active line: typing (cmd) or spinner (spin) or instant (out) */}
                {activeSeg && (
                  <div style={{
                    fontFamily: "'Courier New', Courier, monospace",
                    fontSize: 11, lineHeight: 1.8,
                    display: "flex", flexWrap: "nowrap", whiteSpace: "nowrap",
                    alignItems: "center",
                  }}>
                    {activeSeg.kind === "cmd" ? (
                      <>
                        <span style={{
                          color: "#00ff41", fontWeight: 700, flexShrink: 0, marginRight: 4,
                          textShadow: "0 0 6px rgba(0,255,65,0.7)",
                        }}>{activeSeg.prompt}</span>
                        <span style={{ color: "#e6edf3" }}>{activeText}</span>
                        <span style={{
                          display: "inline-block", width: 7, height: 13,
                          background: "#00ff41", marginLeft: 1, verticalAlign: "middle",
                          boxShadow: "0 0 6px rgba(0,255,65,0.9)",
                          animation: "termBlink 1s step-end infinite",
                        }} />
                      </>
                    ) : activeSeg.kind === "spin" ? (
                      <>
                        <span style={{ color: "#00ff41", marginRight: 6, fontWeight: 700 }}>
                          {SPIN_FRAMES[spinFrame]}
                        </span>
                        <span style={{ color: "#8b949e" }}>{activeText}</span>
                      </>
                    ) : (
                      <span style={{ color: activeSeg.color }}>{activeText}</span>
                    )}
                  </div>
                )}

                {/* Idle prompt */}
                {!activeSeg && doneLines.length === 0 && (
                  <div style={{
                    fontFamily: "'Courier New', Courier, monospace",
                    fontSize: 11, lineHeight: 1.8,
                    display: "flex", alignItems: "center", whiteSpace: "nowrap",
                  }}>
                    <span style={{
                      color: "#00ff41", fontWeight: 700,
                      textShadow: "0 0 8px rgba(0,255,65,0.8), 0 0 20px rgba(0,255,65,0.3)",
                    }}>root@kali:~$</span>
                    <span style={{ color: "#e6edf3", marginLeft: 4 }}></span>
                    {/* CSS blink cursor */}
                    <span style={{
                      display: "inline-block", width: 7, height: 13,
                      background: "#00ff41",
                      marginLeft: 1, verticalAlign: "middle",
                      boxShadow: "0 0 8px rgba(0,255,65,1), 0 0 16px rgba(0,255,65,0.5)",
                      animation: "termBlink 1s step-end infinite",
                    }} />
                  </div>
                )}
              </div>
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
