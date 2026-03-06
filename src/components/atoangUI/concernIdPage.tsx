"use client";
import ValidationModal from "@/components/atoangUI/validationModal";
import Timeline from "@/components/timeline";
import { Button } from "@/components/ui/button";

import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/authContext";
import { useConcern } from "@/contexts/concernContext";

import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge as AIbadge } from "../ui/badge";
import { fetcher } from "@/lib/swrFetcher";

import ConcernMediaGrid from "@/components/atoangUI/ConcernMediaGrid";
import {
  Badge,
  Mail,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  ImageIcon,
  MapPin,
  Phone,
  Tag,
  User,
  XCircle,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/formatDate";
import { ResolveConcern } from "./resolveConcern";
import { LoadingConcernId } from "./concernIdLoading";

type Status = "pending" | "approved" | "rejected" | "inProgress";

const statusConfig: Record<
  Status,
  { icon: typeof Clock; color: string; bgColor: string }
> = {
  pending: {
    icon: Clock,
    bgColor: "bg-yellow-500/10 hover:bg-yellow-500/20",
    color: "text-yellow-600",
  },
  inProgress: {
    icon: Activity,
    bgColor: "bg-blue-500/10 hover:bg-blue-500/20",
    color: "text-blue-600",
  },
  approved: {
    icon: CheckCircle,
    bgColor: "bg-emerald-500/10 hover:bg-emerald-500/20",
    color: "text-emerald-600",
  },
  rejected: {
    icon: XCircle,
    bgColor: "bg-red-500/10 hover:bg-red-500/20",
    color: "text-red-600",
  },
};

export default function ConcernIdPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [openResolve, setOpenResolve] = useState(false);
  const [openValidation, setOpenValidation] = useState(false);
  const {
    setConcern,
    concern,
    setConcernId,
    setConcernUpdates,
    concernUpdates,
  } = useConcern();

  const { data, error, isLoading, mutate } = useSWR(
    id ? `/api/concern/${id}` : null,
    fetcher,
  );

  useEffect(() => {
    if (!data) return;
    setConcern(data.data);
    setConcernUpdates(data.updates.data);
    setConcernId(id);
  }, [data, id]);

  if (error) {
    toast.error("Failed to load concern data.");
    notFound();
  }

  const config = concern
    ? statusConfig[concern.validation as Status]
    : undefined;
  const isAI = concern?.media?.some((m: any) => m.isAI) ?? false;
  const StatusIcon = config?.icon;
  if (isLoading) {
    return <LoadingConcernId />;
  }
  return (
    <>
      <div className="space-y-5 px-0">
        {/* ── Header ── */}
        <div className="space-y-3 pb-4 border-b border-border">
          {/* Top badge row – scrollable on very small screens */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono bg-muted px-2.5 py-1 rounded text-muted-foreground shrink-0">
              #{concern?.id}
            </span>

            <Badge
              className={cn(
                config?.bgColor,
                config?.color,
                "border-0 text-xs font-semibold rounded-full shrink-0",
              )}
            >
              {concern?.validation?.charAt(0).toUpperCase() +
                concern?.validation?.slice(1)}
            </Badge>

            {isAI ? (
              <AIbadge variant="destructive" className="text-xs shrink-0">
                🤖 AI Images Detected
              </AIbadge>
            ) : (
              <AIbadge variant="secondary" className="text-xs shrink-0">
                ✓ Authentic Images
              </AIbadge>
            )}
          </div>

          {/* Title */}
          <h2 className="text-xl sm:text-3xl font-bold text-foreground leading-tight">
            {concern?.title}
          </h2>

          {/* Category + action buttons row */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="flex items-center gap-1 bg-blue-100 text-blue-700 border-0 rounded-full text-xs">
              {concern?.category?.name ?? concern?.other ?? "Uncategorized"}
            </Badge>

            <div className="flex items-center gap-2 ml-auto flex-wrap justify-end">
              <Button
                disabled={user?.type !== "barangay_official"}
                size="sm"
                className={cn(
                  config?.bgColor,
                  config?.color,
                  "border-0 disabled:opacity-100 disabled:pointer-events-none text-xs h-8",
                )}
                onClick={() => setOpenValidation(true)}
              >
                {StatusIcon && <StatusIcon className="h-3 w-3 mr-1" />}
                {concern?.validation === "approved"
                  ? "Approved"
                  : concern?.validation === "pending"
                    ? "Pending"
                    : "Rejected"}
              </Button>

              {user?.type === "barangay_official" &&
              concern?.validation === "approved" ? (
                <Button
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => setOpenResolve(true)}
                >
                  Resolve Concern
                </Button>
              ) : null}
            </div>
          </div>
        </div>

        {/* ── Details Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Location */}
          <div className="flex items-start gap-3">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Location</p>
              <p className="text-sm font-medium truncate">
                {concern?.location ?? "N/A"}
              </p>
            </div>
          </div>

          {/* Submitted By */}
          <div className="flex items-start gap-3 sm:col-span-2 lg:col-span-1">
            <User className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted-foreground mb-1">Submitted By</p>
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-y-1 gap-x-3">
                <span className="text-sm font-medium flex items-center gap-1 truncate">
                  <User className="h-3 w-3 shrink-0" />
                  {concern?.isAnonymous === true
                    ? "Anonymous User"
                    : concern?.user?.fullname}
                </span>
                <span className="text-sm font-medium flex items-center gap-1 truncate">
                  <Mail className="h-3 w-3 shrink-0" />
                  {concern?.isAnonymous === true
                    ? "Anonymous User"
                    : concern?.user?.email}
                </span>
                <span className="text-sm font-medium flex items-center gap-1 truncate">
                  <Phone className="h-3 w-3 shrink-0" />
                  {concern?.isAnonymous === true
                    ? "Anonymous User"
                    : concern?.user?.contactNumber?.charAt(0)}
                </span>
                <span className="text-sm font-medium">
                  Barangay assistance:{" "}
                  <strong>
                    {concern?.needsBarangayAssistance ? "Yes" : "No"}
                  </strong>
                </span>
              </div>
            </div>
          </div>

          {/* Date Submitted */}
          <div className="flex items-start gap-3">
            <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Date Submitted</p>
              <p className="text-sm font-medium">
                {concern?.issuedAt
                  ? formatDate(new Date(concern.issuedAt))
                  : "N/A"}
              </p>
            </div>
          </div>

          {/* Last Updated */}
          <div className="flex items-start gap-3">
            <Clock className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Last Updated</p>
              <p className="text-sm font-medium">
                {concern?.updatedAt
                  ? formatDate(new Date(concern.updatedAt))
                  : "N/A"}
              </p>
            </div>
          </div>

          {/* Assigned To (conditional) */}
          {concern?.assignedTo && (
            <div className="flex items-start gap-3 sm:col-span-2">
              <Tag className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Assigned To</p>
                <p className="text-sm font-medium">{concern.assignedTo}</p>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* ── Description ── */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
            <h3 className="font-medium text-sm">Description</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed pl-6">
            {concern?.details ?? "No description available."}
          </p>
        </div>

        {/* ── Media ── */}
        {concern?.media && concern.media.length > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                <h3 className="font-medium text-sm">
                  Attached Images ({concern.media.length})
                </h3>
              </div>
              <ConcernMediaGrid media={concern.media} />
            </div>
          </>
        )}

        {/* ── Timeline Card ── */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Concern Updates</CardTitle>
          </CardHeader>
          <CardContent>
            {concernUpdates ? (
              <Timeline
                updates={concernUpdates}
                createdAt={concern?.issuedAt}
              />
            ) : (
              <p className="text-sm text-muted-foreground">No updates yet.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <ValidationModal
        open={openValidation}
        mutate={mutate}
        setOpen={setOpenValidation}
      />
      <ResolveConcern
        mutate={mutate}
        open={openResolve}
        setOpen={setOpenResolve}
      />
    </>
  );
}
