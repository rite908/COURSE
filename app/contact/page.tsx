"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Shield, Mail, Globe, MessageCircle, ArrowRight, HelpCircle, BookOpen, Users, Zap, ExternalLink, Star } from "lucide-react";
import { useTheme } from "@/lib/theme";

const CONTACT_CARDS = [
  { icon: <Globe size={22} />,         color: "#2563EB", darkBg: "rgba(37,99,235,0.15)",  lightBg: "#EEF3FF", title: "TWH OSINT Platform",  desc: "India ka sabse powerful free OSINT tool — banaya Afsar Ali ne.", link: "https://twh-osint.vercel.app/twh", label: "Visit Platform", external: true },
  { icon: <MessageCircle size={22} />, color: "#25D366", darkBg: "rgba(37,211,102,0.15)", lightBg: "#F0FDF4", title: "WhatsApp Community", desc: "Course ke baare mein questions? Community join karo aur directly baat karo.", link: "#", label: "Join Community", external: false },
  { icon: <Mail size={22} />,          color: "#7C3AED", darkBg: "rgba(124,58,237,0.15)", lightBg: "#F3EEFF", title: "Email Afsar",         desc: "Business inquiries, collaboration ya feedback ke liye directly mail karo.", link: "mailto:contact@twh-academy.in", label: "Send Email", external: true },
];

const FAQS = [
  { q: "Kya TWH Academy bilkul free hai?",           a: "Haan — poora course, sab 5 chapters, sab MCQs, sab tasks — 100% free. Koi hidden charges nahi.", color: "#2563EB" },
  { q: "Mujhe koi prior knowledge chahiye?",          a: "Bilkul nahi. Yeh course absolute beginners ke liye hai — computer ka basic use karna aata ho, bas kaafi hai.", color: "#7C3AED" },
  { q: "Progress ek device se doosre par transfer?",  a: "Abhi nahi — progress aur notes localStorage mein save hoti hai (tumhara browser). Database support add karne par kaam chal raha hai.", color: "#0EA5E9" },
  { q: "Kya yeh course Hindi ya English mein hai?",   a: "Dono! Yeh Hinglish mein hai — Hindi aur English mix. Technical terms English mein, explanation Hinglish mein.", color: "#059669" },
  { q: "MCQ fail hone par kya hota hai?",             a: "Topic unlock nahi hogi. Phir se try karo! Koi penalty nahi — seedha retry karo.", color: "#D97706" },
  { q: "Certificate kab milega?",                     a: "Certificate feature abhi development mein hai. Jab launch hoga tab sabse pehle woh students ko milega jo pura course complete kar chuke hain.", color: "#DC2626" },
  { q: "Kya mujhe Kali Linux install karna padega?",  a: "Chapter 5 mein haan — lekin tab tak nahi jab tak tum wahan pahuncho. Shuru mein sirf ek browser chahiye.", color: "#7C3AED" },
  { q: "Nayi chapters kab aayengi?",                  a: "Sab 5 chapters available hain! Future mein advanced chapters add hone ki possibility hai — updates ke liye TWH follow karo.", color: "#2563EB" },
];

const QUICK_LINKS = [
  { icon: <BookOpen size={16} />, label: "Start Chapter 1", href: "/chapters", color: "#2563EB" },
  { icon: <HelpCircle size={16}/>, label: "View Roadmap",  href: "/roadmap",  color: "#7C3AED" },
  { icon: <Users size={16} />,    label: "About TWH",      href: "/about",    color: "#0EA5E9" },
  { icon: <Zap size={16} />,      label: "All Features",   href: "/features", color: "#059669" },
];

