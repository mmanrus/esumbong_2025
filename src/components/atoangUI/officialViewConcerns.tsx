"use client";

import { StatusFilter } from "@/components/atoangUI/archivesPage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableSkeleton } from "@/components/skeletons/tableSkeleton";
import { fetcher } from "@/lib/swrFetcher";
import { Filter, Search, ChevronLeft, ChevronRight, Eye, Info, Tag, Calendar } from "lucide-react";
import { notFound } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import useSWR from "swr";
import { formatDate } from "@/lib/formatDate";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import ConcernDialog from "@/components/atoangUI/concern/concernDialog";
import DialogAlert from "@/components/atoangUI/alertDialog";
import clsx from "clsx";

export default function OfficialViewConcerns() {
  const [status, setStatus] = useState("all");
  const [input, setInput] = useState("");
  const [concerns, setConcerns] = useState<any[]>([]);
  const [query, setQuery] = useState({ search: "", status: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [selectedConcern, setSelectedConcern] = useState<any | null>(null);
  const [newValidation, setNewValidation] = useState<"approved" | "rejected" | "pending">();
  const [validating, setValidating] = useState(false);

  const itemsPerPage = 6;

  const { data, error, isLoading } = useSWR(
    `/api/concern/getAll?search=${query.search}&status=${query.status}&archived=false`,
    fetcher,
  );

  useEffect(() => {
    if (!data) return;
    setConcerns(data.data ?? []);
    setNextCursor(data.nextCursor ?? null);
    setHasNextPage(data.hasNextPage ?? false);
  }, [data]);

  useEffect(() => {
    setConcerns([]);
    setNextCursor(null);
    setHasNextPage(false);
    setCurrentPage(1);
  }, [query, status]);

  useEffect(() => { setCurrentPage(1); }, [status, input]);

  if (error) {
    toast.error("Failed to load concern data.");
    notFound();
  }

  const loadMore = async () => {
    if (!nextCursor || isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      const res = await fetch(
        `/api/concern/getAll?search=${query.search}&status=${query.status}&archived=false&cursor=${nextCursor}`,
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

  const handleValidation = async (
    validationStatus: "approved" | "rejected" | "pending",
    concernId: any,
  ) => {
    setValidating(true);
    const res = await fetch(`/api/concern/validate/${concernId}`, {
      credentials: "include",
      method: "PATCH",
      body: JSON.stringify({ validation: validationStatus }),
    });
    if (!res.ok) {
      toast.error("Error validating the concern");
      setValidating(false);
      return;
    }
    toast.success(`Concern validated as ${validationStatus.charAt(0).toUpperCase() + validationStatus.slice(1)}`);
    setValidating(false);
  };

  const filteredConcerns = useMemo(() => {
    const search = input.toLowerCase();
    return concerns.filter((c: any) => {
      if (status !== "all" && c.validation !== status && c.status !== status) return false;
      if (!search) return true;
      return (
        c.id.toString().includes(search) ||
        c.user?.fullname.toLowerCase().includes(search) ||
        c.category?.name?.toLowerCase().includes(search) ||
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
    { label: "All",      value: "all",      count: concerns.length },
    { label: "Pending",  value: "pending",  count: concerns.filter((c: any) => c.validation === "pending"  || c.status === "pending").length  },
    { label: "Resolved", value: "resolved", count: concerns.filter((c: any) => c.validation === "resolved" || c.status === "resolved").length },
    { label: "Approved", value: "approved", count: concerns.filter((c: any) => c.validation === "approved" || c.status === "approved").length },
    { label: "Rejected", value: "rejected", count: concerns.filter((c: any) => c.validation === "rejected" || c.status === "rejected").length },
  ];

  const validationBadgeClass = (v: string) =>
    v === "approved" ? "bg-emerald-100 text-emerald-700"
    : v === "pending" ? "bg-amber-100 text-amber-700"
    : "bg-red-100 text-red-700";

  return (
    <div className="space-y-4 sm:space-y-6 pb-20 lg:pb-0">

      {/* ── Header ── */}
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#1F4251]">
          View Concerns
        </h1>
        <p className="mt-0.5 text-sm text-gray-600">
          Browse and manage all submitted concerns
        </p>
      </div>

      {/* ── Search + Filters ── */}
      <div className="bg-card rounded-xl shadow-sm border p-3 sm:p-4 space-y-3">
        {/* Search row */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              placeholder="Search ticket, name, category..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && setQuery({ search: input, status: status === "all" ? "" : status })}
              className="pl-3 pr-3 h-9 text-sm"
            />
          </div>
          <Button
            size="sm"
            className="h-9 px-3 gap-1.5"
            onClick={() => setQuery({ search: input, status: status === "all" ? "" : status })}
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search</span>
          </Button>
        </div>

        {/* Filter chips */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <Filter className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          {filterButtons.map((f) => (
            <Button
              key={f.value}
              variant={status === f.value ? "default" : "outline"}
              size="sm"
              onClick={() => setStatus(f.value)}
              className="h-7 text-xs px-2.5 gap-1"
            >
              {f.label}
              <span className={cn(
                "px-1.5 py-0.5 rounded text-[10px] font-bold",
                status === f.value ? "bg-white/20" : "bg-muted"
              )}>
                {f.count}
              </span>
            </Button>
          ))}
        </div>
      </div>

      {/* ── Table / Cards ── */}
      {isLoading ? (
        <TableSkeleton rows={5} columns={5} />
      ) : (
        <div className="bg-card rounded-xl shadow-sm border overflow-hidden">

          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  {["Case #", "Concern Type", "Date", "Status", "Actions"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-sm font-medium text-muted-foreground">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedConcerns.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-sm text-muted-foreground">
                      No concerns found.
                    </td>
                  </tr>
                ) : paginatedConcerns.map((concern: any) => (
                  <tr
                    key={concern.id}
                    className="border-t hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-5 py-3 text-sm font-mono text-muted-foreground">
                      <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">#{concern.id}</span>
                    </td>
                    <td className="px-5 py-3 text-sm text-muted-foreground max-w-40 truncate">
                      {concern.category?.name ?? concern.other ?? "N/A"}
                    </td>
                    <td className="px-5 py-3 text-sm text-muted-foreground whitespace-nowrap">
                      {formatDate(new Date(concern.issuedAt))}
                    </td>
                    <td className="px-5 py-3">
                      <span className={cn(
                        "inline-block px-2 py-0.5 rounded text-xs font-semibold",
                        validationBadgeClass(concern.validation)
                      )}>
                        {concern.validation?.charAt(0).toUpperCase() + concern.validation?.slice(1)}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          className="h-8 px-3 bg-blue-600 hover:bg-blue-700 text-white gap-1.5 text-xs"
                          onClick={() => setSelectedConcern(concern)}
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </Button>
                        <DialogAlert
                          trigger={
                            <Button size="sm" className="h-8 px-3 bg-amber-500 hover:bg-amber-600 text-white text-xs">
                              Validate
                            </Button>
                          }
                          Icon={Info}
                          IconColor="blue-600"
                          headMessage="Validate Concern as?"
                        >
                          <form
                            className="flex flex-row gap-2 justify-center"
                            onSubmit={async (e) => {
                              e.preventDefault();
                              if (!newValidation) { toast.error("Please select a status."); return; }
                              await handleValidation(newValidation, concern.id);
                            }}
                          >
                            <Button size="sm" disabled={concern.validation === "approved" || validating} type="submit" onClick={() => setNewValidation("approved")}>Approve</Button>
                            <Button size="sm" variant="destructive" disabled={concern.validation === "rejected" || validating} type="submit" onClick={() => setNewValidation("rejected")}>Reject</Button>
                            <Button size="sm" variant="outline" disabled={concern.validation === "pending" || validating} type="submit" onClick={() => setNewValidation("pending")}>Pending</Button>
                          </form>
                        </DialogAlert>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile card list */}
          <div className="sm:hidden divide-y">
            {paginatedConcerns.length === 0 ? (
              <p className="p-8 text-center text-sm text-muted-foreground">
                No concerns found.
              </p>
            ) : (
              paginatedConcerns.map((concern: any) => (
                <div key={concern.id} className="p-3 space-y-2">
                  {/* Top row: ID + validation badge */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                        #{concern.id}
                      </span>
                      <span className={cn(
                        "inline-block px-2 py-0.5 rounded text-[11px] font-semibold",
                        validationBadgeClass(concern.validation)
                      )}>
                        {concern.validation.charAt(0).toUpperCase() + concern.validation.slice(1)}
                      </span>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Button
                        size="sm"
                        className="h-7 w-7 p-0 bg-blue-600 hover:bg-blue-700"
                        onClick={() => setSelectedConcern(concern)}
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Button>

                      <DialogAlert
                        trigger={
                          <Button size="sm" className="h-7 px-2 bg-amber-500 hover:bg-amber-600 text-white text-[11px]">
                            Val
                          </Button>
                        }
                        Icon={Info}
                        IconColor="blue-600"
                        headMessage="Validate Concern as?"
                      >
                        <form
                          className="flex flex-row gap-2 justify-center"
                          onSubmit={async (e) => {
                            e.preventDefault();
                            if (!newValidation) {
                              toast.error("Please select a status.");
                              return;
                            }
                            await handleValidation(newValidation, concern.id);
                          }}
                        >
                          <Button size="sm" disabled={concern.validation === "approved" || validating} type="submit" onClick={() => setNewValidation("approved")}>
                            Approve
                          </Button>
                          <Button size="sm" variant="destructive" disabled={concern.validation === "rejected" || validating} type="submit" onClick={() => setNewValidation("rejected")}>
                            Reject
                          </Button>
                          <Button size="sm" variant="outline" disabled={concern.validation === "pending" || validating} type="submit" onClick={() => setNewValidation("pending")}>
                            Pending
                          </Button>
                        </form>
                      </DialogAlert>
                    </div>
                  </div>

                  {/* Title */}
                  {concern.title && (
                    <p className="text-sm font-medium text-foreground truncate">
                      {concern.title}
                    </p>
                  )}

                  {/* Meta: category + date */}
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
              ))
            )}
          </div>
        </div>
      )}

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
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
              <Button onClick={loadMore} disabled={isLoadingMore} variant="outline" size="sm" className="h-7 sm:h-8 px-2 text-xs">
                {isLoadingMore ? "..." : "More"}
              </Button>
            ) : null}
          </div>
        </div>
      )}

      {/* Shared concern dialog */}
      <ConcernDialog
        open={!!selectedConcern}
        concern={selectedConcern}
        onDelete={(id: number) => {
          setConcerns((prev) => prev.filter((c: any) => c.id !== id));
          setSelectedConcern(null);
        }}
        onOpenChange={(open) => { if (!open) setSelectedConcern(null); }}
      />
    </div>
  );
}