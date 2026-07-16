"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const GLASS_LIGHT = {
  background: "rgba(255,255,255,0.96)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,1)",
  boxShadow: "0 8px 32px rgba(37,99,235,0.13), 0 2px 8px rgba(0,0,0,0.08)",
  borderRadius: 14,
};

const PACKET_BARS = [3, 5, 4, 7, 6, 8, 5, 9, 7, 8];

export default function HeroScene() {
  return (
    /* Outer wrapper — matches the container in page.tsx */
    <div style={{ position: "relative", width: "100%", height: "100%", minHeight: 520 }}>

      {/* ── Big ambient purple glow behind circle ── */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 0,
      }}>
        <div style={{
          width: "85%", height: "85%", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,60,220,0.28) 0%, rgba(37,99,235,0.14) 45%, transparent 70%)",
          filter: "blur(50px)",
        }} />
      </div>

      {/* ── Hacker circle — centred, large ── */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 2, pointerEvents: "none",
      }}>
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "relative",
            /* Fill most of the column */
            width: "min(100%, 720px)",
            aspectRatio: "1",
          }}
        >
          {/* ── Outer pulse rings ── */}
          <motion.div
            animate={{ scale: [1, 1.07, 1], opacity: [0.45, 0.05, 0.45] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute", inset: -10, borderRadius: "50%",
              border: "1.5px solid rgba(124,58,237,0.60)",
              pointerEvents: "none",
            }}
          />
          <motion.div
            animate={{ scale: [1, 1.13, 1], opacity: [0.22, 0.02, 0.22] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.9 }}
            style={{
              position: "absolute", inset: -22, borderRadius: "50%",
              border: "1px solid rgba(99,102,241,0.35)",
              pointerEvents: "none",
            }}
          />

          {/* ── Image (already circular with purple border) ── */}
          <div style={{ position: "relative", width: "100%", height: "100%", zIndex: 1, overflow: "hidden", borderRadius: "50%" }}>
            <Image
              src="/hacker.png"
              alt="TWH Hacker"
              fill
              sizes="(max-width: 768px) 300px, (max-width: 1024px) 380px, 600px"
              style={{ objectFit: "contain", transform: "scale(1.55)", transformOrigin: "center center" }}
              priority
            />
          </div>
        </motion.div>
      </div>

      {/* ── Floating particles ── */}
      {Array.from({ length: 10 }).map((_, i) => (
        <motion.div
          key={`p${i}`}
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
            <div style={{ fontFamily: "monospace", fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 5 }}>
              192.168.1.1
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E", display: "inline-block" }} />
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
              <div style={{ width: 24, height: 24, borderRadius: 7, background: "rgba(37,99,235,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="11" height="13" viewBox="0 0 11 13" fill="none">
                  <rect x="1.5" y="5.5" width="8" height="7" rx="1.5" stroke="#2563EB" strokeWidth="1.4"/>
                  <path d="M3.5 5.5V3.5a2 2 0 0 1 4 0v2" stroke="#2563EB" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
              </div>
              <span style={{ fontFamily: "monospace", fontSize: 14, fontWeight: 800, color: "#111827" }}>AES-256</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E", display: "inline-block" }} />
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
              <span style={{ fontSize: 22, fontWeight: 900, color: "#111827", lineHeight: 1 }}>724K</span>
              <span style={{ fontSize: 11, color: "#22C55E", fontWeight: 700, marginBottom: 2 }}>+12.5%</span>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 2 }}>
              {PACKET_BARS.map((h, i) => (
                <div key={i} style={{
                  width: 9, borderRadius: 2,
                  height: h * 3.4,
                  background: `rgba(37,99,235,${0.30 + h * 0.07})`,
                }} />
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Terminal — bottom left */}
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        style={{ position: "absolute", bottom: "6%", left: "0%", zIndex: 20 }}
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
          {[
            { text: "whoami",      color: "#94A3B8" },
            { text: "scanning...", color: "#94A3B8" },
            { text: "192.168.1.1", color: "#94A3B8" },
            { text: "accessing...",color: "#94A3B8" },
            { text: "target_found",color: "#4ADE80", bold: true },
          ].map((line, i) => (
            <div key={i} style={{
              fontFamily: "monospace", fontSize: 11.5,
              color: line.color,
              fontWeight: line.bold ? 700 : 400,
              lineHeight: 1.8,
              display: "flex", gap: 6,
            }}>
              <span style={{ color: "#3B82F6" }}>&gt;</span>
              <span>{line.text}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ACCESS GRANTED — bottom center */}
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        style={{
          position: "absolute", bottom: "5%", left: "50%",
          transform: "translateX(-50%)",
          zIndex: 20, whiteSpace: "nowrap",
        }}
      >
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "9px 18px", borderRadius: 999,
          background: "rgba(22,163,74,0.14)",
          border: "1px solid rgba(22,163,74,0.45)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          boxShadow: "0 4px 20px rgba(22,163,74,0.20)",
        }}>
          <div style={{
            width: 20, height: 20, borderRadius: "50%",
            background: "#16A34A",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{ fontSize: 11.5, fontWeight: 800, color: "#16A34A", textTransform: "uppercase", letterSpacing: "0.10em" }}>
            Access Granted
          </span>
        </div>
      </motion.div>

    </div>
  );
}
