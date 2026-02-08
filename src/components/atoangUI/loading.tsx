
        // components/skeletons/ReportsPageSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingPageTSX() {
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-80" />
        </div>

        <div className="flex flex-col gap-2 items-end md:flex-row md:items-center md:space-x-3">
          <Skeleton className="h-10 w-[180px]" />
          <Skeleton className="h-10 w-28" />
        </div>
      </div>

      {/* Report Content */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />

        {/* Fake chart area */}
        <div className="mt-6 space-y-3">
          <Skeleton className="h-40 w-full rounded-lg" />
        </div>
      </div>
    </>
  );
}
