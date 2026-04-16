"use client";

import OpenAddUserDialog from "./addUserDialog";
import { userColumns, User } from "./userColumns";
import { UserDataTable } from "./userDataTable";
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
import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import useSWR from "swr";
import { Search, UserPlus, Filter } from "lucide-react";

export function UserManagePage() {
  const [type, setType] = useState("all");
  const [input, setInput] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [openAddUser, setOpenAddUser] = useState(false);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [query, setQuery] = useState({ search: "", type: "" });

  const { data, error, isLoading, mutate } = useSWR(
    `/api/users/getAll?search=${query.search}&type=${query.type}`,
    fetcher,
  );

  useEffect(() => {
    if (!data) return;
    // Backend may return array directly or { data: [], nextCursor, hasNextPage }
    if (Array.isArray(data)) {
      setUsers(data);
      setNextCursor(null);
      setHasNextPage(false);
    } else {
      setUsers(data.data ?? data);
      setNextCursor(data.nextCursor ?? null);
      setHasNextPage(data.hasNextPage ?? false);
    }
  }, [data]);

  if (error) {
    toast.error("Failed to load user data.");
    notFound();
  }

  // Load more — append next page
  const loadMore = async () => {
    if (!nextCursor || isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      const res = await fetch(
        `/api/users/getAll?search=${query.search}&type=${query.type}&cursor=${nextCursor}`,
      );
      const newData = await res.json();
      const newUsers = Array.isArray(newData) ? newData : (newData.data ?? []);
      setUsers((prev) => [...prev, ...newUsers]);
      setNextCursor(newData.nextCursor ?? null);
      setHasNextPage(newData.hasNextPage ?? false);
    } catch {
      toast.error("Failed to load more users.");
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Client-side filter (on top of server search)
  const filteredUsers = useMemo(() => {
    return users.filter((u: any) => {
      const search = input.toLowerCase();

      if (type !== "all") {
        if (type === "true" || type === "false") {
          if (u.isVerified !== (type === "true")) return false;
        } else {
          if (u.type !== type) return false;
        }
      }

      if (!search) return true;
      return (
        u?.id.toString().includes(search) ||
        u?.fullname?.toLowerCase().includes(search) ||
        u?.email?.toLowerCase().includes(search) ||
        u?.type?.toLowerCase().includes(search) ||
        u?.contactNumber?.toLowerCase().includes(search)
      );
    });
  }, [users, input, type]);

  const handleSearch = () =>
    setQuery({ search: input, type: type === "all" ? "" : type });

  return (
    <div className="space-y-4 sm:space-y-5 pb-20 lg:pb-0">
      {/* ── Header ── */}
      <div className="flex flex-col gap-3">
        {/* Title row */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#1F4251]">
              Users
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
              Manage user accounts and permissions.
            </p>
          </div>

          {/* Add User — always visible */}
          <Button
            onClick={() => setOpenAddUser(true)}
            size="sm"
            className="bg-purple-600 hover:bg-purple-700 text-white gap-1.5
                       text-xs sm:text-sm h-8 sm:h-9 px-3 sm:px-4 flex-shrink-0"
          >
            <UserPlus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Add User</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>

        {/* Search + Filter row */}
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Search input */}
          <div className="relative flex-1">
            <Input
              placeholder="Search by name, email, type..."
              className="h-9 pr-3 text-sm"
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              value={input}
            />
          </div>

          {/* Type filter */}
          <Select defaultValue="all" onValueChange={setType} value={type}>
            <SelectTrigger className="w-full sm:w-44 h-9 text-sm">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="barangay_official">Officials</SelectItem>
              <SelectItem value="resident">Residents</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              {/* superAdmin is excluded server-side and never shown */}
              <SelectItem value="true">Verified</SelectItem>
              <SelectItem value="false">Unverified</SelectItem>
            </SelectContent>
          </Select>

          {/* Search button */}
          <Button
            onClick={handleSearch}
            size="sm"
            className="h-9 px-4 gap-1.5 bg-green-600 hover:bg-green-700 text-sm"
          >
            <Search className="h-3.5 w-3.5" />
            Search
          </Button>
        </div>
      </div>

      {/* ── Table ── */}
      <UserDataTable
        isLoading={isLoading}
        columns={userColumns({ setUsers })}
        data={filteredUsers}
        // Pass load-more props down to the table footer
        hasNextPage={hasNextPage}
        isLoadingMore={isLoadingMore}
        onLoadMore={loadMore}
        totalLoaded={users.length}
      />

      <OpenAddUserDialog
        open={openAddUser}
        mutate={mutate}
        setOpen={setOpenAddUser}
      />
    </div>
  );
}
