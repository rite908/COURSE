"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Shield, BookOpen, HelpCircle, Target, TrendingUp, Award,
  FlaskConical, Smartphone, Lock, Zap, ArrowRight, CheckCircle,
  Users, FileText, Star,
} from "lucide-react";

const MAIN_FEATURES = [
  {
    icon: <BookOpen size={24} />, color: "#2563EB", bg: "#EEF3FF",
    title: "5 Complete Chapters",
    desc: "Foundation se lekar Kali Linux tak — pura roadmap ek jagah. Har chapter professionally structured hai: Theory → Demo → MCQ → Hands-on Task.",
    points: ["6+ topics per chapter", "Hinglish language", "Progressive difficulty", "Real-world examples"],
  },
  {
    icon: <HelpCircle size={24} />, color: "#7C3AED", bg: "#F3EEFF",
    title: "450+ MCQ Questions",
    desc: "Har topic ke baad 15 MCQs — jo sirf memorization nahi, actual understanding test karte hain. Randomized positions, varied lengths, no trick questions.",
    points: ["15 MCQs per topic", "Randomized correct answers", "Instant feedback", "Score tracking"],
  },
  {
    icon: <Target size={24} />, color: "#0EA5E9", bg: "#F0F9FF",
    title: "Hands-on Tasks",
    desc: "Sirf padhna kaafi nahi — har topic ke end mein ek practical task hota hai jo tum actually kar sakte ho. Curiosity jagaane wala, rote learning nahi.",
    points: ["Real tool usage", "Step-by-step guide", "Beginner-safe", "Pro tips included"],
  },
  {
    icon: <Lock size={24} />, color: "#059669", bg: "#ECFDF5",
    title: "MCQ-Locked Topics",
    desc: "Agle topic tab unlock hoga jab tum current MCQ pass karo. Yeh ensure karta hai ki tum bina samjhe aage nahi badh sakte — solid foundation guaranteed.",
    points: ["Progressive unlocking", "No skipping ahead", "Mastery-based", "Score saved locally"],
  },
  {
    icon: <TrendingUp size={24} />, color: "#D97706", bg: "#FFFBEB",
    title: "Progress Dashboard",
    desc: "Ek clean dashboard jo tumhara poora progress dikhata hai — chapters started, topics completed, MCQ accuracy, aur overall score.",
    points: ["Per-chapter progress", "MCQ accuracy %", "Topics completed", "Time tracking"],
  },
  {
    icon: <FileText size={24} />, color: "#DC2626", bg: "#FEF2F2",
    title: "Personal Notes System",
    desc: "Har topic ke saath ek notepad — apne words mein likho, auto-save hoga. Notes sirf tumhare device par stored hain, private aur secure.",
    points: ["Per-topic notes", "Auto-save", "Private & local", "Rich text format"],
  },
  {
    icon: <Smartphone size={24} />, color: "#0EA5E9", bg: "#F0F9FF",
    title: "Mobile Friendly",
    desc: "Chaahe laptop ho, phone ho ya tablet — TWH Academy har device par perfectly kaam karta hai. Responsive design, touch-optimized sidebar.",
    points: ["Works on all devices", "Touch-friendly sidebar", "Fast loading", "Offline capable"],
  },
  {
    icon: <Award size={24} />, color: "#7C3AED", bg: "#F3EEFF",
    title: "Completion Certificate",
    desc: "Pura course complete karo aur apna certificate pao — jise tum LinkedIn par laga sakte ho ya employers ko dikha sakte ho. Coming soon.",
    points: ["PDF certificate", "Shareable link", "LinkedIn ready", "Coming soon"],
  },
];

const COMPARISON = [
  { feature: "Language", twh: "Hinglish (easy to understand)", others: "English only" },
  { feature: "Cost", twh: "100% Free", others: "₹5,000 – ₹50,000" },
  { feature: "MCQ Locking", twh: "Yes — mastery enforced", others: "No — skip anything" },
  { feature: "Hands-on Tasks", twh: "Every topic", others: "Rare or paid" },
  { feature: "Notes System", twh: "Built-in per topic", others: "Not available" },
  { feature: "Progress Tracking", twh: "Detailed dashboard", others: "Basic or none" },
  { feature: "Content Style", twh: "Conversational, analogies", others: "Dry, textbook-style" },
  { feature: "Prerequisites", twh: "Zero — absolute beginner", others: "Often need prior knowledge" },
];

