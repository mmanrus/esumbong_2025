"use client";

import { fetcher } from "@/lib/swrFetcher";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Tag,
  Calendar,
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import useSWR from "swr";
import { Concern } from "./concern/concernRows";
import { formatDate } from "@/lib/formatDate";
import { Skeleton } from "../ui/skeleton";
import { useRouter } from "next/navigation";
import { useWebSocket } from "@/contexts/webSocketContext";
import { ConcernStats } from "./dashboardResident";
import { toast } from "sonner";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { Status, statusConfig, StatusP } from "./concern/userConcernRows";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

export function OfficialDashboard() {
  const [recentConcerns, setRecentConcerns] = useState<Concern[]>([]);
  const [stats, setStats] = useState<ConcernStats | null>(null);
  const [loading, setIsLoading] = useState(false);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const socket = useWebSocket();
  const router = useRouter();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/concern/getStats?official=true`);
      if (!res.ok) return;
      const data = await res.json();
      setStats(data.stats);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!socket) return;
    socket.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "NEW_STAT") setStats(data.stats);
    };
  }, [socket]);

  const { data, isLoading: swrLoading } = useSWR(
    `/api/concern/getAll?recent=true&archived=false`,
    fetcher,
  );

  useEffect(() => {
    if (!data) return;
    setRecentConcerns(data.data ?? []);
    setNextCursor(data.nextCursor ?? null);
    setHasNextPage(data.hasNextPage ?? false);
  }, [data]);

  const loadMore = async () => {
    if (!nextCursor || isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      const res = await fetch(
        `/api/concern/getAll?&archived=false&cursor=${nextCursor}`,
      );
      const newData = await res.json();
      setRecentConcerns((prev) => [...prev, ...(newData.data ?? [])]);
      setNextCursor(newData.nextCursor ?? null);
      setHasNextPage(newData.hasNextPage ?? false);
    } catch {
      toast.error("Failed to load more concerns.");
    } finally {
      setIsLoadingMore(false);
    }
  };

  const totalPages = Math.ceil(recentConcerns.length / itemsPerPage);
  const paginatedConcerns = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return recentConcerns.slice(start, start + itemsPerPage);
  }, [recentConcerns, currentPage]);

  const statsCard = [
    {
      label: "Total Concerns",
      value: stats ? Object.values(stats).reduce((a, b) => a + b, 0) : 0,
      icon: FileText,
      border: "border-l-blue-400",
      textColor: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Pending",
      value: stats?.pending ?? 0,
      icon: Clock,
      border: "border-l-yellow-400",
      textColor: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    {
      label: "Resolved",
      value: stats?.resolved ?? 0,
      icon: CheckCircle,
      border: "border-l-green-400",
      textColor: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Unresolved",
      value:
        recentConcerns?.filter((c: any) => c.status === "unresolved").length ||
        0,
      icon: XCircle,
      border: "border-l-red-400",
      textColor: "text-red-600",
      bg: "bg-red-50",
    },
  ];

  return (
    <div className="space-y-5 sm:space-y-6 pb-20 lg:pb-0">
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
          Dashboard Overview
        </h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Monitor and manage barangay concerns
        </p>
      </div>

      {/* Stats — 2 col on mobile, 4 col on xl */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        {statsCard.map((stat) => (
          <Card
            key={stat.label}
            className={`border-l-4 ${stat.border} shadow-sm`}
          >
            <CardContent className="p-3 sm:p-5">
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-snug">
                    {stat.label}
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
                    className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.textColor}`}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Concerns */}
      <div className="bg-card rounded-xl shadow-sm border overflow-hidden">
        <div className="p-4 sm:p-5 border-b">
          <h2 className="text-base sm:text-lg font-semibold text-foreground">
            Recent Concerns
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Latest submitted concerns
          </p>
        </div>

        {/* Desktop: table. Mobile: card list */}

        {/* ── Desktop table (hidden on mobile) ── */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                {["Ticket #", "Category", "Date", "Status"].map((h) => (
                  <th
                    key={h}
                    className="text-left px-5 py-3 text-sm font-medium text-muted-foreground"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {swrLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={4} className="px-5 py-4">
                      <Skeleton className="h-5 w-full" />
                    </td>
                  </tr>
                ))
              ) : paginatedConcerns.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-5 py-8 text-center text-muted-foreground text-sm"
                  >
                    No recent concerns yet
                  </td>
                </tr>
              ) : (
                paginatedConcerns.map((concern) => {
                  const config = concern
                    ? statusConfig[concern.status as StatusP]
                    : undefined;
                  const StatusIcon = config?.icon;
                  return (
                    <tr
                      key={concern.id}
                      className="border-t hover:bg-muted/30 transition-colors cursor-pointer"
                      onClick={() => router.push(`/concern/${concern.id}`)}
                    >
                      <td className="px-5 py-4 text-sm font-mono text-muted-foreground">
                        #{concern.id}
                      </td>
                      <td className="px-5 py-4 text-sm text-muted-foreground max-w-40 truncate">
                        {concern.category?.name ?? concern.other ?? "N/A"}
                      </td>
                      <td className="px-5 py-4 text-sm text-muted-foreground whitespace-nowrap">
                        {formatDate(new Date(concern.issuedAt))}
                      </td>
                      <td className="px-5 py-4">
                        <Badge
                          variant="secondary"
                          className={cn(
                            config?.bgColor,
                            config?.color,
                            "border-0 text-xs",
                          )}
                        >
                          {StatusIcon && (
                            <StatusIcon className="h-3 w-3 mr-1" />
                          )}
                          {concern.status
                            ?.replace(/([A-Z])/g, " $1")
                            .replace(/^./, (s) => s.toUpperCase())}
                        </Badge>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── Mobile card list (hidden on sm+) ── */}
        <div className="sm:hidden divide-y">
          {swrLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-4 space-y-2 animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            ))
          ) : paginatedConcerns.length === 0 ? (
            <p className="p-6 text-center text-muted-foreground text-sm">
              No recent concerns yet
            </p>
          ) : (
            paginatedConcerns.map((concern) => {
              const config = concern
                ? statusConfig[concern.status as StatusP]
                : undefined;
              const StatusIcon = config?.icon;
              return (
                <div
                  key={concern.id}
                  className="p-3 flex items-start justify-between gap-2 hover:bg-muted/30
                               cursor-pointer transition-colors active:bg-muted/50"
                  onClick={() => router.push(`/concern/${concern.id}`)}
                >
                  <div className="flex-1 min-w-0">
                    {/* ID + status */}
                    <div className="flex items-center gap-1.5 flex-wrap mb-1">
                      <span
                        className="text-[10px] font-mono text-muted-foreground bg-muted
                                         px-1.5 py-0.5 rounded"
                      >
                        #{concern.id}
                      </span>
                      <Badge
                        variant="secondary"
                        className={cn(
                          config?.bgColor,
                          config?.color,
                          "border-0 text-[10px] py-0",
                        )}
                      >
                        {StatusIcon && (
                          <StatusIcon className="h-2.5 w-2.5 mr-0.5" />
                        )}
                        {concern.status
                          ?.replace(/([A-Z])/g, " $1")
                          .replace(/^./, (s) => s.toUpperCase())}
                      </Badge>
                    </div>
                    {/* Category + date */}
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                      <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Tag className="h-2.5 w-2.5" />
                        {concern.category?.name ?? concern.other ?? "N/A"}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Calendar className="h-2.5 w-2.5" />
                        {formatDate(new Date(concern.issuedAt))}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            className="flex items-center justify-between gap-3 p-3 sm:p-4
                          bg-gray-50 border-t border-gray-200"
          >
            <div className="text-xs text-muted-foreground hidden sm:block">
              Page {currentPage} of {totalPages}
            </div>
            <div className="text-xs text-muted-foreground sm:hidden">
              {currentPage}/{totalPages}
            </div>
            <div className="flex gap-1.5 sm:gap-2">
              <Button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                variant="outline"
                size="sm"
                className="h-7 sm:h-8 px-2 sm:px-3 text-xs"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span className="hidden sm:inline ml-1">Prev</span>
              </Button>
              <div className="flex items-center px-2 text-xs bg-white rounded border border-gray-300">
                {currentPage} / {totalPages}
              </div>
              {currentPage < totalPages ? (
                <Button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  variant="outline"
                  size="sm"
                  className="h-7 sm:h-8 px-2 sm:px-3 text-xs"
                >
                  <span className="hidden sm:inline mr-1">Next</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              ) : hasNextPage ? (
                <Button
                  onClick={loadMore}
                  disabled={isLoadingMore}
                  variant="outline"
                  size="sm"
                  className="h-7 sm:h-8 px-2 sm:px-3 text-xs"
                >
                  {isLoadingMore ? "..." : "More"}
                </Button>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
