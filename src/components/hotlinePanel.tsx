"use client";

import { useState } from "react";
import { Phone, Shield, Flame, Ambulance, ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";

const hotlines = [
  {
    label: "Barangay Hotline",
    number: "123-4567",
    icon: Shield,
    color: "from-blue-500 to-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
    iconBg: "bg-blue-500",
  },
  {
    label: "Police",
    number: "166",
    icon: Shield,
    color: "from-indigo-500 to-indigo-700",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    text: "text-indigo-700",
    iconBg: "bg-indigo-600",
  },
  {
    label: "Fire Station",
    number: "160",
    icon: Flame,
    color: "from-orange-500 to-red-500",
    bg: "bg-orange-50",
    border: "border-orange-200",
    text: "text-orange-700",
    iconBg: "bg-orange-500",
  },
  {
    label: "Ambulance",
    number: "911",
    icon: Ambulance,
    color: "from-red-500 to-rose-600",
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
      {/* ── Desktop: fixed right aside (unchanged behaviour) ── */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-l shadow-md p-5 overflow-y-auto gap-4">
        <PanelHeader />
        <HotlineList />
      </aside>

      {/* ── Mobile: sticky bottom drawer ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
        {/* Trigger bar */}
        <button
          onClick={() => setIsOpen((v) => !v)}
          className="w-full flex items-center justify-between px-5 py-3 bg-[#1F4251] text-white shadow-[0_-4px_16px_rgba(0,0,0,0.18)]"
        >
          <div className="flex items-center gap-2 font-semibold tracking-wide text-sm">
            <AlertTriangle className="w-4 h-4 text-yellow-300" />
            Emergency Hotlines
          </div>
          {isOpen ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronUp className="w-4 h-4" />
          )}
        </button>

        {/* Collapsible content */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out bg-white border-t border-gray-200 shadow-[0_-2px_12px_rgba(0,0,0,0.1)] ${
            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="p-4 grid grid-cols-2 gap-3">
            {hotlines.map((h) => (
              <MobileCard key={h.label} hotline={h} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

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
            className={`flex items-center gap-3 p-3 rounded-xl border ${h.bg} ${h.border} hover:shadow-md transition-all duration-200 group`}
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
            <Phone className={`w-4 h-4 ${h.text} opacity-0 group-hover:opacity-100 transition-opacity`} />
          </a>
        </li>
      ))}
    </ul>
  );
}

function MobileCard({ hotline }: { hotline: any}) {
  return (
    <a
      href={`tel:${hotline.number}`}
      className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border ${hotline.bg} ${hotline.border} active:scale-95 transition-transform`}
    >
      <div className={`${hotline.iconBg} p-2.5 rounded-full shadow`}>
        <hotline.icon className="w-5 h-5 text-white" />
      </div>
      <div className="text-center">
        <p className="text-[10px] text-gray-500 font-medium leading-tight">{hotline.label}</p>
        <p className={`text-sm font-bold ${hotline.text}`}>{hotline.number}</p>
      </div>
    </a>
  );
}