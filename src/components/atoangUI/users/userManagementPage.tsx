"use client";

import OpenAddUserDialog from "./addUserDialog";
import { userColumns } from "./userColumns";
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
import { useEffect, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

export function UserManagePage() {
  const [type, setType] = useState("all");
  const [input, setInput] = useState("");
  const [users, setUsers] = useState<any>(null);
  const [openAddUser, setOpenAddUser] = useState(false);
  const [query, setQuery] = useState({
    search: "",
    type: "",
  });
  const { data, error, isLoading, mutate } = useSWR(
    `/api/users/getAll?search=${query.search}&type=${query.type}`,
    fetcher,
  );
  useEffect(() => {
    if (!data) return;
    setUsers(data);
  }, [data]);
  if (isLoading) return <p>Loading</p>;

  if (error) {
    toast.error("Failed to load user data.");
    notFound();
  }
  const filteredUsers = users?.filter((u: any) => {
    const search = input.toLowerCase();
    if (type !== "all" && u.type !== type) {
      return false;
    }

    // SEARCH FILTER (optional)
    if (!search) return true;
    return (
      u?.id.toString().includes(search) ||
      u?.fullname.toLowerCase().includes(search) ||
      u?.email.toLowerCase().includes(search) ||
      u?.type.toLowerCase().includes(search) ||
      u?.contactNumber.toLowerCase().includes(search)
    );
  });

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-[#1F4251]">Users</h2>
          <p className="text-sm text-gray-600">
            Manage user accounts and permissions.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Input
            placeholder="Search case..."
            className="border p-2 rounded-md"
            onChange={(e) => setInput(e.target.value)}
            value={input}
          />

          <Select defaultValue="all" onValueChange={setType} value={type}>
            <SelectTrigger className="w-[180px] cursor-pointer">
              <SelectValue placeholder="Report type" />
            </SelectTrigger>
            <SelectContent className="cursor-pointer">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="barangay_official">
                Barangay Officials
              </SelectItem>
              <SelectItem value="resident">Residents</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={() =>
              setQuery({
                search: input,
                type: type === "all" ? "" : type,
              })
            }
            className="px-4 py-2 bg-green-600 rounded cursor-pointer hover:bg-gray-300"
          >
            Search
          </Button>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={(openAddUser) => setOpenAddUser(!!openAddUser)}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 cursor-pointer"
          >
            Add User
          </Button>
        </div>
      </div>

      <UserDataTable
        isLoading={isLoading}
        columns={userColumns({ setUsers })}
        data={filteredUsers ?? []}
      />
      <OpenAddUserDialog
        open={openAddUser}
        mutate={mutate}
        setOpen={setOpenAddUser}
      />
    </>
  );
}
