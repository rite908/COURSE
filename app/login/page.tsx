"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Shield } from "lucide-react";
import { setCurrentUser, type UserName } from "@/lib/storage";
import { useTheme } from "@/lib/theme";

const PROFILES: {
  name: UserName; title: string; role: string;
  color: string; darkBg: string; lightBg: string; border: string;
  glow: string; emoji: string; level: string;
}[] = [
  {
    name: "TWH",    title: "The White Hat",  role: "Course Creator & Founder",
    color: "#2563EB", darkBg: "rgba(37,99,235,0.15)",  lightBg: "#EFF6FF", border: "#BFDBFE",
    glow: "rgba(37,99,235,0.18)", emoji: "🛡️", level: "CREATOR",
  },
  {
    name: "Prince", title: "The Learner",    role: "Student Operative",
    color: "#7C3AED", darkBg: "rgba(124,58,237,0.15)", lightBg: "#F5F3FF", border: "#DDD6FE",
    glow: "rgba(124,58,237,0.18)", emoji: "🎯", level: "TRAINEE",
  },
  {
    name: "Ashish", title: "The Explorer",   role: "Student Operative",
    color: "#059669", darkBg: "rgba(5,150,105,0.15)",  lightBg: "#ECFDF5", border: "#A7F3D0",
    glow: "rgba(5,150,105,0.18)", emoji: "🚀", level: "TRAINEE",
  },
];

function LoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isDark } = useTheme();
  const [mounted,   setMounted]   = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selecting, setSelecting] = useState<string | null>(null);
  const [vw,        setVw]        = useState(1280);

  useEffect(() => {
    setMounted(true);
    const u = () => setVw(window.innerWidth);
    u(); window.addEventListener("resize", u, { passive: true });
    return () => window.removeEventListener("resize", u);
  }, []);

  const isMd = vw >= 640;
  const sp = vw < 640 ? 16 : vw < 768 ? 24 : 40;

  const T = {
    bg:      isDark ? "#060912"  : "#F8FAFF",
    bg2:     isDark ? "#0D1117"  : "#FFFFFF",
    text:    isDark ? "#F1F5F9"  : "#111827",
    text2:   isDark ? "#94A3B8"  : "#6B7280",
    muted:   isDark ? "#64748B"  : "#9CA3AF",
    border:  isDark ? "#1E2433"  : "#E5E7EB",
    chipTxt: isDark ? "#60A5FA"  : "#2563EB",
    dot:     isDark ? "rgba(96,165,250,0.08)" : "rgba(148,163,254,0.20)",
  };

  const redirectTo = searchParams?.get("from") || "/dashboard";

  const handleSelect = async (user: UserName) => {
    setSelecting(user);
    await new Promise((r) => setTimeout(r, 450));
    setCurrentUser(user);
    router.push(redirectTo);
  };

  return (
    <main style={{
      minHeight: "100vh", background: T.bg,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: `80px ${sp}px 40px`, position: "relative", overflow: "hidden",
    }}>
      {/* Dot grid */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: `radial-gradient(circle, ${T.dot} 1.5px, transparent 1.5px)`,
        backgroundSize: "28px 28px",
      }} />
      {/* Glow */}
      <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 600, height: 400, background: "radial-gradient(ellipse,rgba(37,99,235,0.08) 0%,transparent 70%)", pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: 880 }}>
        {/* Header */}
        <motion.div
          initial={mounted ? { opacity: 0, y: -20 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          style={{ textAlign: "center", marginBottom: 48 }}
        >
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 28 }}>
            <img src="/twh-logo.png" alt="TWH Academy" style={{ width: 52, height: 52, borderRadius: "50%", objectFit: "cover", boxShadow: "0 0 0 2px rgba(37,99,235,0.40), 0 4px 16px rgba(37,99,235,0.35)" }} />
            <span style={{ fontWeight: 700, fontSize: "18px", color: T.text }}>
              TWH <span style={{ color: "#2563EB" }}>Academy</span>
            </span>
          </div>
          <h1 style={{ fontWeight: 900, fontSize: isMd ? "2.4rem" : "1.9rem", color: T.text, letterSpacing: "-0.025em", marginBottom: 12 }}>
            Welcome Back, Hacker! 👋
          </h1>
          <p style={{ color: T.text2, fontSize: "15px" }}>
            Choose your identity to continue your learning journey.
          </p>
        </motion.div>

        {/* Profile cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: isMd ? "repeat(3,1fr)" : "1fr",
          gap: 16,
          marginBottom: 32,
        }}>
          {PROFILES.map((p, i) => {
            const isHovered  = hoveredId === p.name;
            const isSelect   = selecting === p.name;

            return (
              <motion.button
                key={p.name}
                initial={mounted ? { opacity: 0, y: 32, scale: 0.96 } : false}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: i * 0.1 + 0.15, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onHoverStart={() => setHoveredId(p.name)}
                onHoverEnd={() => setHoveredId(null)}
                onClick={() => !selecting && handleSelect(p.name)}
                style={{
                  position: "relative", textAlign: "left", borderRadius: 20,
                  overflow: "hidden", cursor: "pointer",
                  background: T.bg2,
                  border: `1.5px solid ${isHovered ? p.color + "60" : T.border}`,
                  boxShadow: isHovered
                    ? `0 12px 40px ${p.glow}`
                    : `0 2px 16px rgba(0,0,0,${isDark ? 0.25 : 0.05})`,
                  transition: "border-color 0.25s, box-shadow 0.25s",
                }}
              >
                {/* Selecting overlay */}
                <AnimatePresence>
                  {isSelect && (
                    <motion.div
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      style={{ position: "absolute", inset: 0, zIndex: 20, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 20, background: `${T.bg2}ee` }}
                    >
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
                          style={{ width: 24, height: 24, borderRadius: "50%", border: `2px solid ${T.border}`, borderTopColor: p.color }}
                        />
                        <span style={{ fontSize: "12px", fontWeight: 600, color: T.text2 }}>Entering...</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Top accent bar */}
                <div style={{ height: 4, background: `linear-gradient(90deg,${p.color},${p.color}77)` }} />

                {/* Avatar area */}
                <div style={{
                  background: isDark ? (isHovered ? p.darkBg : "transparent") : (isHovered ? p.lightBg : "#FAFBFF"),
                  padding: "32px 24px 24px",
                  display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
                  transition: "background 0.25s",
                }}>
                  <motion.div
                    animate={isHovered ? { scale: 1.08, rotate: [0, -5, 5, 0] } : { scale: 1 }}
                    transition={{ duration: 0.4 }}
                    style={{
                      width: 80, height: 80, borderRadius: 20, fontSize: "2.8rem",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: T.bg2, border: `2px solid ${T.border}`, marginBottom: 16,
                      boxShadow: `0 2px 12px rgba(0,0,0,${isDark ? 0.3 : 0.06})`,
                    }}
                  >{p.emoji}</motion.div>

                  <span style={{
                    display: "inline-block", padding: "3px 12px", borderRadius: 999,
                    fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em",
                    color: p.color, background: isDark ? p.darkBg : p.lightBg,
                    marginBottom: 10,
                  }}>{p.level}</span>

                  <h3 style={{ fontWeight: 900, fontSize: "1.5rem", color: p.color, marginBottom: 2 }}>{p.name}</h3>
                  <p style={{ fontWeight: 600, fontSize: "13px", color: T.text2 }}>{p.title}</p>
                </div>

                {/* Footer row */}
                <div style={{ padding: "12px 24px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: `1px solid ${T.border}` }}>
                  <span style={{ fontSize: "12px", color: T.muted }}>{p.role}</span>
                  <motion.span
                    animate={isHovered ? { x: 4, opacity: 1 } : { x: 0, opacity: 0.45 }}
                    style={{ fontSize: "13px", fontWeight: 700, color: p.color }}
                  >Enter →</motion.span>
                </div>
              </motion.button>
            );
          })}
        </div>

        <motion.p
          initial={mounted ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75 }}
          style={{ textAlign: "center", color: T.muted, fontSize: "12px" }}
        >
          No password required · Progress automatically saved per profile
        </motion.p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}
