// components/atoangUI/users/userColumns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
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
};

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
            user.isActive === false && "text-red-600",
            "font-medium truncate max-w-[200px]",
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
            user.isActive === false && "text-red-600",
            "truncate max-w-[200px]",
          )}
        >
          {user.email}
        </p>
      );
    },
  },
  {
    accessorKey: "contactNumber",
    header: "Phone Number",
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      return (
        <span className="capitalize">{row.getValue("type") as string}</span>
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
      <div className="flex justify-end pr-4">
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
              prev.map((u) =>
                u.id === updatedUser.id ? updatedUser : u
              )
            );
          }}
        >
          <Button size="sm" onClick={() => setOpen(true)}>
            <Eye className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">View</span>
          </Button>
        </UserDetailsDialog>
      </div>
    );
  },
}
];
