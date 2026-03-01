"use client"
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  TrendingUp,
  Users,
  Shield,
  ChevronRight,
  Phone,
  AlertTriangle,
  Flame,
  Ambulance,
  Building2,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function HomePage() {
  const [isHotlineExpanded, setIsHotlineExpanded] = useState(false);

  const hotlines = [
    {
      icon: Building2,
      label: "Barangay Hotline",
      number: "123-4567",
      color: "from-teal-400 to-teal-700",
    },
    {
      icon: Shield,
      label: "Police",
      number: "166",
      color: "from-teal-500 to-cyan-700",
    },
    {
      icon: Flame,
      label: "Fire Station",
      number: "160",
      color: "from-yellow-400 to-orange-500",
    },
    {
      icon: Ambulance,
      label: "Ambulance",
      number: "911",
      color: "from-yellow-300 to-yellow-500",
    },
  ];

  const features = [
    {
      icon: MessageSquare,
      title: "Report Issues",
      description:
        "Easily submit reports about community concerns, infrastructure problems, or public service issues with just a few clicks.",
    },
    {
      icon: TrendingUp,
      title: "Track Progress",
      description:
        "Stay informed with real-time updates on your submitted reports and see how your community is improving.",
    },
    {
      icon: Users,
      title: "Community Engagement",
      description:
        "Connect with fellow citizens, support important issues, and collectively make your voice heard.",
    },
    {
      icon: Shield,
      title: "Transparency",
      description:
        "Access public records, view response times, and hold authorities accountable with complete transparency.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <>
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">

        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/homePage.webp"
              alt="Community gathering"
              fill
            />
            <div className="absolute inset-0 bg-linear-to-r from-teal-900/90 via-teal-800/85 to-teal-700/80"></div>
          </div>
          {/* ── DESKTOP: Floating card inside hero ── */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2, duration: 0.6, type: "spring", stiffness: 100 }}
            className="hidden md:block absolute left-6 top-1/2 -translate-y-1/2 w-60"
          >
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/20 ">
              <button
                onClick={() => setIsHotlineExpanded(!isHotlineExpanded)}
                className="w-full flex items-center justify-between px-4 py-3 bg-yellow-400 text-teal-900"
              >
                <div className="flex items-center gap-2">
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                    <AlertTriangle className="w-4 h-4 text-teal-800" />
                  </motion.div>
                  <span className="font-bold text-xs tracking-widest uppercase">Emergency Hotlines</span>
                </div>
                <motion.div animate={{ rotate: isHotlineExpanded ? 0 : -90 }} transition={{ duration: 0.3 }}>
                  <ChevronDown className="w-4 h-4 text-teal-800" />
                </motion.div>
              </button>
              <AnimatePresence initial={false}>
                {isHotlineExpanded && (
                  <motion.div
                    key="hotlines-desktop"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="overflow-hidden bg-teal-900/80 backdrop-blur-md"
                  >
                    <div className="p-3 space-y-2">
                      {hotlines.map((item, index) => (
                        <motion.a
                          key={index}
                          href={`tel:${item.number.replace("-", "")}`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.07 + 0.1 }}
                          whileHover={{ scale: 1.03, x: 4 }}
                          whileTap={{ scale: 0.97 }}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-white/10 bg-white/10 hover:bg-white/20 cursor-pointer group transition-all duration-200"
                        >
                          <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center shadow-sm flex-shrink-0`}>
                            <item.icon className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-white/60 font-medium leading-none mb-0.5">{item.label}</p>
                            <p className="text-sm font-bold text-yellow-300 tracking-wide">{item.number}</p>
                          </div>
                          <Phone className="w-3.5 h-3.5 text-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0" />
                        </motion.a>
                      ))}
                    </div>
                    <div className="px-3 pb-3">
                      <p className="text-center text-xs text-white/40 bg-white/5 rounded-lg py-1.5">
                        Tap any number to call
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="absolute inset-0 rounded-2xl bg-yellow-400/10 blur-xl -z-10 scale-95" />
          </motion.div>

          {/* ── MOBILE: Icon strip tab + slide-out sidebar ── */}
          <div className="md:hidden">
            {/* Backdrop overlay */}
            <AnimatePresence>
              {isHotlineExpanded && (
                <motion.div
                  key="backdrop"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="fixed inset-0 bg-black/50 z-30"
                  onClick={() => setIsHotlineExpanded(false)}
                />
              )}
            </AnimatePresence>

            {/* Sidebar panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: isHotlineExpanded ? 0 : "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 h-full w-64 z-40 bg-teal-900 shadow-2xl flex flex-col"
            >
              {/* Sidebar header */}
              <div className="flex items-center justify-between px-4 py-4 bg-yellow-400">
                <div className="flex items-center gap-2">
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                    <AlertTriangle className="w-4 h-4 text-teal-900" />
                  </motion.div>
                  <span className="font-bold text-xs tracking-widest uppercase text-teal-900">Emergency Hotlines</span>
                </div>
                <button
                  onClick={() => setIsHotlineExpanded(false)}
                  className="w-7 h-7 rounded-full bg-teal-900/20 flex items-center justify-center text-teal-900 hover:bg-teal-900/30 transition-colors"
                >
                  <ChevronRight className="w-4 h-4 rotate-180" />
                </button>
              </div>

              {/* Sidebar hotline items */}
              <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                {hotlines.map((item, index) => (
                  <motion.a
                    key={index}
                    href={`tel:${item.number.replace("-", "")}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: isHotlineExpanded ? 1 : 0, x: isHotlineExpanded ? 0 : -20 }}
                    transition={{ delay: index * 0.08 + 0.1 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-4 px-4 py-3.5 rounded-2xl border border-white/10 bg-white/10 active:bg-white/20 cursor-pointer"
                  >
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-md flex-shrink-0`}>
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white/50 font-medium mb-0.5">{item.label}</p>
                      <p className="text-base font-bold text-yellow-300 tracking-wide">{item.number}</p>
                    </div>
                    <Phone className="w-4 h-4 text-white/30 flex-shrink-0" />
                  </motion.a>
                ))}
              </div>

              <div className="px-4 pb-6">
                <p className="text-center text-xs text-white/30 bg-white/5 rounded-xl py-2">
                  Tap any number to call
                </p>
              </div>
            </motion.div>

            {/* Icon strip tab — always visible on left edge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: isHotlineExpanded ? 0 : 1, x: isHotlineExpanded ? -20 : 0 }}
              transition={{ duration: 0.2 }}
              className="fixed left-0 top-1/2 -translate-y-1/2 z-30 pointer-events-auto"
            >
              <button
                onClick={() => setIsHotlineExpanded(true)}
                className="flex flex-col items-center gap-1.5 bg-teal-900/90 backdrop-blur-sm border-r-0 border border-white/20 rounded-r-2xl px-2 py-3 shadow-xl"
              >
                {/* Pulsing alert dot */}
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="w-2 h-2 rounded-full bg-yellow-400 mb-1"
                />
                {hotlines.map((item, index) => (
                  <div
                    key={index}
                    className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center shadow-sm`}
                  >
                    <item.icon className="w-4 h-4 text-white" />
                  </div>
                ))}
                <ChevronRight className="w-3.5 h-3.5 text-white/50 mt-1" />
              </button>
            </motion.div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
                e-Sumbong:
                <br />
                <span className="text-yellow-300">Your Voice, Our Action</span>
              </h1>
              <p className="text-xl sm:text-2xl text-white/90 mb-12 max-w-3xl mx-auto">
                Empowering citizens to report issues, track solutions, and build
                stronger communities together.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-8 py-4 bg-yellow-400 text-teal-900 font-bold text-lg rounded-xl shadow-2xl hover:bg-yellow-300 hover:scale-105 transform transition-all duration-300"
              >
                Get Started
                <ChevronRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2"
            >
              <div className="w-1.5 h-2 bg-white/50 rounded-full"></div>
            </motion.div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Why Choose E-Sumbong?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                A platform designed to bridge the gap between citizens and their
                local government
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
                >
                  <div className="w-16 h-16 bg-linear-to-br from-teal-500 to-teal-700 rounded-xl flex items-center justify-center mb-6 transform group-hover:rotate-6 transition-transform duration-300">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-linear-to-r from-teal-600 to-teal-800">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl text-white/90 mb-10">
              Join thousands of active citizens who are already using E-Sumbong
              to improve their communities
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-10 py-5 bg-yellow-400 text-teal-900 font-bold text-lg rounded-xl shadow-2xl hover:bg-yellow-300 hover:scale-105 transform transition-all duration-300"
            >
              Get Started Now
              <ChevronRight className="w-6 h-6" />
            </Link>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-linear-to-br from-teal-500 to-teal-700 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xl">EI</span>
                  </div>
                  <span className="text-xl font-bold">e-Sumbong</span>
                </div>
                <p className="text-gray-400">
                  Empowering communities through transparent communication and
                  civic engagement.
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                      About
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li>
                    <span className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                      Privacy Policy
                    </span>
                  </li>
                  <li>
                    <span className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                      Terms of Service
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
              <p>&copy; 2026 e-Sumbong. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}