"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

/* ── Floating cards data ── */
const CARDS = [
  {
    id: "ip-pill",
    top: "16%", left: "2%",
    delay: 0.3,
    content: (
      <div className="flex items-center gap-2 px-3 py-1.5">
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
        <span className="font-mono text-xs font-bold text-gray-800 tracking-wide">192.168.1.1</span>
        <span className="text-[10px] text-gray-500 ml-0.5">▶</span>
      </div>
    ),
  },
  {
    id: "ip-scan",
    top: "8%", right: "2%",
    delay: 0.6,
    content: (
      <div className="px-3 py-2.5 space-y-0.5 min-w-[120px]">
        <div className="text-[9px] font-black text-blue-600 tracking-widest uppercase">IP Scanning</div>
        <div className="font-mono text-[11px] font-bold text-gray-800">192.168.1.1</div>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
          <span className="text-[9px] text-gray-500 uppercase tracking-wide font-semibold">Status: Active</span>
        </div>
      </div>
    ),
  },
  {
    id: "packets",
    top: "48%", right: "-2%",
    delay: 1.0,
    content: (
      <div className="px-3 py-2.5 min-w-[110px]">
        <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Packets</div>
        <div className="flex items-end gap-1.5 mb-1.5">
          <span className="text-xl font-black text-gray-800 leading-none">724K</span>
          <span className="text-[10px] text-green-500 font-bold mb-0.5">+12.5%</span>
        </div>
        <div className="flex items-end gap-px">
          {[3,5,4,7,6,8,5,9,7,8].map((h,i) => (
            <div key={i} className="w-1.5 rounded-sm" style={{ height: h*3, background: `rgba(37,99,235,${0.35+h*0.07})` }} />
          ))}
        </div>
      </div>
    ),
  },
];

const GLASS = {
  background: "rgba(255,255,255,0.90)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
  border: "1px solid rgba(255,255,255,0.96)",
  boxShadow: "0 4px 24px rgba(37,99,235,0.12), 0 1px 4px rgba(0,0,0,0.04)",
};

