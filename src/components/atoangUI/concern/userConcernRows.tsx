"use client";
import { useAuth } from "@/contexts/authContext";
import { fetcher } from "@/lib/swrFetcher";
import { notFound, redirect, useRouter } from "next/navigation";
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

export type Status = "pending" | "approved" | "rejected" | "inProgress";
export const statusConfig: Record<
  Status,
  { icon: typeof Clock; color: string; bgColor: string }
> = {
  pending: {
    icon: Clock,
    bgColor: "bg-yellow-500/10",
    color: "text-yellow-600",
  },
  inProgress: {
    bgColor: "bg-blue-500/10",
    color: "text-blue-600",
    icon: Activity,
  },
  approved: {
    icon: CheckCircle,
    bgColor: "bg-emerald-500/10",
    color: "text-emerald-600",
  },
  rejected: {
    icon: XCircle,
    bgColor: "bg-red-500/10",
    color: "text-red-600",
  },
};

const statusSteps: Status[] = ["pending", "inProgress", "approved", "rejected"];

export function UserConcernRows() {
  const router = useRouter();
  const { user } = useAuth();
  const { data, error, isLoading, mutate } = useSWR(
    `/api/concern/getByUserId/${user?.id}`,
    fetcher,
  );
  const [userConcerns, setUserConcerns] = useState<Concern[] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!data) return;
    setUserConcerns(data.data);
    setCurrentPage(1);
  }, [data]);

  // Calculate pagination
  const totalItems = userConcerns?.length ?? 0;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedConcerns =
    userConcerns?.slice(startIndex, startIndex + ITEMS_PER_PAGE) ?? [];
  if (isLoading)
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="h-8 w-8 rounded-full border-4 border-gray-200 border-t-blue-600 animate-spin mx-auto mb-2"></div>
          <span className="text-muted-foreground">
            Loading your concerns...
          </span>
        </div>
      </div>
    );
  if (error) {
    toast.error("Failed to load concerns");
    notFound();
  }
  if (!Array.isArray(userConcerns) || userConcerns.length === 0) {
    return (
      <Card className="p-12 border border-dashed border-gray-300">
        <p className="text-center text-muted-foreground">
          No concerns found. Submit your first concern to get started.
        </p>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {paginatedConcerns?.map((c: Concern, index: any) => {
          const config = c ? statusConfig[c.status as Status] : undefined;

          const StatusIcon = config?.icon;

          return (
            <Card
              key={c.id}
              className="hover:shadow-lg transition-all cursor-pointer group border-l-4 hover:border-l-primary overflow-hidden"
              style={{ borderLeftColor: config?.color }}
              onClick={() => router.push(`/concern/${c.id}`)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-600">
                        #{c.id}
                      </span>
                      <Badge
                        variant="secondary"
                        className={cn(
                          config?.bgColor,
                          config?.color,
                          "border-0",
                        )}
                      >
                        {StatusIcon && <StatusIcon className="h-3 w-3 mr-1" />}
                        {c.status
                          ?.replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase())}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-foreground truncate text-lg">
                      {c.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      <span className="inline-block bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                        {c.category?.name ?? c.other ?? "Uncategorized"}
                      </span>
                    </p>

                    <StatusProgress currentStatus={c.status} />

                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-4 text-xs text-muted-foreground">
                      <span>
                        📅 Submitted: {formatDate(new Date(c.issuedAt))}
                      </span>
                      <span>
                        🔄 Updated: {formatDate(new Date(c.updatedAt))}
                      </span>
                    </div>
                  </div>

                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-4 mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages} • Showing {startIndex + 1}-
            {Math.min(startIndex + ITEMS_PER_PAGE, totalItems)} of {totalItems}{" "}
            concerns
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Previous</span>
            </Button>
            <div className="flex items-center px-3 py-2 text-sm text-gray-700 bg-white rounded border border-gray-300">
              {currentPage} / {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
              className="flex items-center gap-1"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

function StatusProgress({ currentStatus }: { currentStatus: Status }) {
  const currentIndex = statusSteps.indexOf(currentStatus);
  const isRejected = currentStatus === "rejected";

  return (
    <div className="flex items-center gap-2 mt-3">
      {statusSteps.map((step, index) => {
        const isCompleted = !isRejected && index <= currentIndex;
        const isCurrent = step === currentStatus;
        const config = statusConfig[step];

        return (
          <div key={step} className="flex items-center">
            <div
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full transition-colors",
                isCompleted ? config.bgColor : "bg-muted",
                isCurrent && "ring-2 ring-offset-2 ring-primary",
              )}
            >
              <config.icon
                className={cn(
                  "h-4 w-4",
                  isCompleted ? config.color : "text-muted-foreground",
                )}
              />
            </div>
            {index < statusSteps.length - 1 && (
              <div
                className={cn(
                  "w-8 h-1 mx-1 rounded-full",
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
