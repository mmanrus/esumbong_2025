"use client";

import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/swrFetcher";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronRight, Megaphone, Search, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/formatDate";
import { motion } from "framer-motion";

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

  const itemsPerPage = 6;

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setSearch(input);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
            <Megaphone className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Announcements
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Stay updated with the latest news and important updates from our community
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-2xl mx-auto"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search announcements by title..."
              className="pl-12 pr-24 h-14 text-lg border-2 border-slate-200 focus:border-indigo-400 rounded-2xl shadow-sm"
            />
            <Button
              disabled={isLoading}
              onClick={() => setSearch(input)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl"
            >
              Search
            </Button>
          </div>
        </motion.div>

        {/* Stats Bar */}
        {!isLoading && announcements.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-2 text-sm text-slate-600"
          >
            <Sparkles className="h-4 w-4 text-indigo-500" />
            <span>
              Showing {paginatedAnnouncements.length} of {announcements.length} announcements
            </span>
          </motion.div>
        )}

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <AnnouncementCardSkeleton key={i} index={i} />
            ))}
          </div>
        )}

        {/* Announcements Grid */}
        {!isLoading && (
          <>
            {paginatedAnnouncements.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl shadow-lg border-2 border-slate-200 p-16 text-center"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center">
                  <Megaphone className="h-10 w-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-700 mb-2">
                  No announcements found
                </h3>
                <p className="text-slate-500">
                  {search
                    ? "Try adjusting your search terms"
                    : "Check back later for updates"}
                </p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {paginatedAnnouncements.map((item, index) => (
                  <AnnouncementCard
                    key={item.id}
                    announcement={item}
                    index={index}
                    onClick={() => router.push(`/announcements/${item.id}`)}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Pagination */}
        {!isLoading && paginatedAnnouncements.length > 0 && totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-3"
          >
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-6 h-11 rounded-xl border-2 disabled:opacity-50 hover:bg-indigo-50 hover:border-indigo-300 transition-all"
            >
              Previous
            </Button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-11 h-11 rounded-xl font-medium transition-all ${
                    currentPage === page
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-110"
                      : "bg-white border-2 border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-indigo-50"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <Button
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-6 h-11 rounded-xl border-2 disabled:opacity-50 hover:bg-indigo-50 hover:border-indigo-300 transition-all"
            >
              Next
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Announcement Card Component
function AnnouncementCard({
  announcement,
  index,
  onClick,
}: {
  announcement: Announcement;
  index: number;
  onClick: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl border-2 border-slate-200 hover:border-indigo-300 p-6 cursor-pointer transition-all duration-300 overflow-hidden"
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative z-10 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-2">
              {announcement.title}
            </h3>
          </div>
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-indigo-100 group-hover:bg-indigo-200 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
              <ChevronRight className="h-5 w-5 text-indigo-600 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-lg">
            <Calendar className="h-4 w-4" />
            <span className="font-medium">{formatDate(announcement.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Decorative corner accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-bl-full transform translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-500" />
    </motion.div>
  );
}

// Skeleton Component
function AnnouncementCardSkeleton({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-2xl shadow-md border-2 border-slate-200 p-6 space-y-4"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div className="h-6 bg-slate-200 rounded-lg w-3/4 animate-pulse" />
          <div className="h-6 bg-slate-200 rounded-lg w-1/2 animate-pulse" />
        </div>
        <div className="w-10 h-10 bg-slate-200 rounded-full animate-pulse" />
      </div>
      <div className="h-9 bg-slate-200 rounded-lg w-32 animate-pulse" />
    </motion.div>
  );
}