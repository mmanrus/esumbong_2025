// components/atoangUI/users/userDataTable.tsx
"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  SortingState,
  getSortedRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DataTableProps<TData> {
  isLoading: boolean;
  columns: ColumnDef<TData>[];
  data: TData[];
  // Load-more props (optional — gracefully ignored if not passed)
  hasNextPage?: boolean;
  isLoadingMore?: boolean;
  onLoadMore?: () => void;
  totalLoaded?: number;
}

export function UserDataTable<TData>({
  isLoading,
  columns,
  data,
  hasNextPage = false,
  isLoadingMore = false,
  onLoadMore,
  totalLoaded,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
    initialState: { pagination: { pageSize: 10 } },
  });

  const { pageIndex, pageSize } = table.getState().pagination;
  const totalRows = table.getFilteredRowModel().rows.length;
  const startIndex = pageIndex * pageSize + 1;
  const endIndex = Math.min((pageIndex + 1) * pageSize, totalRows);

  return (
    <div className="flex flex-col gap-3 sm:gap-4 h-full">
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
        {/* ── Desktop table ── */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50 border-b border-gray-200">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-gray-50">
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="px-4 py-3 text-left text-xs font-semibold
                                 text-gray-600 uppercase tracking-wide"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={i} className="border-b border-gray-100">
                    {columns.map((_, idx) => (
                      <TableCell key={idx} className="px-4 py-3">
                        <Skeleton className="h-7 bg-gray-100 rounded animate-pulse" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="px-4 py-3 text-sm text-gray-700"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="text-center py-10 text-gray-400 text-sm"
                  >
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* ── Mobile card list ── */}
        <div className="md:hidden">
          {isLoading ? (
            <div className="space-y-2 p-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="border rounded-xl p-3 space-y-2 animate-pulse"
                >
                  <Skeleton className="h-4 bg-gray-200 rounded w-3/4" />
                  <Skeleton className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : table.getRowModel().rows?.length ? (
            <div className="space-y-2 p-3">
              {table.getRowModel().rows.map((row) => (
                <div
                  key={row.id}
                  className="border border-gray-200 rounded-xl p-3 bg-white
                             hover:bg-gray-50 transition-colors"
                >
                  {row.getVisibleCells().map((cell, idx) => {
                    const headerLabel =
                      typeof cell.column.columnDef.header === "string"
                        ? cell.column.columnDef.header
                        : cell.column.id;

                    // Hide "Actions" label row — render it full-width at the bottom
                    const isActions = cell.column.id === "actions";

                    if (isActions) {
                      return (
                        <div key={cell.id} className="mt-3 flex justify-end">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </div>
                      );
                    }

                    return (
                      <div
                        key={cell.id}
                        className="flex justify-between items-center gap-2 py-1.5
                                   border-b border-gray-100 last:border-0"
                      >
                        <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide w-20 flex-shrink-0">
                          {headerLabel}
                        </span>
                        <span className="text-xs text-gray-700 flex-1 text-right min-w-0">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-400 text-sm">
              No users found
            </div>
          )}
        </div>
      </div>

      {/* ── Pagination + Load More ── */}
      {!isLoading && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Count info */}
          <div className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
            Showing {totalRows > 0 ? startIndex : 0}–{endIndex} of {totalRows}
            {totalLoaded !== undefined && hasNextPage && (
              <span className="text-gray-400"> ({totalLoaded} loaded)</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Prev / Next for local pagination */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="h-7 sm:h-8 px-2 sm:px-3 text-xs"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline ml-1">Prev</span>
            </Button>

            <div
              className="flex items-center px-2.5 py-1 text-xs text-gray-600
                            bg-gray-50 rounded border border-gray-200 whitespace-nowrap"
            >
              {pageIndex + 1} / {table.getPageCount() || 1}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="h-7 sm:h-8 px-2 sm:px-3 text-xs"
            >
              <span className="hidden sm:inline mr-1">Next</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>

            {/* Load More — fetches next 20 from backend */}
            {hasNextPage && onLoadMore && (
              <Button
                variant="outline"
                size="sm"
                onClick={onLoadMore}
                disabled={isLoadingMore}
                className="h-7 sm:h-8 px-3 text-xs border-teal-300 text-teal-700
                           hover:bg-teal-50 hover:text-teal-800"
              >
                {isLoadingMore ? "Loading..." : "Load More"}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
