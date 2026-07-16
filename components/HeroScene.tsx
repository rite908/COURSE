"use client";

import { motion } from "framer-motion";

/* Deterministic bar heights for the "Packets" mini chart — fixed values only,
   never Math.random(), so server-rendered and client-hydrated markup match exactly. */
const PACKET_BARS = [3, 5, 4, 7, 6, 8, 5, 9, 7, 8];

/* ── Floating glass cards ── */
const GLASS = {
  background: "rgba(255,255,255,0.94)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,1)",
  boxShadow: "0 8px 32px rgba(37,99,235,0.14), 0 2px 8px rgba(0,0,0,0.06)",
  borderRadius: 14,
};

export default function HeroScene() {
  return (
    <div className="relative w-full h-full px-3 sm:px-6 lg:pr-8 max-w-[520px] mx-auto lg:max-w-none" style={{ minHeight: 380 }}>

      {/* ════ GLOBE (CSS + SVG) ════ */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ zIndex: 1 }}
      >
        {/* Outer ambient haze */}
        <div style={{
          position: "absolute",
          width: "100%", height: "100%",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(37,99,235,0.22) 0%, rgba(99,102,241,0.12) 45%, transparent 70%)",
          filter: "blur(36px)",
        }} />

        {/* Main sphere */}
        <div className="w-[72%] max-w-[300px] lg:max-w-none" style={{
          position: "relative",
          aspectRatio: "1",
          borderRadius: "50%",
          background: "radial-gradient(circle at 37% 33%, #9DD3FF 0%, #4A9EFF 16%, #2563EB 40%, #3730A3 66%, #5B21B6 88%)",
          boxShadow: [
            "0 0 0 1px rgba(147,197,253,0.25)",
            "0 0 60px 20px rgba(37,99,235,0.50)",
            "0 0 120px 50px rgba(99,102,241,0.28)",
            "0 0 200px 80px rgba(37,99,235,0.14)",
          ].join(", "),
        }}>
          {/* Grid SVG */}
          <svg
            viewBox="0 0 400 400"
            className="absolute inset-0 w-full h-full"
            style={{ borderRadius: "50%", opacity: 0.55 }}
          >
            <defs>
              <clipPath id="sClip"><circle cx="200" cy="200" r="200" /></clipPath>
            </defs>
            <g clipPath="url(#sClip)">
              {[36,72,108,144,180,216,252,288,324,360].map(y => (
                <line key={`h${y}`} x1="0" y1={y} x2="400" y2={y} stroke="rgba(190,225,255,0.45)" strokeWidth="0.8" />
              ))}
              {[36,72,108,144,180,216,252,288,324,360].map(x => (
                <line key={`v${x}`} x1={x} y1="0" x2={x} y2="400" stroke="rgba(190,225,255,0.45)" strokeWidth="0.8" />
              ))}
              {[-320,-240,-160,-80,0,80,160,240,320,400,480].map(o => (
                <line key={`d${o}`} x1={o} y1="0" x2={o+400} y2="400" stroke="rgba(190,225,255,0.20)" strokeWidth="0.5" />
              ))}
              {Array.from({length:16},(_,li) => Array.from({length:16},(_,lj) => {
                const x=25+lj*25, y=25+li*25, dx=x-200, dy=y-200;
                if(dx*dx+dy*dy>185*185) return null;
                const d=1-Math.sqrt(dx*dx+dy*dy)/200;
                return <circle key={`dot${li}-${lj}`} cx={x} cy={y} r={1.3+d*1.1} fill={`rgba(215,238,255,${0.28+d*0.58})`} />;
              }))}
            </g>
          </svg>

          {/* Animated arcs */}
          <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full" style={{ borderRadius: "50%", overflow: "hidden" }}>
            <defs>
              <clipPath id="sClip2"><circle cx="200" cy="200" r="200" /></clipPath>
              <filter id="arcGlow"><feGaussianBlur stdDeviation="2.5" result="b"/><feComposite in="SourceGraphic" in2="b" operator="over"/></filter>
            </defs>
            <g clipPath="url(#sClip2)" filter="url(#arcGlow)">
              {[
                { d: "M 55 290 Q 155 55 325 175",  stroke: "rgba(100,170,250,0.95)", dash: 310, dur: 3.4,  delay: 0   },
                { d: "M 35 145 Q 200 18 368 210",  stroke: "rgba(196,128,255,0.90)", dash: 390, dur: 4.4,  delay: 1.1 },
                { d: "M 95 345 Q 255 100 388 290", stroke: "rgba(100,170,250,0.85)", dash: 330, dur: 5.2,  delay: 2.2 },
                { d: "M 25 200 Q 165 355 345 115", stroke: "rgba(167,139,250,0.80)", dash: 370, dur: 6.0,  delay: 0.6 },
              ].map((arc, i) => (
                <motion.path
                  key={i}
                  d={arc.d}
                  fill="none"
                  stroke={arc.stroke}
                  strokeWidth={1.8}
                  strokeDasharray={arc.dash}
                  animate={{ strokeDashoffset: [arc.dash, -arc.dash] }}
                  transition={{ duration: arc.dur, repeat: Infinity, ease: "linear", delay: arc.delay }}
                />
              ))}
            </g>
          </svg>

          {/* Specular highlight */}
          <div style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            background: "radial-gradient(circle at 34% 30%, rgba(225,245,255,0.30) 0%, transparent 52%)",
          }} />

          {/* Rim glow */}
          <div style={{
            position: "absolute", inset: "-3px", borderRadius: "50%",
            background: "radial-gradient(circle at center, transparent 70%, rgba(147,197,253,0.45) 85%, rgba(147,197,253,0.60) 93%, transparent 100%)",
          }} />
        </div>

        {/* Orbital rings */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
          style={{
            position: "absolute",
            width: "98%", height: "31%", borderRadius: "50%",
            border: "1px solid rgba(147,210,255,0.32)",
          }}
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          style={{
            position: "absolute",
            width: "85%", height: "26%", borderRadius: "50%",
            border: "1px solid rgba(192,132,252,0.24)",
            transform: "rotateX(70deg)",
          }}
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 38, repeat: Infinity, ease: "linear" }}
          style={{
            position: "absolute",
            width: "105%", height: "105%", borderRadius: "50%",
            border: "1px solid rgba(96,165,250,0.08)",
          }}
        />
      </div>

      {/* ════ TWH LOGO ════ */}
      <div
        className="absolute bottom-0 left-1/2 pointer-events-none"
        style={{ width: "44%", maxWidth: 260, transform: "translateX(-50%)", zIndex: 10 }}
      >
        {/* Ground glow */}
        <div style={{
          position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
          width: "200%", height: 28,
          background: "radial-gradient(ellipse, rgba(37,99,235,0.50) 0%, transparent 70%)",
          filter: "blur(10px)",
        }} />
        {/* Pulse rings */}
        <motion.div
          animate={{ scaleX: [1,1.20,1], opacity: [0.50,0.10,0.50] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position:"absolute", bottom:-4, left:"50%", transform:"translateX(-50%)",
            width:"160%", height:20, borderRadius:"50%",
            border:"1.5px solid rgba(96,165,250,0.85)", zIndex:1
          }}
        />
        <motion.div
          animate={{ scaleX:[1,1.30,1], opacity:[0.28,0.04,0.28] }}
          transition={{ duration:2.6, repeat:Infinity, ease:"easeInOut", delay:0.7 }}
          style={{
            position:"absolute", bottom:-4, left:"50%", transform:"translateX(-50%)",
            width:"200%", height:28, borderRadius:"50%",
            border:"1px solid rgba(139,92,246,0.60)", zIndex:1
          }}
        />
        {/* Actual logo image */}
        <motion.img
          src="/twh-logo.png"
          alt="TWH Academy"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4.0, repeat: Infinity, ease: "easeInOut" }}
          style={{
            width: "100%",
            position: "relative",
            zIndex: 2,
            filter: "drop-shadow(0 0 24px rgba(37,99,235,0.55)) drop-shadow(0 0 8px rgba(99,102,241,0.40))",
          }}
        />
      </div>

      {/* ════ CITY SKYLINE ════ */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ zIndex: 5 }}>
        <svg viewBox="0 0 900 90" preserveAspectRatio="xMidYMax slice" style={{ display:"block", width:"100%" }}>
          <defs>
            <linearGradient id="cityGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#A5B8D8" stopOpacity="0.38"/>
              <stop offset="100%" stopColor="#8096C0" stopOpacity="0.12"/>
            </linearGradient>
          </defs>
          <path d="M0,90 L0,72 L18,72 L18,62 L28,62 L28,52 L38,52 L38,60 L52,60 L52,44 L57,44 L57,40 L63,40 L63,44 L68,44 L68,62 L78,62 L78,50 L86,50 L86,38 L92,38 L92,50 L100,50 L100,65 L114,65 L114,55 L120,55 L120,44 L128,44 L128,55 L135,55 L135,67 L144,67 L144,48 L154,48 L154,38 L162,38 L162,30 L170,30 L170,38 L178,38 L178,48 L185,48 L185,65 L196,65 L196,53 L206,53 L206,62 L216,62 L216,48 L226,48 L226,40 L232,32 L238,40 L238,48 L248,48 L248,63 L262,63 L262,54 L272,54 L272,44 L280,44 L280,34 L287,34 L287,44 L297,44 L297,58 L312,58 L312,47 L322,47 L322,38 L330,38 L330,47 L342,47 L342,60 L356,60 L356,50 L366,50 L366,42 L374,42 L374,50 L384,50 L384,63 L397,63 L397,52 L407,52 L407,40 L417,40 L417,32 L424,24 L431,32 L431,40 L440,40 L440,52 L452,52 L452,65 L462,65 L462,55 L472,55 L472,44 L480,44 L480,55 L492,55 L492,67 L502,67 L502,55 L512,55 L512,48 L520,48 L520,40 L527,34 L534,40 L534,48 L542,48 L542,58 L557,58 L557,65 L572,65 L572,55 L582,55 L582,44 L590,44 L590,55 L602,55 L602,68 L616,68 L616,58 L626,58 L626,50 L634,50 L634,42 L640,36 L646,42 L646,50 L654,50 L654,62 L667,62 L667,50 L677,50 L677,42 L685,42 L685,50 L697,50 L697,63 L712,63 L712,52 L722,52 L722,65 L732,65 L732,74 L747,74 L747,67 L757,67 L757,58 L764,58 L764,67 L778,67 L778,74 L793,74 L793,72 L810,72 L810,80 L830,80 L830,72 L850,72 L850,65 L900,65 L900,90 Z"
            fill="url(#cityGrad)"/>
        </svg>
      </div>

      {/* ════ FLOATING GLASS CARDS ════ */}
      {/* Hidden on small screens to avoid overlapping the globe/figure — shown from sm breakpoint up */}

      {/* Card 1 — IP pill, top-left */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ y: { duration: 3.6, repeat: Infinity, ease: "easeInOut" } }}
        className="hidden sm:block absolute pointer-events-none"
        style={{ top: "10%", left: "2%", zIndex: 20 }}
      >
        <div style={GLASS}>
          <div className="flex items-center gap-2 px-3 py-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
            <span className="font-mono text-xs font-bold text-gray-800">192.168.1.1</span>
            <span className="text-[10px] text-gray-400 ml-0.5">▶</span>
          </div>
        </div>
      </motion.div>

      {/* Card 2 — IP Scan, top-right */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ y: { duration: 4.0, repeat: Infinity, ease: "easeInOut", delay: 0.5 } }}
        className="hidden sm:block absolute pointer-events-none"
        style={{ top: "6%", right: "2%", zIndex: 20 }}
      >
        <div style={GLASS}>
          <div className="px-4 py-3 space-y-1 min-w-[130px]">
            <div className="text-[9px] font-black text-blue-600 tracking-widest uppercase">IP Scanning</div>
            <div className="font-mono text-[12px] font-bold text-gray-800">192.168.1.1</div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
              <span className="text-[9px] text-gray-500 uppercase tracking-wide font-semibold">Active</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Card 3 — Packets bar, right-center */}
      <motion.div
        animate={{ y: [0, -7, 0] }}
        transition={{ y: { duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.8 } }}
        className="hidden sm:block absolute pointer-events-none"
        style={{ top: "50%", right: "0%", zIndex: 20, transform: "translateY(-50%)" }}
      >
        <div style={GLASS}>
          <div className="px-4 py-3 min-w-[118px]">
            <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Packets</div>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-xl font-black text-gray-800 leading-none">724K</span>
              <span className="text-[10px] text-green-500 font-bold mb-0.5">+12.5%</span>
            </div>
            <div className="flex items-end gap-[2px]">
              {PACKET_BARS.map((h,i) => (
                <div key={i} className="w-2 rounded-sm" style={{ height: h*3.2, background: `rgba(37,99,235,${0.32+h*0.07})` }} />
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ════ PARTICLES ════ */}
      {Array.from({length:16}).map((_,i) => (
        <motion.div
          key={`p${i}`}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: i%3===0?3:2, height: i%3===0?3:2,
            left: `${8+(i*77)%80}%`, top: `${5+(i*51)%86}%`,
            background: i%2===0?"rgba(96,165,250,0.75)":"rgba(192,132,252,0.60)",
            zIndex: 3,
          }}
          animate={{ opacity:[0.2,0.95,0.2], scale:[1,1.7,1] }}
          transition={{ duration: 2.0+(i%5)*0.45, repeat:Infinity, delay:(i*0.17)%3 }}
        />
      ))}
    </div>
  );
}
