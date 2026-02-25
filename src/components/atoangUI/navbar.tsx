"use client";
import React, { useState, useEffect } from "react";
import { Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { toast } from "sonner";
import { useAuth } from "@/contexts/authContext";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const path = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    setIsMobileMenuOpen(false);
    toast.success("You have been successfully logged out.");
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    //{ name: "Contact", path: "/contact" },
  ];

  const isActive = (linkPath: string) => path === linkPath; // ✅ fix

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/95 backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              width={180}
              height={60}
              src="/esumbong-logo.png"
              alt="e-Sumbong Logo"
              className="h-[45px]  md:h-[50px] lg:h-[60px] w-auto transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`relative font-medium transition-colors duration-300 ${
                  isActive(link.path)
                    ? isScrolled
                      ? "text-teal-700"
                      : "text-gray-700"
                    : isScrolled
                      ? "text-gray-700 hover:text-teal-700"
                      : "text-gray-700 hover:text-white"
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <motion.div
                    layoutId="activeNav"
                    className={`absolute -bottom-1 left-0 right-0 h-0.5 ${
                      isScrolled ? "bg-teal-700" : "bg-teal-700"
                    }`}
                  />
                )}
              </Link>
            ))}

            <Link
              href="/login"
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                isScrolled
                  ? "bg-teal-700 text-white hover:bg-teal-800 shadow-md hover:shadow-lg"
                  : "bg-white text-teal-700 hover:bg-teal-50 shadow-lg hover:shadow-xl"
              }`}
            >
              Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors duration-300 ${
              isScrolled
                ? "text-gray-700 hover:bg-gray-100"
                : "text-white hover:bg-white/10"
            }`}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t border-gray-200 shadow-lg"
          >
            <div className="px-4 py-4 space-y-3">
              {isAuthenticated && (
                <div className="px-4 py-2 border-b border-gray-100 mb-2">
                  <p className="text-xs text-gray-500 uppercase font-semibold">
                    Signed in as
                  </p>
                  <p className="text-sm font-medium text-teal-700 truncate">
                    {user?.email}
                  </p>
                </div>
              )}

              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${
                    isActive(link.path)
                      ? "bg-teal-50 text-teal-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {isAuthenticated ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${
                      isActive("/dashboard")
                        ? "bg-teal-50 text-teal-700"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <LayoutDashboard size={18} />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors duration-300 text-left"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </>
              ) : path === "/login" ? (
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-2 bg-teal-700 text-white text-center rounded-lg font-medium hover:bg-teal-800 transition-colors duration-300"
                >
                  Login
                </Link>
              ) : (
                ""
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
