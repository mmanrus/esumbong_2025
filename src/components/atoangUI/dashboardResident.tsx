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
export type ConcernStats = {
  pending: number;
  inProgress: number;
  verified: number;
  canceled: number;
  approved: number;
  rejected: number;
  resolved: number;
};
// Floating animated icons for visual interest
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
  const { data: announcementsData } = useSWR(
    "/api/announcement/getAll",
    fetcher,
  );

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      if (process.env.NODE_ENV === "development") {
        console.log("Websocket response", data);
      }
      if (data.type === "NEW_STAT") {
        setStats(data.stats);
      }
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
      setIsLoading(false);
      return;
    } catch (error) {
      if (process.env.NODE_ENV === "development")
        console.error("error retrieving history:", error);
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
    <div className="space-y-6 relative overflow-hidden">
      {/* Floating Background Icons */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
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

      <div className="relative z-10">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Welcome back, <span className="text-primary">{user?.fullname}</span>!
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
        {statsCard.map((stat, index) => (
          <Card
            key={stat.title}
            className={`border-l-4 ${stat.borderColor} shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 animate-fade-in cursor-pointer`}
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => router.push(stat.link)}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">
                    {stat.title}
                  </p>
                  <p className={`text-4xl font-bold mt-1 ${stat.valueColor}`}>
                    {stat.value}
                  </p>
                </div>
                <div className="p-2 rounded-full bg-muted/50">
                  <stat.icon className={`h-6 w-6 ${stat.valueColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Announcements Section */}
      {announcementsData?.data && announcementsData.data.length > 0 && (
        <div className="relative z-10">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Megaphone className="h-6 w-6 text-primary" />
              Latest Announcements
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {announcementsData.data.slice(0, 2).map((announcement: any) => (
              <Card
                key={announcement.id}
                className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow overflow-hidden cursor-pointer group"
                onClick={() => router.push(`/announcements/${announcement.id}`)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors flex-1">
                      {announcement.title}
                    </h3>
                    <Badge variant="secondary" className="shrink-0 text-xs">
                      New
                    </Badge>
                  </div>
                  <div
                    className="text-sm text-muted-foreground line-clamp-3 mb-3 *:inline"
                    dangerouslySetInnerHTML={{ __html: announcement.content }}
                  />
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {formatDate(new Date(announcement.createdAt))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
