"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import GlobeCanvas from "./GlobeCanvas";

const FLOAT_CARDS = [
  {
    id: "ip1",
    style: { top: "14%",  left: "8%" },
    delay: 0,
    content: (
      <div className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        <span className="font-mono text-xs font-bold text-gray-800">192.168.1.1</span>
        <span className="text-[10px] text-gray-400 ml-0.5">▸</span>
      </div>
    ),
  },
  {
    id: "ip2",
    style: { top: "10%",  right: "2%" },
    delay: 0.4,
    content: (
      <div className="space-y-0.5">
        <div className="text-[9px] font-bold text-blue-600 tracking-widest uppercase">IP Scanning</div>
        <div className="font-mono text-xs font-bold text-gray-800">192.168.1.1</div>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
          <span className="text-[9px] text-gray-400 uppercase tracking-wide">Status: Active</span>
        </div>
      </div>
    ),
  },
  {
    id: "packets",
    style: { top: "52%",  right: "-2%" },
    delay: 0.8,
    content: (
      <div>
        <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Packets</div>
        <div className="flex items-end gap-1">
          <span className="text-xl font-black text-gray-800">724K</span>
          <span className="text-[10px] text-green-500 font-bold mb-0.5">+12.5%</span>
        </div>
        <div className="flex gap-px mt-1">
          {[3,5,4,7,6,8,5,9,7,8].map((h,i) => (
            <div key={i} className="w-1.5 rounded-sm bg-blue-400"
              style={{ height: h * 3, opacity: 0.5 + h * 0.05 }} />
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "mcqs",
    style: { bottom: "32%", left: "4%" },
    delay: 1.2,
    content: (
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center">
          <span className="text-sm">🎯</span>
        </div>
        <div>
          <div className="font-black text-sm text-gray-900">450+</div>
          <div className="text-[9px] text-gray-400 uppercase tracking-wide">MCQs</div>
        </div>
      </div>
    ),
  },
];

export default function HeroScene() {
  const [mounted, setMounted] = useState(false);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative w-full h-full min-h-[520px]" style={{ perspective: "1000px" }}>

      {/* ── CSS glowing sphere (strong visual base) ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Outer purple halo */}
        <div className="absolute rounded-full"
          style={{
            width: "92%", height: "92%",
            background: "radial-gradient(circle, rgba(124,58,237,0.20) 0%, rgba(67,97,238,0.12) 40%, transparent 70%)",
            filter: "blur(48px)",
          }} />
        {/* Core blue sphere fill */}
        <div className="absolute rounded-full overflow-hidden"
          style={{
            width: "70%", height: "70%",
            background: "radial-gradient(circle at 38% 35%, rgba(186,230,253,0.55) 0%, rgba(96,165,250,0.45) 25%, rgba(67,97,238,0.40) 55%, rgba(124,58,237,0.30) 80%, rgba(109,40,217,0.15) 100%)",
            boxShadow: "0 0 60px 20px rgba(67,97,238,0.20), 0 0 120px 40px rgba(124,58,237,0.12)",
          }} />
        {/* Edge rim glow */}
        <div className="absolute rounded-full"
          style={{
            width: "70%", height: "70%",
            background: "radial-gradient(circle at 70% 70%, rgba(167,139,250,0.25) 0%, transparent 55%)",
          }} />
        {/* Inner specular */}
        <div className="absolute rounded-full"
          style={{
            width: "30%", height: "30%",
            marginLeft: "-20%", marginTop: "-20%",
            background: "radial-gradient(circle, rgba(219,234,254,0.45) 0%, transparent 70%)",
            filter: "blur(8px)",
          }} />
      </div>

      {/* ── Orbital rings ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute rounded-full border"
          style={{
            width: "90%", height: "35%",
            borderColor: "rgba(147,197,253,0.18)",
            boxShadow: "0 0 12px rgba(147,197,253,0.08)",
          }}
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute rounded-full border"
          style={{
            width: "78%", height: "28%",
            borderColor: "rgba(196,181,253,0.14)",
          }}
        />
      </div>

      {/* ── Globe canvas (network lines overlay) ── */}
      <motion.div
        initial={mounted ? { opacity: 0, scale: 0.85 } : false}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
        className="absolute inset-0"
      >
        <GlobeCanvas />
      </motion.div>

      {/* ── Hooded figure ── */}
      <motion.div
        initial={mounted ? { opacity: 0, y: 30 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.4 }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{ width: "42%", maxWidth: 240, zIndex: 10 }}
      >
        {/* Ground glow ring */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2"
          style={{
            width: "180%",
            height: 40,
            background: "radial-gradient(ellipse, rgba(67,97,238,0.35) 0%, transparent 70%)",
            filter: "blur(8px)",
            zIndex: 1,
          }}
        />
        {/* Scanning rings */}
        <motion.div
          animate={{ scaleX: [1, 1.15, 1], opacity: [0.4, 0.15, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full border border-blue-400"
          style={{ width: "160%", height: 28, zIndex: 1 }}
        />
        <motion.div
          animate={{ scaleX: [1, 1.25, 1], opacity: [0.25, 0.08, 0.25] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full border border-violet-400"
          style={{ width: "195%", height: 36, zIndex: 1 }}
        />

        <svg
          viewBox="0 0 200 260"
          fill="none"
          className="w-full"
          style={{ zIndex: 2, position: "relative" }}
        >
          <defs>
            <radialGradient id="figureGlow" cx="50%" cy="30%" r="60%">
              <stop offset="0%"   stopColor="#1E3A5F" />
              <stop offset="100%" stopColor="#0A0F1E" />
            </radialGradient>
            <radialGradient id="shieldGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="#93C5FD" stopOpacity="0.8"/>
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0"/>
            </radialGradient>
            <filter id="figShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#2563EB" floodOpacity="0.25"/>
            </filter>
            <filter id="shieldFilter">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur"/>
              <feComposite in="SourceGraphic" in2="blur" operator="over"/>
            </filter>
          </defs>

          {/* ── Body ── */}
          {/* Shoulders */}
          <path
            d="M 45 85 C 38 90 30 100 28 118 C 26 135 30 148 34 162 C 38 178 40 200 42 228 C 43 240 44 252 45 260 L 155 260 C 156 252 157 240 158 228 C 160 200 162 178 166 162 C 170 148 174 135 172 118 C 170 100 162 90 155 85 Z"
            fill="url(#figureGlow)"
            filter="url(#figShadow)"
          />
          {/* Hood back */}
          <path
            d="M 53 88 C 53 88 48 60 52 38 C 56 16 72 4 100 3 C 128 4 144 16 148 38 C 152 60 147 88 147 88 Z"
            fill="#0E1B2E"
            filter="url(#figShadow)"
          />
          {/* Hood visible top (slightly lighter) */}
          <ellipse cx="100" cy="44" rx="46" ry="42" fill="#111E30" />
          {/* Back of head hint */}
          <ellipse cx="100" cy="54" rx="28" ry="26" fill="#0D1829" />
          {/* Hood shadow fold */}
          <path
            d="M 55 86 Q 78 98 100 98 Q 122 98 145 86"
            stroke="#1A2D45" strokeWidth="3" strokeLinecap="round"
            fill="none" opacity="0.6"
          />

          {/* ── TWH Shield on back ── */}
          {/* Glow behind shield */}
          <ellipse cx="100" cy="162" rx="22" ry="22" fill="url(#shieldGlow)" />
          {/* Shield outline */}
          <path
            d="M 100 144 L 82 152 L 82 168 Q 82 182 100 190 Q 118 182 118 168 L 118 152 Z"
            fill="none"
            stroke="#60A5FA"
            strokeWidth="1.8"
            opacity="0.9"
            filter="url(#shieldFilter)"
          />
          {/* Inner shield accent */}
          <path
            d="M 100 148 L 86 154 L 86 168 Q 86 178 100 184 Q 114 178 114 168 L 114 154 Z"
            fill="rgba(37,99,235,0.12)"
          />
          {/* Checkmark */}
          <path
            d="M 91 165 L 97 172 L 109 158"
            stroke="#93C5FD"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* TWH text */}
          <text
            x="100" y="178"
            textAnchor="middle"
            fill="#60A5FA"
            fontSize="8"
            fontFamily="monospace"
            fontWeight="bold"
            opacity="0.7"
          >
            TWH
          </text>

          {/* ── Subtle highlight on shoulders ── */}
          <path
            d="M 45 88 C 55 82 72 78 100 78 C 128 78 145 82 155 88"
            stroke="rgba(99,179,237,0.15)" strokeWidth="2" strokeLinecap="round" fill="none"
          />
        </svg>
      </motion.div>

      {/* ── City skyline ── */}
      <motion.div
        initial={mounted ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.8 }}
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{ zIndex: 5 }}
      >
        <svg viewBox="0 0 800 100" preserveAspectRatio="xMidYMax slice" className="w-full">
          <defs>
            <linearGradient id="skylineGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C7D9F5" stopOpacity="0.25"/>
              <stop offset="100%" stopColor="#A5B4FC" stopOpacity="0.12"/>
            </linearGradient>
          </defs>
          {/* City buildings silhouette */}
          <path
            d="M0,100 L0,80 L20,80 L20,70 L30,70 L30,60 L40,60 L40,68 L55,68 L55,52 L60,52 L60,48 L65,48 L65,52 L70,52 L70,70 L80,70 L80,58 L88,58 L88,45 L93,45 L93,58 L100,58 L100,72 L115,72 L115,62 L120,62 L120,50 L128,50 L128,62 L135,62 L135,74 L145,74 L145,55 L155,55 L155,45 L162,45 L162,38 L170,38 L170,45 L178,45 L178,55 L185,55 L185,72 L195,72 L195,60 L205,60 L205,68 L215,68 L215,55 L225,55 L225,48 L230,40 L235,48 L235,55 L245,55 L245,70 L260,70 L260,62 L270,62 L270,52 L278,52 L278,42 L285,42 L285,52 L295,52 L295,65 L310,65 L310,55 L320,55 L320,45 L328,45 L328,55 L340,55 L340,68 L355,68 L355,58 L365,58 L365,50 L372,50 L372,58 L382,58 L382,70 L395,70 L395,60 L405,60 L405,48 L415,48 L415,40 L422,32 L429,40 L429,48 L438,48 L438,60 L450,60 L450,72 L460,72 L460,62 L470,62 L470,52 L478,52 L478,62 L490,62 L490,74 L500,74 L500,62 L510,62 L510,55 L518,55 L518,48 L525,42 L532,48 L532,55 L540,55 L540,65 L555,65 L555,72 L570,72 L570,62 L580,62 L580,52 L588,52 L588,62 L600,62 L600,75 L615,75 L615,65 L625,65 L625,58 L632,58 L632,50 L638,44 L644,50 L644,58 L652,58 L652,68 L665,68 L665,58 L675,58 L675,50 L682,50 L682,58 L695,58 L695,70 L710,70 L710,60 L720,60 L720,72 L730,72 L730,82 L745,82 L745,75 L755,75 L755,65 L762,65 L762,75 L775,75 L775,82 L790,82 L790,80 L800,80 L800,100 Z"
            fill="url(#skylineGrad)"
          />
        </svg>
      </motion.div>

      {/* ── Floating glass cards ── */}
      {FLOAT_CARDS.map((card) => (
        <motion.div
          key={card.id}
          initial={mounted ? { opacity: 0, scale: 0.8 } : false}
          animate={{
            opacity: 1, scale: 1,
            y: [0, -8, 0],
          }}
          transition={{
            opacity: { duration: 0.5, delay: 0.6 + card.delay },
            scale:   { duration: 0.5, delay: 0.6 + card.delay },
            y: { duration: 3 + card.delay * 0.5, repeat: Infinity, ease: "easeInOut", delay: card.delay * 0.3 },
          }}
          className="absolute z-20 pointer-events-none"
          style={card.style as React.CSSProperties}
        >
          <div
            className="px-3 py-2.5 rounded-xl"
            style={{
              background: "rgba(255,255,255,0.82)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,0.9)",
              boxShadow: "0 4px 20px rgba(37,99,235,0.1), 0 1px 4px rgba(0,0,0,0.04)",
            }}
          >
            {card.content}
          </div>
        </motion.div>
      ))}

      {/* ── Particle dots scattered ── */}
      {mounted && Array.from({ length: 18 }).map((_, i) => (
        <motion.div
          key={`p-${i}`}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: i % 3 === 0 ? 3 : 2,
            height: i % 3 === 0 ? 3 : 2,
            left: `${10 + (i * 73) % 80}%`,
            top:  `${5  + (i * 53) % 85}%`,
            background: i % 2 === 0 ? "rgba(99,179,237,0.6)" : "rgba(196,181,253,0.5)",
          }}
          animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.5, 1] }}
          transition={{ duration: 2 + (i % 4), repeat: Infinity, delay: (i * 0.2) % 3 }}
        />
      ))}
    </div>
  );
}
