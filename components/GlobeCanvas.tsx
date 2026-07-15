"use client";

import { useEffect, useRef } from "react";

interface Point3D { x: number; y: number; z: number }
interface Arc { lat1: number; lng1: number; lat2: number; lng2: number; progress: number; speed: number; color: string }

function toXYZ(lat: number, lng: number, r: number): Point3D {
  const phi   = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return {
    x: -r * Math.sin(phi) * Math.cos(theta),
    y:  r * Math.cos(phi),
    z:  r * Math.sin(phi) * Math.sin(theta),
  };
}

function rotateY(p: Point3D, angle: number): Point3D {
  const cos = Math.cos(angle), sin = Math.sin(angle);
  return { x: p.x * cos + p.z * sin, y: p.y, z: -p.x * sin + p.z * cos };
}

function rotateX(p: Point3D, angle: number): Point3D {
  const cos = Math.cos(angle), sin = Math.sin(angle);
  return { x: p.x, y: p.y * cos - p.z * sin, z: p.y * sin + p.z * cos };
}

const CITIES = [
  { lat: 40.7, lng: -74.0, label: "NY" },
  { lat: 51.5, lng: -0.1,  label: "LO" },
  { lat: 35.7, lng: 139.7, label: "TK" },
  { lat: 28.6, lng: 77.2,  label: "DL" },
  { lat: 1.3,  lng: 103.8, label: "SG" },
  { lat: -23.5, lng: -46.6, label: "SP" },
  { lat: 48.9, lng: 2.3,   label: "PA" },
  { lat: 37.6, lng: -122.4, label: "SF" },
  { lat: 55.7, lng: 37.6,  label: "MO" },
  { lat: 31.2, lng: 121.5, label: "SH" },
];