export default function FeaturesPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <main className="min-h-screen" style={{ background: "#F8FAFF", paddingTop: 72 }}>

      {/* ── Hero ── */}
      <section
        className="px-6 py-20 text-center"
        style={{ background: "linear-gradient(145deg,#FFFFFF 0%,#F5F8FF 60%,#EEF2FF 100%)" }}
      >
        <motion.div
          initial={mounted ? { opacity: 0, y: 20 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-6">
            <Star size={13} className="text-blue-500" />
            <span className="text-[12px] font-bold text-blue-600 uppercase tracking-wider">Platform Features</span>
          </div>
          <h1
            className="font-black text-gray-900 mb-5 leading-tight"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.03em" }}
          >
            Sab kuch jo tumhe chahiye{" "}
            <span style={{
              background: "linear-gradient(130deg,#2563EB,#7C3AED)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>
              ek jagah mein
            </span>
          </h1>
          <p className="text-gray-500 text-base leading-relaxed max-w-xl mx-auto">
            TWH Academy sirf ek course nahi — yeh ek complete learning platform hai. Chapters, MCQs, tasks, notes, progress tracking — sab built-in.
          </p>
        </motion.div>
      </section>

      {/* ── Feature Grid ── */}
      <section className="py-20 px-6" style={{ background: "#FFFFFF" }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {MAIN_FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.06, duration: 0.45 }}
                whileHover={{ y: -5, boxShadow: `0 20px 48px ${f.color}12` }}
                className="bg-white rounded-2xl p-7 border border-gray-100 flex gap-5 items-start transition-all"
                style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.04)" }}
              >
                <div className="shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: f.bg, color: f.color }}>
                  {f.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-gray-900 text-[15px] mb-2">{f.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">{f.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {f.points.map((p) => (
                      <span key={p} className="flex items-center gap-1.5 text-[11px] font-medium text-gray-500 bg-gray-50 border border-gray-100 rounded-lg px-2 py-0.5">
                        <CheckCircle size={8} style={{ color: f.color }} />
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comparison Table ── */}
      <section className="py-20 px-6" style={{ background: "#F8FAFF" }}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55 }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-5">
              <Zap size={13} className="text-blue-500" />
              <span className="text-[12px] font-bold text-blue-600 uppercase tracking-wider">TWH vs Others</span>
            </div>
            <h2 className="text-[2rem] font-black text-gray-900 mb-3" style={{ letterSpacing: "-0.025em" }}>
              Kyu TWH Academy{" "}
              <span style={{ background: "linear-gradient(130deg,#2563EB,#7C3AED)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                different hai
              </span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.50 }}
            className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
            style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}
          >
            {/* Header */}
            <div className="grid grid-cols-3 px-6 py-4 border-b border-gray-100" style={{ background: "#F8FAFF" }}>
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Feature</div>
              <div className="text-center">
                <span className="text-[12px] font-black text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">TWH Academy</span>
              </div>
              <div className="text-center">
                <span className="text-[12px] font-semibold text-gray-400">Other Courses</span>
              </div>
            </div>
            {COMPARISON.map((row, i) => (
              <div
                key={row.feature}
                className={`grid grid-cols-3 px-6 py-4 items-center border-b border-gray-50 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
              >
                <div className="text-sm font-semibold text-gray-600">{row.feature}</div>
                <div className="text-center flex justify-center">
                  <span className="text-[12.5px] font-semibold text-blue-700 flex items-center gap-1.5">
                    <CheckCircle size={12} className="text-blue-500 shrink-0" />
                    {row.twh}
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-[12.5px] text-gray-400">{row.others}</span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 px-6" style={{ background: "#FFFFFF" }}>
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.50 }}
            className="relative rounded-3xl p-12 text-center overflow-hidden"
            style={{ background: "linear-gradient(135deg,#1D4ED8,#7C3AED)", boxShadow: "0 24px 64px rgba(37,99,235,0.28)" }}
          >
            <div className="absolute top-0 right-0 w-56 h-56 rounded-full -translate-y-1/2 translate-x-1/2 bg-white/5" />
            <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full translate-y-1/2 -translate-x-1/2 bg-white/5" />
            <div className="relative z-10">
              <h2 className="text-2xl font-black text-white mb-3" style={{ letterSpacing: "-0.025em" }}>
                Features pasand aaye?<br />Ab try karo — free mein.
              </h2>
              <p className="text-blue-200 mb-7 text-sm leading-relaxed">
                Koi sign-up nahi. Koi credit card nahi. Seedha Chapter 1 se shuru karo.
              </p>
              <Link href="/login">
                <motion.div
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-3 px-8 py-3.5 rounded-2xl bg-white text-blue-600 font-bold text-[14px] shadow-lg cursor-pointer"
                >
                  Start Learning <ArrowRight size={15} />
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </main>
  );
}
