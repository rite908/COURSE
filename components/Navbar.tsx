"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogOut, ChevronRight } from "lucide-react";
import { getCurrentUser, clearCurrentUser, type UserName } from "@/lib/storage";

const USER_CONFIG: Record<UserName, { color: string; bg: string }> = {
  TWH:    { color: "#2563EB", bg: "#EEF3FF" },
  Prince: { color: "#7C3AED", bg: "#F3EEFF" },
  Ashish: { color: "#059669", bg: "#ECFDF5" },
};

export default function Navbar() {
  const [user, setUser] = useState<UserName | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
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

  const navLinks = [
    { href: "/", label: "Home" },
    ...(user ? [
      { href: "/chapters", label: "Chapters" },
      { href: "/dashboard", label: "Dashboard" },
    ] : []),
  ];

  const userConf = user ? USER_CONFIG[user] : null;

  return (
    <motion.nav
      initial={mounted ? { y: -72, opacity: 0 } : false}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0)",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(226,232,240,0.8)" : "none",
        boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.05)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2.5 group">
          <div className="relative w-8 h-8 flex items-center justify-center rounded-lg bg-blue-600">
            <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
              <path d="M8 0.5L15 4V10C15 13.6 11.9 17 8 17C4.1 17 1 13.6 1 10V4L8 0.5Z"
                fill="none" stroke="white" strokeWidth="1.4"/>
              <path d="M5.5 9.5L7 11L10.5 7.5" stroke="white" strokeWidth="1.6"
                strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="font-bold text-sm text-gray-900">
            TWH <span className="text-blue-600">Academy</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {user && userConf ? (
            <div className="hidden md:flex items-center gap-2">
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold"
                style={{ color: userConf.color, background: userConf.bg }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: userConf.color }} />
                {user}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-all"
              >
                <LogOut size={13} />
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden md:flex items-center gap-1.5 px-5 py-2 text-sm font-semibold text-white rounded-lg bg-blue-600 hover:bg-blue-700 transition-all shadow-sm"
            >
              Start Learning <ChevronRight size={14} />
            </Link>
          )}

          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-all"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden border-t border-gray-100 bg-white"
          >
            <div className="px-5 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    pathname === link.href
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {user && userConf ? (
                <>
                  <div className="flex items-center gap-2 px-3 py-2.5 text-sm font-semibold" style={{ color: userConf.color }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: userConf.color }} />
                    {user}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-gray-50 transition-all"
                  >
                    <LogOut size={13} /> Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-1.5 px-3 py-2.5 text-sm font-semibold text-blue-600"
                >
                  Start Learning <ChevronRight size={14} />
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
