"use client";

import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/formatDate";
import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { redirect } from "next/navigation";
import { ArrowUpDown } from "lucide-react";

export type Feedback = {
  id: number;
  title: string;
  issuedAt: string;
};

export const columns: ColumnDef<Feedback>[] = [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "title",
    header: "Subject",
  },
  {
    accessorKey: "issuedAt",
    header: ({ column }) => {
      return (
        <div className="flex justify-end">
          <Button
            variant={"ghost"}
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="text-right font-medium">
          {formatDate(new Date(row.getValue("issuedAt")))}
        </div>
      );
    },
  },
  {
    accessorKey: "actions",
    id: "actions",
    header: ({}) => {
      return (
        <div className="flex justify-end pr-5">
          <span>View</span>
        </div>
      );
    },
    cell: ({ row }) => {
      const feedback = row.original;
      return (
        <div className="flex justify-end  pr-5">
          <Button
            onClick={() => redirect(`/feedback/${feedback.id}`)}
            className="flex items-center"
          >
            <Eye className="inline mr-1" />
            View Feedback
          </Button>
        </div>
      );
    },
  },
];
