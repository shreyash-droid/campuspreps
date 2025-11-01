"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const NavItem = ({ href, children }) => (
  <Link 
    href={href}
    className="text-white/80 hover:text-white transition-colors px-4 py-2 text-lg font-light"
  >
    {children}
  </Link>
);

const MobileNavItem = ({ href, children }) => (
  <Link
    href={href}
    className="text-white/80 hover:text-white block px-3 py-2 text-base font-medium transition-colors"
  >
    {children}
  </Link>
);

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [userData, setUserData] = useState(null);
  const menuRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    // Get user data from localStorage
    const user = localStorage.getItem('user');
    if (user) {
      setUserData(JSON.parse(user));
    }

    // Handle clicking outside of menu
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    // Clear all localStorage data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('loggedIn');
    // Update state
    setUserData(null);
    setShowProfileMenu(false);
    // Redirect to home page and force a reload to reset all states
    window.location.href = '/';
  };

  const handleProfileClick = () => {
    router.push('/profile');
    setShowProfileMenu(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
      <nav className="bg-black/50 backdrop-blur-md border-black rounded-2xl py-2 max-w-8xl mx-auto">
        <div className="px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            {/* Logo and Brand */}
            <Link
              href="/"
              className="flex items-center space-x-2 text-white hover:opacity-90 transition-opacity"
            >
              <Image
                src="/cap.svg"
                alt="Logo"
                width={32}
                height={32}
                className="w-8 h-8"
              />
              <span className="text-xl font-semibold">Campus Preps</span>
            </Link>

            {/* Navigation Items */}
            <div className="hidden md:flex items-center space-x-1">
              <NavItem href="/select-year?type=papers">Papers</NavItem>
              <NavItem href="/select-year?type=materials">Materials</NavItem>
              <NavItem href="/select-year?type=youtube">YouTube</NavItem>
              <NavItem href="/#contact">Contact</NavItem>
            </div>

            {/* Profile Button with Dropdown */}
            <div className="relative" ref={menuRef}>
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 text-white hover:opacity-80"
              >
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <Image
                    src="/profile.svg"
                    alt="Profile"
                    width={20}
                    height={20}
                    className="opacity-90"
                  />
                </div>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 top-12 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1" role="menu">
                    {userData ? (
                      <>
                        <div className="px-4 py-2 text-sm text-gray-700 border-b">
                          <div className="font-medium">{userData.name}</div>
                          <div className="text-gray-500 truncate text-xs">{userData.email}</div>
                        </div>
                        <button
                          onClick={handleProfileClick}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Your Profile
                        </button>
                        <button
                          onClick={handleSignOut}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <div className="px-4 py-2 text-sm text-gray-700">
                        Please sign in to continue
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-white hover:text-gray-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d={isMobileMenuOpen 
                    ? "M6 18L18 6M6 6l12 12" 
                    : "M4 6h16M4 12h16M4 18h16"
                  } 
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-black/90 backdrop-blur-md rounded-b-2xl border-t border-white/10">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <MobileNavItem href="/select-year?type=papers">Papers</MobileNavItem>
              <MobileNavItem href="/select-year?type=materials">Materials</MobileNavItem>
              <MobileNavItem href="/select-year?type=youtube">YouTube</MobileNavItem>
              <MobileNavItem href="/#contact">Contact</MobileNavItem>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}