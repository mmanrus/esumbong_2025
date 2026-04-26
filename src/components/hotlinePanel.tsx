"use client";

import { useState, useEffect } from "react";
import {
  Phone,
  Shield,
  Flame,
  Ambulance,
  AlertTriangle,
  X,
  Heart,
  Car,
  Zap,
  Droplets,
  Building2,
  Users,
} from "lucide-react";
import { useWebSocket } from "@/contexts/webSocketContext";

// ─── Icon registry — add more as needed ───────────────────────────────────────
export const ICON_OPTIONS = [
  { name: "Shield", Icon: Shield },
  { name: "Flame", Icon: Flame },
  { name: "Ambulance", Icon: Ambulance },
  { name: "Phone", Icon: Phone },
  { name: "Heart", Icon: Heart },
  { name: "Car", Icon: Car },
  { name: "Zap", Icon: Zap },
  { name: "Droplets", Icon: Droplets },
  { name: "Building2", Icon: Building2 },
  { name: "Users", Icon: Users },
];

export function getIcon(name: string) {
  return ICON_OPTIONS.find((o) => o.name === name)?.Icon ?? Phone;
}

// ─── Types ────────────────────────────────────────────────────────────────────

type Hotline = {
  id: number;
  label: string;
  number: string;
  icon: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  iconBg: string;
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useHotlines(barangayId?: number | null) {
  const [hotlines, setHotlines] = useState<Hotline[]>([]);
  const [loading, setLoading] = useState(true);
  const socket = useWebSocket();

  // GET on mount — no token needed, barangayId from auth context
  useEffect(() => {
    if (!barangayId) return;

    fetch(`/api/hotline?barangayId=${barangayId}`)
      .then((r) => r.json())
      .then((data) => setHotlines(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, [barangayId]);

  // Handle WebSocket updates
  useEffect(() => {
    if (!socket || !barangayId) return;

    const prev = socket.onmessage;
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("HotlinePanel received WS message:", data);

        if (data.type && data.hotline && data.hotline.barangayId === barangayId) {
          console.log("Processing hotline event:", data.type);
          if (data.type === "hotlineCreated") {
            setHotlines((h) => [...h, data.hotline]); // Add to end to match order
          } else if (data.type === "hotlineUpdated") {
            setHotlines((h) => h.map((hotline) =>
              hotline.id === data.hotline.id ? data.hotline : hotline
            ));
          } else if (data.type === "hotlineDeleted") {
            console.log("Deleting hotline with id:", data.hotline.id);
            setHotlines((h) => h.filter((hotline) => hotline.id !== data.hotline.id));
          }
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }

      if (prev) prev.call(socket, event);
    };

    return () => {
      socket.onmessage = prev;
    };
  }, [socket, barangayId]);

  return { hotlines, loading };
}

// ─── Panel ────────────────────────────────────────────────────────────────────

export default function HotlinePanel({
  barangayId,
}: {
  barangayId?: number | null;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { hotlines, loading } = useHotlines(barangayId);
  if (!barangayId) return null; // No barangay context, don't show
  return (
    <>
      {/* Desktop: fixed right aside */}
      <aside className="hidden lg:flex rounded-md flex-col w-72 bg-white border-l shadow-md p-5 overflow-y-auto gap-4">
        <PanelHeader />
        {loading ? <LoadingSkeleton /> : <HotlineList hotlines={hotlines} />}
      </aside>

      {/* Mobile: FAB + bottom sheet */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Emergency Hotlines"
          className="fixed bottom-5 left-4 z-50 flex items-center justify-center
                     w-12 h-12 rounded-full bg-[#1F4251] text-white shadow-lg
                     hover:bg-[#2a5568] active:scale-95 transition-all duration-200"
        >
          <AlertTriangle className="w-5 h-5 text-yellow-300" />
        </button>

        {isOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
        )}

        <div
          className={`fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl
                         transition-transform duration-300 ease-out
                         ${isOpen ? "translate-y-0" : "translate-y-full"}`}
        >
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-gray-300" />
          </div>
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
              className="p-1.5 rounded-full hover:bg-gray-100"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          <div className="p-4 grid grid-cols-2 gap-3 pb-8">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <MobileSkeleton key={i} />
                ))
              : hotlines.map((h) => (
                  <MobileCard
                    key={h.id}
                    hotline={h}
                    onCall={() => setIsOpen(false)}
                  />
                ))}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

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

function HotlineList({ hotlines }: { hotlines: Hotline[] }) {
  if (hotlines.length === 0) {
    return (
      <p className="text-sm text-gray-400 text-center py-4">
        No hotlines configured.
      </p>
    );
  }
  return (
    <ul className="flex flex-col gap-3">
      {hotlines.map((h) => {
        const Icon = getIcon(h.icon);
        return (
          <li key={h.id}>
            <a
              href={`tel:${h.number.replace(/\D/g, "")}`}
              className={`flex items-center gap-3 p-3 rounded-xl border
                           ${h.bgColor} ${h.borderColor}
                           hover:shadow-md transition-all duration-200 group`}
            >
              <div className={`${h.iconBg} p-2 rounded-lg shadow-sm`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 font-medium leading-none mb-0.5">
                  {h.label}
                </p>
                <p
                  className={`text-base font-bold ${h.textColor} tracking-wide`}
                >
                  {h.number}
                </p>
              </div>
              <Phone
                className={`w-4 h-4 ${h.textColor} opacity-0 group-hover:opacity-100 transition-opacity`}
              />
            </a>
          </li>
        );
      })}
    </ul>
  );
}

function MobileCard({
  hotline,
  onCall,
}: {
  hotline: Hotline;
  onCall: () => void;
}) {
  const Icon = getIcon(hotline.icon);
  return (
    <a
      href={`tel:${hotline.number.replace(/\D/g, "")}`}
      onClick={onCall}
      className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl
                   border ${hotline.bgColor} ${hotline.borderColor} active:scale-95 transition-transform`}
    >
      <div className={`${hotline.iconBg} p-2.5 rounded-full shadow`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="text-center">
        <p className="text-[10px] text-gray-500 font-medium leading-tight">
          {hotline.label}
        </p>
        <p className={`text-sm font-bold ${hotline.textColor}`}>
          {hotline.number}
        </p>
      </div>
    </a>
  );
}

function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
      ))}
    </div>
  );
}

function MobileSkeleton() {
  return <div className="h-24 bg-gray-100 rounded-xl animate-pulse" />;
}
