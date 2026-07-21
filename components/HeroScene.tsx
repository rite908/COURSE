"use client";

import { motion, useAnimation, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";

const GLASS_LIGHT = {
  background: "rgba(255,255,255,0.96)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,1)",
  boxShadow: "0 8px 32px rgba(37,99,235,0.13), 0 2px 8px rgba(0,0,0,0.08)",
  borderRadius: 14,
};

const TERMINAL_LINES = [
  { text: "whoami",       color: "#94A3B8" },
  { text: "scanning...", color: "#94A3B8" },
  { text: "192.168.1.1", color: "#94A3B8" },
  { text: "accessing...", color: "#94A3B8" },
  { text: "target_found", color: "#4ADE80", bold: true },
];

const IP_SEQUENCE = ["192.168.1.1", "10.0.0.254", "172.16.0.1", "192.168.1.1"];

const BASE_BARS   = [3, 5, 4, 7, 6, 8, 5, 9, 7, 8];
const PACKET_VALS = [724, 731, 718, 745, 724];

/* ── Typewriter hook ── */
function useTypewriter(lines: typeof TERMINAL_LINES, active: boolean) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [cursor, setCursor] = useState(true);

  useEffect(() => {
    if (!active) return;
    setVisibleCount(0);
    let i = 0;
    const reveal = () => {
      i++;
      setVisibleCount(i);
      if (i < lines.length) {
        setTimeout(reveal, 480 + Math.random() * 240);
      }
    };
    const t = setTimeout(reveal, 400);
    return () => clearTimeout(t);
  }, [active, lines.length]);

  useEffect(() => {
    const t = setInterval(() => setCursor(c => !c), 530);
    return () => clearInterval(t);
  }, []);

  return { visibleCount, cursor };
}