const ARC_COLORS = ["#2563EB", "#0EA5E9", "#7C3AED"];

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
      const parent = canvas.parentElement;
      const size = parent
        ? Math.min(parent.offsetWidth, parent.offsetHeight)
        : 400;
      canvas.width  = size || 400;
      canvas.height = size || 400;
    };
    resize();
    // Delay one frame to let layout settle
    requestAnimationFrame(resize);
    const observer = new ResizeObserver(() => requestAnimationFrame(resize));
    observer.observe(canvas.parentElement ?? canvas);

    const arcs: Arc[] = Array.from({ length: 8 }, (_, i) => ({
      lat1: CITIES[i % CITIES.length].lat,
      lng1: CITIES[i % CITIES.length].lng,
      lat2: CITIES[(i + 3) % CITIES.length].lat,
      lng2: CITIES[(i + 3) % CITIES.length].lng,
      progress: Math.random(),
      speed: 0.003 + Math.random() * 0.003,
      color: ARC_COLORS[i % ARC_COLORS.length],
    }));

    const TILT = -0.3;

    const draw = () => {
      const w = canvas.width, h = canvas.height;
      const R = w * 0.38;
      const cx = w / 2, cy = h / 2;
      angleRef.current += 0.003;
      ctx.clearRect(0, 0, w, h);

      // Outer glow ring
      const grad = ctx.createRadialGradient(cx, cy, R * 0.85, cx, cy, R * 1.15);
      grad.addColorStop(0, "rgba(37,99,235,0.08)");
      grad.addColorStop(1, "rgba(37,99,235,0)");
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.15, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Globe base
      const sphereGrad = ctx.createRadialGradient(cx - R * 0.2, cy - R * 0.2, R * 0.05, cx, cy, R);
      sphereGrad.addColorStop(0, "rgba(239,246,255,0.9)");
      sphereGrad.addColorStop(0.6, "rgba(219,234,254,0.5)");
      sphereGrad.addColorStop(1, "rgba(147,197,253,0.2)");
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = sphereGrad;
      ctx.fill();

      // Lat/Lng lines
      const totalLat = 8, totalLng = 12;
      ctx.strokeStyle = "rgba(37,99,235,0.12)";
      ctx.lineWidth = 0.6;

      for (let i = 1; i < totalLat; i++) {
        const lat = -90 + (180 / totalLat) * i;
        ctx.beginPath();
        let first = true;
        for (let j = 0; j <= 72; j++) {
          const lng = -180 + (360 / 72) * j;
          let p = toXYZ(lat, lng, R);
          p = rotateY(p, angleRef.current);
          p = rotateX(p, TILT);
          if (p.z >= 0) {
            const px = cx + p.x, py = cy - p.y;
            first ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
            first = false;
          } else { first = true }
        }
        ctx.stroke();
      }

      for (let i = 0; i < totalLng; i++) {
        const lng = -180 + (360 / totalLng) * i;
        ctx.beginPath();
        let first = true;
        for (let j = 0; j <= 72; j++) {
          const lat = -90 + (180 / 72) * j;
          let p = toXYZ(lat, lng, R);
          p = rotateY(p, angleRef.current);
          p = rotateX(p, TILT);
          if (p.z >= 0) {
            const px = cx + p.x, py = cy - p.y;
            first ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
            first = false;
          } else { first = true }
        }
        ctx.stroke();
      }

      // Arcs
      arcs.forEach((arc) => {
        arc.progress += arc.speed;
        if (arc.progress > 1) arc.progress = 0;

        const steps = 60;
        const pts: { x: number; y: number; visible: boolean }[] = [];

        for (let i = 0; i <= steps; i++) {
          const t = i / steps;
          const lat = arc.lat1 + (arc.lat2 - arc.lat1) * t;
          const lng = arc.lat1 + (arc.lng2 - arc.lng1) * t;
          // Proper interpolation
          const lat2 = arc.lat1 * (1 - t) + arc.lat2 * t;
          const lng2 = arc.lng1 * (1 - t) + arc.lng2 * t;
          const h2   = Math.sin(Math.PI * t) * R * 0.3;
          let p  = toXYZ(lat2, lng2, R + h2);
          p = rotateY(p, angleRef.current);
          p = rotateX(p, TILT);
          pts.push({ x: cx + p.x, y: cy - p.y, visible: p.z >= 0 });
        }

        // Draw trail (last 30% of arc behind progress point)
        const trailStart = Math.max(0, arc.progress - 0.3);
        ctx.beginPath();
        let drawing = false;
        for (let i = Math.floor(trailStart * steps); i <= Math.floor(arc.progress * steps); i++) {
          const pt = pts[i];
          if (!pt || !pt.visible) { drawing = false; continue }
          if (!drawing) { ctx.moveTo(pt.x, pt.y); drawing = true }
          else ctx.lineTo(pt.x, pt.y);
        }
        const trailGrad = ctx.createLinearGradient(0, 0, canvas.width, 0);
        trailGrad.addColorStop(0, `${arc.color}00`);
        trailGrad.addColorStop(1, arc.color);
        ctx.strokeStyle = arc.color;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.7;
        ctx.stroke();
        ctx.globalAlpha = 1;

        // Packet dot
        const dotIdx = Math.floor(arc.progress * steps);
        const dot = pts[dotIdx];
        if (dot && dot.visible) {
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = arc.color;
          ctx.shadowBlur = 8;
          ctx.shadowColor = arc.color;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      // City nodes
      CITIES.forEach((city) => {
        let p = toXYZ(city.lat, city.lng, R);
        p = rotateY(p, angleRef.current);
        p = rotateX(p, TILT);
        if (p.z < 0) return;
        const px = cx + p.x, py = cy - p.y;

        // Ping ring
        ctx.beginPath();
        ctx.arc(px, py, 5, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(37,99,235,0.25)";
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fillStyle = "#2563EB";
        ctx.shadowBlur = 6;
        ctx.shadowColor = "#2563EB";
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className}`}
      style={{ display: "block" }}
    />
  );
}
