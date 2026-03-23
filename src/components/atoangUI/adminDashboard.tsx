"use client";
import { FileText, MessageSquare, Users, Bell, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/authContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useWebSocket } from "@/contexts/webSocketContext";

export type AdminStats = {
  totalUsers: number;
  totalConcerns: number;
  totalBarangayOfficials: number;
  totalResidents: number;
};

const FloatingIcon = ({
  icon: Icon,
  className,
  delay = "0s",
}: {
  icon: React.ComponentType<{ className?: string }>;
  className: string;
  delay?: string;
}) => (
  <div
    className={`absolute opacity-10 animate-float ${className}`}
    style={{ animationDelay: delay }}
  >
    <Icon className="h-16 w-16 text-primary" />
  </div>
);

export function DashboardAdmin() {
  const router = useRouter();
  const { user } = useAuth();
  const socket = useWebSocket();
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "NEW_STAT") setStats(data.stats);
    };
  }, [socket]);

  const fetchStats = async () => {
    try {
      const res = await fetch(`/api/users/getStats`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) return;
      const data = await res.json();
      setStats(data.stats);
    } catch {
      toast.error("Something went wrong");
    }
  };

  const statsCard = [
    {
      title: "Total Users",
      value: stats?.totalUsers ?? 0,
      icon: Users,
      border: "border-l-blue-400",
      textColor: "text-blue-600",
      bg: "bg-blue-50",
      link: "/admin/users",
    },
    {
      title: "Total Concerns",
      value: stats?.totalConcerns ?? 0,
      icon: FileText,
      border: "border-l-yellow-400",
      textColor: "text-yellow-600",
      bg: "bg-yellow-50",
      link: "/",
    },
    {
      title: "Officials",
      value: stats?.totalBarangayOfficials ?? 0,
      icon: Shield,
      border: "border-l-teal-400",
      textColor: "text-teal-600",
      bg: "bg-teal-50",
      link: "/admin/users",
    },
    {
      title: "Residents",
      value: stats?.totalResidents ?? 0,
      icon: Users,
      border: "border-l-green-400",
      textColor: "text-green-600",
      bg: "bg-green-50",
      link: "/admin/users",
    },
  ];

  return (
    <div className="space-y-5 sm:space-y-6 relative overflow-hidden pb-20 lg:pb-0">
      {/* Floating icons — hidden on mobile to avoid clutter */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden hidden sm:block">
        <FloatingIcon
          icon={MessageSquare}
          className="top-10 right-10"
          delay="0s"
        />
        <FloatingIcon icon={Users} className="top-40 right-32" delay="0.5s" />
        <FloatingIcon icon={Bell} className="bottom-20 right-16" delay="1s" />
        <FloatingIcon
          icon={Shield}
          className="top-20 left-[60%]"
          delay="1.5s"
        />
        <FloatingIcon
          icon={FileText}
          className="bottom-32 right-48"
          delay="2s"
        />
      </div>

      {/* Welcome */}
      <div className="relative z-10">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground leading-snug">
          Welcome back, <span className="text-primary">{user?.fullname}</span>!
        </h1>
      </div>

      {/* Stats — 2 col on mobile, 4 col on lg */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 relative z-10">
        {statsCard.map((stat, index) => (
          <Card
            key={stat.title}
            className={`border-l-4 ${stat.border} shadow-sm hover:shadow-md
                        transition-all duration-300 hover:-translate-y-1 cursor-pointer`}
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => router.push(stat.link)}
          >
            <CardContent className="p-3 sm:p-5">
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-snug">
                    {stat.title}
                  </p>
                  <p
                    className={`text-2xl sm:text-4xl font-bold mt-1 tabular-nums ${stat.textColor}`}
                  >
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`p-1.5 sm:p-2 rounded-full ${stat.bg} shrink-0`}
                >
                  <stat.icon
                    className={`h-4 w-4 sm:h-6 sm:w-6 ${stat.textColor}`}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Illustrated empty state card */}
      <Card
        className="border-2 border-dashed border-muted-foreground/20 min-h-[200px] sm:min-h-[300px]
                       flex items-center justify-center relative z-10 overflow-hidden"
      >
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-secondary/5" />
        <div
          className="absolute top-8 left-8 w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-primary/10 animate-float"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="absolute top-16 left-20 w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-secondary/20 animate-float"
          style={{ animationDelay: "0.3s" }}
        />
        <div
          className="absolute bottom-12 right-12 w-16 sm:w-24 h-16 sm:h-24 rounded-full bg-info/10 animate-float"
          style={{ animationDelay: "0.6s" }}
        />
        <div
          className="absolute bottom-20 right-28 w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-success/15 animate-float"
          style={{ animationDelay: "0.9s" }}
        />

        <CardContent className="text-center py-8 sm:py-12 relative z-10 px-4">
          <div
            className="w-14 sm:w-20 h-14 sm:h-20 mx-auto mb-3 sm:mb-4 rounded-full
                          bg-primary/10 flex items-center justify-center animate-float"
          >
            <MessageSquare className="h-7 sm:h-10 w-7 sm:w-10 text-primary" />
          </div>
          <p className="text-muted-foreground text-sm sm:text-lg">
            Select an option from the sidebar to view details
          </p>
          <p className="text-muted-foreground/60 text-xs sm:text-sm mt-1 sm:mt-2">
            Manage users, concerns, or view reports
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
