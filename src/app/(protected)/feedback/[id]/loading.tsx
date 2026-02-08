import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6 animate-fade-in h-full flex flex-col">
      <div className="w-full">
        <div className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
          <Skeleton className="h-11 w-11 text-primary" />
          <Skeleton className="h-11 w-30" />
        </div>
        <Skeleton className="h-6 w-30 text-muted-foreground mt-1" />
      </div>

      <Card className="shadow-sm flex flex-col flex-1">
        <CardHeader>
          <CardTitle className="text-lg">
            {" "}
            <Skeleton className="h-11 w-30" />
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-1 ">
          <div className="space-y-5 flex-1 flex-col flex">
            <div className="space-y-2">
              <div className="flex flex-row gap-2 items-center">
                <Skeleton className="h-11 w-30" />
              </div>
              <Skeleton className="w-full h-5" />
            </div>

            <div className="space-y-2 flex flex-1 flex-col ">
              <div className="flex flex-row gap-2 items-center">
                <Skeleton className="h-5 w-20" />
              </div>
              <Skeleton className={"flex-1"} />
            </div>

            <div className="flex justify-end pt-2">
              <Skeleton className="h-11 w-30"/>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
