"use client";
import { useAuth } from "@/contexts/authContext";
import { fetcher } from "@/lib/swrFetcher";
import { notFound, redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";
import { Concern } from "./concernRows";
import { formatDate } from "@/lib/formatDate";
import {
  CheckCircle,
  ChevronRight,
  Clock,
  Shield,
  XCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type Status = "pending" | "approved" | "rejected";
const statusConfig: Record<
  Status,
  { icon: typeof Clock; color: string; bgColor: string }
> = {
  pending: {
    icon: Clock,
    bgColor: "bg-yellow-500/10",
    color: "text-yellow-600",
  },
  approved: {
    icon: CheckCircle,
    bgColor: "bg-emerald-500/10",
    color: "text-emerald-600",
  },
  rejected: {
    icon: XCircle,
    bgColor: "bg-red-500/10",
    color: "text-red-600",
  },
};

const statusSteps: Status[] = ["pending", "approved", "rejected"];

export function UserConcernRows() {
  const router = useRouter()
  const { user } = useAuth();
  const { data, error, isLoading, mutate } = useSWR(
    `/api/concern/getByUserId/${user?.id}`,
    fetcher,
  );
  const [userConcerns, setUserConcerns] = useState<Concern[] | null>(null);
  useEffect(() => {
    if (!data) return;
    setUserConcerns(data.data);
  }, [data]);
  if (isLoading)
    return (
      <div className="flex justify-center items-center">
        <span>Loading</span>
      </div>
    );
  if (error) {
    toast.error("Failed to load concerns");
    notFound();
  }
  if (!Array.isArray(userConcerns) || userConcerns.length === 0) {
    <Card className="p-8">
      <p className="text-center  text-muted-foreground">
        No concerns found with the selected filter.
      </p>
    </Card>;
  }

  return (
    <>
      {userConcerns?.map((c: Concern, index: any) => {
        const config = c
          ? statusConfig[c.status as Status]
          : undefined;

        const StatusIcon = config?.icon;

        return (
          <Card
            key={c.id}
            className="hover:shadow-md transition-shadow cursor-pointer group"
            onClick={() => router.push(`/concern/${c.id}`)}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-muted-foreground">
                      #{c.id}
                    </span>
                    <Badge
                      variant="secondary"
                      className={cn(config?.bgColor, config?.color, "border-0")}
                    >
                     {StatusIcon && <StatusIcon className="h-3 w-3 mr-1" />}
                      {c.status}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-foreground truncate">
                    {c.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {c.category?.name ?? c.other ?? "Uncategorized"}
                  </p>

                  <StatusProgress currentStatus={c.status} />

                  <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
                    <span>Submitted: {formatDate(new Date(c.issuedAt))}</span>
                    <span>Updated: {formatDate(new Date(c.updatedAt))}</span>
                  </div>
                </div>

                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </>
  );
}

function StatusProgress({ currentStatus }: { currentStatus: Status }) {
  const currentIndex = statusSteps.indexOf(currentStatus);
  const isRejected = currentStatus === "rejected";

  return (
    <div className="flex items-center gap-2 mt-3">
      {statusSteps.map((step, index) => {
        const isCompleted = !isRejected && index <= currentIndex;
        const isCurrent = step === currentStatus;
        const config = statusConfig[step];

        return (
          <div key={step} className="flex items-center">
            <div
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full transition-colors",
                isCompleted ? config.bgColor : "bg-muted",
                isCurrent && "ring-2 ring-offset-2 ring-primary",
              )}
            >
              <config.icon
                className={cn(
                  "h-4 w-4",
                  isCompleted ? config.color : "text-muted-foreground",
                )}
              />
            </div>
            {index < statusSteps.length - 1 && (
              <div
                className={cn(
                  "w-8 h-1 mx-1 rounded-full",
                  isCompleted && index < currentIndex
                    ? "bg-primary"
                    : "bg-muted",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
