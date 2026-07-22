"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useTheme } from "@/lib/theme";
import { Terminal, ArrowLeft, Home } from "lucide-react";

const GLITCH_CHARS = "!@#$%^&*<>?/\\|{}[]~`";

function GlitchText({ text }: { text: string }) {
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    let iter = 0;
    const interval = setInterval(() => {
      setDisplay(
        text
          .split("")
          .map((char, i) =>
            i < iter
              ? char
              : GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
          )
          .join("")
      );
      iter += 0.4;
      if (iter >= text.length) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, [text]);

  return <span style={{ fontFamily: "monospace" }}>{display}</span>;
}

export default function NotFound() {
  const { isDark } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [cmdDone, setCmdDone] = useState(false);

  useEffect(() => {
    setMounted(true);
    const t = setTimeout(() => setCmdDone(true), 1800);
    return () => clearTimeout(t);
  }, []);

  const bg = isDark ? "#060912" : "#F8FAFF";
  const text = isDark ? "#F1F5F9" : "#111827";
  const muted = isDark ? "#475569" : "#94A3B8";
  const cardBg = isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.95)";
  const cardBorder = isDark ? "rgba(37,99,235,0.25)" : "#DBEAFE";

  return (
    <main style={{
      minHeight: "100vh", background: bg, paddingTop: 68,
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden",
    }}>
      {/* Ambient glows */}
      {isDark && (
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <motion.div animate={{ opacity: [0.20, 0.38, 0.20] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            style={{ position: "absolute", top: "10%", left: "15%", width: "45%", height: "50%", background: "radial-gradient(ellipse, rgba(239,68,68,0.18) 0%, transparent 70%)", filter: "blur(60px)" }} />
          <motion.div animate={{ opacity: [0.15, 0.30, 0.15] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            style={{ position: "absolute", bottom: "15%", right: "10%", width: "40%", height: "45%", background: "radial-gradient(ellipse, rgba(139,92,246,0.20) 0%, transparent 70%)", filter: "blur(55px)" }} />
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.08 }}>
            <defs>
              <pattern id="nf-dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
                <circle cx="1.5" cy="1.5" r="1.5" fill="#3B82F6" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#nf-dots)" />
          </svg>
        </div>
      )}

      <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "0 24px", maxWidth: 640 }}>

        {/* 404 big number */}
        <motion.div
          initial={mounted ? { opacity: 0, scale: 0.8 } : false}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontSize: "clamp(7rem, 20vw, 11rem)", fontWeight: 900, lineHeight: 1,
            letterSpacing: "-0.06em", marginBottom: 8,
            background: "linear-gradient(135deg,#EF4444 0%,#7C3AED 60%,#2563EB 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            filter: isDark ? "drop-shadow(0 0 40px rgba(239,68,68,0.35))" : "none",
          }}
        >
          404
        </motion.div>

        {/* Terminal card */}
        <motion.div
          initial={mounted ? { opacity: 0, y: 24 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background: cardBg, border: `1px solid ${cardBorder}`,
            borderRadius: 16, padding: "20px 24px", marginBottom: 32,
            backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
            textAlign: "left",
            boxShadow: isDark ? "0 8px 32px rgba(239,68,68,0.12)" : "0 4px 20px rgba(0,0,0,0.06)",
          }}
        >
          {/* Terminal header */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
            {["#EF4444", "#F59E0B", "#10B981"].map((c) => (
              <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
            ))}
            <span style={{ marginLeft: 8, fontSize: "11px", fontWeight: 600, color: muted, fontFamily: "monospace" }}>bash — terminal</span>
          </div>
          {/* Commands */}
          <div style={{ fontFamily: "monospace", fontSize: "13px", lineHeight: 1.9 }}>
            <div>
              <span style={{ color: "#10B981" }}>root@twh:~$</span>{" "}
              <span style={{ color: text }}>GET /page-not-found</span>
            </div>
            {cmdDone && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                <div style={{ color: "#EF4444" }}>Error 404: Route not found in system</div>
                <div style={{ color: muted }}>
                  <GlitchText text="Scanning filesystem..." />
                </div>
                <div style={{ color: "#F59E0B" }}>→ Suggestion: Return to /home</div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={mounted ? { opacity: 0, y: 16 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          style={{ fontWeight: 900, fontSize: "clamp(1.4rem,3vw,1.9rem)", color: text, letterSpacing: "-0.025em", marginBottom: 12 }}
        >
          Page ka koi naama-nishaan nahi
        </motion.h1>
        <motion.p
          initial={mounted ? { opacity: 0, y: 12 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          style={{ color: muted, fontSize: "15px", lineHeight: 1.75, marginBottom: 40 }}
        >
          Yeh page exist nahi karta — ya delete ho gaya. Ghabrao mat, wapas chalo.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={mounted ? { opacity: 0, y: 12 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}
        >
          <Link href="/" style={{ textDecoration: "none" }}>
            <motion.div whileHover={{ scale: 1.04, boxShadow: "0 12px 36px rgba(37,99,235,0.40)" }} whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 380, damping: 22 }}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 12, background: "linear-gradient(135deg,#2563EB,#7C3AED)", color: "#fff", fontWeight: 700, fontSize: "14px", cursor: "pointer", boxShadow: "0 4px 20px rgba(37,99,235,0.32)" }}>
              <Home size={15} /> Back to Home
            </motion.div>
          </Link>
          <Link href="/chapters" style={{ textDecoration: "none" }}>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 380, damping: 22 }}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 12, background: isDark ? "rgba(255,255,255,0.06)" : "#fff", border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "#DBEAFE"}`, color: text, fontWeight: 700, fontSize: "14px", cursor: "pointer" }}>
              <Terminal size={15} /> Explore Chapters
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
