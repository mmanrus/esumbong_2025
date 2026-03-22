"use client";

import { useParams, notFound } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
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
  userId: number;
};

// ─── Fetcher ──────────────────────────────────────────────────────────────────

async function fetchAnnouncement(id: string): Promise<Announcement> {
  const res = await fetch(`/api/announcement/${id}`);
  if (res.status === 404 || res.status === 403) {
    throw new Error("NOT_FOUND");
  }
  if (!res.ok) {
    throw new Error("FETCH_ERROR");
  }
  const json = await res.json();
  return json.data;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function DetailSkeleton() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <section className="py-8 sm:py-12 px-4 sm:px-6 md:px-8">
        <div className="max-w-3xl mx-auto animate-pulse">
          {/* Back link placeholder */}
          <div className="h-4 bg-gray-200 rounded w-32 mb-8" />
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Header band */}
            <div className="bg-gray-200 px-5 sm:px-8 py-6 space-y-3">
              <div className="h-7 bg-gray-300 rounded w-3/4" />
              <div className="h-4 bg-gray-300 rounded w-1/2" />
            </div>
            {/* Body */}
            <div className="px-5 sm:px-8 py-8 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
              <div className="h-4 bg-gray-200 rounded w-4/6" />
              <div className="h-4 bg-gray-200 rounded w-full mt-4" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AnnouncementDetailPage() {
  const { id } = useParams<{ id: string }>();

  const {
    data: announcement,
    isLoading,
    isError,
    error,
  } = useQuery<Announcement, Error>({
    queryKey: ["announcement", id],
    queryFn: () => fetchAnnouncement(id),
    retry: false,
  });

  if (isError && error?.message === "NOT_FOUND") notFound();
  if (isLoading) return <DetailSkeleton />;

  if (isError) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Header />
        {/* FIX: min-h added so vertical centering works on tall screens */}
        <section className="min-h-[60vh] py-8 sm:py-12 px-4 sm:px-6 flex items-center justify-center">
          <div className="text-center max-w-xs sm:max-w-sm mx-auto">
            <p className="text-4xl mb-4">⚠️</p>
            <p className="text-gray-800 font-semibold text-base sm:text-lg mb-2">
              Something went wrong
            </p>
            <p className="text-gray-500 text-sm mb-6">
              We couldn't load this announcement. Please try again later.
            </p>
            <Link
              href="/emergency"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-600
                         hover:text-teal-800 underline underline-offset-4 transition"
            >
              ← Back to Announcements
            </Link>
          </div>
        </section>
      </main>
    );
  }

  if (!announcement) return null;

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <section className="py-8 sm:py-12 px-4 sm:px-6 md:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Back link */}
          <Link
            href="/emergency"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-600
                       hover:text-teal-800 mb-6 sm:mb-8 transition group"
          >
            <span className="group-hover:-translate-x-0.5 transition-transform duration-150">
              ←
            </span>
            Back to Announcements
          </Link>

          {/* Card */}
          <article className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Header band */}
            <div className="bg-teal-600 px-5 sm:px-8 py-5 sm:py-7">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white leading-snug break-words">
                {announcement.title}
              </h1>

              {/* Dates: stacked on mobile, inline on sm+ */}
              <div className="mt-2 flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-1 sm:gap-3">
                <span className="text-teal-100 text-xs sm:text-sm">
                  📅 Posted {formatDate(announcement.createdAt)}
                </span>
                {announcement.updatedAt && (
                  <span className="text-teal-200 text-xs sm:text-sm opacity-80">
                    · Updated {formatDate(announcement.updatedAt)}
                  </span>
                )}
              </div>
            </div>

            {/* Body — Tiptap HTML content
                FIX: overflow-x-auto wrapper prevents wide tables/code blocks from
                breaking the layout on narrow screens */}
            <div className="px-5 sm:px-8 py-6 sm:py-8">
              <div className="overflow-x-auto">
                <div
                  className="prose prose-sm sm:prose prose-gray max-w-none
                             prose-headings:text-gray-900 prose-headings:font-bold
                             prose-headings:leading-snug
                             prose-p:leading-relaxed prose-p:text-gray-700
                             prose-a:text-teal-600 prose-a:no-underline hover:prose-a:underline
                             prose-img:rounded-lg prose-img:shadow-md prose-img:mx-auto
                             prose-blockquote:border-l-4 prose-blockquote:border-teal-400
                             prose-blockquote:text-gray-600 prose-blockquote:not-italic
                             prose-pre:overflow-x-auto prose-pre:text-xs sm:prose-pre:text-sm
                             prose-table:text-sm prose-th:text-left"
                  dangerouslySetInnerHTML={{ __html: announcement.content }}
                />
              </div>
            </div>

            {/* Footer badges */}
            <div className="px-5 sm:px-8 py-4 sm:py-5 border-t border-gray-100 flex flex-wrap gap-2">
              {announcement.notifyResidents && (
                <span
                  className="text-xs font-semibold px-3 py-1 rounded-full
                                 bg-teal-100 text-teal-700 border border-teal-200"
                >
                  👥 For Residents
                </span>
              )}
              {announcement.notifyOfficials && (
                <span
                  className="text-xs font-semibold px-3 py-1 rounded-full
                                 bg-blue-100 text-blue-700 border border-blue-200"
                >
                  🏛️ For Officials
                </span>
              )}
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
