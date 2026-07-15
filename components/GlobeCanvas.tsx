"use client";

import { useEffect, useRef } from "react";

interface Point3D { x: number; y: number; z: number }
interface Arc { lat1: number; lng1: number; lat2: number; lng2: number; progress: number; speed: number; hue: number }

function toXYZ(lat: number, lng: number, r: number): Point3D {
  const phi   = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return {
    x: -r * Math.sin(phi) * Math.cos(theta),
    y:  r * Math.cos(phi),
    z:  r * Math.sin(phi) * Math.sin(theta),
  };
}

function rotateY(p: Point3D, a: number): Point3D {
  const c = Math.cos(a), s = Math.sin(a);
  return { x: p.x * c + p.z * s, y: p.y, z: -p.x * s + p.z * c };
}
function rotateX(p: Point3D, a: number): Point3D {
  const c = Math.cos(a), s = Math.sin(a);
  return { x: p.x, y: p.y * c - p.z * s, z: p.y * s + p.z * c };
}

const CITIES = [
  { lat: 40.7, lng: -74.0 }, { lat: 51.5, lng: -0.1  }, { lat: 35.7, lng: 139.7 },
  { lat: 28.6, lng:  77.2 }, { lat:  1.3, lng: 103.8 }, { lat: 48.9, lng:   2.3 },
  { lat: 37.6, lng:-122.4 }, { lat: 55.7, lng:  37.6 }, { lat: 31.2, lng: 121.5 },
  { lat:-23.5, lng: -46.6 }, { lat: 19.4, lng: -99.1 }, { lat: 59.9, lng:  30.3 },
  { lat: 25.2, lng:  55.3 }, { lat:-33.9, lng: 151.2 }, { lat: 41.0, lng:  29.0 },
  { lat: 43.7, lng: -79.4 }, { lat: 52.4, lng:  13.4 }, { lat: 39.9, lng: 116.4 },
];

