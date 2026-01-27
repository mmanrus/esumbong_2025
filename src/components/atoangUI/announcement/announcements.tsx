import { formatDate } from "@/lib/formatDate";
import { fetcher } from "@/lib/swrFetcher";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

export default function AnnouncementList({
  sidebar,
  search,
}: {
  sidebar: "true" | "false" | null;
  search?: string;
}) {
  const [announcement, setAnnouncements] = useState<any>(null);
  
  const { data, error, isLoading, mutate } = useSWR(
    `/api/announcement/getAll?search=${search}`,
    fetcher,
  );
  useEffect(() => {
    if (!data) return;
    setAnnouncements(data.data);
  }, [data]);
  if (isLoading) return <p>Loading...</p>;

  if (error) {
    toast.error("Failed to load announcements.");
    notFound();
  }

  
  if (!Array.isArray(announcement) || announcement.length === 0) {
    return (
      <a href="/announcements">
        <li className="bg-blue-50 border-l-4 border-blue-600 p-3 rounded">
          <p className="text-sm">
            <strong>No Announcement Available</strong>
          </p>
        </li>
      </a>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {announcement.map((a) => (
        <li
          key={a.id}
          className="bg-blue-50 border-l-4 border-blue-600 p-3 rounded flex flex-col gap-2"
        >
          <a className="text-sm" href={`/announcements/${a.id}`}>
            <strong>{a.title}</strong>
          </a>
          <span className="text-xs text-muted-foreground">
            {formatDate(a.createdAt)}
          </span>
        </li>
      ))}
    </div>
  );
}
