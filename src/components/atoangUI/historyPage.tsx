"use client";

type Status = "pending" | "approved" | "rejected" | "resolved";
import { useEffect, useState, useMemo } from "react";

interface HistoryItem {
  id: string;
  title: string;
  category?: string;
  other?: string;
  status: Status;
  createdAt: string;
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
import { ChevronRight, Calendar, Filter, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

const statusColors: Record<Status, { bg: string; text: string }> = {
  pending: { bg: "bg-yellow-500/10", text: "text-yellow-600" },
  approved: { bg: "bg-emerald-500/10", text: "text-emerald-600" },
  rejected: { bg: "bg-red-500/10", text: "text-red-600" },
  resolved: { bg: "bg-blue-500/10", text: "text-blue-600" },
};

export function HistoryPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  useEffect(() => {
    fetchHistory();
  }, []);

  // Reset page to 1 whenever filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  const fetchHistory = async (): Promise<HistoryItem[]> => {
    try {
      const res = await fetch("/api/concern/history");
      if (!res.ok) return [];

      const json = await res.json();
      const raw = json?.data?.data;

      const normalized: HistoryItem[] = Array.isArray(raw)
        ? raw.map((item: any) => ({
            id: String(item.concernId),
            title: item.concern?.title ?? "Untitled concern",
            category:
              item.concern?.category?.name ??
              item.concern?.other ??
              "Uncategorized",
            status: item.status,
            createdAt: new Date(item.createdAt).toLocaleDateString(),
          }))
        : [];

      setHistory(normalized);
      return normalized;
    } catch (error) {
      if(process.env.NODE_ENV ==="development") console.error("error retrieving history:", error);
      toast.error("Something went wrong");
      return [];
    }
  };
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);
  // ✅ Memoize filtered history to avoid unnecessary re-renders
  const filteredHistory = useMemo(() => {
    return statusFilter === "all"
      ? history
      : history.filter((item) => item.status === statusFilter);
  }, [history, statusFilter]);

  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);

  // ✅ Slice current page only
  const paginatedHistory = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = currentPage * itemsPerPage;
    return filteredHistory.slice(start, end);
  }, [filteredHistory, currentPage]);

  return (
    <div className="space-y-6 flex flex-1 flex-col h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">History</h1>
          <p className="text-muted-foreground mt-1">
            View all your previously submitted concerns
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>

              <SelectItem value="approved">Approved</SelectItem>
              {/**<SelectItem value="resolved">Resolved</SelectItem> */}
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3 h-full">
        {paginatedHistory.length === 0 ? (
          <Card className="p-8 flex flex-1 items-center justify-center h-full">
            <p className="text-center text-muted-foreground">
              No concerns found with the selected filter.
            </p>
          </Card>
        ) : (
          paginatedHistory.map((item, index) => {
            const colors = statusColors[item.status];
            return (
              <Card
                key={`${item.id}-${currentPage}-${index}`}
                className="hover:shadow-md transition-shadow cursor-pointer group py-3"
              >
                <CardContent className="py-0 min-h-[15px]">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 flex-wrap">
                        <span className="text-xs font-mono text-muted-foreground">
                          #{item.id}
                        </span>
                        <Badge
                          variant="secondary"
                          className={cn(colors.bg, colors.text, "border-0")}
                        >
                          {item.status}
                        </Badge>
                      </div>
                      <h3 className="font-medium text-sm text-foreground mt-0.5 truncate">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1">
                          <Tag className="h-3 w-3" /> {item.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {item.createdAt}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="px-3 py-1 text-sm border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-2 text-sm">
          Page {currentPage} of {totalPages || 1}
        </span>
        <button
          disabled={currentPage === totalPages || paginatedHistory.length === 0}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="px-3 py-1 text-sm border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
