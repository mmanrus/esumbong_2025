"use client";

import { useParams, notFound } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Header from "@/components/atoangUI/headers";

// ─── Types ────────────────────────────────────────────────────────────────────

type MediaItem = { url: string; type: string; name: string | null };

type ConcernUpdate = {
  id: number;
  updateMessage: string;
  status: string;
  createdAt: string;
  media: MediaItem[];
};

type PublicConcern = {
  id: number;
  title: string | null;
  details: string;
  status: string;
  issuedAt: string;
  updatedAt: string | null;
  location: string | null;
  needsBarangayAssistance: boolean;
  other: string | null;
  category: { name: string } | null;
  updates: ConcernUpdate[];
  media: MediaItem[];
};

// ─── Fetcher ──────────────────────────────────────────────────────────────────

async function fetchPublicConcern(id: string): Promise<PublicConcern> {
  const res = await fetch(`/api/concern/public/${id}`);
  if (res.status === 404 || res.status === 403) throw new Error("NOT_FOUND");
  if (!res.ok) throw new Error("FETCH_ERROR");
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

const STATUS_CONFIG: Record<
  string,
  {
    label: string;
    bg: string;
    text: string;
    border: string;
    dot: string;
    borderBottom: string;
  }
> = {
  pending: {
    label: "Pending",
    bg: "bg-yellow-50",
    text: "text-yellow-800",
    border: "border-yellow-300",
    dot: "bg-yellow-400",
    borderBottom: "border-b-yellow-400",
  },
  inProgress: {
    label: "In Progress",
    bg: "bg-blue-50",
    text: "text-blue-800",
    border: "border-blue-300",
    dot: "bg-blue-500",
    borderBottom: "border-b-blue-400",
  },
  verified: {
    label: "Verified",
    bg: "bg-teal-50",
    text: "text-teal-800",
    border: "border-teal-300",
    dot: "bg-teal-500",
    borderBottom: "border-b-teal-400",
  },
  resolved: {
    label: "Resolved",
    bg: "bg-green-50",
    text: "text-green-800",
    border: "border-green-300",
    dot: "bg-green-500",
    borderBottom: "border-b-green-400",
  },
  canceled: {
    label: "Canceled",
    bg: "bg-gray-50",
    text: "text-gray-600",
    border: "border-gray-300",
    dot: "bg-gray-400",
    borderBottom: "border-b-gray-300",
  },
  rejected: {
    label: "Rejected",
    bg: "bg-red-50",
    text: "text-red-800",
    border: "border-red-300",
    dot: "bg-red-500",
    borderBottom: "border-b-red-400",
  },
  unresolved: {
    label: "Unresolved",
    bg: "bg-orange-50",
    text: "text-orange-800",
    border: "border-orange-300",
    dot: "bg-orange-500",
    borderBottom: "border-b-orange-400",
  },
  approved: {
    label: "Approved",
    bg: "bg-emerald-50",
    text: "text-emerald-800",
    border: "border-emerald-300",
    dot: "bg-emerald-500",
    borderBottom: "border-b-emerald-400",
  },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG["pending"];
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold
                      px-3 py-1 rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Header />
      <section className="py-8 sm:py-12 px-4 sm:px-6 md:px-8">
        <div className="max-w-3xl mx-auto animate-pulse space-y-5">
          <div className="h-4 bg-slate-200 rounded w-28" />
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <div className="h-8 bg-slate-200 mx-5 sm:mx-8 mt-5 rounded w-16" />
            <div className="px-5 sm:px-8 py-4 border-b-4 border-b-slate-200 space-y-2 mb-2">
              <div className="h-6 bg-slate-200 rounded w-3/4" />
              <div className="h-4 bg-slate-200 rounded w-1/2" />
            </div>
            <div className="px-5 sm:px-8 py-6 space-y-3">
              <div className="h-4 bg-slate-200 rounded w-full" />
              <div className="h-4 bg-slate-200 rounded w-5/6" />
              <div className="h-4 bg-slate-200 rounded w-2/3" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

// ─── Update Timeline ──────────────────────────────────────────────────────────

function UpdateItem({ update }: { update: ConcernUpdate }) {
  const cfg = STATUS_CONFIG[update.status] ?? STATUS_CONFIG["pending"];
  return (
    // FIX: increased pl-10 (was pl-8) so content clears the dot on 320px phones
    <div className="relative pl-10">
      {/* Vertical line */}
      <div className="absolute left-[14px] top-5 bottom-0 w-px bg-gray-200" />
      {/* Dot */}
      <div
        className={`absolute left-2.5 top-1.5 w-3.5 h-3.5 rounded-full
                       border-2 border-white shadow-sm ${cfg.dot}`}
      />

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-5">
        {/* Meta row — wraps gracefully on narrow screens */}
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 mb-2">
          <StatusBadge status={update.status} />
          <span className="text-xs text-gray-400 whitespace-nowrap">
            {formatDate(update.createdAt)}
          </span>
        </div>
        <p className="text-gray-700 text-sm leading-relaxed">
          {update.updateMessage}
        </p>

        {/* Update media */}
        {update.media.length > 0 && (
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {update.media.map((m, i) =>
              m.type === "photo" ? (
                <img
                  key={i}
                  src={m.url}
                  alt={m.name ?? `Update attachment ${i + 1}`}
                  className="w-full h-24 object-cover rounded-lg border border-gray-200"
                />
              ) : (
                <a
                  key={i}
                  href={m.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 p-2.5 bg-gray-50 rounded-lg border
                             border-gray-200 text-xs text-teal-600 hover:bg-teal-50 transition min-w-0"
                >
                  <span className="flex-shrink-0">📎</span>
                  {/* FIX: truncate prevents long filenames from overflowing */}
                  <span className="truncate">{m.name ?? "File"}</span>
                </a>
              ),
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PublicConcernPage() {
  const { id } = useParams<{ id: string }>();

  const {
    data: concern,
    isLoading,
    isError,
    error,
  } = useQuery<PublicConcern, Error>({
    queryKey: ["public-concern", id],
    queryFn: () => fetchPublicConcern(id),
    retry: false,
  });

  if (isError && error?.message === "NOT_FOUND") notFound();
  if (isLoading) return <Skeleton />;

  if (isError) {
    return (
      <main className="min-h-screen bg-slate-50">
        <Header />
        {/* FIX: min-h-[60vh] ensures vertical centering works */}
        <section className="min-h-[60vh] py-8 px-4 flex items-center justify-center">
          <div className="text-center max-w-xs sm:max-w-sm mx-auto">
            <p className="text-4xl mb-4">⚠️</p>
            <p className="text-gray-800 font-semibold mb-2">
              Failed to load concern
            </p>
            <p className="text-gray-500 text-sm mb-6">
              This concern may not be publicly available.
            </p>
            <Link
              href="/"
              className="text-teal-600 hover:text-teal-800 text-sm underline underline-offset-4 transition"
            >
              ← Back to Home
            </Link>
          </div>
        </section>
      </main>
    );
  }

  if (!concern) return null;

  const cfg = STATUS_CONFIG[concern.status] ?? STATUS_CONFIG["pending"];

  return (
    <main className="min-h-screen bg-slate-50">
      <Header />

      <section className="py-8 sm:py-12 px-4 sm:px-6 md:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Back */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-600
                       hover:text-teal-800 mb-5 sm:mb-6 transition group"
          >
            <span className="group-hover:-translate-x-0.5 transition-transform">
              ←
            </span>
            Back to Home
          </Link>

          {/* Read-only notice
              FIX: min-w-0 + flex-1 on text span prevents banner overflow on 320px */}
          <div
            className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg
                          px-3 sm:px-4 py-2.5 mb-5 sm:mb-6"
          >
            <span className="flex-shrink-0 text-sm">🔒</span>
            <p className="text-xs sm:text-sm text-amber-700 font-medium min-w-0 leading-snug">
              Public read-only view. Reporter identity is kept private.
            </p>
          </div>

          {/* Main card */}
          <article className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
            {/* Status band */}
            <div
              className={`px-5 sm:px-8 py-5 sm:py-6 border-b-4 ${cfg.borderBottom}
                             bg-gradient-to-r from-white to-slate-50`}
            >
              {/* Badges row */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <StatusBadge status={concern.status} />
                {concern.category && (
                  <span
                    className="text-xs font-semibold px-3 py-1 rounded-full
                                   bg-teal-100 text-teal-700 border border-teal-200"
                  >
                    {concern.category.name}
                  </span>
                )}
              </div>

              {/* Title — break-words prevents long titles from overflowing */}
              <h1
                className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900
                             leading-snug break-words mb-2"
              >
                {concern.title ?? "Untitled Concern"}
              </h1>

              {/* Meta — each item wraps independently */}
              <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  📅 {formatDate(concern.issuedAt)}
                </span>
                {concern.location && (
                  <span className="text-xs text-gray-500 min-w-0 truncate max-w-[200px] sm:max-w-none">
                    📍 {concern.location}
                  </span>
                )}
                {concern.needsBarangayAssistance && (
                  <span className="text-xs text-orange-600 font-semibold whitespace-nowrap">
                    ⚠️ Needs Barangay Assistance
                  </span>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="px-5 sm:px-8 py-5 sm:py-6 border-b border-gray-100">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
                Concern Details
              </h2>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base break-words">
                {concern.details}
              </p>
              {concern.other && (
                <p className="text-gray-500 text-sm mt-3 italic break-words">
                  Additional info: {concern.other}
                </p>
              )}
            </div>

            {/* Media attachments */}
            {concern.media.length > 0 && (
              <div className="px-5 sm:px-8 py-5 sm:py-6 border-b border-gray-100">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
                  Attachments
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                  {concern.media.map((m, i) =>
                    m.type === "photo" ? (
                      <img
                        key={i}
                        src={m.url}
                        alt={m.name ?? `Attachment ${i + 1}`}
                        className="w-full h-24 sm:h-32 object-cover rounded-lg
                                   border border-gray-200 shadow-sm"
                      />
                    ) : (
                      <a
                        key={i}
                        href={m.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 p-3 bg-gray-50 rounded-lg border
                                   border-gray-200 text-xs text-teal-600 hover:bg-teal-50
                                   transition min-w-0"
                      >
                        <span className="flex-shrink-0">📎</span>
                        {/* FIX: truncate prevents long filenames from overflowing the grid cell */}
                        <span className="truncate">{m.name ?? "File"}</span>
                      </a>
                    ),
                  )}
                </div>
              </div>
            )}

            {/* Updates timeline */}
            <div className="px-5 sm:px-8 py-5 sm:py-6">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-5">
                Updates from Barangay
              </h2>

              {concern.updates.length === 0 ? (
                <div
                  className="bg-gray-50 rounded-xl border border-dashed border-gray-300
                                p-6 text-center"
                >
                  <p className="text-gray-400 text-sm">
                    No updates posted yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {concern.updates.map((update) => (
                    <UpdateItem key={update.id} update={update} />
                  ))}
                </div>
              )}
            </div>
          </article>

          {/* CTA
              FIX: px-5 sm:px-8 instead of p-6 sm:p-8 so it matches card padding rhythm
              and doesn't clip on 320px phones */}
          <div
            className="mt-6 sm:mt-8 bg-teal-600 rounded-2xl px-5 sm:px-8 py-7 sm:py-8
                          text-center text-white shadow-lg"
          >
            <h3 className="text-lg sm:text-xl font-bold mb-2">
              Have a concern of your own?
            </h3>
            <p className="text-teal-100 text-sm mb-5 max-w-sm mx-auto">
              Register as a resident to submit concerns, track progress, and get
              updates from your barangay.
            </p>
            <Link
              href="/register"
              className="inline-block bg-white text-teal-700 font-semibold text-sm
                         px-6 py-2.5 rounded-full hover:bg-teal-50 active:scale-95
                         transition-all shadow"
            >
              Register Now
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
