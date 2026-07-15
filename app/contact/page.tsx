"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Shield, Mail, Globe, MessageCircle, ArrowRight,
  HelpCircle, BookOpen, Users, Zap, ExternalLink, Star,
} from "lucide-react";

const CONTACT_CARDS = [
  {
    icon: <Globe size={22} />, color: "#2563EB", bg: "#EEF3FF",
    title: "TWH OSINT Platform",
    desc: "India ka sabse powerful free OSINT tool — banaya Afsar Ali ne.",
    link: "https://twh-osint.vercel.app/twh",
    label: "Visit Platform",
    external: true,
  },
  {
    icon: <MessageCircle size={22} />, color: "#25D366", bg: "#F0FDF4",
    title: "WhatsApp Community",
    desc: "Course ke baare mein questions? Community join karo aur directly baat karo.",
    link: "#",
    label: "Join Community",
    external: false,
  },
  {
    icon: <Mail size={22} />, color: "#7C3AED", bg: "#F3EEFF",
    title: "Email Afsar",
    desc: "Business inquiries, collaboration ya feedback ke liye directly mail karo.",
    link: "mailto:contact@twh-academy.in",
    label: "Send Email",
    external: true,
  },
];

const FAQS = [
  {
    q: "Kya TWH Academy bilkul free hai?",
    a: "Haan — poora course, sab 5 chapters, sab MCQs, sab tasks — 100% free. Koi hidden charges nahi, koi subscription nahi.",
    color: "#2563EB",
  },
  {
    q: "Mujhe koi prior knowledge chahiye?",
    a: "Bilkul nahi. Yeh course absolute beginners ke liye hai — computer ka basic use karna aata ho, bas kaafi hai. Hum wahan se start karte hain jahan se tum ho.",
    color: "#7C3AED",
  },
  {
    q: "Progress ek device se doosre device par transfer ho sakti hai?",
    a: "Abhi nahi — progress aur notes localStorage mein save hoti hai (tumhara browser). Hum database support add karne par kaam kar rahe hain.",
    color: "#0EA5E9",
  },
  {
    q: "Kya yeh course Hindi mein hai ya English mein?",
    a: "Dono! Yeh Hinglish mein hai — Hindi aur English mix. Exactly jaise Afsar baat karta hai. Technical terms English mein hain, explanation Hinglish mein.",
    color: "#059669",
  },
  {
    q: "MCQ fail hone par kya hota hai?",
    a: "Topic unlock nahi hogi. Phir se try karo! MCQ score save hota hai aur tum apna attempt dekh sakte ho. Koi penalty nahi — seedha retry karo.",
    color: "#D97706",
  },
  {
    q: "Certificate kab milega?",
    a: "Certificate feature abhi development mein hai. Jab launch hoga tab sabse pehle woh students ko milega jo pura course complete kar chuke hain.",
    color: "#DC2626",
  },
  {
    q: "Kya mujhe Kali Linux install karna padega?",
    a: "Chapter 5 mein haan — lekin tab tak nahi jab tak tum wahan pahuncho. Shuru mein sirf ek browser chahiye. Steps clearly guide kiye gaye hain.",
    color: "#7C3AED",
  },
  {
    q: "Nayi chapters kab aayengi?",
    a: "Sab 5 chapters available hain! Future mein advanced chapters (Web App Hacking, Malware Analysis) add hone ki possibility hai — updates ke liye TWH follow karo.",
    color: "#2563EB",
  },
];

const QUICK_LINKS = [
  { icon: <BookOpen size={16} />, label: "Start Chapter 1", href: "/chapters", color: "#2563EB" },
  { icon: <HelpCircle size={16} />, label: "View Roadmap", href: "/roadmap", color: "#7C3AED" },
  { icon: <Users size={16} />, label: "About TWH", href: "/about", color: "#0EA5E9" },
  { icon: <Zap size={16} />, label: "All Features", href: "/features", color: "#059669" },
];

