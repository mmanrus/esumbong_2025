"use client";
import { useAuth } from "@/contexts/authContext";
import { fetcher } from "@/lib/swrFetcher";
import { notFound, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";
import { Concern } from "./concernRows";
import { formatDate } from "@/lib/formatDate";
import {
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Clock,
  Activity,
  XCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const ITEMS_PER_PAGE = 5;

export type Status =
  | "pending"
  | "approved"
  | "rejected"
  | "inProgress"
  | "resolved"
  | "verified"
  | "canceled"
  | "unresolved";

export const statusConfig: Record<
  StatusP,
  { icon: typeof Clock; color: string; bgColor: string }
> = {
  pending: {
    icon: Clock,
    bgColor: "bg-yellow-500/10",
    color: "text-yellow-600",
  },
  inProgress: {
    icon: Activity,
    bgColor: "bg-blue-500/10",
    color: "text-blue-600",
  },
  resolved: {
    icon: CheckCircle,
    bgColor: "bg-emerald-500/10",
    color: "text-emerald-600",
  },
  unresolved: {
    icon: XCircle,
    bgColor: "bg-red-500/10",
    color: "text-red-600",
  },
};
export type StatusP = "pending" | "inProgress" | "resolved" | "unresolved";
const statusSteps: StatusP[] = [
  "pending",
  "inProgress",
  "resolved",
  "unresolved",
];

// ─── Component ────────────────────────────────────────────────────────────────

export function UserConcernRows() {
  const router = useRouter();
  const { user } = useAuth();
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const { data, error, isLoading } = useSWR(
    `/api/concern/getByUserId/${user?.id}`,
    fetcher,
  );
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [userConcerns, setUserConcerns] = useState<Concern[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const totalItems = userConcerns?.length ?? 0;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedConcerns =
    userConcerns?.slice(startIndex, startIndex + ITEMS_PER_PAGE) ?? [];

  useEffect(() => {
    if (!data) return;
    setUserConcerns(data.data);
    setNextCursor(data.nextCursor ?? null);
    setHasNextPage(data.hasNextPage ?? false);
    setCurrentPage(1);
  }, [data]);

  const loadMore = async () => {
    if (!nextCursor || isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      const res = await fetch(
        `/api/concern/getByUserId/${user?.id}&cursor=${nextCursor}`,
      );
      const newData = await res.json();
      setUserConcerns((prev) => [...prev, ...(newData.data ?? [])]);
      setNextCursor(newData.nextCursor ?? null);
      setHasNextPage(newData.hasNextPage ?? false);
    } catch {
      toast.error("Failed to load more concerns.");
    } finally {
      setIsLoadingMore(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="h-8 w-8 rounded-full border-4 border-gray-200 border-t-blue-600 animate-spin mx-auto mb-2" />
          <span className="text-muted-foreground text-sm">
            Loading your concerns...
          </span>
        </div>
      </div>
    );
  }

  if (!Array.isArray(userConcerns) || userConcerns.length === 0) {
    return (
      <Card className="p-10 border border-dashed border-gray-300">
        <p className="text-center text-muted-foreground text-sm">
          No concerns found. Submit your first concern to get started.
        </p>
      </Card>
    );
  }

  return (
    <div className="w-full overflow-x-hidden space-y-2 sm:space-y-3">
      {paginatedConcerns.map((c: Concern) => {
        const config = c ? statusConfig[c.status as StatusP] : undefined;
        const StatusIcon = config?.icon;

        return (
          <Card
            key={c.id}
            className="hover:shadow-md transition-all cursor-pointer group border-l-4 overflow-hidden"
            style={{ borderLeftColor: config?.color }}
            onClick={() => router.push(`/concern/${c.id}`)}
          >
            {/* FIX: p-3 sm:p-5 — was p-6 flat which was too tall on mobile */}
            <CardContent className="p-3 sm:p-5 overflow-hidden">
              <div className="flex items-start justify-between gap-2 sm:gap-4 min-w-0 w-full">
                <div className="flex-1 min-w-0">
                  {/* ID + status badge row */}
                  <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                    <span
                      className="text-[10px] sm:text-xs font-mono bg-gray-100
                                       px-1.5 py-0.5 rounded text-gray-500"
                    >
                      #{c.id}
                    </span>
                    <Badge
                      variant="secondary"
                      className={cn(
                        config?.bgColor,
                        config?.color,
                        "border-0 text-xs py-0",
                      )}
                    >
                      {StatusIcon && <StatusIcon className="h-3 w-3 mr-1" />}
                      {c.status
                        ?.replace(/([A-Z])/g, " $1")
                        .replace(/^./, (s) => s.toUpperCase())}
                    </Badge>
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-foreground truncate text-sm sm:text-base leading-snug max-w-full">
                    {c.title}
                  </h3>

                  {/* Category */}
                  <span
                    className="inline-block bg-blue-50 text-blue-700 px-2 py-0.5
                                     rounded text-[10px] sm:text-xs font-medium mt-1"
                  >
                    {c.category?.name ?? c.other ?? "Uncategorized"}
                  </span>

                  {/* Stepper — compact on mobile */}
                  <StatusProgress currentStatus={c.status as Status} />

                  {/* Dates — stacked on mobile, inline on sm+ */}
                  <div className="flex flex-col sm:flex-row sm:gap-4 mt-2 text-[10px] sm:text-xs text-muted-foreground gap-0.5 min-w-0">
                    <span>📅 {formatDate(new Date(c.issuedAt))}</span>
                    <span>🔄 {formatDate(new Date(c.updatedAt))}</span>
                  </div>
                </div>

                <ChevronRight
                  className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground
                                           group-hover:text-primary transition-colors shrink-0 mt-1"
                />
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          className="flex items-center justify-between gap-3 mt-4 p-3 sm:p-4
                        bg-gray-50 rounded-lg border border-gray-200"
        >
          {/* Page info — hidden on very small screens */}
          <div className="text-xs text-muted-foreground hidden sm:block">
            Page {currentPage} of {totalPages} &bull; {startIndex + 1}–
            {Math.min(startIndex + ITEMS_PER_PAGE, totalItems)} of {totalItems}
          </div>
          {/* Compact label for mobile */}
          <div className="text-xs text-muted-foreground sm:hidden">
            {currentPage}/{totalPages}
          </div>

          <div className="flex gap-1.5 sm:gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-7 sm:h-8 px-2 sm:px-3 text-xs"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline ml-1">Prev</span>
            </Button>

            <div
              className="flex items-center px-2 py-1 text-xs text-gray-700
                            bg-white rounded border border-gray-300"
            >
              {currentPage} / {totalPages}
            </div>

            {currentPage < totalPages ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
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
  );
}

// ─── Status stepper ───────────────────────────────────────────────────────────

function StatusProgress({ currentStatus }: { currentStatus: Status }) {
  // Map non-linear statuses to their stepper position
  const stepperStatus: StatusP =
    currentStatus === "approved" || currentStatus === "verified"
      ? "resolved"
      : currentStatus === "rejected"
        ? "unresolved"
        : currentStatus === "canceled"
          ? "unresolved"
          : currentStatus === "pending" ||
              currentStatus === "inProgress" ||
              currentStatus === "resolved" ||
              currentStatus === "unresolved"
            ? currentStatus
            : "pending"; // fallback (safe default)

  const currentIndex = statusSteps.indexOf(stepperStatus);
  // Terminal failure states — don't fill forward steps
  const isTerminalFail = ["rejected", "canceled", "unresolved"].includes(
    currentStatus,
  );

  return (
    <div className="flex items-center gap-0.5 mt-2 min-w-0 max-w-full">
      {statusSteps.map((step, index) => {
        const isCompleted = index < currentIndex && !isTerminalFail;
        const isActive = index === currentIndex;
        const isCurrent = step === stepperStatus;
        const config = statusConfig[step];

        return (
          <div key={step} className="flex items-center">
            {/* Step circle — smaller on mobile */}
            <div
              className={cn(
                "flex items-center justify-center rounded-full transition-colors",
                "w-5 h-5 sm:w-7 sm:h-7", // FIX: 20px on mobile, 28px on sm+
                isCompleted ? config.bgColor : "bg-muted",
                isActive && config.bgColor, // 👈 IMPORTANT
                isCurrent && "ring-2 ring-offset-1 ring-primary",
              )}
            >
              <config.icon
                className={cn(
                  "h-3 w-3 sm:h-4 sm:w-4",
                  isCompleted && config.color,
                  isActive && config.color, // 👈 IMPORTANT
                  !isCompleted && !isActive && "text-muted-foreground",
                )}
              />
            </div>

            {/* Connector line — shorter on mobile */}
            {index < statusSteps.length - 1 && (
              <div
                className={cn(
                  "h-0.5 mx-0.5 rounded-full",
                  "w-3 sm:w-6", // FIX: 12px on mobile, 24px on sm+
                  isCompleted && index < currentIndex
                    ? "bg-primary"
                    : "bg-muted",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
