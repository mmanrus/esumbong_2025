import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-muted ${className ?? ""}`}
    />
  );
}

export function LoadingConcernId() {
  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="space-y-4 pb-4 border-b border-gray-200">
        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-6 w-24 rounded" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-36 rounded-full" />
          <Skeleton className="h-8 w-24 rounded-md" />
          <Skeleton className="h-8 w-32 rounded-md ml-auto" />
        </div>

        {/* Title row */}
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <Skeleton className="h-8 w-2/3 rounded" />
          <Skeleton className="h-6 w-28 rounded-full" />
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-start gap-3">
            <Skeleton className="h-4 w-4 rounded shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3 w-20 rounded" />
              <Skeleton className="h-4 w-40 rounded" />
            </div>
          </div>
        ))}
      </div>

      <Separator />

      {/* Description */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 w-24 rounded" />
        </div>
        <div className="pl-6 space-y-2">
          <Skeleton className="h-3 w-full rounded" />
          <Skeleton className="h-3 w-5/6 rounded" />
          <Skeleton className="h-3 w-4/6 rounded" />
        </div>
      </div>

      <Separator />

      {/* Media Grid */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 w-36 rounded" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="aspect-video w-full rounded-lg" />
          ))}
        </div>
      </div>

      {/* Timeline Card */}
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-36 rounded" />
        </CardHeader>
        <CardContent className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex flex-col items-center">
                <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                {i < 2 && <Skeleton className="w-0.5 h-10 rounded mt-1" />}
              </div>
              <div className="flex-1 space-y-2 pt-1">
                <Skeleton className="h-4 w-32 rounded" />
                <Skeleton className="h-3 w-full rounded" />
                <Skeleton className="h-3 w-3/4 rounded" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}