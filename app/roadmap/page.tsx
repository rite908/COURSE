"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  BookOpen, Cpu, Wifi, Terminal, Zap,
  CheckCircle, ArrowRight, Target,
} from "lucide-react";

const PHASES = [
  {
    phase: "01",
    icon: <BookOpen size={22} />,
    color: "#2563EB",
    bg: "#EEF3FF",
    chapter: "Chapter 1",
    title: "Ethical Hacking ki Duniya",
    subtitle: "Foundation — Mindset & Basics",
    desc: "Hacker ka asli matlab kya hota hai? Types of hackers, developer vs hacker ki soch ka fark, aur ethical hacking ka pura picture — yahan se shuru hota hai asli safar.",
    topics: [
      "Hacker Ka Asli Matlab",
      "Hack Kaise Hota Hai?",
      "Types of Hackers",
      "Developer vs Hacker",
      "Hacker Mindset — 12 Traits",
      "Ethical Hacking Kya Hai?",
    ],
    skills: ["Critical Thinking", "Recon Mindset", "Legal Awareness"],
    status: "available",
  },
  {
    phase: "02",
    icon: <Cpu size={22} />,
    color: "#7C3AED",
    bg: "#F3EEFF",
    chapter: "Chapter 2",
    title: "Computer Ka Andar Ka Sach",
    subtitle: "How Computers Work — Hardware to OS",
    desc: "Ek hacker ke liye computer sirf tool nahi — battlefield hai. CPU, RAM, storage, OS internals, binary aur hex — andar se samjho toh attack aur defence dono zyada powerful ho jaate hain.",
    topics: [
      "CPU Kya Hai aur Kaise Kaam Karta Hai?",
      "RAM aur Storage ka Rishta",
      "Operating System Internals",
      "Binary & Hexadecimal",
      "Boot Process Step-by-Step",
      "Processes, Threads & Memory",
    ],
    skills: ["OS Internals", "Binary Logic", "System Architecture"],
    status: "available",
  },
  {
    phase: "03",
    icon: <Wifi size={22} />,
    color: "#0EA5E9",
    bg: "#F0F9FF",
    chapter: "Chapter 3",
    title: "Network Ka Jaadu",
    subtitle: "Networking — TCP/IP to Packet Sniffing",
    desc: "Internet kaise kaam karta hai yeh samjhna har hacker ke liye zaroori hai. Packets kahan jaate hain, DNS kya karta hai, ports aur protocols — aur kahan chhupa hota hai vulnerability.",
    topics: [
      "IP Address & Subnetting",
      "TCP/IP Model — Layer by Layer",
      "DNS Kaise Kaam Karta Hai?",
      "Ports & Common Protocols",
      "Packet Sniffing with Wireshark",
      "Wi-Fi Security & WPA Basics",
    ],
    skills: ["Network Analysis", "Wireshark", "Protocol Understanding"],
    status: "available",
  },
  {
    phase: "04",
    icon: <Terminal size={22} />,
    color: "#059669",
    bg: "#ECFDF5",
    chapter: "Chapter 4",
    title: "Linux — Hacker Ka Ghar",
    subtitle: "Linux & Command Line — Your Primary Weapon",
    desc: "Agar tum Linux nahi jaante, tum hacker nahi ho. Bash shell, file system ka structure, permissions, scripting — yeh woh foundation hai jiske bina Kali Linux bhi bekar hai.",
    topics: [
      "Linux Kyu? Windows se Better Kyu?",
      "File System Navigation",
      "File Permissions & chmod",
      "Bash Scripting Basics",
      "Process Management",
      "Networking Commands — netstat, nmap, curl",
    ],
    skills: ["Bash Scripting", "File Permissions", "Linux CLI"],
    status: "available",
  },
  {
    phase: "05",
    icon: <Zap size={22} />,
    color: "#D97706",
    bg: "#FFFBEB",
    chapter: "Chapter 5",
    title: "Kali Linux & Real Pentesting",
    subtitle: "Tools, Techniques & Your First Pentest",
    desc: "Ab sab kuch ek jagah aata hai. Kali Linux setup se lekar Nmap, Metasploit, Burp Suite tak — aur pehla real pentest karte karte seekhoge ki professional pentester kaise sochta hai.",
    topics: [
      "Kali Linux Installation & Setup",
      "Nmap — Recon & Port Scanning",
      "Metasploit Framework Basics",
      "Burp Suite — Web App Testing",
      "First Pentest Workflow",
      "Pentest Report Kaise Likhein",
    ],
    skills: ["Nmap", "Metasploit", "Burp Suite", "Report Writing"],
    status: "available",
  },
];

