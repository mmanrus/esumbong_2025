"use client";
import ViewConcernRows from "@/components/atoangUI/concern/concernRows";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetcher } from "@/lib/swrFetcher";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

export default function Page() {
  const [status, setStatus] = useState("all");
  const [input, setInput] = useState("");
  const [concerns, setConcerns] = useState<any>(null);
  const [query, setQuery] = useState({
    search: "",
    status: "",
  });
  const { data, error, isLoading, mutate } = useSWR(
    `/api/concern/getAll?search=${query.search}&status=${query.status}&archived=false&validation=true`,
    fetcher,
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

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-[#1F4251]">
            Generate Summons
          </h2>
          <p className="text-sm text-gray-600">
            Create summons documents for concerned parties.
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
        <div className="flex items-center space-x-3">
          <Input
            placeholder="Search case..."
            className="border p-2 rounded-md"
            onChange={(e) => setInput(e.target.value)}
            value={input}
          />
          <Button
            //onclick="openModal('generate','C-2025-002')"
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 cursor-pointer"
          >
            New Summons
          </Button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <table id="summonsTable" className="min-w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3">Case #</th>
              <th className="text-left px-4 py-3">Respondent</th>
              <th className="text-left px-4 py-3">Type</th>
              <th className="text-left px-4 py-3">Date Issued</th>
              <th className="text-left px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            <ViewConcernRows
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
