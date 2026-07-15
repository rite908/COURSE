"use client";

import { useEffect, useRef } from "react";

interface P3 { x: number; y: number; z: number }
interface Arc { lat1: number; lng1: number; lat2: number; lng2: number; t: number; speed: number; purple: boolean }

function xyz(lat: number, lng: number, r: number): P3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const th  = (lng + 180) * (Math.PI / 180);
  return { x: -r * Math.sin(phi) * Math.cos(th), y: r * Math.cos(phi), z: r * Math.sin(phi) * Math.sin(th) };
}
function ry(p: P3, a: number): P3 { const c=Math.cos(a),s=Math.sin(a); return {x:p.x*c+p.z*s,y:p.y,z:-p.x*s+p.z*c}; }
function rx(p: P3, a: number): P3 { const c=Math.cos(a),s=Math.sin(a); return {x:p.x,y:p.y*c-p.z*s,z:p.y*s+p.z*c}; }

const CITIES = [
  {lat:40.7,lng:-74},{lat:51.5,lng:-0.1},{lat:35.7,lng:139.7},{lat:28.6,lng:77.2},
  {lat:1.3,lng:103.8},{lat:48.9,lng:2.3},{lat:37.6,lng:-122.4},{lat:55.7,lng:37.6},
  {lat:31.2,lng:121.5},{lat:-23.5,lng:-46.6},{lat:19.4,lng:-99.1},{lat:59.9,lng:30.3},
  {lat:25.2,lng:55.3},{lat:-33.9,lng:151.2},{lat:41,lng:29},{lat:43.7,lng:-79.4},
  {lat:52.4,lng:13.4},{lat:39.9,lng:116.4},
];