export default function RoadmapPage() {
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
            <Target size={13} className="text-blue-500" />
            <span className="text-[12px] font-bold text-blue-600 uppercase tracking-wider">Course Roadmap</span>
          </div>
          <h1
            className="font-black text-gray-900 mb-5 leading-tight"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.03em" }}
          >
            Zero se Hero tak —{" "}
            <span style={{
              background: "linear-gradient(130deg,#2563EB,#7C3AED)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>
              5 Chapters mein
            </span>
          </h1>
          <p className="text-gray-500 text-base leading-relaxed max-w-xl mx-auto mb-10">
            Ek structured learning path jo tumhe absolute beginner se certified ethical hacker tak le jaati hai.
            Har chapter pehle wale ke upar build karta hai — koi shortcut nahi, sirf solid foundation.
          </p>
          <Link href="/chapters">
            <motion.div
              whileHover={{ scale: 1.03, boxShadow: "0 8px 28px rgba(37,99,235,0.22)" }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-white font-bold text-[15px] cursor-pointer"
              style={{ background: "linear-gradient(135deg,#2563EB,#7C3AED)", boxShadow: "0 4px 20px rgba(37,99,235,0.30)" }}
            >
              Start Learning Now
              <ArrowRight size={16} />
            </motion.div>
          </Link>
        </motion.div>
      </section>

      {/* ── Timeline ── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">

          {/* Progress bar label */}
          <div className="flex items-center justify-between mb-10">
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Learning Path</p>
            <span className="text-[12px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
              5 / 5 Chapters Available
            </span>
          </div>

          <div className="relative">
            {/* Vertical connector line */}
            <div
              className="absolute top-0 bottom-0 w-px hidden md:block"
              style={{ left: "1.375rem", background: "linear-gradient(to bottom, #BFDBFE, #DDD6FE, #BAE6FD, #A7F3D0, #FDE68A)" }}
            />

            <div className="flex flex-col gap-8">
              {PHASES.map((item, i) => (
                <motion.div
                  key={item.phase}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.08, duration: 0.50 }}
                  className="flex gap-6 items-start"
                >
                  {/* Icon bubble */}
                  <div
                    className="shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center z-10 shadow-sm"
                    style={{ background: item.bg, color: item.color, border: `1.5px solid ${item.color}30` }}
                  >
                    {item.icon}
                  </div>

                  {/* Card */}
                  <motion.div
                    whileHover={{ y: -4, boxShadow: `0 20px 48px ${item.color}12` }}
                    className="flex-1 bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all"
                    style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}
                  >
                    {/* Card header */}
                    <div className="p-6 pb-4">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                        <div>
                          <div
                            className="text-[10px] font-black uppercase tracking-widest mb-1.5"
                            style={{ color: item.color }}
                          >
                            Phase {item.phase} · {item.chapter}
                          </div>
                          <h3 className="font-black text-gray-900 text-[1.1rem] leading-snug mb-1">{item.title}</h3>
                          <p className="text-[12px] text-gray-400 font-medium">{item.subtitle}</p>
                        </div>
                        <span
                          className="self-start shrink-0 text-[10.5px] font-bold px-3 py-1 rounded-full"
                          style={{ background: item.bg, color: item.color }}
                        >
                          ✓ Available
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                    </div>

                    {/* Topics */}
                    <div className="px-6 pb-4">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Topics Covered</p>
                      <div className="flex flex-wrap gap-2">
                        {item.topics.map((t) => (
                          <span
                            key={t}
                            className="flex items-center gap-1.5 text-[11.5px] font-medium text-gray-600 bg-gray-50 border border-gray-100 rounded-lg px-2.5 py-1"
                          >
                            <CheckCircle size={9} style={{ color: item.color }} />
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Skills footer */}
                    <div
                      className="px-6 py-3 flex flex-wrap items-center gap-2 border-t border-gray-50"
                      style={{ background: item.bg + "50" }}
                    >
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mr-1">Skills:</span>
                      {item.skills.map((s) => (
                        <span key={s} className="text-[11px] font-semibold" style={{ color: item.color }}>{s}</span>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
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
                Roadmap clear hai?<br />Ab shuru karo.
              </h2>
              <p className="text-blue-200 mb-7 text-sm leading-relaxed">
                Chapter 1 se start karo — free hai, koi sign-up nahi, koi credit card nahi.
              </p>
              <Link href="/chapters">
                <motion.div
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-3 px-8 py-3.5 rounded-2xl bg-white text-blue-600 font-bold text-[14px] shadow-lg cursor-pointer"
                >
                  Go to Chapters <ArrowRight size={15} />
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </main>
  );
}