export default function GlobeCanvas({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef   = useRef<number>(0);
  const angleRef  = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      // Use the canvas's own bounding rect (works with CSS w-full h-full)
      const rect = canvas.getBoundingClientRect();
      const w = Math.round(rect.width)  || canvas.parentElement?.offsetWidth  || 500;
      const h = Math.round(rect.height) || canvas.parentElement?.offsetHeight || 500;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width  = w;
        canvas.height = h;
      }
    };
    resize();
    requestAnimationFrame(resize);
    const observer = new ResizeObserver(() => requestAnimationFrame(resize));
    observer.observe(canvas);

    const arcs: Arc[] = Array.from({ length: 14 }, (_, i) => ({
      lat1: CITIES[i % CITIES.length].lat,
      lng1: CITIES[i % CITIES.length].lng,
      lat2: CITIES[(i + 5) % CITIES.length].lat,
      lng2: CITIES[(i + 5) % CITIES.length].lng,
      progress: Math.random(),
      speed: 0.002 + Math.random() * 0.003,
      hue: Math.random() > 0.6 ? 260 : 220, // mix blue & purple
    }));

    const TILT = -0.3;

    const draw = () => {
      const w = canvas.width, h = canvas.height;
      const R  = w * 0.40;
      const cx = w / 2, cy = h / 2;
      angleRef.current += 0.0025;
      ctx.clearRect(0, 0, w, h);

      // ── Outer glow ring (CSS-like blur via compositing) ──
      const outerGlow = ctx.createRadialGradient(cx, cy, R * 0.7, cx, cy, R * 1.3);
      outerGlow.addColorStop(0,   "rgba(67,97,238,0)");
      outerGlow.addColorStop(0.6, "rgba(67,97,238,0.12)");
      outerGlow.addColorStop(1,   "rgba(124,58,237,0)");
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.3, 0, Math.PI * 2);
      ctx.fillStyle = outerGlow;
      ctx.fill();

      // ── Globe base sphere (filled glow) ──
      const sphereFill = ctx.createRadialGradient(cx - R * 0.15, cy - R * 0.15, R * 0.02, cx, cy, R);
      sphereFill.addColorStop(0,   "rgba(147,197,253,0.32)");
      sphereFill.addColorStop(0.4, "rgba(99,179,237,0.22)");
      sphereFill.addColorStop(0.75,"rgba(67,97,238,0.16)");
      sphereFill.addColorStop(1,   "rgba(124,58,237,0.08)");
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = sphereFill;
      ctx.fill();

      // ── Latitude lines ──
      const latCount = 10;
      for (let i = 1; i < latCount; i++) {
        const lat = -90 + (180 / latCount) * i;
        ctx.beginPath();
        let first = true;
        for (let j = 0; j <= 80; j++) {
          const lng = -180 + (360 / 80) * j;
          let p = toXYZ(lat, lng, R);
          p = rotateY(p, angleRef.current);
          p = rotateX(p, TILT);
          if (p.z >= -R * 0.1) {
            const alpha = Math.max(0, (p.z + R) / (2 * R));
            ctx.strokeStyle = `rgba(147,197,253,${0.15 + alpha * 0.35})`;
            ctx.lineWidth = 0.7;
            const px = cx + p.x, py = cy - p.y;
            first ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
            first = false;
          } else { first = true }
        }
        ctx.stroke();
      }

      // ── Longitude lines ──
      const lngCount = 16;
      for (let i = 0; i < lngCount; i++) {
        const lng = -180 + (360 / lngCount) * i;
        ctx.beginPath();
        let first = true;
        for (let j = 0; j <= 80; j++) {
          const lat = -90 + (180 / 80) * j;
          let p = toXYZ(lat, lng, R);
          p = rotateY(p, angleRef.current);
          p = rotateX(p, TILT);
          if (p.z >= -R * 0.1) {
            const alpha = Math.max(0, (p.z + R) / (2 * R));
            ctx.strokeStyle = `rgba(147,197,253,${0.12 + alpha * 0.3})`;
            ctx.lineWidth = 0.6;
            const px = cx + p.x, py = cy - p.y;
            first ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
            first = false;
          } else { first = true }
        }
        ctx.stroke();
      }

      // ── Arcs ──
      arcs.forEach((arc) => {
        arc.progress += arc.speed;
        if (arc.progress > 1.3) arc.progress = 0;

        const steps  = 60;
        const pts: { x: number; y: number; z: number }[] = [];

        for (let i = 0; i <= steps; i++) {
          const t    = i / steps;
          const lat2 = arc.lat1 * (1 - t) + arc.lat2 * t;
          const lng2 = arc.lng1 * (1 - t) + arc.lng2 * t;
          const lift = Math.sin(Math.PI * t) * R * 0.28;
          let p  = toXYZ(lat2, lng2, R + lift);
          p = rotateY(p, angleRef.current);
          p = rotateX(p, TILT);
          pts.push({ ...p, x: cx + p.x, y: cy - p.y });
        }

        // Trail
        const trailStart = Math.max(0, arc.progress - 0.35);
        const startIdx   = Math.floor(trailStart * steps);
        const endIdx     = Math.min(steps, Math.floor(arc.progress * steps));

        ctx.beginPath();
        let drawing = false;
        for (let i = startIdx; i <= endIdx; i++) {
          const pt = pts[i];
          if (!pt || pt.z < -R * 0.05) { drawing = false; continue }
          const alpha = ((i - startIdx) / Math.max(1, endIdx - startIdx));
          if (!drawing) { ctx.moveTo(pt.x, pt.y); drawing = true }
          else ctx.lineTo(pt.x, pt.y);
        }
        const isBlue = arc.hue === 220;
        ctx.strokeStyle = isBlue ? "rgba(99,179,237,0.8)" : "rgba(167,139,250,0.7)";
        ctx.lineWidth = 1.2;
        ctx.shadowBlur  = 8;
        ctx.shadowColor = isBlue ? "#60A5FA" : "#A78BFA";
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Packet dot
        const dotIdx = Math.min(endIdx, Math.floor(arc.progress * steps));
        const dot = pts[dotIdx];
        if (dot && dot.z >= -R * 0.05) {
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, 2.5, 0, Math.PI * 2);
          ctx.fillStyle   = isBlue ? "#93C5FD" : "#C4B5FD";
          ctx.shadowBlur  = 12;
          ctx.shadowColor = isBlue ? "#3B82F6" : "#7C3AED";
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      // ── City nodes ──
      CITIES.forEach((city, idx) => {
        let p = toXYZ(city.lat, city.lng, R);
        p = rotateY(p, angleRef.current);
        p = rotateX(p, TILT);
        if (p.z < -R * 0.05) return;
        const px = cx + p.x, py = cy - p.y;
        const depthAlpha = Math.max(0.3, (p.z + R) / (2 * R));
        const isPurple = idx % 3 === 2;

        // Pulse ring
        ctx.beginPath();
        ctx.arc(px, py, 7, 0, Math.PI * 2);
        ctx.strokeStyle = isPurple
          ? `rgba(196,181,253,${depthAlpha * 0.35})`
          : `rgba(147,197,253,${depthAlpha * 0.35})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // Outer ring
        ctx.beginPath();
        ctx.arc(px, py, 4.5, 0, Math.PI * 2);
        ctx.strokeStyle = isPurple
          ? `rgba(196,181,253,${depthAlpha * 0.6})`
          : `rgba(147,197,253,${depthAlpha * 0.6})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Inner dot
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fillStyle   = isPurple ? `rgba(216,180,254,${depthAlpha})` : `rgba(147,197,253,${depthAlpha})`;
        ctx.shadowBlur  = 12;
        ctx.shadowColor = isPurple ? "#A78BFA" : "#60A5FA";
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // ── Edge highlight (rim light) ──
      const edgeGrad = ctx.createRadialGradient(cx, cy, R * 0.7, cx, cy, R);
      edgeGrad.addColorStop(0,   "rgba(99,179,237,0)");
      edgeGrad.addColorStop(0.65,"rgba(99,179,237,0)");
      edgeGrad.addColorStop(0.85,"rgba(147,197,253,0.18)");
      edgeGrad.addColorStop(1,   "rgba(147,197,253,0.28)");
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = edgeGrad;
      ctx.fill();

      // ── Inner specular highlight (top-left) ──
      const specGrad = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.3, 0, cx - R * 0.3, cy - R * 0.3, R * 0.55);
      specGrad.addColorStop(0,   "rgba(219,234,254,0.18)");
      specGrad.addColorStop(1,   "rgba(219,234,254,0)");
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = specGrad;
      ctx.fill();

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => { cancelAnimationFrame(animRef.current); observer.disconnect(); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className}`}
      style={{ display: "block" }}
    />
  );
}
