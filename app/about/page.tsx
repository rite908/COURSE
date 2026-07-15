"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Shield, Code2, Globe, Heart, ArrowRight,
  BookOpen, Award, Users, Zap, Target, Star,
} from "lucide-react";

const STATS = [
  { value: "2016", label: "Hacking Started",  color: "#2563EB", bg: "#EEF3FF" },
  { value: "10+",  label: "Years Experience", color: "#7C3AED", bg: "#F3EEFF" },
  { value: "500+", label: "Students Trained", color: "#0EA5E9", bg: "#F0F9FF" },
  { value: "Free", label: "Always",           color: "#059669", bg: "#ECFDF5" },
];

const VALUES = [
  {
    icon: <Heart size={20} />, color: "#2563EB", bg: "#EEF3FF",
    title: "Education for Everyone",
    desc: "Cybersecurity sirf expensive bootcamps ke liye nahi. TWH Academy mein sab kuch free hai — kyunki knowledge par kisi ka haq nahi hona chahiye.",
  },
  {
    icon: <Shield size={20} />, color: "#7C3AED", bg: "#F3EEFF",
    title: "Ethics First",
    desc: "Hacking sikhna ek responsibility hai. Yahan sikhaya jaata hai — permission ke saath, legally, aur doosron ki madad ke liye. Black hat nahi, White hat.",
  },
  {
    icon: <Code2 size={20} />, color: "#0EA5E9", bg: "#F0F9FF",
    title: "Hinglish mein Seekho",
    desc: "English barrier ki wajah se bahut log cybersecurity nahi seekh paate. Yeh course Hinglish mein hai — jaise Afsar khud baat karta hai.",
  },
  {
    icon: <Globe size={20} />, color: "#059669", bg: "#ECFDF5",
    title: "India ki Cybersecurity",
    desc: "India ka digital infrastructure badh raha hai aur cybersecurity experts ki zaroorat bhi. TWH Academy yahan ki next generation tayaar kar raha hai.",
  },
];

const JOURNEY = [
  { year: "2016", event: "12 saal ki umar mein pehli baar computer kholaa — aur seedha andar ghus gaya.", color: "#2563EB" },
  { year: "2018", event: "Ethical hacking ki duniya discover ki. Pehla CTF solve kiya. Addiction shuru.", color: "#7C3AED" },
  { year: "2020", event: "OSINT mein specialization — India ka pehla free OSINT platform banaya: TWH OSINT.", color: "#0EA5E9" },
  { year: "2022", event: "Full-stack development seekha. Security aur software dono ek saath develop karna shuru kiya.", color: "#059669" },
  { year: "2024", event: "TWH Academy launch — pehla free Hinglish ethical hacking course India ke liye.", color: "#D97706" },
];

