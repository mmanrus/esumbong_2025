"use client";
import { useAuth } from "@/contexts/authContext";
import { fetcher } from "@/lib/swrFetcher";
import useSWR from "swr";
import { DataTable } from "./data-table";
import { Feedback, columns } from "./columns";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function AllFeedbackPage({ isSpam }: { isSpam?: boolean }) {
  const { user } = useAuth();
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [feedbacks, setFeedback] = useState<Feedback[]>([]);
  const [shouldAdvancePage, setShouldAdvancePage] = useState(false); // ✅

  const { data, error, isLoading } = useSWR(
    `/api/feedback?me=${user?.type === "resident" ? "true" : "false"}${isSpam ? "&spam=true" : ""}`,
    fetcher,
  );

  useEffect(() => {
    if (!data) return;
    setFeedback(data.data ?? []);
    setNextCursor(data.nextCursor ?? null);
    setHasNextPage(data.hasNextPage ?? false);
  }, [data]);

  const loadMore = async () => { // ✅ no goToNextPage param needed anymore
    if (!nextCursor || isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      const res = await fetch(
        `/api/feedback?me=${user?.type === "resident" ? "true" : "false"}${isSpam ? "&spam=true" : ""}&cursor=${nextCursor}`,
      );
      const newData = await res.json();
      setFeedback((prev) => [...prev, ...(newData.data ?? [])]);
      setNextCursor(newData.nextCursor ?? null);
      setHasNextPage(newData.hasNextPage ?? false);
      setShouldAdvancePage(true); // ✅ signal DataTable to advance after re-render
    } catch {
      toast.error("Failed to load more feedback.");
    } finally {
      setIsLoadingMore(false);
    }
  };

  if (error) {
    toast.error("Failed to load feedbacks.");
    return null;
  }

  return (
    <div className="flex flex-col flex-1 h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-[#1F4251]">
            View {isSpam ? "Spam " : ""}Feedback
          </h2>
          <p className="text-sm text-gray-600">
            Review all submitted {isSpam ? "spam " : ""}feedback. Click{" "}
            <strong>View</strong> to read the full details.
          </p>
        </div>
      </div>
      <div className="flex flex-1">
        <DataTable
          loadMore={loadMore}
          isLoadingMore={isLoadingMore}
          hasNextPage={hasNextPage}
          columns={columns}
          isLoading={isLoading}
          data={feedbacks}
          shouldAdvancePage={shouldAdvancePage}          // ✅
          onPageAdvanced={() => setShouldAdvancePage(false)} // ✅ reset after advancing
        />
      </div>
    </div>
  );
}