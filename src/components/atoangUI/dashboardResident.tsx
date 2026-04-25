"use client";
import {
  FileText,
  Clock,
  CheckCircle,
  MessageSquare,
  Users,
  Bell,
  Shield,
  Megaphone,
  Calendar,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/authContext";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useWebSocket } from "@/contexts/webSocketContext";
import { formatDate } from "@/lib/formatDate";
import useSWR from "swr";
import { fetcher } from "@/lib/swrFetcher";
import { getAnnouncementPreview } from "@/lib/announcementPreview";

export type ConcernStats = {
  pending: number;
  inProgress: number;
  verified: number;
  canceled: number;
  approved: number;
  rejected: number;
  resolved: number;
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


export function DashboardOverview() {
  const router = useRouter();
  const { user } = useAuth();
  const socket = useWebSocket();
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<ConcernStats | null>(null);
  const { data: announcementsData } = useSWR("/api/announcement", fetcher);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      if (process.env.NODE_ENV === "development")
        console.log("Websocket response", data);
      if (data.type === "NEW_STAT") setStats(data.stats);
    };
  }, [socket]);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/concern/getStats`);
      if (!res.ok) {
        setIsLoading(false);
        return;
      }
      const data = await res.json();
      setStats(data.stats);
    } catch (error) {
      if (process.env.NODE_ENV === "development")
        console.error("error retrieving stats:", error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const statsCard = [
    {
      title: "Total Concerns",
      value: stats
        ? Object.values(stats).reduce((a: number, b: number) => a + b, 0)
        : 0,
      icon: FileText,
      borderColor: "border-l-info",
      valueColor: "text-info",
      link: "/resident/history",
    },
    {
      title: "Pending Issues",
      value: stats?.pending ?? 0,
      icon: Clock,
      borderColor: "border-l-warning",
      valueColor: "text-warning",
      link: "/resident/history?status=Pending",
    },
    {
      title: "In Progress",
      value: stats?.inProgress ?? 0,
      icon: Clock,
      borderColor: "border-l-warning",
      valueColor: "text-warning",
      link: "/resident/history?status=Pending",
    },
    {
      title: "Resolved",
      value: stats?.resolved ?? 0,
      icon: CheckCircle,
      borderColor: "border-l-success",
      valueColor: "text-success",
      link: "/resident/history?status=Resolved",
    },
  ];

  return (
    // FIX: pb-20 adds breathing room above the FAB on mobile
    <div className="space-y-5 sm:space-y-6 relative overflow-hidden pb-20 lg:pb-0">
      {/* Floating Background Icons — hidden on mobile for cleaner look */}
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
        <h1 className="text-sm md:text-3xl font-bold text-foreground leading-snug">
          Welcome back, <span className="text-primary">{user?.fullname}</span>!
        </h1>
      </div>

      {/* Stats grid
          FIX: grid-cols-2 on mobile (was grid-cols-1 — caused the ugly single-column stacking).
          4-col on lg. */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 relative z-10">
        {statsCard.map((stat, index) => (
          <Card
            key={stat.title}
            className={`border-l-4 ${stat.borderColor} shadow-sm hover:shadow-md
                        transition-all duration-300 hover:-translate-y-1 animate-fade-in
                        cursor-pointer `}
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => router.push(stat.link)}
          >
            <CardContent className="p-2 sm:p-5 py-1">
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-snug">
                    {stat.title}
                  </p>
                  <p
                    className={`text-lg sm:text-4xl font-bold mt-1 ${stat.valueColor} tabular-nums`}
                  >
                    {stat.value}
                  </p>
                </div>
                <div className="p-1.5 sm:p-2 rounded-full mt-[-12] bg-muted/50 shrink-0">
                  <stat.icon
                    className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.valueColor}`}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Announcements */}
      {/* Change grid to always 2 cols */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
  {announcementsData?.data.slice(0, 2).map((announcement: any) => {
    const { text, imageUrl } = getAnnouncementPreview(announcement.content);
    return (
      <Card
        key={announcement.id}
        className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow
                   overflow-hidden cursor-pointer group"
        onClick={() => router.push(`/announcements/${announcement.id}`)}
      >
        <CardContent className="p-4 flex flex-col gap-2 h-full">
          {/* Title + Badge */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-semibold text-foreground
                           group-hover:text-primary transition-colors flex-1 leading-snug line-clamp-2">
              {announcement.title}
            </h3>
            <Badge variant="secondary" className="shrink-0 text-xs">New</Badge>
          </div>

          {/* Text preview — takes remaining space */}
          <p className="text-sm text-muted-foreground line-clamp-3 flex-1">
            {text}
          </p>

          {/* Image — full width at bottom, only if exists */}
          {imageUrl && (
            <div className="w-full h-36 rounded-md overflow-hidden mt-1">
              <img
                src={imageUrl}
                alt="preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Date */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3 flex-shrink-0" />
            {formatDate(new Date(announcement.createdAt))}
          </div>
        </CardContent>
      </Card>
    );
  })}
</div>
    </div>
  );
}
