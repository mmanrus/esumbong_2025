"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-gray-900 text-white py-4 px-4 md:px-8 sticky top-0 z-50 shadow-lg">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl hover:opacity-80"
        >
          <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
            <span className="text-gray-900 font-bold">E</span>
          </div>
          <span>e-Sumbong</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className={`transition ${
              isActive("/")
                ? "text-yellow-400 font-bold"
                : "hover:text-yellow-400"
            }`}
          >
            Home
          </Link>
          <Link
            href="/about"
            className={`transition ${
              isActive("/about")
                ? "text-yellow-400 font-bold"
                : "hover:text-yellow-400"
            }`}
          >
            About
          </Link>
          <Link
            href="/emergency"
            className={`transition ${
              isActive("/emergency")
                ? "text-yellow-400 font-bold"
                : "hover:text-yellow-400"
            }`}
          >
            Emergency & Announcements
          </Link>
          <button
            className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-bold hover:bg-yellow-500 transition"
            onClick={() => router.push("/login")}
          >
            Login
          </button>
        </div>
      </div>
    </nav>
  );
}
