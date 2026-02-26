"use client";

import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/swrFetcher";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/formatDate";

interface Announcement {
  id: number;
  title: string;
  createdAt: string;
}

export default function Page() {
  const router = useRouter();

  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  const { data, error, isLoading } = useSWR(
    `/api/announcement/getAll?search=${search}`,
    fetcher
  );

  const announcements: Announcement[] = data?.data ?? [];

  useEffect(() => {
    if (error) {
      toast.error("Failed to load announcements.");
    }
  }, [error]);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const totalPages = Math.ceil(announcements.length / itemsPerPage);

  const paginatedAnnouncements = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = currentPage * itemsPerPage;
    return announcements.slice(start, end);
  }, [announcements, currentPage]);

  return (
    <div className="space-y-6 flex flex-1 flex-col h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Announcements
          </h1>
          <p className="text-muted-foreground mt-1">
            View all published announcements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search announcements..."
          />
          <Button
            disabled={isLoading}
            onClick={() => setSearch(input)}
          >
            Search
          </Button>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3 flex-1">
        {paginatedAnnouncements.length === 0 ? (
          <Card className="p-8 flex items-center justify-center">
            <p className="text-muted-foreground">
              No announcements found.
            </p>
          </Card>
        ) : (
          paginatedAnnouncements.map((item) => (
            <Card
              key={item.id}
              onClick={() => router.push(`/announcements/${item.id}`)}
              className="hover:shadow-md transition-shadow cursor-pointer group py-3"
            >
              <CardContent className="py-0">
                <div className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm text-foreground truncate">
                      {item.title}
                    </h3>

                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {formatDate(item.createdAt)}
                    </div>
                  </div>

                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </CardContent>
            </Card>
          ))
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
          disabled={
            currentPage === totalPages ||
            paginatedAnnouncements.length === 0
          }
          onClick={() => setCurrentPage((p) => p + 1)}
          className="px-3 py-1 text-sm border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}