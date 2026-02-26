"use client";

import { formatDate } from "@/lib/formatDate";
import { ColumnDef } from "@tanstack/react-table";

export type Announcement = {
  id: number;
  title: string;
  createdAt: Date;
};

export const columns: ColumnDef<Announcement>[] = [
  {
    accessorKey: "title",
    header: () => <div className="text-center">Announcement</div>,
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium">
          {row.getValue("title")}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: () => <div className="text-center">Date</div>,
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium">
          {formatDate(row.getValue("createdAt"))}
        </div>
      );
    },
  },
];
{
  /*
    id: "actions",
    cell: ({ row }) => {
      const announcement = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              <span className="sr-only">Open Menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(String(announcement.id))
              }
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => redirect(`/announcements/${announcement.id}`)}
            >
              View Annoucement
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  */
}
