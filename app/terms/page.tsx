"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";
import { useTheme } from "@/lib/theme";

export default function TermsPage() {
  const { isDark } = useTheme();
  const [vw, setVw] = useState(1280);
  useEffect(() => {
    const u = () => setVw(window.innerWidth);
    u(); window.addEventListener("resize", u, { passive: true });
    return () => window.removeEventListener("resize", u);
  }, []);
  const sp = vw < 640 ? 16 : vw < 768 ? 24 : vw < 1024 ? 40 : 64;

  const T = {
    bg:      isDark ? "#060912" : "#F8FAFF",
    text:    isDark ? "#F1F5F9" : "#111827",
    text2:   isDark ? "#94A3B8" : "#6B7280",
    card:    isDark ? "#0D1117" : "#FFFFFF",
    border:  isDark ? "#1E2433" : "#E5E7EB",
    chipTxt: isDark ? "#60A5FA" : "#2563EB",
  };

  const SECTIONS = [
    {
      title: "Purpose of this course",
      body: "TWH Academy teaches ethical hacking and computer fundamentals strictly for educational purposes. Techniques covered are meant to help you understand, secure, and protect systems — never to attack systems you don't own or don't have explicit written permission to test.",
    },
    {
      title: "Your responsibility",
      body: "You agree to use everything you learn here legally and ethically. Unauthorized access to computers, networks, or accounts that aren't yours is illegal in most jurisdictions and is never endorsed by TWH Academy.",
    },
    {
      title: "No warranty",
      body: "Course content, hands-on tasks, and MCQs are provided as-is, for learning purposes. We do our best to keep everything accurate, but TWH Academy makes no guarantee of completeness or fitness for any particular purpose.",
    },
    {
      title: "Changes",
      body: "These terms may be updated as the course evolves. Continuing to use TWH Academy after changes means you accept the updated terms.",
    },
    { title: "Contact", body: null },
  ];

  return (
    <main style={{ minHeight: "100vh", background: T.bg, paddingTop: 88, paddingBottom: 64, padding: `88px ${sp}px 64px` }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: "14px", fontWeight: 600, color: T.chipTxt, textDecoration: "none", marginBottom: 32 }}>
          <ArrowLeft size={15} /> Back to Home
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 32 }}>
          <img src="/twh-logo.png" alt="TWH Academy" style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", flexShrink: 0, boxShadow: "0 0 0 2px rgba(37,99,235,0.35)" }} />
          <h1 style={{ fontSize: "1.8rem", fontWeight: 900, color: T.text, letterSpacing: "-0.025em" }}>Terms of Use</h1>
        </div>

        <div style={{
          background: T.card, borderRadius: 20, border: `1px solid ${T.border}`,
          padding: vw < 640 ? 24 : 40,
          boxShadow: `0 2px 24px rgba(0,0,0,${isDark ? 0.3 : 0.05})`,
        }}>
          <p style={{ color: T.text2, fontSize: "13px", marginBottom: 28 }}>Last updated: July 2026</p>
          {SECTIONS.map((section) => (
            <div key={section.title} style={{ marginBottom: 28 }}>
              <h2 style={{ fontSize: "1.05rem", fontWeight: 700, color: T.text, marginBottom: 10, paddingLeft: 14, borderLeft: "3px solid #2563EB" }}>
                {section.title}
              </h2>
              {section.body ? (
                <p style={{ color: T.text2, fontSize: "14.5px", lineHeight: 1.8 }}>{section.body}</p>
              ) : (
                <p style={{ color: T.text2, fontSize: "14.5px", lineHeight: 1.8 }}>
                  Questions?{" "}
                  <Link href="/contact" style={{ color: T.chipTxt, fontWeight: 600, textDecoration: "none" }}>Contact page</Link>{" "}
                  pe reach out karo.
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
