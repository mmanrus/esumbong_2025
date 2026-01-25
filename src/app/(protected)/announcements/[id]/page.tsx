"use client";
import ContentPage from "@/components/read-only-editor";
import { useAuth } from "@/contexts/authContext";
import { fetcher } from "@/lib/swrFetcher";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [announcement, setAnnouncement] = useState<any>(null);
  const { data, error, isLoading, mutate } = useSWR(
    id ? `/api/announcement/${id}` : null,
    fetcher,
  );

  useEffect(() => {
    if (!data) return;
    setAnnouncement(data.data);
  }, [data, id]);

  if (isLoading) return <p>Loading...</p>;

  if (error) {
    toast.error("Failed to load Announcement data.");
    notFound();
  }
  if (!announcement?.notifyResidents && user?.type === "resident") {
    notFound();
  }
  if (!announcement?.notifyOfficials && user?.type === "official") {
    notFound();
  }

  return (
    <>
      <div>
        <h1>{announcement?.title}</h1>
        <div className="prose max-w-none">
          <ContentPage content={announcement?.content} />
        </div>
      </div>
    </>
  );
}
