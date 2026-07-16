"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const GLASS_LIGHT = {
  background: "rgba(255,255,255,0.95)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,1)",
  boxShadow: "0 8px 32px rgba(37,99,235,0.13), 0 2px 8px rgba(0,0,0,0.07)",
  borderRadius: 14,
};

const PACKET_BARS = [3, 5, 4, 7, 6, 8, 5, 9, 7, 8];

export default function HeroScene() {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%", minHeight: 380 }}>

      {/* ── Outer ambient glow ── */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{
          width: "75%", height: "75%", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,60,220,0.22) 0%, rgba(37,99,235,0.13) 45%, transparent 70%)",
          filter: "blur(40px)",
        }} />
      </div>

      {/* ── Hacker image in circular frame ── */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 2,
      }}>
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "relative",
            width: "clamp(220px, 55%, 320px)",
            aspectRatio: "1",
          }}
        >
          {/* Purple ring border */}
          <div style={{
            position: "absolute", inset: -4, borderRadius: "50%",
            background: "linear-gradient(135deg, #7C3AED 0%, #2563EB 50%, #7C3AED 100%)",
            padding: 3,
          }}>
            <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "#060912" }} />
          </div>

          {/* Outer pulse ring */}
          <motion.div
            animate={{ scale: [1, 1.08, 1], opacity: [0.6, 0.1, 0.6] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute", inset: -10, borderRadius: "50%",
              border: "1.5px solid rgba(124,58,237,0.70)",
              pointerEvents: "none",
            }}
          />
          <motion.div
            animate={{ scale: [1, 1.14, 1], opacity: [0.3, 0.04, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
            style={{
              position: "absolute", inset: -20, borderRadius: "50%",
              border: "1px solid rgba(99,102,241,0.45)",
              pointerEvents: "none",
            }}
          />

          {/* Image clipped to circle */}
          <div style={{
            position: "relative", width: "100%", height: "100%",
            borderRadius: "50%", overflow: "hidden",
            zIndex: 1,
          }}>
            <Image
              src="/hacker.png"
              alt="TWH Hacker"
              fill
              sizes="(max-width: 768px) 220px, (max-width: 1024px) 260px, 320px"
              style={{ objectFit: "cover", objectPosition: "center top" }}
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

      {/* Card: IP SCANNING — top right */}
      <motion.div
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        style={{ position: "absolute", top: "6%", right: "2%", zIndex: 20 }}
      >
        <div style={GLASS_LIGHT}>
          <div style={{ padding: "10px 14px", minWidth: 140 }}>
            <div style={{ fontSize: 9, fontWeight: 800, color: "#2563EB", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 4 }}>
              IP Scanning
            </div>
            <div style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 4 }}>
              192.168.1.1
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E", display: "inline-block" }} />
              <span style={{ fontSize: 9, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>Active</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Card: ENCRYPTION — left center */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
        style={{ position: "absolute", top: "36%", left: "0%", zIndex: 20 }}
      >
        <div style={GLASS_LIGHT}>
          <div style={{ padding: "10px 14px", minWidth: 130 }}>
            <div style={{ fontSize: 9, fontWeight: 800, color: "#2563EB", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 4 }}>
              Encryption
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <div style={{ width: 22, height: 22, borderRadius: 6, background: "rgba(37,99,235,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="11" height="13" viewBox="0 0 11 13" fill="none">
                  <rect x="1.5" y="5.5" width="8" height="7" rx="1.5" stroke="#2563EB" strokeWidth="1.4"/>
                  <path d="M3.5 5.5V3.5a2 2 0 0 1 4 0v2" stroke="#2563EB" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
              </div>
              <span style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 800, color: "#111827" }}>AES-256</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E", display: "inline-block" }} />
              <span style={{ fontSize: 9, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>Secure</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Card: PACKETS — right center */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        style={{ position: "absolute", top: "50%", right: "0%", zIndex: 20, transform: "translateY(-50%)" }}
      >
        <div style={GLASS_LIGHT}>
          <div style={{ padding: "10px 14px", minWidth: 120 }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>
              Packets
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 6, marginBottom: 6 }}>
              <span style={{ fontSize: 20, fontWeight: 900, color: "#111827", lineHeight: 1 }}>724K</span>
              <span style={{ fontSize: 10, color: "#22C55E", fontWeight: 700, marginBottom: 2 }}>+12.5%</span>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 2 }}>
              {PACKET_BARS.map((h, i) => (
                <div key={i} style={{
                  width: 8, borderRadius: 2,
                  height: h * 3.2,
                  background: `rgba(37,99,235,${0.30 + h * 0.07})`,
                }} />
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Card: Terminal — bottom left */}
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        style={{ position: "absolute", bottom: "8%", left: "0%", zIndex: 20 }}
      >
        <div style={{
          background: "rgba(10,14,26,0.93)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(37,99,235,0.30)",
          borderRadius: 12,
          padding: "10px 14px",
          minWidth: 160,
          boxShadow: "0 8px 32px rgba(0,0,0,0.30)",
        }}>
          {[
            { text: "whoami",     color: "#94A3B8" },
            { text: "scanning...",color: "#94A3B8" },
            { text: "192.168.1.1",color: "#94A3B8" },
            { text: "accessing...",color: "#94A3B8" },
            { text: "target_found", color: "#4ADE80", bold: true },
          ].map((line, i) => (
            <div key={i} style={{
              fontFamily: "monospace", fontSize: 11,
              color: line.color,
              fontWeight: line.bold ? 700 : 400,
              lineHeight: 1.7,
              display: "flex", gap: 6,
            }}>
              <span style={{ color: "#2563EB" }}>&gt;</span>
              <span>{line.text}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Badge: ACCESS GRANTED — bottom center */}
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        style={{
          position: "absolute", bottom: "6%", left: "50%",
          transform: "translateX(-50%)",
          zIndex: 20,
        }}
      >
        <div style={{
          display: "flex", alignItems: "center", gap: 7,
          padding: "8px 16px", borderRadius: 999,
          background: "rgba(22,163,74,0.15)",
          border: "1px solid rgba(22,163,74,0.45)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          boxShadow: "0 4px 20px rgba(22,163,74,0.20)",
        }}>
          <div style={{
            width: 18, height: 18, borderRadius: "50%",
            background: "#16A34A",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{ fontSize: 11, fontWeight: 800, color: "#16A34A", textTransform: "uppercase", letterSpacing: "0.10em" }}>
            Access Granted
          </span>
        </div>
      </motion.div>

    </div>
  );
}