export default function HeroScene() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <div className="relative w-full" style={{ height: "100%", minHeight: 540 }}>

      {/* ════ BIG BLUE GLOBE (CSS + SVG) ════ */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 1 }}>

        {/* Far outer ambient purple/blue haze */}
        <div style={{
          position: "absolute",
          width: "105%", height: "105%",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(37,99,235,0.18) 0%, rgba(99,102,241,0.10) 45%, transparent 70%)",
          filter: "blur(32px)",
        }} />

        {/* Main sphere */}
        <div style={{
          position: "relative",
          width: "74%",
          aspectRatio: "1",
          borderRadius: "50%",
          background: "radial-gradient(circle at 38% 34%, #90CAFF 0%, #4A9EFF 18%, #2563EB 42%, #3730A3 68%, #6D28D9 90%)",
          boxShadow: "0 0 70px 20px rgba(37,99,235,0.45), 0 0 140px 50px rgba(99,102,241,0.25), 0 0 200px 80px rgba(37,99,235,0.12)",
        }}>
          {/* Grid overlay (SVG stripes) */}
          <svg
            viewBox="0 0 400 400"
            className="absolute inset-0 w-full h-full"
            style={{ borderRadius: "50%", opacity: 0.55 }}
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <clipPath id="sphereClip">
                <circle cx="200" cy="200" r="200" />
              </clipPath>
            </defs>
            <g clipPath="url(#sphereClip)">
              {/* Latitude lines */}
              {[40,80,120,160,200,240,280,320,360].map(y => (
                <line key={`h${y}`} x1="0" y1={y} x2="400" y2={y} stroke="rgba(180,220,255,0.4)" strokeWidth="0.8" />
              ))}
              {/* Longitude lines */}
              {[40,80,120,160,200,240,280,320,360].map(x => (
                <line key={`v${x}`} x1={x} y1="0" x2={x} y2="400" stroke="rgba(180,220,255,0.4)" strokeWidth="0.8" />
              ))}
              {/* Diagonal lines for depth */}
              {[-300,-240,-180,-120,-60,0,60,120,180,240,300].map(o => (
                <line key={`d${o}`} x1={o} y1="0" x2={o+400} y2="400" stroke="rgba(180,220,255,0.18)" strokeWidth="0.5" />
              ))}
              {/* Dot pattern */}
              {Array.from({length:18},(_,li)=>Array.from({length:18},(_,lj)=>{
                const x = 22+lj*22, y = 22+li*22;
                const dx = x-200, dy = y-200;
                if(dx*dx+dy*dy > 190*190) return null;
                const d = 1 - Math.sqrt(dx*dx+dy*dy)/200;
                return <circle key={`d${li}-${lj}`} cx={x} cy={y} r={1.2+d*1.0} fill={`rgba(210,235,255,${0.3+d*0.55})`} />;
              }))}
            </g>
          </svg>

          {/* Specular highlight */}
          <div style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: "radial-gradient(circle at 34% 30%, rgba(220,242,255,0.30) 0%, transparent 50%)",
          }} />

          {/* Rim glow */}
          <div style={{
            position: "absolute",
            inset: "-3px",
            borderRadius: "50%",
            background: "radial-gradient(circle at center, transparent 68%, rgba(147,197,253,0.40) 83%, rgba(147,197,253,0.55) 92%, transparent 100%)",
          }} />

          {/* Animated arc lines overlay */}
          <svg
            viewBox="0 0 400 400"
            className="absolute inset-0 w-full h-full"
            style={{ borderRadius: "50%", overflow: "hidden" }}
          >
            <defs>
              <clipPath id="sc2"><circle cx="200" cy="200" r="200" /></clipPath>
              <filter id="arcGlow">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <g clipPath="url(#sc2)" filter="url(#arcGlow)">
              <motion.path
                d="M 60 280 Q 160 60 320 180"
                fill="none" stroke="rgba(96,165,250,0.9)" strokeWidth="1.5"
                strokeDasharray="300"
                animate={{ strokeDashoffset: [300, -300] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
              />
              <motion.path
                d="M 40 150 Q 200 20 360 200"
                fill="none" stroke="rgba(192,132,252,0.85)" strokeWidth="1.4"
                strokeDasharray="380"
                animate={{ strokeDashoffset: [380, -380] }}
                transition={{ duration: 4.2, repeat: Infinity, ease: "linear", delay: 1 }}
              />
              <motion.path
                d="M 100 340 Q 250 100 380 280"
                fill="none" stroke="rgba(96,165,250,0.8)" strokeWidth="1.3"
                strokeDasharray="320"
                animate={{ strokeDashoffset: [-320, 320] }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear", delay: 2 }}
              />
              <motion.path
                d="M 30 200 Q 160 350 340 120"
                fill="none" stroke="rgba(167,139,250,0.75)" strokeWidth="1.2"
                strokeDasharray="360"
                animate={{ strokeDashoffset: [360, -360] }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear", delay: 0.5 }}
              />
            </g>
          </svg>
        </div>

        {/* Orbital rings */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
          style={{
            position: "absolute",
            width: "95%", height: "30%",
            borderRadius: "50%",
            border: "1px solid rgba(147,210,255,0.30)",
            boxShadow: "0 0 8px rgba(147,197,253,0.10)",
          }}
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          style={{
            position: "absolute",
            width: "83%", height: "25%",
            borderRadius: "50%",
            border: "1px solid rgba(192,132,252,0.22)",
            transform: "rotateX(70deg)",
          }}
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
          style={{
            position: "absolute",
            width: "102%", height: "102%",
            borderRadius: "50%",
            border: "1px solid rgba(96,165,250,0.08)",
          }}
        />
      </div>

      {/* ════ HOODED FIGURE ════ */}
      <div
        className="absolute bottom-0 left-1/2 pointer-events-none"
        style={{ width: "42%", maxWidth: 250, transform: "translateX(-50%)", zIndex: 10 }}
      >
        {/* Ground glow */}
        <div style={{
          position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
          width: "200%", height: 32,
          background: "radial-gradient(ellipse, rgba(37,99,235,0.50) 0%, transparent 70%)",
          filter: "blur(6px)",
        }} />
        {/* Scan rings */}
        <motion.div
          animate={{ scaleX: [1,1.18,1], opacity: [0.50,0.14,0.50] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position:"absolute", bottom:-4, left:"50%", transform:"translateX(-50%)",
            width:"165%", height:24, borderRadius:"50%",
            border:"1px solid rgba(96,165,250,0.8)", zIndex:1
          }}
        />
        <motion.div
          animate={{ scaleX:[1,1.28,1], opacity:[0.28,0.05,0.28] }}
          transition={{ duration:2.4, repeat:Infinity, ease:"easeInOut", delay:0.6 }}
          style={{
            position:"absolute", bottom:-4, left:"50%", transform:"translateX(-50%)",
            width:"200%", height:32, borderRadius:"50%",
            border:"1px solid rgba(139,92,246,0.6)", zIndex:1
          }}
        />

        <svg viewBox="0 0 200 265" fill="none" style={{ width:"100%", zIndex:2, position:"relative" }}>
          <defs>
            <radialGradient id="b2" cx="50%" cy="28%" r="60%">
              <stop offset="0%" stopColor="#1A2E4A"/>
              <stop offset="100%" stopColor="#070C18"/>
            </radialGradient>
            <radialGradient id="sg2" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#93C5FD" stopOpacity="0.95"/>
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0"/>
            </radialGradient>
            <filter id="gf2"><feGaussianBlur stdDeviation="2.5" result="b"/><feComposite in="SourceGraphic" in2="b" operator="over"/></filter>
            <filter id="bf2"><feDropShadow dx="0" dy="4" stdDeviation="10" floodColor="#1D4ED8" floodOpacity="0.32"/></filter>
          </defs>
          <path d="M44 88C36 94 27 106 25 126C23 144 28 158 32 174C36 192 38 212 40 235C41 248 42 256 43 265L157 265C158 256 159 248 160 235C162 212 164 192 168 174C172 158 177 144 175 126C173 106 164 94 156 88Z" fill="url(#b2)" filter="url(#bf2)"/>
          <path d="M52 90C52 90 46 62 50 38C54 15 70 3 100 2C130 3 146 15 150 38C154 62 148 90 148 90Z" fill="#0A1220" filter="url(#bf2)"/>
          <ellipse cx="100" cy="46" rx="46" ry="44" fill="#111C2E"/>
          <ellipse cx="100" cy="57" rx="28" ry="27" fill="#0D1725"/>
          <path d="M54 88Q77 101 100 101Q123 101 146 88" stroke="#1E3A5F" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.7"/>
          <path d="M44 90C56 83 74 79 100 79C126 79 144 83 156 90" stroke="rgba(100,160,240,0.14)" strokeWidth="2" strokeLinecap="round" fill="none"/>
          {/* Shield glow */}
          <ellipse cx="100" cy="163" rx="24" ry="24" fill="url(#sg2)" opacity="0.65"/>
          <path d="M100 143L80 152L80 169Q80 184 100 192Q120 184 120 169L120 152Z" fill="none" stroke="#60A5FA" strokeWidth="2" filter="url(#gf2)" opacity="0.95"/>
          <path d="M100 148L85 155L85 169Q85 180 100 186Q115 180 115 169L115 155Z" fill="rgba(37,99,235,0.15)"/>
          <path d="M92 162L98 169L110 155" stroke="#BAE6FD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" filter="url(#gf2)"/>
          <text x="100" y="173" textAnchor="middle" fill="#93C5FD" fontSize="11" fontFamily="monospace" fontWeight="bold" filter="url(#gf2)" opacity="0.95">TWH</text>
        </svg>
      </div>

      {/* ════ CITY SKYLINE ════ */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ zIndex: 5 }}>
        <svg viewBox="0 0 900 90" preserveAspectRatio="xMidYMax slice" style={{ display:"block", width:"100%" }}>
          <defs>
            <linearGradient id="sky2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#B8CCE8" stopOpacity="0.35"/>
              <stop offset="100%" stopColor="#A5B4FC" stopOpacity="0.12"/>
            </linearGradient>
          </defs>
          <path d="M0,90 L0,72 L18,72 L18,62 L28,62 L28,52 L38,52 L38,60 L52,60 L52,44 L57,44 L57,40 L63,40 L63,44 L68,44 L68,62 L78,62 L78,50 L86,50 L86,38 L92,38 L92,50 L100,50 L100,65 L114,65 L114,55 L120,55 L120,44 L128,44 L128,55 L135,55 L135,67 L144,67 L144,48 L154,48 L154,38 L162,38 L162,30 L170,30 L170,38 L178,38 L178,48 L185,48 L185,65 L196,65 L196,53 L206,53 L206,62 L216,62 L216,48 L226,48 L226,40 L232,32 L238,40 L238,48 L248,48 L248,63 L262,63 L262,54 L272,54 L272,44 L280,44 L280,34 L287,34 L287,44 L297,44 L297,58 L312,58 L312,47 L322,47 L322,38 L330,38 L330,47 L342,47 L342,60 L356,60 L356,50 L366,50 L366,42 L374,42 L374,50 L384,50 L384,63 L397,63 L397,52 L407,52 L407,40 L417,40 L417,32 L424,24 L431,32 L431,40 L440,40 L440,52 L452,52 L452,65 L462,65 L462,55 L472,55 L472,44 L480,44 L480,55 L492,55 L492,67 L502,67 L502,55 L512,55 L512,48 L520,48 L520,40 L527,34 L534,40 L534,48 L542,48 L542,58 L557,58 L557,65 L572,65 L572,55 L582,55 L582,44 L590,44 L590,55 L602,55 L602,68 L616,68 L616,58 L626,58 L626,50 L634,50 L634,42 L640,36 L646,42 L646,50 L654,50 L654,62 L667,62 L667,50 L677,50 L677,42 L685,42 L685,50 L697,50 L697,63 L712,63 L712,52 L722,52 L722,65 L732,65 L732,74 L747,74 L747,67 L757,67 L757,58 L764,58 L764,67 L778,67 L778,74 L793,74 L793,72 L810,72 L810,80 L830,80 L830,72 L850,72 L850,65 L900,65 L900,90 Z" fill="url(#sky2)"/>
        </svg>
      </div>

      {/* ════ FLOATING CARDS ════ */}
      {mounted && CARDS.map(card => {
        const { top, left, right } = card as any;
        return (
        <motion.div
          key={card.id}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1, y: [0, -7, 0] }}
          transition={{
            opacity: { duration: 0.35, delay: card.delay },
            scale:   { duration: 0.35, delay: card.delay },
            y: { duration: 3.5 + card.delay*0.3, repeat: Infinity, ease: "easeInOut", delay: card.delay*0.4 },
          }}
          className="absolute pointer-events-none"
          style={{ top, left, right, zIndex: 20 }}
        >
          <div className="rounded-xl overflow-hidden" style={GLASS}>
            {card.content}
          </div>
        </motion.div>
        );
      })}

      {/* ════ AMBIENT PARTICLES ════ */}
      {mounted && Array.from({length:18}).map((_,i) => (
        <motion.div
          key={`p${i}`}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: i%3===0?3:2, height: i%3===0?3:2,
            left: `${8+(i*79)%82}%`, top: `${4+(i*53)%88}%`,
            background: i%2===0?"rgba(96,165,250,0.7)":"rgba(192,132,252,0.55)",
            zIndex: 3,
          }}
          animate={{ opacity:[0.2,0.9,0.2], scale:[1,1.6,1] }}
          transition={{ duration: 2.2+(i%5)*0.4, repeat:Infinity, delay:(i*0.18)%3 }}
        />
      ))}
    </div>
  );
}