export default function GlobeCanvas() {
  const cvRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef(0);
  const ang = useRef(0);

  useEffect(() => {
    const cv = cvRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d")!;
    const W = cv.width, H = cv.height;
    const R  = W * 0.40;
    const cx = W / 2, cy = H * 0.48;
    const TILT = -0.20;

    const arcs: Arc[] = Array.from({length:16},(_,i) => ({
      lat1: CITIES[i%CITIES.length].lat, lng1: CITIES[i%CITIES.length].lng,
      lat2: CITIES[(i+5)%CITIES.length].lat, lng2: CITIES[(i+5)%CITIES.length].lng,
      t: Math.random(), speed: 0.0016+Math.random()*0.0022, purple: Math.random()>0.55,
    }));

    function frame() {
      ang.current += 0.0020;
      ctx.clearRect(0, 0, W, H);

      /* 1 — Outer glow halo */
      const g1 = ctx.createRadialGradient(cx, cy, R*0.1, cx, cy, R*1.7);
      g1.addColorStop(0,    "rgba(25,100,255,0.45)");
      g1.addColorStop(0.30, "rgba(40,110,255,0.30)");
      g1.addColorStop(0.60, "rgba(90,45,220,0.14)");
      g1.addColorStop(1,    "rgba(90,45,220,0)");
      ctx.beginPath(); ctx.arc(cx,cy,R*1.7,0,Math.PI*2);
      ctx.fillStyle = g1; ctx.fill();

      /* 2 — Sphere fill */
      const g2 = ctx.createRadialGradient(cx-R*0.20, cy-R*0.22, R*0.01, cx, cy, R);
      g2.addColorStop(0,    "#8ECFFF");
      g2.addColorStop(0.15, "rgba(68,148,255,0.90)");
      g2.addColorStop(0.48, "rgba(37,99,235,0.80)");
      g2.addColorStop(0.78, "rgba(67,48,200,0.65)");
      g2.addColorStop(1,    "rgba(109,40,217,0.45)");
      ctx.beginPath(); ctx.arc(cx,cy,R,0,Math.PI*2);
      ctx.fillStyle = g2; ctx.fill();

      /* 3 — Dense dot grid */
      const LS=22, LN=44;
      for(let li=0;li<=LS;li++){
        const lat=-90+(180/LS)*li;
        for(let lj=0;lj<=LN;lj++){
          const lng=-180+(360/LN)*lj;
          let p=xyz(lat,lng,R); p=ry(p,ang.current); p=rx(p,TILT);
          if(p.z<0) continue;
          const d=(p.z+R)/(2*R);
          ctx.beginPath();
          ctx.arc(cx+p.x, cy-p.y, 1.0+d*1.3, 0, Math.PI*2);
          ctx.fillStyle=`rgba(200,234,255,${0.35+d*0.58})`;
          ctx.fill();
        }
      }

      /* 4 — Lat lines */
      for(let i=1;i<13;i++){
        const lat=-90+(180/13)*i;
        ctx.beginPath(); let first=true;
        for(let j=0;j<=90;j++){
          let p=xyz(lat,-180+(360/90)*j,R); p=ry(p,ang.current); p=rx(p,TILT);
          if(p.z<0){ctx.stroke();ctx.beginPath();first=true;continue;}
          const a=0.14+((p.z+R)/(2*R))*0.32;
          ctx.strokeStyle=`rgba(165,220,255,${a})`; ctx.lineWidth=0.9;
          first?ctx.moveTo(cx+p.x,cy-p.y):ctx.lineTo(cx+p.x,cy-p.y); first=false;
        } ctx.stroke();
      }

      /* 5 — Lng lines */
      for(let i=0;i<18;i++){
        const lng=-180+(360/18)*i;
        ctx.beginPath(); let first=true;
        for(let j=0;j<=90;j++){
          let p=xyz(-90+(180/90)*j,lng,R); p=ry(p,ang.current); p=rx(p,TILT);
          if(p.z<0){ctx.stroke();ctx.beginPath();first=true;continue;}
          const a=0.11+((p.z+R)/(2*R))*0.26;
          ctx.strokeStyle=`rgba(165,220,255,${a})`; ctx.lineWidth=0.7;
          first?ctx.moveTo(cx+p.x,cy-p.y):ctx.lineTo(cx+p.x,cy-p.y); first=false;
        } ctx.stroke();
      }

      /* 6 — Arcs */
      arcs.forEach(arc => {
        arc.t += arc.speed; if(arc.t>1.25) arc.t=0;
        const ST=70;
        const pts:Array<{x:number;y:number;z:number}>=[];
        for(let i=0;i<=ST;i++){
          const t=i/ST;
          let p=xyz(arc.lat1*(1-t)+arc.lat2*t, arc.lng1*(1-t)+arc.lng2*t, R+Math.sin(Math.PI*t)*R*0.30);
          p=ry(p,ang.current); p=rx(p,TILT);
          pts.push({x:cx+p.x, y:cy-p.y, z:p.z});
        }
        const si=Math.floor(Math.max(0,arc.t-0.4)*ST), ei=Math.min(ST,Math.floor(arc.t*ST));
        ctx.beginPath(); let drw=false;
        for(let i=si;i<=ei;i++){
          const pt=pts[i]; if(!pt||pt.z<-R*0.05){drw=false;continue;}
          drw?ctx.lineTo(pt.x,pt.y):ctx.moveTo(pt.x,pt.y); drw=true;
        }
        ctx.strokeStyle=arc.purple?"rgba(200,130,255,0.95)":"rgba(100,170,255,1.0)";
        ctx.lineWidth=2.2; ctx.shadowBlur=16; ctx.shadowColor=arc.purple?"#A78BFA":"#3B82F6";
        ctx.stroke(); ctx.shadowBlur=0;
        const dot=pts[Math.min(ei,ST)];
        if(dot&&dot.z>=-R*0.05){
          ctx.beginPath(); ctx.arc(dot.x,dot.y,4.5,0,Math.PI*2);
          ctx.fillStyle=arc.purple?"#E9D5FF":"#BFDBFE";
          ctx.shadowBlur=22; ctx.shadowColor=arc.purple?"#7C3AED":"#2563EB";
          ctx.fill(); ctx.shadowBlur=0;
        }
      });

      /* 7 — City nodes */
      CITIES.forEach((city,idx)=>{
        let p=xyz(city.lat,city.lng,R); p=ry(p,ang.current); p=rx(p,TILT);
        if(p.z<0) return;
        const px=cx+p.x, py=cy-p.y, d=(p.z+R)/(2*R), pu=idx%4===2;
        ctx.beginPath(); ctx.arc(px,py,7,0,Math.PI*2);
        ctx.strokeStyle=pu?`rgba(220,180,255,${d*0.42})`:`rgba(150,215,255,${d*0.42})`; ctx.lineWidth=1; ctx.stroke();
        ctx.beginPath(); ctx.arc(px,py,3.5,0,Math.PI*2);
        ctx.strokeStyle=pu?`rgba(220,180,255,${d*0.78})`:`rgba(150,215,255,${d*0.78})`; ctx.lineWidth=1.2; ctx.stroke();
        ctx.beginPath(); ctx.arc(px,py,2,0,Math.PI*2);
        ctx.fillStyle=pu?`rgba(225,180,255,${d})`:`rgba(190,234,255,${d})`;
        ctx.shadowBlur=14; ctx.shadowColor=pu?"#A78BFA":"#60A5FA"; ctx.fill(); ctx.shadowBlur=0;
      });

      /* 8 — Rim */
      const rim=ctx.createRadialGradient(cx,cy,R*0.76,cx,cy,R*1.02);
      rim.addColorStop(0,"rgba(96,165,250,0)"); rim.addColorStop(0.75,"rgba(100,170,255,0.10)");
      rim.addColorStop(0.90,"rgba(147,200,255,0.30)"); rim.addColorStop(1,"rgba(147,200,255,0.48)");
      ctx.beginPath(); ctx.arc(cx,cy,R*1.02,0,Math.PI*2); ctx.fillStyle=rim; ctx.fill();

      /* 9 — Specular */
      const sp=ctx.createRadialGradient(cx-R*0.30,cy-R*0.30,0,cx-R*0.30,cy-R*0.30,R*0.52);
      sp.addColorStop(0,"rgba(220,242,255,0.30)"); sp.addColorStop(1,"rgba(220,242,255,0)");
      ctx.beginPath(); ctx.arc(cx,cy,R,0,Math.PI*2); ctx.fillStyle=sp; ctx.fill();

      animRef.current = requestAnimationFrame(frame);
    }

    frame();
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <canvas
      ref={cvRef}
      width={900}
      height={900}
      style={{ display:"block", width:"100%", height:"100%", position:"absolute", inset:0 }}
    />
  );
}
