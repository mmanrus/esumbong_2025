"use client";

import { useState } from "react";
import {
  Phone,
  Shield,
  Flame,
  Ambulance,
  AlertTriangle,
  X,
} from "lucide-react";

const hotlines = [
  {
    label: "Barangay Hotline",
    number: "123-4567",
    icon: Shield,
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
    iconBg: "bg-blue-500",
  },
  {
    label: "Police",
    number: "166",
    icon: Shield,
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    text: "text-indigo-700",
    iconBg: "bg-indigo-600",
  },
  {
    label: "Fire Station",
    number: "160",
    icon: Flame,
    bg: "bg-orange-50",
    border: "border-orange-200",
    text: "text-orange-700",
    iconBg: "bg-orange-500",
  },
  {
    label: "Ambulance",
    number: "911",
    icon: Ambulance,
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-700",
    iconBg: "bg-red-500",
  },
];

export default function HotlinePanel() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* ── Desktop: fixed right aside ── */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-l shadow-md p-5 overflow-y-auto gap-4">
        <PanelHeader />
        <HotlineList />
      </aside>

      {/* ── Mobile: FAB bottom-left ── */}
      <div className="lg:hidden">
        {/* FAB button */}
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Emergency Hotlines"
          className="fixed bottom-5 left-4 z-50 flex items-center justify-center
                     w-12 h-12 rounded-full bg-[#1F4251] text-white shadow-lg
                     hover:bg-[#2a5568] active:scale-95 transition-all duration-200"
        >
          <AlertTriangle className="w-5 h-5 text-yellow-300" />
        </button>

        {/* Backdrop */}
        {isOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
        )}

        {/* Bottom sheet modal */}
        <div
          className={`fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl
                      transition-transform duration-300 ease-out
                      ${isOpen ? "translate-y-0" : "translate-y-full"}`}
        >
          {/* Sheet handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-gray-300" />
          </div>

          {/* Sheet header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#1F4251]">
                <AlertTriangle className="w-4 h-4 text-yellow-300" />
              </div>
              <h3 className="text-base font-bold text-[#1F4251]">
                Emergency Hotlines
              </h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full hover:bg-gray-100 transition"
              aria-label="Close"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* Hotlines grid */}
          <div className="p-4 grid grid-cols-2 gap-3 pb-8">
            {hotlines.map((h) => (
              <MobileCard key={h.label} hotline={h} onCall={() => setIsOpen(false)} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Desktop list ─────────────────────────────────────────────────────────────

function PanelHeader() {
  return (
    <div className="flex items-center gap-2">
      <div className="p-2 rounded-lg bg-[#1F4251]">
        <AlertTriangle className="w-4 h-4 text-yellow-300" />
      </div>
      <h3 className="text-lg font-bold text-[#1F4251] tracking-tight">
        Emergency Hotlines
      </h3>
    </div>
  );
}

function HotlineList() {
  return (
    <ul className="flex flex-col gap-3">
      {hotlines.map((h) => (
        <li key={h.label}>
          <a
            href={`tel:${h.number}`}
            className={`flex items-center gap-3 p-3 rounded-xl border ${h.bg} ${h.border}
                        hover:shadow-md transition-all duration-200 group`}
          >
            <div className={`${h.iconBg} p-2 rounded-lg shadow-sm`}>
              <h.icon className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 font-medium leading-none mb-0.5">
                {h.label}
              </p>
              <p className={`text-base font-bold ${h.text} tracking-wide`}>
                {h.number}
              </p>
            </div>
            <Phone
              className={`w-4 h-4 ${h.text} opacity-0 group-hover:opacity-100 transition-opacity`}
            />
          </a>
        </li>
      ))}
    </ul>
  );
}

// ─── Mobile card ──────────────────────────────────────────────────────────────

function MobileCard({
  hotline,
  onCall,
}: {
  hotline: (typeof hotlines)[0];
  onCall: () => void;
}) {
  return (
    <a
      href={`tel:${hotline.number}`}
      onClick={onCall}
      className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl
                  border ${hotline.bg} ${hotline.border} active:scale-95 transition-transform`}
    >
      <div className={`${hotline.iconBg} p-2.5 rounded-full shadow`}>
        <hotline.icon className="w-5 h-5 text-white" />
      </div>
      <div className="text-center">
        <p className="text-[10px] text-gray-500 font-medium leading-tight">
          {hotline.label}
        </p>
        <p className={`text-sm font-bold ${hotline.text}`}>{hotline.number}</p>
      </div>
    </a>
  );
}