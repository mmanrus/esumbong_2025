"use client";

import ContentPage from "../../officials/manageAnnouncements/RichTextViewer";
import { fetcher } from "@/lib/swrFetcher";
import { notFound, useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { formatDate } from "@/lib/formatDate";
import { Button } from "@/components/ui/button";

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [announcement, setAnnouncement] = useState<any>(null);
  const { data, error, isLoading, mutate } = useSWR(
    id ? `/api/announcement/${id}` : null,
    fetcher,
  );

  useEffect(() => {
    if (!data) return;
    setAnnouncement(data.data);
  }, [data, id]);

  useEffect(() => {
    if (error) {
      toast.error("Failed to load Announcement data.");
      notFound();
    }
  }, [error]);

  if (isLoading) {
    return <AnnouncementSkeleton />;
  }

  if (!announcement || !announcement.content) {
    return <AnnouncementSkeleton />;
  }

  // Parse content if it's a string
  const parsedContent =
    typeof announcement.content === "string"
      ? JSON.parse(announcement.content)
      : announcement.content;

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 hover:bg-stone-200/50 text-stone-700"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Announcements
        </Button>

        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-stone-200 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
            <h1 className="text-3xl font-bold text-white mb-3">
              {announcement.title}
            </h1>
            <div className="flex items-center gap-4 text-indigo-100 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(announcement.createdAt)}</span>
              </div>
              {announcement.author && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{announcement.author}</span>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-6">
            <ContentPage content={parsedContent} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Skeleton Loading Component
function AnnouncementSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Back Button Skeleton */}
        <div className="h-10 w-40 bg-stone-200 rounded-lg animate-pulse mb-4" />

        {/* Header Card Skeleton */}
        <div className="bg-white rounded-2xl shadow-lg border border-stone-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
            <div className="h-9 bg-indigo-400/30 rounded-lg w-3/4 mb-3 animate-pulse" />
            <div className="flex items-center gap-4">
              <div className="h-5 bg-indigo-400/30 rounded w-32 animate-pulse" />
              <div className="h-5 bg-indigo-400/30 rounded w-24 animate-pulse" />
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="px-8 py-6 space-y-6">
            {/* Paragraph skeleton */}
            <div className="space-y-3">
              <div className="h-4 bg-stone-200 rounded-lg w-full animate-pulse" />
              <div className="h-4 bg-stone-200 rounded-lg w-11/12 animate-pulse" />
              <div className="h-4 bg-stone-200 rounded-lg w-10/12 animate-pulse" />
              <div className="h-4 bg-stone-200 rounded-lg w-9/12 animate-pulse" />
            </div>

            {/* Image skeleton */}
            <div className="h-64 bg-stone-200 rounded-xl animate-pulse" />

            {/* More paragraph skeleton */}
            <div className="space-y-3">
              <div className="h-4 bg-stone-200 rounded-lg w-full animate-pulse" />
              <div className="h-4 bg-stone-200 rounded-lg w-10/12 animate-pulse" />
              <div className="h-4 bg-stone-200 rounded-lg w-11/12 animate-pulse" />
            </div>

            {/* Heading skeleton */}
            <div className="h-6 bg-stone-200 rounded-lg w-2/3 animate-pulse mt-6" />

            {/* List skeleton */}
            <div className="space-y-2 ml-4">
              <div className="h-4 bg-stone-200 rounded-lg w-11/12 animate-pulse" />
              <div className="h-4 bg-stone-200 rounded-lg w-10/12 animate-pulse" />
              <div className="h-4 bg-stone-200 rounded-lg w-9/12 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}