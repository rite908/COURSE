"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, Sun, Moon, LogOut } from "lucide-react";
import { getCurrentUser, clearCurrentUser, type UserName } from "@/lib/storage";

const NAV_LINKS = [
  { href: "/",          label: "Home"     },
  { href: "/chapters",  label: "Chapters" },
  { href: "#roadmap",   label: "Roadmap"  },
  { href: "#about",     label: "About"    },
  { href: "#features",  label: "Features" },
  { href: "#contact",   label: "Contact"  },
];

export default function Navbar() {
  const [user,      setUser]      = useState<UserName | null>(null);
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [dark,      setDark]      = useState(false);
  const [mounted,   setMounted]   = useState(false);
  const router   = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setUser(getCurrentUser());
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    clearCurrentUser();
    setMenuOpen(false);
    router.push("/login");
  };

  const isHome = pathname === "/";
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href) && href !== "/";

  return (
    <motion.nav
      initial={mounted ? { y: -68, opacity: 0 } : false}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: "rgba(255,255,255,0.96)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderBottom: scrolled ? "1px solid rgba(226,232,240,0.7)" : "1px solid rgba(226,232,240,0.4)",
        boxShadow: scrolled ? "0 1px 24px rgba(0,0,0,0.07)" : "0 1px 0 rgba(226,232,240,0.6)",
      }}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-[68px] flex items-center justify-between gap-6">

        {/* ── Logo ── */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-sm">
            <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
              <path d="M9 0.5L17 4V10C17 14.8 13.4 18.8 9 19.5C4.6 18.8 1 14.8 1 10V4L9 0.5Z"
                fill="none" stroke="white" strokeWidth="1.4"/>
              <path d="M6 10L8 12L12 8" stroke="white" strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <div className="font-bold text-[15px] text-gray-900 leading-none">TWH Academy</div>
            <div className="text-[10px] text-gray-400 mt-0.5 leading-none">Ethical Hacking Academy</div>
          </div>
        </Link>

        {/* ── Center Nav ── */}
        <div className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 rounded-lg text-[13.5px] font-medium transition-colors duration-200 ${
                  active ? "text-blue-600" : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {link.label}
                {active && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0.5 left-4 right-4 h-0.5 rounded-full bg-blue-600"
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* ── Right ── */}
        <div className="hidden lg:flex items-center gap-2 shrink-0">
          {user ? (
            <>
              <Link href="/dashboard">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-[13px] font-semibold text-gray-700 hover:bg-gray-50 transition-all"
                >
                  <User size={14} />
                  {user}
                </motion.div>
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"
              >
                <LogOut size={15} />
              </button>
            </>
          ) : (
            <Link href="/login">
              <motion.div
                whileHover={{ scale: 1.03, boxShadow: "0 4px 16px rgba(37,99,235,0.2)" }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-[13px] font-semibold text-gray-700 bg-white hover:border-blue-200 transition-all"
              >
                <User size={14} />
                Choose Profile
              </motion.div>
            </Link>
          )}
          {/* Theme toggle (cosmetic) */}
          <button
            onClick={() => setDark(!dark)}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"
          >
            {dark ? <Moon size={15} /> : <Sun size={15} />}
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          className="lg:hidden p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-all"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden overflow-hidden border-t border-gray-100 bg-white/95 backdrop-blur-xl"
          >
            <div className="px-5 py-4 space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive(link.href) ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-gray-100">
                {user ? (
                  <>
                    <Link href="/dashboard" onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2.5 text-sm font-semibold text-gray-700">
                      <User size={14} /> {user}
                    </Link>
                    <button onClick={handleLogout}
                      className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-400 hover:bg-gray-50 rounded-xl transition-all w-full">
                      <LogOut size={13} /> Logout
                    </button>
                  </>
                ) : (
                  <Link href="/login" onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 text-sm font-semibold text-blue-600">
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
