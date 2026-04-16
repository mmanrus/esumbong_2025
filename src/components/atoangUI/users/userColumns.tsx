"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Eye, CheckCircle2, Clock } from "lucide-react";
import clsx from "clsx";
import UserDetailsDialog from "./userDetails";
import React from "react";

export type User = {
  id: number;
  fullname: string;
  email: string;
  contactNumber: string;
  type: string;
  isActive: boolean;
  isVerified: boolean;
};

// ─── Reusable verified badge ──────────────────────────────────────────────────

export function VerifiedBadge({ isVerified }: { isVerified: boolean }) {
  if (isVerified) {
    return (
      <span
        className="inline-flex items-center gap-1 text-xs font-medium
                       text-emerald-700 bg-emerald-50 border border-emerald-200
                       px-2 py-0.5 rounded-full whitespace-nowrap"
      >
        <CheckCircle2 className="w-3 h-3" />
        Verified
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-medium
                     text-amber-700 bg-amber-50 border border-amber-200
                     px-2 py-0.5 rounded-full whitespace-nowrap"
    >
      <Clock className="w-3 h-3" />
      Unverified
    </span>
  );
}

// ─── Columns ──────────────────────────────────────────────────────────────────

export const userColumns = ({
  setUsers,
}: {
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}): ColumnDef<User>[] => [
  {
    accessorKey: "fullname",
    header: "Fullname",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <p
          className={clsx(
            user.isActive === false && "text-red-500",
            "font-medium truncate max-w-[160px]",
          )}
        >
          {user.fullname}
        </p>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <p
          className={clsx(
            user.isActive === false && "text-red-500",
            "truncate max-w-[180px] text-sm",
          )}
        >
          {user.email}
        </p>
      );
    },
  },
  {
    // Replaced contactNumber with isVerified
    accessorKey: "isVerified",
    header: "Status",
    cell: ({ row }) => (
      <VerifiedBadge isVerified={row.getValue("isVerified") as boolean} />
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const val = row.getValue("type") as string;
      return (
        <span className="capitalize text-sm">
          {val === "barangay_official" ? "Official" : val}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right pr-4">Actions</div>,
    cell: ({ row }) => {
      const user = row.original;
      const [open, setOpen] = React.useState(false);

      return (
        <div className="flex justify-end pr-2">
          <UserDetailsDialog
            open={open}
            onOpenChange={setOpen}
            user={user}
            onDelete={(id: number) => {
              setUsers((prev) => prev.filter((u) => u.id !== id));
              setOpen(false);
            }}
            onUpdate={(updatedUser) => {
              setUsers((prev) =>
                prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)),
              );
            }}
          >
            <Button
              size="sm"
              onClick={() => setOpen(true)}
              className="h-7 px-2 text-xs gap-1"
            >
              <Eye className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">View</span>
            </Button>
          </UserDetailsDialog>
        </div>
      );
    },
  },
];
