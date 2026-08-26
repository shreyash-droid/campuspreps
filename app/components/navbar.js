"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);
  const router = useRouter();
  const { user, isAuthenticated, login, logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav
        className={`flex w-full items-center justify-between px-6 py-4 transition-all duration-300 md:px-16 ${
          scrolled
            ? "border-b border-white/10 bg-[#0b0b0d]/85 shadow-[0_8px_40px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl"
            : "border-b border-white/[0.05] bg-[#0b0b0d]/30 backdrop-blur-md"
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 text-white transition-opacity hover:opacity-80">
          <Image src="/cap.svg" alt="Logo" width={30} height={30} className="h-7 w-7" />
          <span className="display text-lg tracking-tight">Campus Preps</span>
        </Link>

        {/* Right cluster: Contact + auth */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/#contact"
            className="hidden px-2 text-[15px] text-white/65 transition-colors hover:text-white sm:block"
          >
            Contact
          </Link>

          <span className="hidden h-5 w-px bg-white/10 sm:block" />

          {isAuthenticated && user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowProfileMenu((s) => !s)}
                className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-white ring-1 ring-white/20 transition hover:ring-white/40"
                aria-label="Account menu"
              >
                <Image
                  src={user?.image || "/profile.svg"}
                  alt="Profile"
                  width={36}
                  height={36}
                  className="object-cover"
                />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 top-12 w-56 overflow-hidden rounded-2xl border border-white/10 bg-[#111113] shadow-2xl">
                  <div className="border-b border-white/10 px-4 py-3">
                    <div className="text-sm font-medium text-white">{user.name}</div>
                    <div className="truncate text-xs text-white/45">{user.email}</div>
                  </div>
                  <button
                    onClick={() => {
                      router.push("/profile");
                      setShowProfileMenu(false);
                    }}
                    className="block w-full px-4 py-2.5 text-left text-sm text-white/75 transition hover:bg-white/5 hover:text-white"
                  >
                    Your Profile
                  </button>
                  <button
                    onClick={logout}
                    className="block w-full px-4 py-2.5 text-left text-sm text-[#d98c74] transition hover:bg-white/5"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={login}
              className="btn-primary focus-ring rounded-full px-5 py-2 text-sm font-medium"
            >
              Log in
            </button>
          )}

          {/* Mobile: Contact lives in a tiny menu */}
          <button
            className="text-white/80 transition hover:text-white sm:hidden"
            onClick={() => setIsMobileMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 7h16M4 12h16M4 17h16"}
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile sheet */}
      {isMobileMenuOpen && (
        <div className="mx-4 mt-2 rounded-2xl border border-white/10 bg-[#0f0f11]/95 p-3 backdrop-blur-xl sm:hidden">
          <Link
            href="/#contact"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block rounded-xl px-3 py-2.5 text-base text-white/80 transition hover:bg-white/5 hover:text-white"
          >
            Contact
          </Link>
        </div>
      )}
    </header>
  );
}
