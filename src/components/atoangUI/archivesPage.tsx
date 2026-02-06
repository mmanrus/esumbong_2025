"use client";

import ViewConcernArchivesRows from "@/components/atoangUI/concern/concernArchivesRow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Skeleton } from "@/components/ui/skeleton";
import { fetcher } from "@/lib/swrFetcher";
import { Filter, Search } from "lucide-react";
import { useEffect, useState } from "react";
import useSWR from "swr";

export type StatusFilter = "all" | "pending" | "resolved" | "approved" | "rejected";

export default function ArchivesPage() {
  const [query, setQuery] = useState({
    search: "",
    status: "",
  });

  const [status, setStatus] = useState("all");
  const [input, setInput] = useState("");
  const [concerns, setConcerns] = useState<any>(null);
  const filteredConcern = concerns?.filter((c: any) => {
    const search = input.toLowerCase();
    if (status !== "all" && c.validation !== status && c.status !== status) {
      return false;
    }

    // SEARCH FILTER (optional)
    if (!search) return true;
    return (
      c.id.toString().includes(search) ||
      c.user?.fullname.toLowerCase().includes(search) ||
      c.category?.name.toLowerCase().includes(search) ||
      c.details.toLowerCase().includes(search) ||
      c.title.toLowerCase().includes(search)
    );
  });
  const { data, error, isLoading, mutate } = useSWR(
    `/api/concern/getAll?search=${query.search}&status=${query.status}&archived=true`,
    fetcher,
  );
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

  useEffect(() => {
    if (!data) return;
    setConcerns(data.data);
  }, [data]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:items-center md:flex-row justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-3xl md:2xl font-bold text-[#1F4251]">
            Archives
          </h2>
          <p className="text-sx md:text-sm text-gray-600">
            Archived concerns records.
          </p>
        </div>
        {/* Search and Filters */}
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
              <Search className="w-4 h-4 inline  text-muted-foreground"/>
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

      <div className="bg-card rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto h-full">
          <table className="min-w-full h-full table-fixed">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-5 py-3 text-sm font-medium text-muted-foreground">
                  Case #
                </th>
                <th className="text-left px-5 py-3 text-sm font-medium text-muted-foreground hidden md:table-cell">
                  Complainant
                </th>
                <th className="text-left px-5 py-3 text-sm font-medium text-muted-foreground hidden md:table-cell">
                  Category
                </th>
                <th className="text-left px-5 py-3 text-sm font-medium text-muted-foreground">
                  Archived On
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
                    <td colSpan={1} className="px-4 py-5 ">
                      <Skeleton className="h-10 w-10 rounded-full" />
                    </td>
                    <td colSpan={1} className="px-4 py-5 ">
                      <Skeleton className="h-3 md:h-4 lg:h-6 flex-1 " />
                    </td>
                    <td colSpan={1} className="px-4 py-5">
                      <Skeleton className="h-3 md:h-4 lg:h-6 flex-1 " />
                    </td>
                    <td colSpan={1} className="px-4 py-5 ">
                      <Skeleton className="h-3 md:h-4 lg:h-6 flex-1 " />
                    </td>
                    <td colSpan={1} className="px-4 py-5 ">
                      <Skeleton className="h-3 md:h-4 lg:h-6 flex-1 " />
                    </td>
                    <td colSpan={1} className="px-4 py-5 ">
                      <Skeleton className="h-3 md:h-4 lg:h-6 flex-1 " />
                    </td>
                  </tr>
                ))
              ) : (
                <ViewConcernArchivesRows
                  concerns={filteredConcern}
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
    </div>
  );
}
