"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

type ConcernUpdate = {
  updateMessage: string;
  status: string;
  createdAt: string;
};

type PublicConcern = {
  id: number;
  title: string | null;
  details: string;
  status: string;
  issuedAt: string;
  location: string | null;
  needsBarangayAssistance: boolean;
  category: { name: string } | null;
  updates: ConcernUpdate[];
};

// ─── Fetcher ──────────────────────────────────────────────────────────────────

async function fetchSampleConcerns(): Promise<PublicConcern[]> {
  const res = await fetch("/api/concern/public");
  if (!res.ok) throw new Error("Failed to fetch");
  const data = await res.json();
  // Normalise: backend may return array or { data: [] }
  return Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
      ? data.data
      : [];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  string,
  {
    label: string;
    badge: string;
    leftBorder: string;
    noticeBg: string;
    noticeText: string;
    noticeBorder: string;
  }
> = {
  pending: {
    label: "Pending",
    badge: "bg-yellow-100 text-yellow-800",
    leftBorder: "border-l-yellow-500",
    noticeBg: "bg-yellow-50",
    noticeText: "text-yellow-800",
    noticeBorder: "border-yellow-500",
  },
  inProgress: {
    label: "In Progress",
    badge: "bg-blue-100 text-blue-800",
    leftBorder: "border-l-blue-500",
    noticeBg: "bg-teal-50",
    noticeText: "text-teal-800",
    noticeBorder: "border-teal-700",
  },
  resolved: {
    label: "Resolved",
    badge: "bg-green-100 text-green-800",
    leftBorder: "border-l-green-500",
    noticeBg: "bg-green-50",
    noticeText: "text-green-800",
    noticeBorder: "border-green-500",
  },
  verified: {
    label: "Verified",
    badge: "bg-teal-100 text-teal-800",
    leftBorder: "border-l-teal-500",
    noticeBg: "bg-teal-50",
    noticeText: "text-teal-800",
    noticeBorder: "border-teal-400",
  },
};

function getConfig(status: string) {
  return STATUS_CONFIG[status] ?? STATUS_CONFIG["pending"];
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function CarouselSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-lg border-l-4 border-l-gray-200 overflow-hidden animate-pulse">
      <div className="p-5 sm:p-6 space-y-4">
        <div className="flex justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
          </div>
          <div className="space-y-2">
            <div className="h-5 bg-gray-200 rounded w-16" />
          </div>
        </div>
        <div className="h-20 bg-gray-100 rounded-lg" />
      </div>
    </div>
  );
}

// ─── Filters ──────────────────────────────────────────────────────────────────

const FILTERS = ["all", "pending", "inProgress", "resolved"] as const;
type Filter = (typeof FILTERS)[number];

// ─── Component ────────────────────────────────────────────────────────────────