export default function HeroScene() {
  const [mounted, setMounted] = useState(false);

  /* IP cycling */
  const [ipIdx, setIpIdx]       = useState(0);
  const [ipKey, setIpKey]       = useState(0);
  const [scanning, setScanning] = useState(false);

  /* Packet bars */
  const [bars, setBars]       = useState(BASE_BARS);
  const [packetIdx, setPacketIdx] = useState(0);

  /* Terminal */
  const { visibleCount, cursor } = useTypewriter(TERMINAL_LINES, mounted);

  useEffect(() => {
    setMounted(true);
  }, []);

  /* IP scanner cycle every 3.5 s */
  useEffect(() => {
    if (!mounted) return;
    const t = setInterval(() => {
      setScanning(true);
      setTimeout(() => {
        setIpIdx(i => {
          const next = (i + 1) % IP_SEQUENCE.length;
          setIpKey(k => k + 1);
          return next;
        });
        setScanning(false);
      }, 700);
    }, 3500);
    return () => clearInterval(t);
  }, [mounted]);

  /* Packet bars jitter every 1.8 s */
  useEffect(() => {
    if (!mounted) return;
    const t = setInterval(() => {
      setBars(BASE_BARS.map(h => Math.max(2, h + Math.floor(Math.random() * 5) - 2)));
      setPacketIdx(i => (i + 1) % PACKET_VALS.length);
    }, 1800);
    return () => clearInterval(t);
  }, [mounted]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", minHeight: 520 }}>

      {/* ── Ambient glow ── */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 0 }}>
        <div style={{
          width: "85%", height: "85%", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,60,220,0.28) 0%, rgba(37,99,235,0.14) 45%, transparent 70%)",
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
            animate={{ scale: [1, 1.07, 1], opacity: [0.45, 0.05, 0.45] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            style={{ position: "absolute", inset: -10, borderRadius: "50%", border: "1.5px solid rgba(124,58,237,0.60)", pointerEvents: "none" }}
          />
          <motion.div
            animate={{ scale: [1, 1.13, 1], opacity: [0.22, 0.02, 0.22] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.9 }}
            style={{ position: "absolute", inset: -22, borderRadius: "50%", border: "1px solid rgba(99,102,241,0.35)", pointerEvents: "none" }}
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

      {/* ── Floating particles ── */}
      {Array.from({ length: 10 }).map((_, i) => (
        <motion.div key={`p${i}`}
          style={{
            position: "absolute",
            width: i % 3 === 0 ? 3 : 2, height: i % 3 === 0 ? 3 : 2,
            borderRadius: "50%",
            left: `${8 + (i * 77) % 80}%`,
            top: `${5 + (i * 51) % 86}%`,
            background: i % 2 === 0 ? "rgba(96,165,250,0.75)" : "rgba(192,132,252,0.60)",
            pointerEvents: "none", zIndex: 1,
          }}
          animate={{ opacity: [0.2, 0.95, 0.2], scale: [1, 1.7, 1] }}
          transition={{ duration: 2.0 + (i % 5) * 0.45, repeat: Infinity, delay: (i * 0.17) % 3 }}
        />
      ))}

      {/* ══════════ FLOATING CARDS ══════════ */}

      {/* IP SCANNING — top right */}
      <motion.div
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        style={{ position: "absolute", top: "5%", right: "0%", zIndex: 20 }}
      >
        <div style={GLASS_LIGHT}>
          <div style={{ padding: "11px 16px", minWidth: 148 }}>
            <div style={{ fontSize: 9, fontWeight: 800, color: "#2563EB", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 5 }}>
              IP Scanning
            </div>

            {/* Animated IP address */}
            <div style={{ fontFamily: "monospace", fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 5, height: 20, overflow: "hidden" }}>
              <AnimatePresence mode="wait">
                <motion.span
                  key={ipKey}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3 }}
                  style={{ display: "block" }}
                >
                  {scanning ? (
                    <span style={{ color: "#F59E0B" }}>scanning…</span>
                  ) : (
                    IP_SEQUENCE[ipIdx]
                  )}
                </motion.span>
              </AnimatePresence>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              {/* Pulsing green dot */}
              <span style={{ position: "relative", display: "inline-flex", width: 10, height: 10 }}>
                <motion.span
                  animate={{ scale: [1, 2.2, 1], opacity: [0.7, 0, 0.7] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
                  style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#22C55E" }}
                />
                <span style={{ position: "relative", width: 6, height: 6, margin: 2, borderRadius: "50%", background: "#22C55E", display: "inline-block" }} />
              </span>
              <span style={{ fontSize: 9, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>Active</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ENCRYPTION — left center */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
        style={{ position: "absolute", top: "35%", left: "0%", zIndex: 20 }}
      >
        <div style={GLASS_LIGHT}>
          <div style={{ padding: "11px 16px", minWidth: 136 }}>
            <div style={{ fontSize: 9, fontWeight: 800, color: "#2563EB", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 5 }}>
              Encryption
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5 }}>
              {/* Lock icon with shimmer */}
              <motion.div
                animate={{ rotate: [0, -8, 8, -4, 4, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
                style={{ width: 24, height: 24, borderRadius: 7, background: "rgba(37,99,235,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
              >
                <svg width="11" height="13" viewBox="0 0 11 13" fill="none">
                  <rect x="1.5" y="5.5" width="8" height="7" rx="1.5" stroke="#2563EB" strokeWidth="1.4"/>
                  <path d="M3.5 5.5V3.5a2 2 0 0 1 4 0v2" stroke="#2563EB" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
              </motion.div>
              <span style={{ fontFamily: "monospace", fontSize: 14, fontWeight: 800, color: "#111827" }}>AES-256</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ position: "relative", display: "inline-flex", width: 10, height: 10 }}>
                <motion.span
                  animate={{ scale: [1, 2.2, 1], opacity: [0.7, 0, 0.7] }}
                  transition={{ duration: 2.1, repeat: Infinity, ease: "easeOut", delay: 0.4 }}
                  style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#22C55E" }}
                />
                <span style={{ position: "relative", width: 6, height: 6, margin: 2, borderRadius: "50%", background: "#22C55E", display: "inline-block" }} />
              </span>
              <span style={{ fontSize: 9, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>Secure</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* PACKETS — right center */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        style={{ position: "absolute", top: "48%", right: "0%", zIndex: 20, transform: "translateY(-50%)" }}
      >
        <div style={GLASS_LIGHT}>
          <div style={{ padding: "11px 16px", minWidth: 128 }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 5 }}>
              Packets
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 7, marginBottom: 7 }}>
              {/* Animated counter */}
              <AnimatePresence mode="wait">
                <motion.span
                  key={packetIdx}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.25 }}
                  style={{ fontSize: 22, fontWeight: 900, color: "#111827", lineHeight: 1 }}
                >
                  {PACKET_VALS[packetIdx]}K
                </motion.span>
              </AnimatePresence>
              <span style={{ fontSize: 11, color: "#22C55E", fontWeight: 700, marginBottom: 2 }}>+12.5%</span>
            </div>
            {/* Animated bars */}
            <div style={{ display: "flex", alignItems: "flex-end", gap: 2 }}>
              {bars.map((h, i) => (
                <motion.div
                  key={i}
                  animate={{ height: h * 3.4 }}
                  transition={{ duration: 0.6, ease: "easeInOut", delay: i * 0.04 }}
                  style={{
                    width: 9, borderRadius: 2,
                    background: `rgba(37,99,235,${0.30 + h * 0.07})`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Terminal — bottom left */}
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        style={{ position: "absolute", top: "60%", left: "0%", zIndex: 20 }}
      >
        <div style={{
          background: "rgba(8,12,24,0.94)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(37,99,235,0.28)",
          borderRadius: 12,
          padding: "11px 16px",
          minWidth: 168,
          boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
        }}>
          {TERMINAL_LINES.map((line, i) => (
            <AnimatePresence key={i}>
              {i < visibleCount && (
                <motion.div
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.22 }}
                  style={{
                    fontFamily: "monospace", fontSize: 11.5,
                    color: line.color,
                    fontWeight: line.bold ? 700 : 400,
                    lineHeight: 1.8,
                    display: "flex", gap: 6,
                  }}
                >
                  <span style={{ color: "#3B82F6" }}>&gt;</span>
                  <span>{line.text}</span>
                  {/* Blinking cursor on last visible line */}
                  {i === visibleCount - 1 && visibleCount < TERMINAL_LINES.length && (
                    <motion.span
                      animate={{ opacity: cursor ? 1 : 0 }}
                      transition={{ duration: 0 }}
                      style={{ color: "#3B82F6", fontWeight: 900 }}
                    >▋</motion.span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          ))}
        </div>
      </motion.div>

      {/* ACCESS GRANTED — bottom center */}
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        style={{
          position: "absolute", top: "72%", left: "52%",
          transform: "translateX(-50%)",
          zIndex: 20, whiteSpace: "nowrap",
        }}
      >
        {/* Outer glow pulse ring */}
        <div style={{ position: "relative", display: "inline-block" }}>
          <motion.div
            animate={{ scale: [1, 1.18, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            style={{
              position: "absolute", inset: -6, borderRadius: 999,
              border: "1.5px solid rgba(22,163,74,0.55)",
              pointerEvents: "none",
            }}
          />
          <motion.div
            animate={{ scale: [1, 1.32, 1], opacity: [0.25, 0, 0.25] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.3 }}
            style={{
              position: "absolute", inset: -12, borderRadius: 999,
              border: "1px solid rgba(22,163,74,0.30)",
              pointerEvents: "none",
            }}
          />
          <motion.div
            animate={{ boxShadow: [
              "0 4px 20px rgba(22,163,74,0.20)",
              "0 4px 32px rgba(22,163,74,0.55)",
              "0 4px 20px rgba(22,163,74,0.20)",
            ]}}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "9px 18px", borderRadius: 999,
              background: "rgba(22,163,74,0.14)",
              border: "1px solid rgba(22,163,74,0.45)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              style={{
                width: 20, height: 20, borderRadius: "50%",
                background: "#16A34A",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.div>
            <span style={{ fontSize: 11.5, fontWeight: 800, color: "#16A34A", textTransform: "uppercase", letterSpacing: "0.10em" }}>
              Access Granted
            </span>
          </motion.div>
        </div>
      </motion.div>

    </div>
  );
}
