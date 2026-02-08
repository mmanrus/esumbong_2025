import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";


export default function Loading() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-primary">
                <Skeleton className="ml-2 w-20 h-12 animate-pulse" />
              </CardTitle>
              <CardDescription>
                <Skeleton className="ml-2 w-24 h-10 animate-pulse" />
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-6 w-8 rounded animate-pulse" />

              <Skeleton className="h-6 w-8 rounded animate-pulse" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-4">
            <Skeleton className="h-20 w-20 rounded-full animate-pulse"></Skeleton>
            <div>
              <Skeleton className="h-6 w-32 animate-pulse" />
              <Skeleton className="h-6 w-24 mt-1 animate-pulse" />
            </div>
          </div>

          <Separator />

          {/* Profile Fields */}
          <div className="grid gap-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full animate-pulse" />
                  <Skeleton className="h-4 w-10 animate-pulse"/>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 text-muted-foreground rounded-full" />
                <Skeleton className="h-4 w-12" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 text-muted-foreground rounded-full" />
                <Skeleton className="h-4 w-12" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 text-muted-foreground rounded-full" />
                <Skeleton className="h-4 w-12" />
              </div>
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-18" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
