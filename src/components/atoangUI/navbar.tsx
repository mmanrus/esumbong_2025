"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/emergency", label: "Emergency & Announcements" },
  ];

  return (
    <nav className="bg-gray-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl hover:opacity-80 flex-shrink-0"
        >
          <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
            <span className="text-gray-900 font-bold text-sm">E</span>
          </div>
          <span>Sumbong</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm transition whitespace-nowrap ${
                isActive(l.href)
                  ? "text-yellow-400 font-bold"
                  : "hover:text-yellow-400"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <button
            className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-bold
                       hover:bg-yellow-500 transition text-sm whitespace-nowrap"
            onClick={() => router.push("/login")}
          >
            Login
          </button>
        </div>

        {/* Mobile: Login + Hamburger */}
        <div className="flex md:hidden items-center gap-3">
          <button
            className="bg-yellow-400 text-gray-900 px-3 py-1.5 rounded-lg font-bold
                       hover:bg-yellow-500 transition text-sm"
            onClick={() => router.push("/login")}
          >
            Login
          </button>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            className="text-white hover:text-yellow-400 transition p-1"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700 px-4 py-3 space-y-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`block py-2.5 px-3 rounded-lg text-sm transition ${
                isActive(l.href)
                  ? "text-yellow-400 font-bold bg-gray-700"
                  : "hover:text-yellow-400 hover:bg-gray-700"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