export default function ContactPage() {
  const { isDark } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [vw,      setVw]      = useState(1280);

  useEffect(() => {
    setMounted(true);
    const u = () => setVw(window.innerWidth);
    u(); window.addEventListener("resize", u, { passive: true });
    return () => window.removeEventListener("resize", u);
  }, []);

  const isMd = vw >= 768;
  const isLg = vw >= 1024;
  const sp = vw < 640 ? 16 : vw < 768 ? 24 : vw < 1024 ? 40 : 64;
  const vp = isMd ? 80 : 52;

  const T = {
    bg:      isDark ? "#060912"  : "#F8FAFF",
    bg2:     isDark ? "#0D1117"  : "#FFFFFF",
    altBg:   isDark ? "#0A0E1A"  : "#F0F5FF",
    text:    isDark ? "#F1F5F9"  : "#111827",
    text2:   isDark ? "#94A3B8"  : "#6B7280",
    muted:   isDark ? "#64748B"  : "#9CA3AF",
    border:  isDark ? "#1E2433"  : "#E5E7EB",
    card:    isDark ? "#0D1117"  : "#FFFFFF",
    chipBg:  isDark ? "rgba(37,99,235,0.15)" : "#EFF6FF",
    chipBdr: isDark ? "rgba(37,99,235,0.35)" : "#DBEAFE",
    chipTxt: isDark ? "#60A5FA"  : "#2563EB",
    heroBg:  isDark ? "linear-gradient(150deg,#060912,#0A0E1A)" : "linear-gradient(150deg,#FFFFFF,#F5F8FF)",
    rowAlt:  isDark ? "rgba(255,255,255,0.025)" : "#FAFBFF",
  };

  const fade = (delay = 0) => ({
    initial: mounted ? { opacity: 0, y: 18 } : (false as const),
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-40px" },
    transition: { delay, duration: 0.48, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] },
  });

  return (
    <main style={{ minHeight: "100vh", background: T.bg, paddingTop: 68 }}>

      {/* Hero */}
      <section style={{ background: T.heroBg, padding: `${vp}px ${sp}px`, textAlign: "center" }}>
        <motion.div initial={mounted ? { opacity: 0, y: 20 } : false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} style={{ maxWidth: 600, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "5px 14px", borderRadius: 999, background: T.chipBg, border: `1px solid ${T.chipBdr}`, marginBottom: 20 }}>
            <Star size={12} color="#3B82F6" />
            <span style={{ fontSize: "11px", fontWeight: 700, color: T.chipTxt, textTransform: "uppercase", letterSpacing: "0.09em" }}>Contact & Help</span>
          </div>
          <h1 style={{ fontWeight: 900, color: T.text, fontSize: isLg ? "clamp(2rem,4vw,3rem)" : isMd ? "2.3rem" : "1.8rem", letterSpacing: "-0.03em", marginBottom: 16, lineHeight: 1.1 }}>
            Koi sawaal hai?{" "}
            <span style={{ background: "linear-gradient(130deg,#2563EB,#7C3AED)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Hum yahan hain.</span>
          </h1>
          <p style={{ color: T.text2, fontSize: "15px", lineHeight: 1.75 }}>
            Course ke baare mein doubt ho, technical issue ho ya bas baat karni ho — reach out karo.
          </p>
        </motion.div>
      </section>

      {/* Contact cards */}
      <section style={{ background: T.bg2, padding: `${vp}px ${sp}px` }}>
        <div style={{ display: "grid", gridTemplateColumns: isLg ? "repeat(3,1fr)" : isMd ? "repeat(3,1fr)" : "1fr", gap: 16, marginBottom: 40 }}>
          {CONTACT_CARDS.map((card, i) => (
            <motion.div key={card.title} {...fade(i * 0.1)}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              style={{ background: T.card, borderRadius: 20, padding: "28px", border: `1px solid ${T.border}`, display: "flex", flexDirection: "column", gap: 14, boxShadow: `0 2px 16px rgba(0,0,0,${isDark ? 0.22 : 0.04})` }}>
              <div style={{ width: 52, height: 52, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", background: isDark ? card.darkBg : card.lightBg, color: card.color }}>
                {card.icon}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontWeight: 700, fontSize: "15px", color: T.text, marginBottom: 8 }}>{card.title}</h3>
                <p style={{ color: T.text2, fontSize: "13.5px", lineHeight: 1.75, marginBottom: 18 }}>{card.desc}</p>
              </div>
              <a href={card.link} target={card.external ? "_blank" : undefined} rel="noopener noreferrer">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 12, fontSize: "13px", fontWeight: 600, cursor: "pointer", color: card.color, border: `1px solid ${card.color}30`, background: isDark ? card.darkBg : card.lightBg }}>
                  {card.label} <ExternalLink size={12} />
                </motion.div>
              </a>
            </motion.div>
          ))}
        </div>

        {/* Quick links */}
        <motion.div {...fade(0.2)}
          style={{ background: T.card, borderRadius: 20, padding: isMd ? "32px" : "24px", border: `1px solid ${T.border}`, boxShadow: `0 2px 16px rgba(0,0,0,${isDark ? 0.22 : 0.04})` }}>
          <p style={{ fontSize: "11px", fontWeight: 800, color: T.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 18 }}>Quick Links</p>
          <div style={{ display: "grid", gridTemplateColumns: isMd ? "repeat(4,1fr)" : "repeat(2,1fr)", gap: 10 }}>
            {QUICK_LINKS.map((l) => (
              <Link key={l.label} href={l.href}>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderRadius: 14, border: `1px solid ${T.border}`, fontSize: "13.5px", fontWeight: 600, color: T.text2, background: isDark ? "rgba(255,255,255,0.03)" : "#FAFAFA", cursor: "pointer", transition: "border-color 0.2s" }}>
                  <span style={{ color: l.color }}>{l.icon}</span>{l.label}
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>
      </section>

      {/* FAQ */}
      <section style={{ background: T.altBg, padding: `${vp}px ${sp}px` }}>
        <motion.div initial={mounted ? { opacity: 0, y: 20 } : false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "5px 14px", borderRadius: 999, background: T.chipBg, border: `1px solid ${T.chipBdr}`, marginBottom: 18 }}>
            <HelpCircle size={12} color="#3B82F6" />
            <span style={{ fontSize: "11px", fontWeight: 700, color: T.chipTxt, textTransform: "uppercase", letterSpacing: "0.09em" }}>FAQ</span>
          </div>
          <h2 style={{ fontWeight: 900, fontSize: isLg ? "2.2rem" : "1.8rem", color: T.text, letterSpacing: "-0.025em", marginBottom: 12 }}>Aksar Puche Jaane Wale Sawaal</h2>
          <p style={{ color: T.text2, fontSize: "15px", maxWidth: 420, margin: "0 auto" }}>Yahan mil jaega jawab. Nahi mila toh WhatsApp pe aa jao.</p>
        </motion.div>

        <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", flexDirection: "column", gap: 12 }}>
          {FAQS.map((faq, i) => (
            <motion.div key={i} {...fade(i * 0.05)}
              style={{ background: T.card, borderRadius: 18, padding: isMd ? "22px 28px" : "18px 20px", border: `1px solid ${T.border}`, boxShadow: `0 2px 12px rgba(0,0,0,${isDark ? 0.2 : 0.04})` }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 8 }}>
                <div style={{ width: 26, height: 26, borderRadius: 8, flexShrink: 0, marginTop: 1, display: "flex", alignItems: "center", justifyContent: "center", background: faq.color + (isDark ? "22" : "18"), color: faq.color }}>
                  <HelpCircle size={12} />
                </div>
                <h3 style={{ fontWeight: 700, fontSize: "14.5px", color: T.text, lineHeight: 1.5 }}>{faq.q}</h3>
              </div>
              <p style={{ color: T.text2, fontSize: "13.5px", lineHeight: 1.75, paddingLeft: 38 }}>{faq.a}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: T.bg2, padding: `${vp}px ${sp}px` }}>
        <motion.div initial={mounted ? { opacity: 0, y: 20 } : false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
          style={{ maxWidth: 680, margin: "0 auto", borderRadius: 24, background: "linear-gradient(135deg,#1D4ED8,#7C3AED)", padding: isMd ? "60px 10%" : "44px 28px", textAlign: "center", position: "relative", overflow: "hidden", boxShadow: "0 24px 64px rgba(37,99,235,0.30)" }}>
          <div style={{ position: "absolute", top: "-50px", right: "-50px", width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <img src="/twh-logo.png" alt="TWH Academy" style={{ width: 52, height: 52, borderRadius: 16, objectFit: "cover", margin: "0 auto 20px", display: "block" }} />
            <h2 style={{ fontWeight: 900, color: "white", fontSize: isMd ? "1.9rem" : "1.55rem", letterSpacing: "-0.025em", marginBottom: 12 }}>Baat ho gayi?<br />Ab padhai shuru karo.</h2>
            <p style={{ color: "#BFDBFE", fontSize: "14px", lineHeight: 1.75, marginBottom: 32 }}>TWH Academy mein hamesha swagat hai — aaj bhi, kal bhi.</p>
            <Link href="/login">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "13px 36px", borderRadius: 14, background: "white", color: "#2563EB", fontWeight: 800, fontSize: "14px", cursor: "pointer", boxShadow: "0 8px 28px rgba(0,0,0,0.18)" }}>
                Start Learning <ArrowRight size={15} />
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