export default function ContactPage() {
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
          className="max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-6">
            <Star size={13} className="text-blue-500" />
            <span className="text-[12px] font-bold text-blue-600 uppercase tracking-wider">Contact & Help</span>
          </div>
          <h1
            className="font-black text-gray-900 mb-5 leading-tight"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.03em" }}
          >
            Koi sawaal hai?{" "}
            <span style={{
              background: "linear-gradient(130deg,#2563EB,#7C3AED)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>
              Hum yahan hain.
            </span>
          </h1>
          <p className="text-gray-500 text-base leading-relaxed max-w-lg mx-auto">
            Course ke baare mein doubt ho, technical issue ho ya bas baat karni ho — reach out karo. TWH community always active rehti hai.
          </p>
        </motion.div>
      </section>

      {/* ── Contact Cards ── */}
      <section className="py-20 px-6" style={{ background: "#FFFFFF" }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
            {CONTACT_CARDS.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.50 }}
                whileHover={{ y: -6, boxShadow: `0 20px 48px ${card.color}14` }}
                className="bg-white rounded-2xl p-7 border border-gray-100 flex flex-col gap-4 transition-all"
                style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: card.bg, color: card.color }}>
                  {card.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-[15px] mb-2">{card.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-5">{card.desc}</p>
                </div>
                <a href={card.link} target={card.external ? "_blank" : undefined} rel="noopener noreferrer">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold border transition-all cursor-pointer"
                    style={{ color: card.color, borderColor: card.color + "30", background: card.bg }}
                  >
                    {card.label}
                    <ExternalLink size={12} />
                  </motion.div>
                </a>
              </motion.div>
            ))}
          </div>

          {/* Quick navigation */}
          <motion.div
            initial={mounted ? { opacity: 0, y: 16 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.50 }}
            className="bg-white rounded-2xl p-8 border border-gray-100"
            style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.04)" }}
          >
            <p className="text-[12px] font-black text-gray-400 uppercase tracking-widest mb-5">Quick Links</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {QUICK_LINKS.map((l) => (
                <Link key={l.label} href={l.href}>
                  <motion.div
                    whileHover={{ scale: 1.03, boxShadow: `0 6px 20px ${l.color}14` }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-gray-100 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-all cursor-pointer"
                    style={{ background: "#FAFAFA" }}
                  >
                    <span style={{ color: l.color }}>{l.icon}</span>
                    {l.label}
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 px-6" style={{ background: "#F8FAFF" }}>
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55 }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-5">
              <HelpCircle size={13} className="text-blue-500" />
              <span className="text-[12px] font-bold text-blue-600 uppercase tracking-wider">FAQ</span>
            </div>
            <h2 className="text-[2rem] font-black text-gray-900 mb-3" style={{ letterSpacing: "-0.025em" }}>
              Aksar Puche Jaane Wale Sawaal
            </h2>
            <p className="text-gray-400 text-base max-w-md mx-auto">
              Yahan mil jaega jawab. Nahi mila toh WhatsApp pe aa jao.
            </p>
          </motion.div>

          <div className="flex flex-col gap-4">
            {FAQS.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ delay: i * 0.05, duration: 0.45 }}
                className="bg-white rounded-2xl p-6 border border-gray-100"
                style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
              >
                <div className="flex items-start gap-3 mb-2">
                  <div
                    className="shrink-0 w-6 h-6 rounded-lg flex items-center justify-center mt-0.5"
                    style={{ background: faq.color + "18", color: faq.color }}
                  >
                    <HelpCircle size={12} />
                  </div>
                  <h3 className="font-bold text-gray-900 text-[14.5px] leading-snug">{faq.q}</h3>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed pl-9">{faq.a}</p>
              </motion.div>
            ))}
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
              <div className="w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center mx-auto mb-5 backdrop-blur-sm">
                <Shield size={20} className="text-white" />
              </div>
              <h2 className="text-2xl font-black text-white mb-3" style={{ letterSpacing: "-0.025em" }}>
                Baat ho gayi?<br />Ab padhai shuru karo.
              </h2>
              <p className="text-blue-200 mb-7 text-sm leading-relaxed">
                TWH Academy mein hamesha swagat hai — aaj bhi, kal bhi.
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
