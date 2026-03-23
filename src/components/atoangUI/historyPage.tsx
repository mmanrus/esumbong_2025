"use client";

type Status = "pending" | "inProgress" | "approved" | "rejected" | "resolved" | "canceled" | "verified" | "unresolved";

import { useEffect, useState, useMemo } from "react";

interface HistoryItem {
  id: string;
  title: string;
  category?: string;
  other?: string;
  status: Status;
  createdAt: string;
  updatedAt?: string;
}

import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChevronRight,
  Calendar,
  Filter,
  Tag,
  Clock,
  Activity,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import LoadingPageTSX from "./loading";
import { fetcher } from "@/lib/swrFetcher";
import useSWR from "swr";
import { useRouter } from "next/navigation";

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, {
  bg: string
  text: string
  border: string
  icon: React.ElementType
  label: string
}> = {
  pending:    { bg: "bg-yellow-50",  text: "text-yellow-700",  border: "border-yellow-200", icon: Clock,        label: "Pending"    },
  inProgress: { bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-200",   icon: Activity,     label: "In Progress"},
  approved:   { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200",icon: CheckCircle2, label: "Approved"   },
  resolved:   { bg: "bg-green-50",   text: "text-green-700",   border: "border-green-200",  icon: CheckCircle2, label: "Resolved"   },
  rejected:   { bg: "bg-red-50",     text: "text-red-700",     border: "border-red-200",    icon: XCircle,      label: "Rejected"   },
  canceled:   { bg: "bg-gray-50",    text: "text-gray-600",    border: "border-gray-200",   icon: XCircle,      label: "Canceled"   },
  verified:   { bg: "bg-teal-50",    text: "text-teal-700",    border: "border-teal-200",   icon: ShieldCheck,  label: "Verified"   },
  unresolved: { bg: "bg-orange-50",  text: "text-orange-700",  border: "border-orange-200", icon: AlertCircle,  label: "Unresolved" },
}

function getStatusCfg(status: string) {
  return STATUS_CONFIG[status] ?? STATUS_CONFIG["pending"]
}

// ─── Compact status badge ─────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const cfg = getStatusCfg(status)
  const Icon = cfg.icon
  return (
    <span className={cn(
      "inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border",
      cfg.bg, cfg.text, cfg.border
    )}>
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  )
}

// ─── Left border color per status ────────────────────────────────────────────

const LEFT_BORDER: Record<string, string> = {
  pending:    "border-l-yellow-400",
  inProgress: "border-l-blue-400",
  approved:   "border-l-emerald-400",
  resolved:   "border-l-green-400",
  rejected:   "border-l-red-400",
  canceled:   "border-l-gray-300",
  verified:   "border-l-teal-400",
  unresolved: "border-l-orange-400",
}

// ─── Component ────────────────────────────────────────────────────────────────

export function HistoryPage() {
  const router = useRouter()
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [hasNextPage, setHasNextPage] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [nextCursor, setNextCursor] = useState<number | null>(null)
  const itemsPerPage = 8 // more items per page since cards are compact now

  const { data, isLoading } = useSWR("/api/concern/history", fetcher)

  useEffect(() => {
    if (!data) return
    const normalized: HistoryItem[] = Array.isArray(data.data)
      ? data.data.map((item: any) => ({
          id: String(item.concernId),
          title: item.concern?.title ?? "Untitled concern",
          category: item.concern?.category?.name ?? item.concern?.other ?? "Uncategorized",
          status: item.status,
          createdAt: new Date(item.createdAt).toLocaleDateString("en-PH", {
            year: "numeric", month: "short", day: "numeric",
          }),
          updatedAt: item.updatedAt
            ? new Date(item.updatedAt).toLocaleDateString("en-PH", {
                year: "numeric", month: "short", day: "numeric",
              })
            : undefined,
        }))
      : []
    setHistory(normalized)
    setNextCursor(data.nextCursor ?? null)
    setHasNextPage(data.hasNextPage ?? false)
    setCurrentPage(1)
  }, [data])

  useEffect(() => { setCurrentPage(1) }, [statusFilter])

  const filteredHistory = useMemo(() =>
    statusFilter === "all" ? history : history.filter((i) => i.status === statusFilter),
    [history, statusFilter]
  )

  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage)

  const paginatedHistory = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredHistory.slice(start, start + itemsPerPage)
  }, [filteredHistory, currentPage])

  const loadMore = async () => {
    if (!nextCursor || isLoadingMore) return
    setIsLoadingMore(true)
    try {
      const res = await fetch(`/api/concern/history?cursor=${nextCursor}`)
      const newData = await res.json()
      setHistory((prev) => [...prev, ...(newData.data ?? [])])
      setNextCursor(newData.nextCursor ?? null)
      setHasNextPage(newData.hasNextPage ?? false)
    } catch {
      toast.error("Failed to load more concerns.")
    } finally {
      setIsLoadingMore(false)
    }
  }

  if (isLoading) return <LoadingPageTSX />

  return (
    <div className="space-y-4 sm:space-y-6 flex flex-1 flex-col h-full pb-20 lg:pb-0">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">History</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            All your previously submitted concerns
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36 sm:w-40 text-sm">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="inProgress">In Progress</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* List */}
      <div className="space-y-2 sm:space-y-3 flex-1">
        {paginatedHistory.length === 0 ? (
          <Card className="p-8 flex flex-1 items-center justify-center">
            <p className="text-center text-muted-foreground text-sm">
              No concerns found with the selected filter.
            </p>
          </Card>
        ) : (
          paginatedHistory.map((item, index) => (
            <Card
              key={`${item.id}-${currentPage}-${index}`}
              onClick={() => router.push(`/concern/${item.id}`)}
              className={cn(
                "border-l-4 hover:shadow-md transition-all py-3 duration-200 cursor-pointer group",
                LEFT_BORDER[item.status] ?? "border-l-gray-300"
              )}
            >
              <CardContent className="px-3 sm:px-4 py-0">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex-1 min-w-0">

                    {/* Top row: ID + status badge */}
                    <div className="flex items-center gap-1.5 flex-wrap mb-1">
                      <span className="text-[10px] sm:text-xs font-mono text-muted-foreground">
                        #{item.id}
                      </span>
                      <StatusBadge status={item.status} />
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-sm text-foreground truncate leading-snug">
                      {item.title}
                    </h3>

                    {/* Meta row — tighter on mobile */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1">
                      <span className="flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground">
                        <Tag className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" />
                        {item.category}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground">
                        <Calendar className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" />
                        {item.createdAt}
                      </span>
                      {item.updatedAt && item.updatedAt !== item.createdAt && (
                        <span className="flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground">
                          <Activity className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" />
                          {item.updatedAt}
                        </span>
                      )}
                    </div>

                  </div>

                  {/* Chevron */}
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary
                                           transition-colors flex-shrink-0" />
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 pt-1">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="px-3 py-1.5 text-xs sm:text-sm border rounded-lg
                     disabled:opacity-40 hover:bg-muted transition"
        >
          Prev
        </button>
        <span className="px-2 text-xs sm:text-sm text-muted-foreground">
          {currentPage} / {totalPages || 1}
        </span>
        {currentPage < totalPages ? (
          <button
            disabled={currentPage === totalPages || paginatedHistory.length === 0}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1.5 text-xs sm:text-sm border rounded-lg
                       disabled:opacity-40 hover:bg-muted transition"
          >
            Next
          </button>
        ) : hasNextPage ? (
          <button
            onClick={loadMore}
            disabled={isLoadingMore}
            className="px-3 py-1.5 text-xs sm:text-sm border rounded-lg
                       disabled:opacity-40 hover:bg-muted transition"
          >
            {isLoadingMore ? "Loading..." : "Load More"}
          </button>
        ) : null}
      </div>

    </div>
  )
}