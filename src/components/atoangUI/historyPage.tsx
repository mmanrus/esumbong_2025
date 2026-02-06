"use client";
type Status = "pending" | "approved" | "rejected" | "resolved";
import { useEffect, useState } from "react";
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
import clsx from "clsx";

const statusColors: Record<Status, { bg: string; text: string }> = {
  pending: {
    bg: "bg-yellow-500/10",
    text: "text-yellow-600",
  }, // warning

  approved: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-600",
  }, // success

  rejected: {
    bg: "bg-red-500/10",
    text: "text-red-600",
  }, // destructive

  resolved: {
    bg: "bg-blue-500/10",
    text: "text-blue-600",
  }, // primary / inf
};

export function HistoryPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const fetchHistory = async (): Promise<HistoryItem[]> => {
    try {
      const res = await fetch("/api/concern/history");
      if (!res.ok) return [];

      const json = await res.json();

      // 🔴 ACTUAL array location
      const raw = json?.data?.data;

      const normalized: HistoryItem[] = Array.isArray(raw)
        ? raw.map((item: any) => ({
            id: String(item.concernId), // ✅ correct field
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
      console.log("Normalized history data:", normalized);
      return normalized;
    } catch (error) {
      console.error("error retrieving history:", error);
      toast.error("Something went wrong");
      return [];
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);
  const filteredHistory = Array.isArray(history)
    ? statusFilter === "all"
      ? history
      : history.filter((item) => item.status === statusFilter)
    : [];

  return (
    <div className="space-y-6">
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
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        {filteredHistory.length === 0 ? (
          <Card className="p-8">
            <p className="text-center  text-muted-foreground">
              No concerns found with the selected filter.
            </p>
          </Card>
        ) : (
          filteredHistory.map((item: HistoryItem) => {
            const colors = statusColors[item.status];

            return (
              <Card
                key={item.id}
                className="hover:shadow-md transition-shadow cursor-pointer group"
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={"text-xs font-mono text-muted-foreground"}
                        >
                          #{item.id}
                        </span>
                        <Badge
                          variant="secondary"
                          className={cn(
                            colors.bg,
                            colors.text,
                            "border-0",
                          )}
                        >
                          {item.status}
                        </Badge>
                      </div>
                      <h3 className="font-medium text-foreground mt-1 truncate">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          {item.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {item.createdAt}
                        </span>
                        {item.status === "resolved" && (
                          <span className="text-success">
                            Resolved: {item.createdAt}
                          </span>
                        )}
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
    </div>
  );
}
