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
  const { data, error, isLoading, mutate } = useSWR(
    `/api/feedback?me=${user?.type === "resident" ? "true" : "false"}${isSpam ? "&spam=true" : ""}`,
    fetcher,
  );
  const [feedbacks, setFeedback] = useState<Feedback[]>([]);
  useEffect(() => {
    if (!data) return;
    setFeedback(data.data);
  }, [data]);

  if (error) {
    toast.error("Failed to load feedbacks.");
    return;
  }

  return (
    <div className="flex flex-col flex-1 h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-[#1F4251]">
            View {isSpam ? "Spam " : undefined}Feedback
          </h2>
          <p className="text-sm text-gray-600">
            Review all submitted {isSpam ? "spam " : undefined}feedback. Click{" "}
            <strong>View</strong> to read the full details.
          </p>
        </div>
      </div>
      <div className="flex flex-1 ">
        <DataTable columns={columns} isLoading={isLoading} data={feedbacks} />
      </div>
    </div>
  );
}
