"use client";
import { fetcher } from "@/lib/swrFetcher";
import { FileText, Clock, CheckCircle, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { Concern } from "./concern/concernRows";
import { formatDate } from "@/lib/formatDate";
import { Skeleton } from "../ui/skeleton";
import { useRouter } from "next/navigation";
import { useWebSocket } from "@/contexts/webSocketContext";
import { ConcernStats } from "./dashboardResident";
import { toast } from "sonner";

export function OfficialDashboard() {
  const [recentConcerns, setRecentConcerns] = useState<any>(null);
  const [stats, setStats] = useState<ConcernStats | null>(null);

  const [loading, setIsLoading] = useState(false);
  const socket = useWebSocket();
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
      const res = await fetch(`/api/concern/getStats?official=true`);
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
      label: "Total Concerns",
      value: stats
        ? Object.values(stats).reduce((a: number, b: number) => a + b, 0)
        : 0,
      icon: FileText,
      colorClass: "stat-card-total",
      textColor: "text-status-ongoing",
    },
    {
      label: "Pending",
      value: stats?.pending ?? 0,
      icon: Clock,
      colorClass: "stat-card-pending",
      textColor: "text-status-pending",
    },
    {
      label: "Resolved",

      value: stats?.inProgress ?? 0,
      icon: CheckCircle,
      colorClass: "stat-card-resolved",
      textColor: "text-status-resolved",
    },
    {
      label: "Unresolved",
      value:
        recentConcerns?.filter((c: any) => c.status === "unresolved").length ||
        0,
      icon: XCircle,
      colorClass: "stat-card-unresolved",
      textColor: "text-status-unresolved",
    },
  ];
  const { data, error, isLoading, mutate } = useSWR(
    `/api/concern/getAll?recent=true&archived=false`,
    fetcher,
  );
  useEffect(() => {
    if (!data) return;
    setRecentConcerns(data.data);
  }, [data]);
  const router = useRouter();
  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Dashboard Overview
        </h1>
        <p className="text-muted-foreground mt-1">
          Monitor and manage barangay concerns
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 align-items-center">
        {statsCard.map((stat) => (
          <div key={stat.label} className={`stat-card ${stat.colorClass}`}>
            <div className="flex items-start bg-gray-50 hover:bg-gray-100 transition-colors p-2 rounded justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">
                  {stat.label}
                </p>
                <p className={`text-3xl font-bold mt-2 ${stat.textColor}`}>
                  {stat.value}
                </p>
              </div>
              <div className={`p-2 rounded-lg bg-muted/50`}>
                <stat.icon className={`w-5 h-5 ${stat.textColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Concerns */}
      <div className="bg-card rounded-xl shadow-sm border">
        <div className="p-5 border-b">
          <h2 className="text-lg font-semibold text-foreground">
            Recent Concerns
          </h2>
          <p className="text-sm text-muted-foreground">
            Latest submitted concerns
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-5 py-3 text-sm font-medium text-muted-foreground">
                  Ticket #
                </th>
                <th className="text-left px-5 py-3 text-sm font-medium text-muted-foreground">
                  Complainant
                </th>
                <th className="text-left px-5 py-3 text-sm font-medium text-muted-foreground">
                  Cagegory
                </th>
                <th className="text-left px-5 py-3 text-sm font-medium text-muted-foreground">
                  Date
                </th>
                <th className="text-left px-5 py-3 text-sm font-medium text-muted-foreground">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <tr key={index}>
                    <td colSpan={1} className="px-5 py-6 ">
                      <Skeleton className="h-10 w-10 rounded-full" />
                    </td>
                    <td colSpan={1} className="px-5 py-6 ">
                      <Skeleton className="h-4 md:h-5 lg:h-10 flex-1 " />
                    </td>
                    <td colSpan={1} className="px-5 py-6 ">
                      <Skeleton className="h-4 md:h-5 lg:h-10 flex-1 " />
                    </td>
                    <td colSpan={1} className="px-5 py-6 ">
                      <Skeleton className="h-4 md:h-5 lg:h-10 flex-1 " />
                    </td>
                    <td colSpan={1} className="px-5 py-6 ">
                      <Skeleton className="h-4 md:h-5 lg:h-10 flex-1 " />
                    </td>
                  </tr>
                ))
              ) : recentConcerns?.length === 0 || !recentConcerns ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-6 text-center text-muted-foreground"
                  >
                    No recent concerns yet
                  </td>
                </tr>
              ) : (
                recentConcerns?.map((concern: Concern) => (
                  <tr
                    key={concern.id}
                    className="border-t hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={() => router.push(`/concern/${concern.id}`)}
                  >
                    <td className="px-5 py-4 text-sm font-medium text-foreground">
                      {concern.id}
                    </td>
                    <td className="px-5 py-4 text-sm text-foreground">
                      {concern?.user?.fullname}
                    </td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">
                      {concern?.category?.name ?? concern?.other ?? "N/A"}
                    </td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">
                      {formatDate(new Date(concern?.issuedAt))}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`status-badge status-${concern?.validation}`}
                      >
                        {concern.status.charAt(0).toUpperCase() +
                          concern.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
