"use client";
import {
  FileText,
  Clock,
  CheckCircle,
  MessageSquare,
  Users,
  Bell,
  Shield,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/authContext";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useWebSocket } from "@/contexts/webSocketContext";
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

      {/* Illustrated Card with Animation */}
      <Card className="border-2 border-dashed border-muted-foreground/20 min-h-[300px] flex items-center justify-center relative z-10 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-secondary/5" />

        {/* Animated illustration circles */}
        <div
          className="absolute top-8 left-8 w-20 h-20 rounded-full bg-primary/10 animate-float"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="absolute top-16 left-20 w-12 h-12 rounded-full bg-secondary/20 animate-float"
          style={{ animationDelay: "0.3s" }}
        />
        <div
          className="absolute bottom-12 right-12 w-24 h-24 rounded-full bg-info/10 animate-float"
          style={{ animationDelay: "0.6s" }}
        />
        <div
          className="absolute bottom-20 right-28 w-10 h-10 rounded-full bg-success/15 animate-float"
          style={{ animationDelay: "0.9s" }}
        />
        <div
          className="absolute top-1/2 left-1/4 w-8 h-8 rounded-full bg-warning/10 animate-float"
          style={{ animationDelay: "1.2s" }}
        />

        <CardContent className="text-center py-12 relative z-10">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center animate-float">
            <MessageSquare className="h-10 w-10 text-primary" />
          </div>
          <p className="text-muted-foreground text-lg">
            Select an option from the sidebar to view details
          </p>
          <p className="text-muted-foreground/60 text-sm mt-2">
            Submit concerns, track status, or view your history
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
