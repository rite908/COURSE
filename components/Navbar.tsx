"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, Sun, Moon, LogOut, Shield } from "lucide-react";
import { getCurrentUser, clearCurrentUser, type UserName } from "@/lib/storage";
import { useTheme } from "@/lib/theme";

const NAV_LINKS = [
  { href: "/",         label: "Home"     },
  { href: "/chapters", label: "Chapters" },
  { href: "/roadmap",  label: "Roadmap"  },
  { href: "/about",    label: "About"    },
  { href: "/features", label: "Features" },
  { href: "/contact",  label: "Contact"  },
];

const BREAK = 1024;

export default function Navbar() {
  const [user,     setUser]     = useState<UserName | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted,  setMounted]  = useState(false);
  const [vw,       setVw]       = useState(1280);

  const { isDark, toggle: toggleTheme } = useTheme();
  const router   = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setUser(getCurrentUser());
    setMounted(true);
    const updateVw = () => setVw(window.innerWidth);
    updateVw();
    window.addEventListener("resize", updateVw, { passive: true });
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("resize", updateVw);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const isDesktop = vw >= BREAK;

  const handleLogout = () => {
    clearCurrentUser();
    setMenuOpen(false);
    router.push("/login");
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href) && href !== "/";

  /* ── Colour tokens ── */
  const navBg  = isDark ? "rgba(6,9,18,0.97)"   : "rgba(255,255,255,0.97)";
  const bdr    = isDark ? "rgba(30,36,51,0.90)"  : scrolled ? "rgba(226,232,240,0.90)" : "rgba(226,232,240,0.50)";
  const shadow = scrolled
    ? isDark ? "0 2px 28px rgba(0,0,0,0.50)" : "0 2px 28px rgba(0,0,0,0.09)"
    : isDark ? "0 1px 0 rgba(30,36,51,0.60)"  : "0 1px 0 rgba(226,232,240,0.60)";

  const txtPri = isDark ? "#F1F5F9" : "#111827";
  const txtSec = isDark ? "#94A3B8" : "#6B7280";
  const cardBg = isDark ? "#0D1117" : "#FFFFFF";
  const cardBr = isDark ? "#1E2433" : "#E5E7EB";
  const hvrBg  = isDark ? "#1A2030" : "#F9FAFB";

  /* ── Side padding matches page ── */
  const sp = vw < 640 ? 16 : vw < 768 ? 24 : vw < 1024 ? 40 : 64;

  return (
    <motion.nav
      initial={mounted ? { y: -76, opacity: 0 } : false}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: navBg,
        backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
        borderBottom: `1px solid ${bdr}`,
        boxShadow: shadow,
        transition: "border-color 0.3s, box-shadow 0.3s",
        width: "100%",
      }}
    >
      {/* ── Main bar ── */}
      <div style={{
        width: "100%",
        padding: `0 ${sp}px`,
        height: 68,
        display: "flex", alignItems: "center",
        justifyContent: "space-between",
        boxSizing: "border-box",
      }}>

        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 11, flexShrink: 0, textDecoration: "none" }}>
          <img src="/twh-logo.png" alt="TWH Academy" style={{
            width: 38, height: 38, borderRadius: 11, flexShrink: 0,
            objectFit: "cover",
            boxShadow: "0 2px 10px rgba(37,99,235,0.32)",
          }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: "15px", color: txtPri, lineHeight: 1.25 }}>TWH Academy</div>
            <div style={{ fontSize: "10px", color: txtSec, lineHeight: 1.25 }}>Ethical Hacking Academy</div>
          </div>
        </Link>

        {/* ── Desktop nav links — centered ── */}
        {isDesktop && (
          <div style={{ display: "flex", alignItems: "center", gap: 36, position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
            {NAV_LINKS.map(link => {
              const active = isActive(link.href);
              return (
                <Link key={link.href} href={link.href}
                  style={{
                    position: "relative", padding: "6px 0",
                    fontSize: "14px", fontWeight: active ? 600 : 500,
                    color: active ? "#2563EB" : txtSec,
                    textDecoration: "none", transition: "color 0.2s", whiteSpace: "nowrap",
                  }}
                  onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.color = txtPri; }}
                  onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.color = txtSec; }}
                >
                  {link.label}
                  {active && (
                    <motion.div layoutId="nav-indicator" style={{
                      position: "absolute", bottom: 2, left: "15%", right: "15%",
                      height: 2, borderRadius: 999, background: "#2563EB",
                    }} />
                  )}
                </Link>
              );
            })}
          </div>
        )}

        {/* ── Desktop right actions ── */}
        {isDesktop && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            {user ? (
              <>
                <Link href="/dashboard" style={{ textDecoration: "none" }}>
                  <motion.div whileHover={{ scale: 1.02 }} style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "8px 16px", borderRadius: 11,
                    border: `1px solid ${cardBr}`, fontSize: "13.5px",
                    fontWeight: 600, color: txtPri, background: cardBg,
                    cursor: "pointer", whiteSpace: "nowrap",
                  }}>
                    <User size={13} color={txtSec} />{user}
                  </motion.div>
                </Link>
                <button onClick={handleLogout} title="Logout" style={{
                  padding: 8, borderRadius: 11, border: "none",
                  background: "transparent", cursor: "pointer",
                  color: txtSec, display: "flex", alignItems: "center",
                  transition: "background 0.2s, color 0.2s",
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = hvrBg; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                ><LogOut size={15} /></button>
              </>
            ) : (
              <>
                <Link href="/login" style={{ textDecoration: "none" }}>
                  <motion.div whileHover={{ scale: 1.02 }} style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "8px 16px", borderRadius: 11,
                    border: `1px solid ${cardBr}`, fontSize: "13.5px",
                    fontWeight: 600, color: txtPri, background: cardBg,
                    cursor: "pointer",
                  }}>
                    <User size={13} color={txtSec} />Login
                  </motion.div>
                </Link>
                <Link href="/chapters" style={{ textDecoration: "none" }}>
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "8px 18px", borderRadius: 11,
                    fontSize: "13.5px", fontWeight: 700, color: "white",
                    background: "linear-gradient(135deg,#2563EB 0%,#7C3AED 100%)",
                    boxShadow: "0 4px 16px rgba(37,99,235,0.35)",
                    cursor: "pointer", whiteSpace: "nowrap",
                  }}>
                    Get Started
                  </motion.div>
                </Link>
              </>
            )}

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              title={isDark ? "Switch to Light" : "Switch to Dark"}
              style={{
                padding: 8, borderRadius: 11, border: "none",
                background: isDark ? "rgba(37,99,235,0.15)" : "transparent",
                cursor: "pointer",
                color: isDark ? "#60A5FA" : txtSec,
                display: "flex", alignItems: "center",
                transition: "background 0.2s, color 0.2s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = hvrBg; (e.currentTarget as HTMLElement).style.color = txtPri; }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = isDark ? "rgba(37,99,235,0.15)" : "transparent";
                (e.currentTarget as HTMLElement).style.color = isDark ? "#60A5FA" : txtSec;
              }}
            >
              {isDark ? <Sun size={16} /> : <Moon size={15} />}
            </button>
          </div>
        )}

        {/* ── Mobile right: theme toggle + hamburger ── */}
        {!isDesktop && (
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <button
              onClick={toggleTheme}
              style={{
                padding: 8, borderRadius: 10, border: "none",
                background: "transparent", cursor: "pointer",
                color: txtSec, display: "flex", alignItems: "center",
              }}
            >
              {isDark ? <Sun size={16} /> : <Moon size={15} />}
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} style={{
              padding: 8, borderRadius: 10, border: "none",
              background: "transparent", cursor: "pointer",
              color: txtSec, display: "flex", alignItems: "center",
            }}>
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        )}
      </div>

      {/* ── Mobile dropdown ── */}
      <AnimatePresence>
        {!isDesktop && menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            style={{
              overflow: "hidden",
              borderTop: `1px solid ${bdr}`,
              background: navBg,
              backdropFilter: "blur(20px)",
            }}
          >
            <div style={{ padding: "12px 20px 20px" }}>
              {/* Nav links */}
              <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 12 }}>
                {NAV_LINKS.map(link => {
                  const active = isActive(link.href);
                  return (
                    <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
                      style={{
                        display: "flex", alignItems: "center",
                        padding: "11px 16px", borderRadius: 12,
                        fontSize: "14.5px", fontWeight: active ? 600 : 500,
                        color: active ? "#2563EB" : txtSec,
                        background: active ? (isDark ? "rgba(37,99,235,0.15)" : "#EFF6FF") : "transparent",
                        textDecoration: "none", transition: "background 0.15s",
                      }}
                    >{link.label}</Link>
                  );
                })}
              </div>

              {/* User / login */}
              <div style={{ borderTop: `1px solid ${bdr}`, paddingTop: 12, display: "flex", flexDirection: "column", gap: 2 }}>
                {user ? (
                  <>
                    <Link href="/dashboard" onClick={() => setMenuOpen(false)}
                      style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 16px", fontSize: "14px", fontWeight: 600, color: txtPri, textDecoration: "none" }}>
                      <User size={14} color={txtSec} />{user}
                    </Link>
                    <button onClick={handleLogout}
                      style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 16px", fontSize: "14px", color: txtSec, background: "none", border: "none", cursor: "pointer", borderRadius: 12, width: "100%", textAlign: "left" }}>
                      <LogOut size={14} />Logout
                    </button>
                  </>
                ) : (
                  <Link href="/login" onClick={() => setMenuOpen(false)}
                    style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 16px", fontSize: "14px", fontWeight: 600, color: "#2563EB", textDecoration: "none" }}>
                    <User size={14} />Login
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
