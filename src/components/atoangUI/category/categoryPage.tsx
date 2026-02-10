"use client";

import { useEffect, useState } from "react";
import { CategoryDialog } from "@/components/atoangUI/category/categoryForm";
import { CategoryDataTable } from "@/components/atoangUI/category/data-table";
import { Category, columns } from "./column";
import useSWR from "swr";
import { fetcher } from "@/lib/swrFetcher";
export default function CategoryPage() {
  const { data, error, isLoading, mutate } = useSWR(
    `/api/category/getAll`,
    fetcher,
  );
  const [category, setCategory] = useState<Category[] | []>([]);
  useEffect(() => {
    if (!data) return;
    setCategory(data.categories);
  }, [data]);
  return (
    <div className="flex flex-col flex-1 h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-[#1F4251]">
            Manage Categories
          </h2>
          <p className="text-sm text-gray-600">
            View and manage all concern categories. Click <strong>View</strong>{" "}
            to see details or <strong>Edit</strong> to update a category.
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Metadata: This page displays all categories used to classify user
            concerns. Each category helps organize and filter reports
            efficiently.
          </p>
        </div>
        <CategoryDialog mutate={mutate} />
      </div>

      <div className="flex flex-1">
        <CategoryDataTable
          columns={columns({ mutate })}
          data={category}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
