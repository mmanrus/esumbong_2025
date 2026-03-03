import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  showMobileView?: boolean;
}

export function TableSkeleton({
  rows = 5,
  columns = 4,
  showMobileView = true,
}: TableSkeletonProps) {
  return (
    <>
      {/* Desktop View Skeleton */}
      <div className="hidden md:block rounded-lg border border-gray-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {Array.from({ length: columns }).map((_, i) => (
                  <th key={i} className="px-4 py-3">
                    <Skeleton className="h-4 bg-gray-300 rounded w-3/4" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: rows }).map((_, rowIdx) => (
                <tr key={rowIdx} className="border-b border-gray-100 hover:bg-gray-50">
                  {Array.from({ length: columns }).map((_, colIdx) => (
                    <td key={colIdx} className="px-4 py-3">
                      <Skeleton className="h-4 bg-gray-200 rounded w-full" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile View Skeleton */}
      {showMobileView && (
        <div className="md:hidden space-y-3">
          {Array.from({ length: rows }).map((_, i) => (
            <Card key={i} className="border border-gray-200">
              <CardContent className="p-4 space-y-2">
                <Skeleton className="h-5 bg-gray-300 rounded w-2/3" />
                <Skeleton className="h-4 bg-gray-200 rounded w-full" />
                <Skeleton className="h-4 bg-gray-200 rounded w-full" />
                <Skeleton className="h-4 bg-gray-200 rounded w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
