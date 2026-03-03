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
}

export function UserDataTable<TData>({
  isLoading,
  columns,
  data,
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
  });

  const { pageIndex, pageSize } = table.getState().pagination;
  const totalRows = table.getFilteredRowModel().rows.length;
  const startIndex = pageIndex * pageSize + 1;
  const endIndex = Math.min((pageIndex + 1) * pageSize, totalRows);

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm">
        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50 border-b border-gray-200">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-gray-50">
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-b border-gray-100">
                    {columns.map((col, idx) => (
                      <TableCell key={idx} className="px-4 py-3">
                        <Skeleton className="h-8 bg-gray-200 rounded animate-pulse" />
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
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="text-center py-8 text-gray-500"
                  >
                    No Users Found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile View - Card Layout */}
        <div className="md:hidden">
          {isLoading ? (
            <div className="space-y-3 p-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="border rounded-lg p-4 space-y-2">
                  <Skeleton className="h-6 bg-gray-200 rounded animate-pulse" />
                  <Skeleton className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                </div>
              ))}
            </div>
          ) : table.getRowModel().rows?.length ? (
            <div className="space-y-2 p-4">
              {table.getRowModel().rows.map((row) => (
                <div
                  key={row.id}
                  className="border border-gray-200 rounded-lg p-4 bg-white hover:bg-gray-50 transition-colors"
                >
                  {row.getVisibleCells().map((cell, idx) => {
                    const header =
                      table.getHeaderGroups()[0]?.headers[cell.columnIndex];
                    return (
                      <div
                        key={cell.id}
                        className={`flex justify-between items-start gap-2 ${
                          idx !== row.getVisibleCells().length - 1
                            ? "mb-2 pb-2 border-b border-gray-100"
                            : ""
                        }`}
                      >
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide w-24 flex-shrink-0">
                          {header?.column.columnDef.header}
                        </span>
                        <span className="text-sm text-gray-700 flex-1 text-right">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 p-4">
              No Users Found
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {!isLoading && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-600">
            Showing {totalRows > 0 ? startIndex : 0} to {endIndex} of{" "}
            {totalRows} users
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Previous</span>
            </Button>
            <div className="flex items-center px-3 py-2 text-sm text-gray-700 bg-gray-50 rounded border border-gray-200">
              Page {pageIndex + 1} of {table.getPageCount()}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="flex items-center gap-1"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
