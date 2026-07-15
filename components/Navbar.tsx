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
  { href: "#roadmap",  label: "Roadmap"  },
  { href: "#about",    label: "About"    },
  { href: "#features", label: "Features" },
  { href: "#contact",  label: "Contact"  },
];

export default function Navbar() {
  const [user,    setUser]    = useState<UserName | null>(null);
  const [scrolled,setScrolled]= useState(false);
  const [menuOpen,setMenuOpen]= useState(false);
  const [dark,    setDark]    = useState(false);
  const [mounted, setMounted] = useState(false);
  const router   = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setUser(getCurrentUser());
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => { clearCurrentUser(); setMenuOpen(false); router.push("/login"); };
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href) && href !== "/";

  return (
    <motion.nav
      initial={mounted ? { y: -76, opacity: 0 } : false}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.50, ease: [0.25, 0.1, 0.25, 1] }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: "rgba(255,255,255,0.97)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderBottom: scrolled
          ? "1px solid rgba(226,232,240,0.80)"
          : "1px solid rgba(226,232,240,0.50)",
        boxShadow: scrolled
          ? "0 2px 28px rgba(0,0,0,0.08)"
          : "0 1px 0 rgba(226,232,240,0.60)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 h-[72px] flex items-center justify-between">

        {/* ── Logo ── */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-105"
            style={{ background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)" }}
          >
            <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
              <path d="M9 0.5L17 4V10C17 14.8 13.4 18.8 9 19.5C4.6 18.8 1 14.8 1 10V4L9 0.5Z"
                fill="none" stroke="white" strokeWidth="1.5"/>
              <path d="M6 10L8 12L12 8" stroke="white" strokeWidth="1.9"
                strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <div className="font-bold text-[15px] text-gray-900 leading-tight">TWH Academy</div>
            <div className="text-[10px] text-gray-400 leading-tight">Ethical Hacking Academy</div>
          </div>
        </Link>

        {/* ── Center Nav ── */}
        <div className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-2 text-[14px] font-medium transition-colors duration-200 ${
                  active
                    ? "text-blue-600"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {link.label}
                {active && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-1 left-5 right-5 h-[2px] rounded-full bg-blue-600"
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* ── Right Actions ── */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          {user ? (
            <>
              <Link href="/dashboard">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-[13.5px] font-semibold text-gray-700 hover:bg-gray-50 transition-all"
                >
                  <User size={14} />
                  {user}
                </motion.div>
              </Link>
              <button
                onClick={handleLogout}
                className="p-2.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"
              >
                <LogOut size={15} />
              </button>
            </>
          ) : (
            <Link href="/login">
              <motion.div
                whileHover={{ scale: 1.02, boxShadow: "0 4px 16px rgba(37,99,235,0.18)" }}
                className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-[13.5px] font-semibold text-gray-700 hover:border-blue-200 transition-all cursor-pointer"
                style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
              >
                <User size={14} />
                Choose Profile
              </motion.div>
            </Link>
          )}

          {/* Theme toggle */}
          <button
            onClick={() => setDark(!dark)}
            className="p-2.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"
            aria-label="Toggle theme"
          >
            {dark ? <Moon size={15} /> : <Sun size={15} />}
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden p-2.5 rounded-xl hover:bg-gray-100 text-gray-500 transition-all"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden overflow-hidden border-t border-gray-100 bg-white/96 backdrop-blur-xl"
          >
            <div className="px-6 py-4 space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive(link.href)
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 border-t border-gray-100">
                {user ? (
                  <>
                    <Link href="/dashboard" onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-gray-700">
                      <User size={14} /> {user}
                    </Link>
                    <button onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-3 text-sm text-gray-400 hover:bg-gray-50 rounded-xl transition-all w-full">
                      <LogOut size={13} /> Logout
                    </button>
                  </>
                ) : (
                  <Link href="/login" onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-blue-600">
                    <User size={14} /> Choose Profile
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
