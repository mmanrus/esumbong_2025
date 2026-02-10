"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { CategoryDialogView } from "./categoryDialog";
import { KeyedMutator } from "swr";

export type Category = {
  id: number;
  name: string;
  description: string;
};

export const columns = ({
  mutate,
}: {
  mutate: KeyedMutator<{ categories: Category[] }>;
}): ColumnDef<Category>[] => [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return (
        <p className="text-left truncate max-w-[125px] md:max-w-[275px]  font-medium">
          {row.getValue("name")}
        </p>
      );
    },
  },
  {
    accessorKey: "description",
    header: ({}) => {
      return (
        <div className="flex justify-center pr-5">
          <span>Description</span>
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <p className="text-right truncate max-w-[125px] md:max-w-[225px] lg:max-w-[300px]">
          {row.getValue("description")}
        </p>
      );
    },
  },
  {
    accessorKey: "view",
    id: "view",
    header: ({}) => {
      return (
        <div className="flex justify-end pr-5">
          <span>View</span>
        </div>
      );
    },
    cell: ({ row }) => {
      const category = row.original;
      return (
        <div className="flex justify-end  pr-5">
          <CategoryDialogView
            mutate={mutate}
            category={category}
            triggerButton={
              <Button className="flex items-center text-sm sm:text-base px-2 sm:px-4 py-1 sm:py-2">
                <Eye className="inline mr-1 h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">View</span>
              </Button>
            }
          />
        </div>
      );
    },
  },
];
