"use client";

import ViewConcernArchivesRows from "@/components/atoangUI/concern/concernArchivesRow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetcher } from "@/lib/swrFetcher";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

export default function Page() {
  const [query, setQuery] = useState({
    search: "",
    status: "",
  });

  const [status, setStatus] = useState("all");
  const [input, setInput] = useState("");
  const [concerns, setConcerns] = useState<any>(null);
  const filteredConcern = concerns?.filter((c: any) => {
    const search = input.toLowerCase();
    if (status !== "all" && c.validation !== status && c.status !== status) {
      return false;
    }

    // SEARCH FILTER (optional)
    if (!search) return true;
    return (
      c.id.toString().includes(search) ||
      c.user?.fullname.toLowerCase().includes(search) ||
      c.category?.name.toLowerCase().includes(search) ||
      c.details.toLowerCase().includes(search) ||
      c.title.toLowerCase().includes(search)
    );
  });
  const { data, error, isLoading, mutate } = useSWR(
    `/api/concern/getAll?search=${query.search}&status=${query.status}&archived=true`,
    fetcher
  );

  useEffect(() => {
    if (!data) return;
    setConcerns(data.data);
  }, [data]);
  if (isLoading) return <p>Loading</p>;

  if (error) {
    toast.error("Failed to load concern data.");
    notFound();
  }
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-[#1F4251]">Archives</h2>
          <p className="text-sm text-gray-600">
            Archived concerns and past mediation records.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search by case, name, plate..."
            className="border p-2 rounded-md cursor-text focus:ring-2 focus:ring-blue-400"
          />

          <Select defaultValue="all" onValueChange={setStatus} value={status}>
            <SelectTrigger className="w-[180px] cursor-pointer">
              <SelectValue placeholder="Report type" />
            </SelectTrigger>
            <SelectContent className="cursor-pointer">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="assigned">Assigned</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={() =>
              setQuery({
                search: input,
                status: status === "all" ? "" : status,
              })
            }
            className="px-4 py-2 bg-green-600 rounded cursor-pointer hover:bg-gray-300"
          >
            Search
          </Button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3">Case #</th>
              <th className="text-left px-4 py-3">Complainant</th>
              <th className="text-left px-4 py-3">Concern Type</th>
              <th className="text-left px-4 py-3">Archived On</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            <ViewConcernArchivesRows
              concerns={filteredConcern}
              onDelete={(id: number) =>
                setConcerns((prev: any) => prev.filter((c: any) => c.id !== id))
              }
            />
          </tbody>
        </table>
      </div>
    </>
  );
}
