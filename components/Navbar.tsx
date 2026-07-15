"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, Sun, Moon, LogOut } from "lucide-react";
import { getCurrentUser, clearCurrentUser, type UserName } from "@/lib/storage";

const NAV_LINKS = [
  { href: "/",         label: "Home"     },
  { href: "/chapters", label: "Chapters" },
  { href: "/roadmap",  label: "Roadmap"  },
  { href: "/about",    label: "About"    },
  { href: "/features", label: "Features" },
  { href: "/contact",  label: "Contact"  },
];

const BREAK_LG = 1024; // desktop breakpoint

export default function Navbar() {
  const [user,     setUser]     = useState<UserName | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark,     setDark]     = useState(false);
  const [mounted,  setMounted]  = useState(false);
  const [vw,       setVw]       = useState(1280); // viewport width

  const router   = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setUser(getCurrentUser());
    setMounted(true);

    // Viewport tracker — drives desktop vs mobile layout
    const updateVw = () => setVw(window.innerWidth);
    updateVw();
    window.addEventListener("resize", updateVw, { passive: true });

    // Scroll tracker — drives navbar shadow/border
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", updateVw);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const isDesktop = vw >= BREAK_LG;

  const handleLogout = () => {
    clearCurrentUser();
    setMenuOpen(false);
    router.push("/login");
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href) && href !== "/";

  return (
    <motion.nav
      initial={mounted ? { y: -76, opacity: 0 } : false}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
      style={{
        position:          "fixed",
        top: 0, left: 0, right: 0,
        zIndex:            50,
        background:        "rgba(255,255,255,0.97)",
        backdropFilter:    "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderBottom:      scrolled
          ? "1px solid rgba(226,232,240,0.85)"
          : "1px solid rgba(226,232,240,0.50)",
        boxShadow:         scrolled
          ? "0 2px 28px rgba(0,0,0,0.08)"
          : "0 1px 0 rgba(226,232,240,0.60)",
        transition:        "border-color 0.3s, box-shadow 0.3s",
      }}
    >
      {/* ── Main bar ── */}
      <div style={{
        maxWidth:      1280,
        margin:        "0 auto",
        padding:       "0 40px",
        height:        72,
        display:       "flex",
        alignItems:    "center",
        justifyContent:"space-between",
        boxSizing:     "border-box",
      }}>

        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0, textDecoration: "none" }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12, flexShrink: 0,
            background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 8px rgba(37,99,235,0.28)",
          }}>
            <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
              <path d="M9 0.5L17 4V10C17 14.8 13.4 18.8 9 19.5C4.6 18.8 1 14.8 1 10V4L9 0.5Z"
                fill="none" stroke="white" strokeWidth="1.5" />
              <path d="M6 10L8 12L12 8" stroke="white" strokeWidth="1.9"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: "15px", color: "#111827", lineHeight: 1.3 }}>TWH Academy</div>
            <div style={{ fontSize: "10px", color: "#9CA3AF", lineHeight: 1.3 }}>Ethical Hacking Academy</div>
          </div>
        </Link>

        {/* Desktop center nav */}
        {isDesktop && (
          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    position:   "relative",
                    padding:    "8px 0",
                    fontSize:   "14px",
                    fontWeight: active ? 600 : 500,
                    color:      active ? "#2563EB" : "#6B7280",
                    textDecoration: "none",
                    transition: "color 0.2s",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.color = "#111827"; }}
                  onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.color = "#6B7280"; }}
                >
                  {link.label}
                  {active && (
                    <motion.div
                      layoutId="nav-indicator"
                      style={{
                        position:     "absolute",
                        bottom:       4,
                        left:         "20%",
                        right:        "20%",
                        height:       2,
                        borderRadius: 999,
                        background:   "#2563EB",
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        )}

        {/* Desktop right actions */}
        {isDesktop && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            {user ? (
              <>
                <Link href="/dashboard" style={{ textDecoration: "none" }}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    style={{
                      display: "flex", alignItems: "center", gap: 8,
                      padding: "9px 18px", borderRadius: 12,
                      border: "1px solid #E5E7EB",
                      fontSize: "13.5px", fontWeight: 600, color: "#374151",
                      background: "white", cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <User size={14} color="#6B7280" />
                    {user}
                  </motion.div>
                </Link>
                <button
                  onClick={handleLogout}
                  style={{
                    padding: "9px", borderRadius: 12, border: "none",
                    background: "transparent", cursor: "pointer",
                    color: "#9CA3AF", display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#F9FAFB"; (e.currentTarget as HTMLElement).style.color = "#374151"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#9CA3AF"; }}
                >
                  <LogOut size={15} />
                </button>
              </>
            ) : (
              <Link href="/login" style={{ textDecoration: "none" }}>
                <motion.div
                  whileHover={{ scale: 1.02, boxShadow: "0 4px 16px rgba(37,99,235,0.18)" }}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "9px 18px", borderRadius: 12,
                    border: "1px solid #E5E7EB",
                    fontSize: "13.5px", fontWeight: 600, color: "#374151",
                    background: "white", cursor: "pointer",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                    whiteSpace: "nowrap",
                  }}
                >
                  <User size={14} color="#6B7280" />
                  Login
                </motion.div>
              </Link>
            )}

            {/* Theme toggle */}
            <button
              onClick={() => setDark(!dark)}
              aria-label="Toggle theme"
              style={{
                padding: "9px", borderRadius: 12, border: "none",
                background: "transparent", cursor: "pointer",
                color: "#9CA3AF", display: "flex", alignItems: "center", justifyContent: "center",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#F9FAFB"; (e.currentTarget as HTMLElement).style.color = "#374151"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#9CA3AF"; }}
            >
              {dark ? <Moon size={15} /> : <Sun size={15} />}
            </button>
          </div>
        )}

        {/* Mobile hamburger — only shown below desktop breakpoint */}
        {!isDesktop && (
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              padding: "9px", borderRadius: 12, border: "none",
              background: "transparent", cursor: "pointer",
              color: "#6B7280", display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        )}
      </div>

      {/* ── Mobile dropdown ── */}
      <AnimatePresence>
        {!isDesktop && menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              overflow: "hidden",
              borderTop: "1px solid #F1F5F9",
              background: "rgba(255,255,255,0.98)",
              backdropFilter: "blur(20px)",
            }}
          >
            <div style={{ padding: "12px 24px 20px" }}>
              {/* Nav links */}
              <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 12 }}>
                {NAV_LINKS.map((link) => {
                  const active = isActive(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      style={{
                        display: "flex", alignItems: "center",
                        padding: "11px 16px", borderRadius: 12,
                        fontSize: "14px", fontWeight: active ? 600 : 500,
                        color:      active ? "#2563EB" : "#4B5563",
                        background: active ? "#EFF6FF" : "transparent",
                        textDecoration: "none",
                      }}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>

              {/* Divider + auth */}
              <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: 12 }}>
                {user ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <Link href="/dashboard" onClick={() => setMenuOpen(false)}
                      style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 16px", fontSize: "14px", fontWeight: 600, color: "#374151", textDecoration: "none" }}>
                      <User size={14} color="#6B7280" /> {user}
                    </Link>
                    <button onClick={handleLogout}
                      style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 16px", fontSize: "14px", color: "#9CA3AF", background: "none", border: "none", cursor: "pointer", borderRadius: 12, width: "100%", textAlign: "left" }}>
                      <LogOut size={13} /> Logout
                    </button>
                  </div>
                ) : (
                  <Link href="/login" onClick={() => setMenuOpen(false)}
                    style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 16px", fontSize: "14px", fontWeight: 600, color: "#2563EB", textDecoration: "none" }}>
                    <User size={14} /> Login
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
