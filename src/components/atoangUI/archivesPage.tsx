"use client";

import ViewConcernArchivesRows from "@/components/atoangUI/concern/concernArchivesRow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { fetcher } from "@/lib/swrFetcher";
import { Filter, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import useSWR from "swr";

export type StatusFilter =
  | "all"
  | "pending"
  | "resolved"
  | "approved"
  | "rejected";

export default function ArchivesPage() {
  const [query, setQuery] = useState({ search: "", status: "" });
  const [status, setStatus] = useState("all");
  const [input, setInput] = useState("");
  const [concerns, setConcerns] = useState<any[]>([]);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  //
  const { data, error, isLoading, mutate } = useSWR(
    `/api/concern/getAll?search=${query.search}&status=${query.status}&archived=true`,
    fetcher,
  );

  useEffect(() => {
    if (!data) return;
    setConcerns(data.data ?? []);
    setNextCursor(data.nextCursor ?? null);
    setHasNextPage(data.hasNextPage ?? false);
    setCurrentPage(1);
  }, [data]);

  useEffect(() => {
    setConcerns([]);
    setNextCursor(null);
    setHasNextPage(false);
    setCurrentPage(1);
  }, [query, status]);

  useEffect(() => {
    setCurrentPage(1);
  }, [status, input]);
  // Load More
  const loadMore = async () => {
    if (!nextCursor || isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      const res = await fetch(
        `/api/concern/getAll?search=${query.search}&status=${query.status}&archived=true&cursor=${nextCursor}`,
      );
      const newData = await res.json();
      setConcerns((prev) => [...prev, ...(newData.data ?? [])]);
      setNextCursor(newData.nextCursor ?? null);
      setHasNextPage(newData.hasNextPage ?? false);
    } catch {
      toast.error("Failed to load more concerns.");
    } finally {
      setIsLoadingMore(false);
    }
  };

  const filteredConcerns = useMemo(() => {
    const search = input.toLowerCase();
    return concerns.filter((c: any) => {
      if (status !== "all" && c.validation !== status && c.status !== status) return false;
      if (!search) return true;
      return (
        c.id.toString().includes(search) ||
        c.user?.fullname.toLowerCase().includes(search) ||
        c.category?.name.toLowerCase().includes(search) ||
        c.details?.toLowerCase().includes(search) ||
        c.title?.toLowerCase().includes(search)
      );
    });
  }, [concerns, input, status]);

  const totalPages = Math.ceil(filteredConcerns.length / itemsPerPage);
  const paginatedConcerns = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredConcerns.slice(start, start + itemsPerPage);
  }, [filteredConcerns, currentPage]);

  const filterButtons: { label: string; value: StatusFilter; count: number }[] = [
    { label: "All", value: "all", count: concerns.length },
    {
      label: "Pending",
      value: "pending",
      count: concerns.filter((c: any) => c.validation === "pending" || c.status === "pending").length,
    },
    {
      label: "Resolved",
      value: "resolved",
      count: concerns.filter((c: any) => c.validation === "resolved" || c.status === "resolved").length,
    },
    {
      label: "Approved",
      value: "approved",
      count: concerns.filter((c: any) => c.validation === "approved" || c.status === "approved").length,
    },
    {
      label: "Rejected",
      value: "rejected",
      count: concerns.filter((c: any) => c.validation === "rejected" || c.status === "rejected").length,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:items-center md:flex-row justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-3xl md:2xl font-bold text-[#1F4251]">Archives</h2>
          <p className="text-sx md:text-sm text-gray-600">Archived concerns records.</p>
        </div>

        <div className="bg-card rounded-xl shadow-sm border p-4 sm:p-5 space-y-4">
          <div className="relative">
            <Input
              placeholder="Search by ticket number or complainant name..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="pl-4 h-11"
            />
            <Button
              variant="outline"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-sm"
              onClick={() => setQuery({ search: input, status: status === "all" ? "" : status })}
            >
              <Search className="w-4 h-4 inline text-muted-foreground" />
              Search
            </Button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-muted-foreground" />
            {filterButtons.map((filter) => (
              <Button
                key={filter.value}
                variant={status === filter.value ? "default" : "outline"}
                size="sm"
                onClick={() => setStatus(filter.value)}
                className="text-sm"
              >
                {filter.label}
                <span className="ml-2 bg-background/20 px-1.5 py-0.5 rounded text-xs">
                  {filter.count}
                </span>
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-5 py-3 text-sm font-medium text-muted-foreground">Case #</th>
                <th className="text-left px-5 py-3 text-sm font-medium text-muted-foreground hidden md:table-cell">Category</th>
                <th className="text-left px-5 py-3 text-sm font-medium text-muted-foreground">Archived On</th>
                <th className="text-left px-5 py-3 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left px-5 py-3 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <tr key={index}>
                    <td className="px-4 py-5"><Skeleton className="h-10 w-10 rounded-full" /></td>
                    <td className="px-4 py-5"><Skeleton className="h-4 flex-1" /></td>
                    <td className="px-4 py-5"><Skeleton className="h-4 flex-1" /></td>
                    <td className="px-4 py-5"><Skeleton className="h-4 flex-1" /></td>
                    <td className="px-4 py-5"><Skeleton className="h-4 flex-1" /></td>
                  </tr>
                ))
              ) : (
                <ViewConcernArchivesRows
                  concerns={paginatedConcerns}
                  onDelete={(id: number) =>
                    setConcerns((prev) => prev.filter((c: any) => c.id !== id))
                  }
                />
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {!isLoading && filteredConcerns.length > 0 && (
        <div className="flex items-center justify-between gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages} • Showing {paginatedConcerns.length} of {filteredConcerns.length} records
            {hasNextPage && " (more available)"}
          </div>
          <div className="flex gap-2">
            <Button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Previous</span>
            </Button>
            <div className="flex items-center px-3 py-2 text-sm text-gray-700 bg-white rounded border border-gray-300">
              {currentPage} / {totalPages}
            </div>
            {/* Show Next if more local pages, Load More if at last page but backend has more */}
            {currentPage < totalPages ? (
              <Button
                onClick={() => setCurrentPage((p) => p + 1)}
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : hasNextPage ? (
              <Button
                onClick={loadMore}
                disabled={isLoadingMore}
                variant="outline"
                size="sm"
              >
                {isLoadingMore ? "Loading..." : "Load More"}
              </Button>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}