export default function RecentConcernDashboard() {
  const [filter, setFilter] = useState<Filter>("all");
  const [currentSlide, setCurrentSlide] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const {
    data: concerns = [],
    isLoading,
    isError,
  } = useQuery<PublicConcern[], Error>({
    queryKey: ["public-sample-concerns"],
    queryFn: fetchSampleConcerns,
    staleTime: 60_000,
  });

  const filtered =
    filter === "all" ? concerns : concerns.filter((c) => c.status === filter);

  useEffect(() => {
    setCurrentSlide(0);
  }, [filter, concerns.length]);

  // Auto-advance
  useEffect(() => {
    if (filtered.length <= 1) return;
    const t = setInterval(() => {
      setCurrentSlide((p) => (p + 1) % filtered.length);
    }, 5000);
    return () => clearInterval(t);
  }, [filtered.length]);

  const prev = () =>
    setCurrentSlide((p) => (p - 1 + filtered.length) % filtered.length);
  const next = () => setCurrentSlide((p) => (p + 1) % filtered.length);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
    touchStartX.current = null;
  };

  return (
    <section className="py-10 sm:py-14 md:py-20 bg-gradient-to-br from-teal-50 to-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-teal-900 mb-3">
            Track Your Concerns Now
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-700 max-w-xl mx-auto">
            Monitor your reports, see actions taken, and join community
            conversations
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap gap-2 sm:gap-3 justify-center mb-7 sm:mb-10">
          {FILTERS.map((status) => (
            <Button
              key={status}
              onClick={() => setFilter(status)}
              size="sm"
              className={`px-4 py-1.5 rounded-full font-medium transition text-xs sm:text-sm ${
                filter === status
                  ? "bg-yellow-400 text-teal-900 hover:bg-yellow-500 shadow"
                  : "bg-white text-gray-700 border-2 border-gray-200 hover:border-teal-600 shadow-sm"
              }`}
            >
              {status === "all"
                ? "All"
                : status === "inProgress"
                  ? "In Progress"
                  : status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>

        {/* Carousel */}
        <div className="mb-8 sm:mb-12">
          {isLoading && <CarouselSkeleton />}

          {isError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <p className="text-red-600 font-semibold text-sm">
                Failed to load concerns.
              </p>
            </div>
          )}

          {!isLoading && !isError && filtered.length === 0 && (
            <div className="bg-white rounded-xl shadow p-10 text-center">
              <p className="text-gray-500 text-sm sm:text-base">
                No concerns found for this filter.
              </p>
            </div>
          )}

          {!isLoading && !isError && filtered.length > 0 && (
            <div
              className="relative overflow-hidden rounded-xl"
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              {/* Track */}
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {filtered.map((concern) => {
                  const cfg = getConfig(concern.status);
                  const latestUpdate = concern.updates[0] ?? null;

                  return (
                    <div
                      key={concern.id}
                      // FIX: min-w-full keeps each slide full width;
                      // no fixed height — let content determine height naturally
                      className={`min-w-full bg-white shadow-lg border-l-4 ${cfg.leftBorder}`}
                    >
                      <div className="p-4 sm:p-6 md:p-8">
                        {/* Title + badges */}
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3 mb-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base sm:text-xl md:text-2xl font-bold text-gray-900 mb-1.5 leading-snug">
                              {concern.title ?? "Untitled Concern"}
                            </h3>
                            <p className="text-gray-600 text-sm line-clamp-2">
                              {concern.details}
                            </p>
                          </div>
                          {/* Badges: row on mobile, col on sm+ */}
                          <div className="flex flex-row sm:flex-col items-start sm:items-end gap-2 flex-wrap">
                            {concern.category && (
                              <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-200 text-xs">
                                {concern.category.name}
                              </Badge>
                            )}
                            <Badge className={`text-xs ${cfg.badge}`}>
                              {cfg.label}
                            </Badge>
                          </div>
                        </div>

                        <p className="text-xs text-gray-400 mb-4">
                          Submitted: {formatDate(concern.issuedAt)}
                          {concern.location && ` · 📍 ${concern.location}`}
                        </p>

                        {/* Latest update */}
                        {latestUpdate && concern.status !== "pending" && (
                          <div
                            className={`border-l-4 ${cfg.noticeBorder} ${cfg.noticeBg} p-3 sm:p-4 rounded mb-4`}
                          >
                            <h4
                              className={`font-semibold ${cfg.noticeText} mb-1 text-xs sm:text-sm`}
                            >
                              Latest Update
                            </h4>
                            <p
                              className={`${cfg.noticeText} text-xs sm:text-sm`}
                            >
                              {latestUpdate.updateMessage}
                            </p>
                          </div>
                        )}

                        {/* Pending notice */}
                        {concern.status === "pending" && (
                          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 sm:p-4 rounded mb-4">
                            <h4 className="font-semibold text-yellow-900 mb-1 text-xs sm:text-sm">
                              Status
                            </h4>
                            <p className="text-yellow-800 text-xs sm:text-sm">
                              This concern is awaiting review from the Barangay
                              Official.
                            </p>
                          </div>
                        )}

                        {/* View full link */}
                        <Link
                          href={`/concern/${concern.id}`}
                          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold
                                     text-teal-600 hover:text-teal-800 transition group"
                        >
                          View full details
                          <span className="group-hover:translate-x-0.5 transition-transform">
                            →
                          </span>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Prev / Next */}
              {filtered.length > 1 && (
                <>
                  <button
                    onClick={prev}
                    className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2
                               bg-white/90 hover:bg-white text-teal-700 p-1.5 sm:p-2
                               rounded-full shadow-lg transition z-10"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={next}
                    className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2
                               bg-white/90 hover:bg-white text-teal-700 p-1.5 sm:p-2
                               rounded-full shadow-lg transition z-10"
                    aria-label="Next slide"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}

              {/* Dot indicators */}
              {filtered.length > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  {filtered.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentSlide(i)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        i === currentSlide
                          ? "bg-teal-700 w-5"
                          : "bg-teal-300 w-2"
                      }`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
