"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import Link from "next/link";
import Header from "@/components/atoangUI/headers";

// ─── Types ────────────────────────────────────────────────────────────────────

type Announcement = {
  id: number;
  title: string;
  content: string;
  notifyResidents: boolean;
  notifyOfficials: boolean;
  createdAt: string;
  updatedAt: string | null;
};

type AnnouncementsPage = {
  data: Announcement[];
  nextCursor: number | null;
  hasNextPage: boolean;
};
import HotlinePanel from "@/components/hotlinePanel"; // your updated component
import { useEffect, useState } from "react";
import { getAnnouncementPreview } from "@/lib/announcementPreview";
// ─── Fetcher ──────────────────────────────────────────────────────────────────

async function fetchAnnouncements(
  pageParam: unknown,
): Promise<AnnouncementsPage> {
  const cursor = typeof pageParam === "number" ? pageParam : undefined;
  const params = new URLSearchParams();
  if (cursor !== undefined) params.set("cursor", String(cursor));

  const res = await fetch(`/api/announcement?${params.toString()}`, {
    method: "GET",
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.error || "Failed to fetch announcements");
  }
  return res.json();
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "").trim();
}

// ─── Static Data ──────────────────────────────────────────────────────────────

const hotlines = [
  { name: "Emergency Hotline", number: "911", available: "24/7" },
  {
    name: "Barangay Office",
    number: "(555) 123-4567",
    available: "9 AM - 5 PM",
  },
  { name: "Fire Department", number: "(555) 234-5678", available: "24/7" },
  { name: "Police Station", number: "(555) 345-6789", available: "24/7" },
  { name: "Medical Emergency", number: "(555) 456-7890", available: "24/7" },
  { name: "Disaster Management", number: "(555) 567-8901", available: "24/7" },
];

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function AnnouncementSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow p-5 sm:p-6 border-l-4 border-gray-200 animate-pulse">
      <div className="h-5 bg-gray-200 rounded w-2/3 mb-3" />
      <div className="h-4 bg-gray-200 rounded w-full mb-2" />
      <div className="h-4 bg-gray-200 rounded w-4/5 mb-4" />
      <div className="h-3 bg-gray-200 rounded w-1/4" />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EmergencyPage() {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<AnnouncementsPage, Error>({
    queryKey: ["announcements"],
    // TanStack Query v5: queryFn receives full context — pageParam is typed `unknown`
    queryFn: ({ pageParam }) => fetchAnnouncements(pageParam),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? (lastPage.nextCursor ?? undefined) : undefined,
  });
  const [barangayId, setBarangayId] = useState<number | null>(null);
  const [barangayName, setBarangayName] = useState<string | null>(null);

  useEffect(() => {
    // Read the last logged-in barangay from localStorage
    const stored = localStorage.getItem("lastBarangayId");
    const storedName = localStorage.getItem("lastBarangayName");
    if (stored) setBarangayId(parseInt(stored));
    if (storedName) setBarangayName(storedName);
  }, []);
  const announcements = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <section className="py-8 sm:py-12 px-4 sm:px-6 md:px-8">
        <div className="max-w-6xl mx-auto">
          {/* ── Page Title ── */}
          <div className="mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Emergency &amp; Announcements
            </h1>
            {barangayName && (
              <p className="text-sm text-teal-600 font-medium">
                📍 Showing hotlines for {barangayName}
              </p>
            )}
            {!barangayName && (
              <p className="text-sm text-gray-400">
                Log in to see your barangay's emergency hotlines.
              </p>
            )}
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl">
              Stay informed with critical updates and emergency contact
              information for your community.
            </p>
          </div>

          {/* ── Layout ── */}
          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 lg:gap-8">
            {/* ── Announcements List ── */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-5">
              {/* Loading skeletons */}
              {isLoading && (
                <>
                  <AnnouncementSkeleton />
                  <AnnouncementSkeleton />
                  <AnnouncementSkeleton />
                  <AnnouncementSkeleton />
                </>
              )}

              {/* Error state */}
              {isError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                  <p className="text-red-700 font-semibold text-sm sm:text-base">
                    {error?.message || "Failed to load announcements."}
                  </p>
                </div>
              )}

              {/* Empty state */}
              {!isLoading && !isError && announcements.length === 0 && (
                <div className="bg-white rounded-xl shadow p-10 sm:p-12 text-center">
                  <p className="text-gray-400 text-base sm:text-lg">
                    No announcements at this time.
                  </p>
                </div>
              )}

              {/* Announcement cards */}
              {announcements.map((announcement) => {
                const { text, imageUrl } = getAnnouncementPreview(
                  announcement.content,
                );
                return (
                  <Link
                    key={announcement.id}
                    href={`/announcement/${announcement.id}`}
                    className="block bg-white rounded-xl shadow p-5 sm:p-6 border-l-4 border-teal-500
                 hover:shadow-lg hover:border-teal-600 transition-all duration-200 group"
                  >
                    <div className="flex items-start gap-4">
                      {/* Left: text content */}
                      <div className="flex-1 min-w-0">
                        <h3
                          className="text-base sm:text-lg font-bold text-gray-900
                         group-hover:text-teal-700 transition-colors mb-1.5 line-clamp-1"
                        >
                          {announcement.title}
                        </h3>

                        <p className="text-gray-500 text-sm mb-3 line-clamp-2 leading-relaxed">
                          {text}
                        </p>

                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs text-gray-400">
                            📅 {formatDate(announcement.createdAt)}
                          </span>
                          {announcement.notifyResidents && (
                            <span
                              className="text-xs font-semibold px-2.5 py-0.5 rounded-full
                               bg-teal-100 text-teal-700 border border-teal-200"
                            >
                              👥 Residents
                            </span>
                          )}
                          {announcement.notifyOfficials && (
                            <span
                              className="text-xs font-semibold px-2.5 py-0.5 rounded-full
                               bg-blue-100 text-blue-700 border border-blue-200"
                            >
                              🏛️ Officials
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right: image thumbnail */}
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt="preview"
                          className="w-20 h-20 object-cover rounded-lg shrink-0"
                        />
                      ) : (
                        // placeholder so cards without images stay aligned
                        <div className="w-20 h-20 rounded-lg shrink-0 bg-gray-100 flex items-center justify-center">
                          <span className="text-2xl">📢</span>
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}

              {/* Next-page skeletons while fetching */}
              {isFetchingNextPage && (
                <>
                  <AnnouncementSkeleton />
                  <AnnouncementSkeleton />
                </>
              )}

              {/* Load More button */}
              {hasNextPage && !isFetchingNextPage && (
                <div className="flex justify-center pt-2">
                  <button
                    onClick={() => fetchNextPage()}
                    className="w-full sm:w-auto px-8 py-3 bg-teal-600 text-white font-semibold
                               rounded-full hover:bg-teal-700 active:scale-95 transition-all
                               duration-200 shadow-md hover:shadow-lg text-sm sm:text-base"
                  >
                    Load More
                  </button>
                </div>
              )}

              {/* All loaded indicator */}
              {!isLoading && !hasNextPage && announcements.length > 0 && (
                <p className="text-center text-xs sm:text-sm text-gray-400 pt-2 pb-4">
                  ✓ You've seen all announcements
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
      <HotlinePanel barangayId={barangayId} />
    </main>
  );
}
