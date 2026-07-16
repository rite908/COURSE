"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";
import { useTheme } from "@/lib/theme";

export default function PrivacyPage() {
  const { isDark } = useTheme();
  const [vw, setVw] = useState(1280);
  useEffect(() => {
    const u = () => setVw(window.innerWidth);
    u(); window.addEventListener("resize", u, { passive: true });
    return () => window.removeEventListener("resize", u);
  }, []);
  const sp = vw < 640 ? 16 : vw < 768 ? 24 : vw < 1024 ? 40 : 64;

  const T = {
    bg:     isDark ? "#060912" : "#F8FAFF",
    text:   isDark ? "#F1F5F9" : "#111827",
    text2:  isDark ? "#94A3B8" : "#6B7280",
    card:   isDark ? "#0D1117" : "#FFFFFF",
    border: isDark ? "#1E2433" : "#E5E7EB",
    chipTxt:isDark ? "#60A5FA" : "#2563EB",
  };

  return (
    <main style={{ minHeight: "100vh", background: T.bg, paddingTop: 88, paddingBottom: 64, padding: `88px ${sp}px 64px` }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: "14px", fontWeight: 600, color: T.chipTxt, textDecoration: "none", marginBottom: 32 }}>
          <ArrowLeft size={15} /> Back to Home
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 32 }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#2563EB,#7C3AED)" }}>
            <Shield size={18} color="white" />
          </div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 900, color: T.text, letterSpacing: "-0.025em" }}>Privacy Policy</h1>
        </div>

        <div style={{
          background: T.card, borderRadius: 20, border: `1px solid ${T.border}`,
          padding: vw < 640 ? 24 : 40,
          boxShadow: `0 2px 24px rgba(0,0,0,${isDark ? 0.3 : 0.05})`,
        }}>
          <p style={{ color: T.text2, fontSize: "13px", marginBottom: 28 }}>Last updated: July 2026</p>

          {[
            {
              title: "What we store",
              body: "TWH Academy runs entirely in your browser. Your selected profile name, chapter progress, MCQ scores, and notes are saved using your browser's localStorage — nothing is sent to or stored on any external server or database.",
            },
            {
              title: "What we don't do",
              body: "We don't collect emails, passwords, payment information, or any personally identifying data. We don't use tracking cookies or third-party analytics.",
            },
            {
              title: "Clearing your data",
              body: "Since everything lives in your browser's local storage, clearing your browser data or using a different browser/device will reset your progress. There is currently no cross-device sync.",
            },
            {
              title: "Contact",
              body: null,
            },
          ].map((section) => (
            <div key={section.title} style={{ marginBottom: 28 }}>
              <h2 style={{ fontSize: "1.05rem", fontWeight: 700, color: T.text, marginBottom: 10, paddingLeft: 14, borderLeft: `3px solid #2563EB` }}>
                {section.title}
              </h2>
              {section.body ? (
                <p style={{ color: T.text2, fontSize: "14.5px", lineHeight: 1.8 }}>{section.body}</p>
              ) : (
                <p style={{ color: T.text2, fontSize: "14.5px", lineHeight: 1.8 }}>
                  Questions about this policy? Reach out via the{" "}
                  <Link href="/contact" style={{ color: T.chipTxt, fontWeight: 600, textDecoration: "none" }}>Contact page</Link>.
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
