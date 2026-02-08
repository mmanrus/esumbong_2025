"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { DataTable } from "./data-table";
import useSWR from "swr";
import { Announcement, columns } from "./columns";
import { fetcher } from "@/lib/swrFetcher";
import { toast } from "sonner";
import { notFound } from "next/navigation";

export default function Page() {
  const [input, setInput] = useState("");
  const [query, setQuery] = useState({
    search: "",
  });
  const [announcement, setAnnouncements] = useState<Announcement[]>([]);

  const { data, error, isLoading, mutate } = useSWR(
    `/api/announcement/getAll?search=${query.search}`,
    fetcher,
  );
  useEffect(() => {
    if (!data) return;
    setAnnouncements(data.data);
  }, [data]);

  if (error) {
    toast.error("Failed to load announcements.");
    notFound();
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-[#1F4251]">
            View Announcements
          </h2>
          <p className="text-sm text-gray-600">
            Browse all published announcements. Click <strong>View</strong> to
            read the full details.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search by case, name, plate..."
            className="border p-2 rounded-md cursor-text focus:ring-2 focus:ring-blue-400"
          />
          <Button
            disabled={isLoading}
            onClick={() =>
              setQuery({
                search: input,
              })
            }
            className="px-4 py-2 bg-green-600 rounded cursor-pointer hover:bg-gray-300"
          >
            Search
          </Button>
        </div>
      </div>
      <div>
        <DataTable
          columns={columns}
          isLoading={isLoading}
          data={announcement}
        />
      </div>
    </>
  );
}
