"use client";

import { StatusFilter } from "@/components/atoangUI/archivesPage";
import ViewConcernRows from "@/components/atoangUI/concern/concernRows";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { fetcher } from "@/lib/swrFetcher";
import { ChevronLeft, ChevronRight, Filter, Search } from "lucide-react";
import { notFound } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import useSWR from "swr";

export default function OfficialViewSpamConcerns() {
  const [status, setStatus] = useState("all");
  const [input, setInput] = useState("");
  const [concerns, setConcerns] = useState<any>(null);
  const [query, setQuery] = useState({ search: "", status: "" });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of concerns per page
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { data, error, isLoading, mutate } = useSWR(
    `/api/concern/getAll?search=${query.search}&status=${query.status}&archived=false&spam=true`,
    fetcher,
  );



  useEffect(() => {
    if (!data) return;
    setConcerns(data.data);
    setNextCursor(data.nextCursor ?? null);
    setHasNextPage(data.hasNextPage ?? false);
  }, [data]);

  if (error) {
    toast.error("Failed to load concern data.");
    notFound();
  }

  // Filtered concerns based on search & status
  const filteredConcern = useMemo(() => {
    if (!concerns) return [];
    const search = input.toLowerCase();

    return concerns.filter((c: any) => {
      if (status !== "all" && c.validation !== status && c.status !== status) {
        return false;
      }
      if (!search) return true;
      return (
        c.id.toString().includes(search) ||
        c.user?.fullname.toLowerCase().includes(search) ||
        c.category?.name.toLowerCase().includes(search) ||
        c.details.toLowerCase().includes(search) ||
        c.title.toLowerCase().includes(search)
      );
    });
  }, [concerns, input, status]);

  // Load more handler
  const loadMore = async () => {
    if (!nextCursor || isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      const res = await fetch(
        `/api/concern/getAll?search=${query.search}&status=${query.status}&archived=false&cursor=${nextCursor}&spam=true`,
      );
      const newData = await res.json();
      setConcerns((prev: any) => [...prev, ...(newData.data ?? [])]);
      setNextCursor(newData.nextCursor ?? null);
      setHasNextPage(newData.hasNextPage ?? false);
    } catch {
      toast.error("Failed to load more concerns.");
    } finally {
      setIsLoadingMore(false);
    }
  };
  // Reset when filters/query change
  useEffect(() => {
    setConcerns([]);
    setNextCursor(null);
    setHasNextPage(false);
    setCurrentPage(1);
  }, [query, status]);

  // Pagination: slice filtered concerns
  const totalPages = Math.ceil(filteredConcern.length / itemsPerPage);
  const paginatedConcerns = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = currentPage * itemsPerPage;
    return filteredConcern.slice(start, end);
  }, [filteredConcern, currentPage]);

  // Reset page to 1 whenever filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [status, input]);

  const filterButtons: { label: string; value: StatusFilter; count: number }[] =
    [
      { label: "All", value: "all", count: concerns?.length || 0 },
      {
        label: "Pending",
        value: "pending",
        count:
          concerns?.filter(
            (c: any) => c.validation === "pending" || c.status === "pending",
          ).length || 0,
      },
      {
        label: "Resolved",
        value: "resolved",
        count:
          concerns?.filter(
            (c: any) => c.validation === "resolved" || c.status === "resolved",
          ).length || 0,
      },
      {
        label: "Approved",
        value: "approved",
        count:
          concerns?.filter(
            (c: any) => c.validation === "approved" || c.status === "approved",
          ).length || 0,
      },
      {
        label: "Rejected",
        value: "rejected",
        count:
          concerns?.filter(
            (c: any) => c.validation === "rejected" || c.status === "rejected",
          ).length || 0,
      },
    ];

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="flex flex-col md:items-center md:flex-row justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1F4251]">
            View Spam Concerns
          </h1>
          <p className="mt-1 text-gray-600">
            Browse and manage all submitted spam concerns
          </p>
        </div>
        <div className="bg-card rounded-xl shadow-sm border p-4 sm:p-5 space-y-4">
          {/* Search Bar */}
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
              onClick={() =>
                setQuery({
                  search: input,
                  status: status === "all" ? "" : status,
                })
              }
            >
              <Search className="w-4 h-4 inline text-muted-foreground" />
              Search
            </Button>
          </div>

          {/* Filter Buttons */}
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

      {/* Concerns Table */}
      <div className="bg-card rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto h-full">
          <table className="min-w-full h-full table-fixed">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-5 py-3 text-sm font-medium text-muted-foreground">
                  Case #
                </th>
                {/**
                <th className="text-left px-5 py-3 text-sm font-medium text-muted-foreground hidden md:table-cell">
                  Complainant
                </th> */}
                <th className="text-left px-5 py-3 text-sm font-medium text-muted-foreground hidden md:table-cell">
                  Concern Type
                </th>
                <th className="text-left px-5 py-3 text-sm font-medium text-muted-foreground">
                  Date
                </th>
                <th className="text-left px-5 py-3 text-sm font-medium text-muted-foreground">
                  Status
                </th>
                <th className="text-left px-5 py-3 text-sm font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <tr key={index}>
                    <td colSpan={6} className="px-4 py-5">
                      <Skeleton className="h-6 w-full" />
                    </td>
                  </tr>
                ))
              ) : (
                <ViewConcernRows
                  concerns={paginatedConcerns}
                  onDelete={(id: number) =>
                    setConcerns((prev: any) =>
                      prev.filter((c: any) => c.id !== id),
                    )
                  }
                />
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-4 p-3 mt-[-14] bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages} •
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
            {currentPage === totalPages ? (
              hasNextPage && (
                <Button
                  onClick={loadMore}
                  disabled={isLoadingMore}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  {isLoadingMore ? "Loading..." : "Load More"}
                </Button>
              )
            ) : (
              <Button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