export default function AboutPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <main className="min-h-screen" style={{ background: "#F8FAFF", paddingTop: 72 }}>

      {/* ── Hero ── */}
      <section
        className="px-6 py-20"
        style={{ background: "linear-gradient(145deg,#FFFFFF 0%,#F5F8FF 60%,#EEF2FF 100%)" }}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

          {/* Left */}
          <motion.div
            initial={mounted ? { opacity: 0, y: 24 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-6">
              <Star size={12} className="text-blue-500" />
              <span className="text-[12px] font-bold text-blue-600 uppercase tracking-wider">About TWH Academy</span>
            </div>
            <h1
              className="font-black text-gray-900 mb-5 leading-tight"
              style={{ fontSize: "clamp(1.9rem, 3.5vw, 2.8rem)", letterSpacing: "-0.03em" }}
            >
              India Ka{" "}
              <span style={{
                background: "linear-gradient(130deg,#2563EB,#7C3AED)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>
                Sabse Bada
              </span>
              {" "}Free Ethical Hacking Course
            </h1>
            <p className="text-gray-500 text-base leading-relaxed mb-8">
              TWH Academy ek mission se bana hai — India mein cybersecurity education ko accessible banana. Afsar Ali ne yeh course isliye banaya kyunki woh khud chahte the ki unhe iske liye koi paisa na dena padta.
            </p>
            <p className="text-gray-500 text-base leading-relaxed mb-10">
              Yahan sirf theory nahi — real-world skills, Hinglish mein, practical examples ke saath. Har topic aisa likha gaya hai jaise ek dost samjha raha ho, koi professor nahi.
            </p>
            <Link href="/chapters">
              <motion.div
                whileHover={{ scale: 1.03, boxShadow: "0 8px 28px rgba(37,99,235,0.22)" }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-3 px-7 py-3.5 rounded-2xl text-white font-bold text-[14px] cursor-pointer"
                style={{ background: "linear-gradient(135deg,#2563EB,#7C3AED)", boxShadow: "0 4px 20px rgba(37,99,235,0.28)" }}
              >
                Start the Course <ArrowRight size={15} />
              </motion.div>
            </Link>
          </motion.div>

          {/* Right — Stats */}
          <motion.div
            initial={mounted ? { opacity: 0, x: 24 } : false}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="grid grid-cols-2 gap-4"
          >
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={mounted ? { opacity: 0, y: 16 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.08 }}
                whileHover={{ y: -4, boxShadow: `0 16px 40px ${s.color}18` }}
                className="bg-white rounded-2xl p-6 border border-gray-100 text-center transition-all"
                style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}
              >
                <div
                  className="text-[2.2rem] font-black mb-2 leading-none"
                  style={{ color: s.color }}
                >
                  {s.value}
                </div>
                <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Creator Section ── */}
      <section className="py-20 px-6" style={{ background: "#FFFFFF" }}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={mounted ? { opacity: 0, y: 20 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55 }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-5">
              <Users size={13} className="text-blue-500" />
              <span className="text-[12px] font-bold text-blue-600 uppercase tracking-wider">The Creator</span>
            </div>
            <h2 className="text-[2rem] font-black text-gray-900 mb-3" style={{ letterSpacing: "-0.025em" }}>
              Afsar Ali — Technical White Hat
            </h2>
            <p className="text-gray-400 text-base max-w-xl mx-auto">
              Ethical hacker, OSINT expert, full-stack developer — 12 saal ki umar se tech ki duniya mein.
            </p>
          </motion.div>

          {/* Creator card */}
          <motion.div
            initial={mounted ? { opacity: 0, y: 20 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="max-w-4xl mx-auto bg-white rounded-3xl border border-gray-100 overflow-hidden"
            style={{ boxShadow: "0 4px 32px rgba(0,0,0,0.06)" }}
          >
            <div className="h-2" style={{ background: "linear-gradient(90deg,#2563EB,#7C3AED,#0EA5E9)" }} />
            <div className="p-8 sm:p-10">
              <div className="flex flex-col sm:flex-row gap-8 items-start">
                {/* Avatar */}
                <div className="shrink-0">
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-md"
                    style={{ background: "linear-gradient(135deg,#2563EB,#7C3AED)" }}
                  >
                    A
                  </div>
                </div>
                {/* Bio */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h3 className="font-black text-gray-900 text-xl">Afsar Ali</h3>
                    <span className="text-[11px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full">Technical White Hat</span>
                    <span className="text-[11px] font-bold text-purple-600 bg-purple-50 border border-purple-100 px-2.5 py-1 rounded-full">OSINT Expert</span>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">
                    Maine hacking 12 saal ki umar mein shuru ki — sirf curiosity se. Koi mentor nahi tha, koi course nahi tha Hinglish mein. Sab kuch self-taught hai. TWH Academy isliye banaya ki jo mushkilaat maine face ki, woh tumhe na ho.
                  </p>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6">
                    Mera biggest project hai <strong className="text-gray-700">TWH OSINT Platform</strong> — India ka sabse powerful free OSINT tool jo ladkiyon ki online safety ke liye banaya tha. Is experience ne mujhe yeh sikhaya ki technology ka use sirf ethical hona chahiye.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["Ethical Hacking", "OSINT", "Penetration Testing", "Full-Stack Dev", "Cybersecurity Research"].map((skill) => (
                      <span key={skill} className="text-[11.5px] font-medium text-gray-500 bg-gray-50 border border-gray-100 rounded-lg px-3 py-1">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Journey Timeline ── */}
      <section className="py-20 px-6" style={{ background: "#F8FAFF" }}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={mounted ? { opacity: 0, y: 20 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55 }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-5">
              <Zap size={13} className="text-blue-500" />
              <span className="text-[12px] font-bold text-blue-600 uppercase tracking-wider">The Journey</span>
            </div>
            <h2 className="text-[2rem] font-black text-gray-900 mb-3" style={{ letterSpacing: "-0.025em" }}>
              2016 se Aaj Tak
            </h2>
            <p className="text-gray-400 text-base max-w-md mx-auto">
              Curiosity se expert tak — ek simple ladke ki kahani jo computer ka dost ban gaya.
            </p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-[1.35rem] top-0 bottom-0 w-px bg-gradient-to-b from-blue-200 via-purple-200 to-yellow-200 hidden sm:block" />
            <div className="flex flex-col gap-6">
              {JOURNEY.map((item, i) => (
                <motion.div
                  key={item.year}
                  initial={mounted ? { opacity: 0, x: -16 } : false}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ delay: i * 0.07, duration: 0.45 }}
                  className="flex gap-6 items-start"
                >
                  <div
                    className="shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center text-white font-black text-[11px] z-10 shadow-sm"
                    style={{ background: item.color }}
                  >
                    {item.year.slice(2)}
                  </div>
                  <div className="flex-1 bg-white rounded-2xl p-5 border border-gray-100" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                    <div className="text-[11px] font-black uppercase tracking-widest mb-2" style={{ color: item.color }}>{item.year}</div>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.event}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="py-20 px-6" style={{ background: "#FFFFFF" }}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={mounted ? { opacity: 0, y: 20 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55 }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-5">
              <Target size={13} className="text-blue-500" />
              <span className="text-[12px] font-bold text-blue-600 uppercase tracking-wider">Our Values</span>
            </div>
            <h2 className="text-[2rem] font-black text-gray-900 mb-3" style={{ letterSpacing: "-0.025em" }}>
              TWH Academy kis cheez mein believe karta hai
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.title}
                initial={mounted ? { opacity: 0, y: 20 } : false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.45 }}
                whileHover={{ y: -5, boxShadow: `0 16px 40px ${v.color}12` }}
                className="bg-white rounded-2xl p-7 border border-gray-100 flex gap-5 items-start transition-all"
                style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.04)" }}
              >
                <div className="shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: v.bg, color: v.color }}>
                  {v.icon}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-[15px] mb-2">{v.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{v.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
