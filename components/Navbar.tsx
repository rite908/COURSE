"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Menu, X, LogOut, User, BookOpen, Home, Search } from "lucide-react";
import { getCurrentUser, clearCurrentUser, type UserName } from "@/lib/storage";

const USER_COLORS: Record<UserName, string> = {
  TWH: "text-accent-cyan",
  Prince: "text-accent-purple",
  Ashish: "text-accent-green",
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
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    clearCurrentUser();
    router.push("/login");
  };

  const navLinks = user
    ? [
        { href: "/dashboard", label: "Dashboard", icon: <Home size={15} /> },
        { href: "/chapters", label: "Chapters", icon: <BookOpen size={15} /> },
      ]
    : [];

  return (
    <motion.nav
      initial={mounted ? { y: -60, opacity: 0 } : false}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-bg-secondary/90 backdrop-blur-xl border-b border-white/5 shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2.5 group">
          <div className="relative">
            <Shield
              size={22}
              className="text-accent-cyan group-hover:scale-110 transition-transform"
            />
            <div className="absolute inset-0 blur-md bg-accent-cyan/30 rounded-full scale-150" />
          </div>
          <span className="font-bold text-base tracking-wide">
            <span className="text-accent-cyan">TWH</span>
            <span className="text-white/70 font-normal"> Academy</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                pathname === link.href
                  ? "bg-accent-cyan/10 text-accent-cyan"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg glass border border-white/10">
                <User size={13} className={USER_COLORS[user]} />
                <span className={`text-sm font-semibold ${USER_COLORS[user]}`}>{user}</span>
              </div>
              <button
                onClick={handleLogout}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-white/50 hover:text-white/80 hover:bg-white/5 transition-all"
              >
                <LogOut size={14} />
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="px-4 py-1.5 rounded-lg bg-accent-cyan text-bg-primary text-sm font-bold hover:bg-accent-cyan/90 transition-all shadow-glow-cyan"
            >
              Login
            </Link>
          )}

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg glass"
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
            className="md:hidden glass border-t border-white/5 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    pathname === link.href
                      ? "bg-accent-cyan/10 text-accent-cyan"
                      : "text-white/70 hover:bg-white/5"
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
              {user && (
                <>
                  <div className="flex items-center gap-2 px-3 py-2.5">
                    <User size={14} className={USER_COLORS[user]} />
                    <span className={`text-sm font-semibold ${USER_COLORS[user]}`}>{user}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-white/50 hover:bg-white/5 transition-all"
                  >
                    <LogOut size={14} />
                    Logout
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
