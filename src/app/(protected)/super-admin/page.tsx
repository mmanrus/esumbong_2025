"use client";
import { useEffect, useState } from "react";
import { PageHeader, LoadingSkeleton, ErrorBanner } from "@/components/atoangUI/ui";
import { Users, Home, AlertCircle, MessageSquare, ShieldAlert } from "lucide-react";

const API = process.env.NEXT_PUBLIC_BACKEND_URL;

interface Stats {
  totalBarangays: number;
  totalUsers: number;
  totalConcerns: number;
  totalFeedback: number;
  pendingVerifications: number;
}

const STAT_CARDS = (s: Stats) => [
  { label: "Total barangays",       value: s.totalBarangays,       icon: Home,         color: "text-blue-500",   bg: "bg-blue-50" },
  { label: "Total users",           value: s.totalUsers,           icon: Users,        color: "text-green-500",  bg: "bg-green-50" },
  { label: "Total concerns",        value: s.totalConcerns,        icon: AlertCircle,  color: "text-amber-500",  bg: "bg-amber-50" },
  { label: "Total feedback",        value: s.totalFeedback,        icon: MessageSquare,color: "text-purple-500", bg: "bg-purple-50" },
  { label: "Pending verifications", value: s.pendingVerifications, icon: ShieldAlert,  color: "text-red-500",    bg: "bg-red-50" },
];

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/super-admin/dashboard")
      .then((r) => r.json())
      .then((data) => { setStats(data); setLoading(false); })
      .catch(() => { setError("Failed to load stats."); setLoading(false); });
  }, []);

  return (
    <div>
      <PageHeader title="Dashboard" sub="System-wide overview across all barangays" />

      {loading && <LoadingSkeleton rows={3} />}
      {error && <ErrorBanner message={error} />}

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 mt-2">
          {STAT_CARDS(stats).map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-white border border-gray-100 rounded-xl p-5 flex flex-col gap-3">
              <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center`}>
                <Icon size={18} className={color} />
              </div>
              <div>
                <p className="text-2xl font-semibold text-gray-900 leading-none">{value}</p>
                <p className="text-xs text-gray-400 mt-1.5 leading-tight">{label}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}