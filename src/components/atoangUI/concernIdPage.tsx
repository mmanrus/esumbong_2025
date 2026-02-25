"use client";
//import TakeActionModal from "@/components/atoangUI/action";
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
  Lightbulb,
  MapPin,
  Phone,
  Tag,
  User,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/formatDate";

type Status = "pending" | "approved" | "rejected"; //| "resolved";

const statusConfig: Record<
  Status,
  { icon: typeof Clock; color: string; bgColor: string }
> = {
  pending: {
    icon: Clock,
    bgColor: "bg-yellow-500/10 hover:bg-yellow-500/20",
    color: "text-yellow-600",
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
{
  /** resolved: {
    icon: CheckCircle,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },  */
}

export default function ConcernIdPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [openValidation, setOpenValidation] = useState(false);
  const {
    setConcern,
    concern,
    setConcernId,
    setConcernUpdates,
    concernUpdates,
  } = useConcern();
  //const [openAction, setOpenAction] = useState(false);

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

  if (isLoading) return <p>Loading...</p>;
  if (error) {
    toast.error("Failed to load concern data.");
    notFound();
  }
  const MAX_VISIBLE = 5;
  const config = concern
    ? statusConfig[concern.validation as Status]
    : undefined;
  const isAI = concern?.media?.some((m: any) => m.isAI) ?? false;
  const StatusIcon = config?.icon;
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/concern/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const { error } = await res.json();
        toast.error(error);
      }
      const { message } = await res.json();
      toast.success(message);
    } catch (error) {
      toast.error("Something went wrong");
      return;
    }
  };
  return (
    <>
      <div className="space-y-6">
        {/* Header Info */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-mono text-muted-foreground">
              #{concern?.id}
            </span>
            <Badge className={cn(config?.bgColor, config?.color, "border-0")}>
              {concern?.validation}
            </Badge>
            {isAI && <AIbadge variant={"destructive"}>AI Generated</AIbadge>}
            <Button
              disabled={user?.type !== "barangay_official"}
              className={cn(
                config?.bgColor,
                config?.color,
                "border-0 disabled:opacity-100 disabled:pointer-events-none",
              )}
              onClick={() => setOpenValidation(true)}
            >
              {StatusIcon && <StatusIcon className="inline h-3 w-3 mr-1" />}
              {concern?.validation === "approved"
                ? "Approved"
                : concern?.validation === "pending"
                  ? "Pending"
                  : "Rejected"}
            </Button>
            <Badge className="flex items-center gap-1">
              <Lightbulb className="h-3 w-3" />
              {concern?.category?.name ?? concern?.other ?? "Uncategorized"}
            </Badge>
          </div>
          <h2 className="text-lg sm:text-xl font-semibold text-foreground">
            {concern?.title}
          </h2>
        </div>
        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Location</p>
              <p className="text-sm font-medium">
                {concern?.location ?? "N/A"}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <User className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Submitted By:</p>
              <div className="grid grid-cols-2 gap-1">
                <span className="text-sm font-medium">
                  <User className="h-3 w-3 inline mr-1" />
                  {concern?.user?.fullname}
                </span>
                <span className="text-sm font-medium">
                  <Mail className="h-3 w-3 inline mr-1" />
                  {concern?.user?.email}
                </span>
                <span className="text-sm font-medium">
                  <Phone className="h-3 w-3 inline mr-1" />
                  {concern?.user?.contactNumber}
                </span>
                <span className="text-sm font-medium">
                  Needs barangay assistance:{" "}
                  {concern?.needsBarangayAssistance ? "Yes" : "No"}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Date Submitted</p>
              <p className="text-sm font-medium">
                {concern?.issuedAt
                  ? formatDate(new Date(concern?.issuedAt))
                  : "N/A"}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Last Updated</p>
              <p className="text-sm font-medium">
                {concern?.updatedAt
                  ? formatDate(new Date(concern?.updatedAt))
                  : "N/A"}
              </p>
            </div>
          </div>
          {concern?.assignedTo ? (
            <div className="flex items-start gap-3 sm:col-span-2">
              <Tag className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Assigned To</p>
                <p className="text-sm font-medium">
                  {concern?.assignedTo ?? "Unassigned"}
                </p>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>

        <Separator />

        {/* Description */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-medium">Description</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed pl-6">
            {concern?.details ?? "No description available."}
          </p>
        </div>
      </div>

      <Separator className="mt-6" />
      {concern?.media && concern?.media.length > 0 && (
        <>
          <Separator />
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-medium">
                Attached Images ({concern?.media.length})
              </h3>
            </div>
            <ConcernMediaGrid media={concern?.media} />
          </div>
        </>
      )}
      {/**
      <Card>
        <CardHeader>
          <CardTitle>{concern?.title}</CardTitle>

          <CardAction></CardAction>
          <CardDescription className="flex flex-col gap-1">
            <span>Submitted by: {concern?.user?.fullname}</span>
            <span>Email: {concern?.user?.email}</span>
            <span>Contact Number: {concern?.user?.contactNumber}</span>
            <span>
              Needs barangay assistance:{" "}
              {concern?.needsBarangayAssistance ? "Yes" : "No"}
            </span>
            <span>
              date issued:{" "}
              {concern?.issuedAt
                ? new Date(concern?.issuedAt).toLocaleString()
                : "N/A"}
            </span>
          </CardDescription>
          <CardContent>
            <span>{concern?.details}</span>
            <div className="flex flex-row gap-3">
              {user?.type === "barangay_official" && (
                <Button onClick={() => setOpenAction(true)}>Take Action</Button>
              )}
              {user?.type === "resident" && user?.id === concern?.userId && (
                <>
                  <Button onClick={() => handleDelete(id)}>
                    Delete Concern
                  </Button>
                  <Button>Update Concern</Button>
                </>
              )}
            </div>
            <ConcernMediaGrid media={concern?.media} />
          </CardContent>
        </CardHeader>
      </Card>  */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Concern updates:</CardTitle>
        </CardHeader>
        <CardContent>
          {concernUpdates ? (
            <Timeline updates={concernUpdates} />
          ) : (
            <p>Loading updates...</p>
          )}
        </CardContent>
      </Card>
      <ValidationModal
        open={openValidation}
        mutate={mutate}
        setOpen={setOpenValidation}
      />
      {/**<TakeActionModal open={openAction} setOpen={setOpenAction} />*/}
    </>
  );
}
