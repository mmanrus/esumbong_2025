import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Archive, ArchiveRestore, Trash2, Calendar, Tag } from "lucide-react";
import { useState } from "react";
import { FaArchive } from "react-icons/fa";
import { MdUnarchive } from "react-icons/md";
import { toast } from "sonner";
import { formatDate } from "@/lib/formatDate";
import { cn } from "@/lib/utils";

export default function ConcernDialog({
  open,
  onOpenChange,
  concern,
  onDelete,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: (concernId: any) => void;
  concern: any;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleArchive = async (concernId: any) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/concern/archive/${concernId}`, {
        credentials: "include",
        method: "PATCH",
      });
      if (!res.ok) {
        const { error } = await res.json();
        toast.error(error ?? "Error archiving concern");
        return;
      }
      const { message } = await res.json();
      toast.success(message);
      onDelete(concern?.id);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteConcern = async (concernId: any) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/concern/delete/${concernId}`, {
        credentials: "include",
        method: "DELETE",
      });
      if (!res.ok) {
        const { error } = await res.json();
        toast.error(error ?? "Error deleting concern");
        return;
      }
      const { message } = await res.json();
      toast.success(message);
      onDelete(concern?.id);
    } finally {
      setIsLoading(false);
    }
  };

  if (!concern) return null;

  const validationClass =
    concern.validation === "approved" ? "bg-emerald-100 text-emerald-700 border-emerald-200"
    : concern.validation === "pending"  ? "bg-amber-100 text-amber-700 border-amber-200"
    : "bg-red-100 text-red-700 border-red-200";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full rounded-2xl p-0 overflow-hidden gap-0">

        {/* ── Header ── */}
        <DialogHeader className="px-5 pt-5 pb-4 border-b border-gray-100 bg-gray-50/60">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <DialogTitle className="text-base font-bold text-foreground leading-snug">
                Concern #{concern.id}
              </DialogTitle>
              {concern.title && (
                <p className="text-sm text-muted-foreground mt-0.5 truncate">
                  {concern.title}
                </p>
              )}
            </div>

            {/* Validation badge */}
            <span className={cn(
              "flex-shrink-0 inline-block px-2.5 py-1 rounded-full text-xs font-semibold border",
              validationClass
            )}>
              {concern.validation?.charAt(0).toUpperCase() + concern.validation?.slice(1)}
            </span>
          </div>
        </DialogHeader>

        {/* ── Body ── */}
        <div className="px-5 py-4 space-y-4">

          {/* Meta */}
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
            {concern.category?.name || concern.other ? (
              <span className="flex items-center gap-1">
                <Tag className="h-3 w-3" />
                {concern.category?.name ?? concern.other}
              </span>
            ) : null}
            {concern.issuedAt && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(new Date(concern.issuedAt))}
              </span>
            )}
          </div>

          {/* Details */}
          <div className="bg-muted/40 rounded-xl p-3.5 border border-border/50">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Details
            </p>
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words">
              {concern.details ?? "No details provided."}
            </p>
          </div>

          {/* Reporter (masked) */}
          {/* Reporter — hide identity if anonymous */}
          <p className="text-xs text-muted-foreground">
            Reported by{" "}
            <span className="font-medium text-foreground">
              {concern.isAnonymous
                ? "Anonymous User"
                : concern.user?.fullname
              }
            </span>
          </p>
        </div>

        {/* ── Footer actions ── */}
        <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/40 flex flex-wrap items-center gap-2 justify-between">

          {/* Left: archive + delete */}
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isLoading}
                  onClick={() => handleArchive(concern.id)}
                  className="gap-1.5 text-xs h-8"
                >
                  {concern.isArchived ? (
                    <><MdUnarchive className="h-3.5 w-3.5" /> Unarchive</>
                  ) : (
                    <><FaArchive className="h-3 w-3" /> Archive</>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                {concern.isArchived ? "Restore concern" : "Archive concern"}
              </TooltipContent>
            </Tooltip>

            {concern.isArchived && (
              <Button
                variant="destructive"
                size="sm"
                disabled={isLoading}
                onClick={() => deleteConcern(concern.id)}
                className="gap-1.5 text-xs h-8"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </Button>
            )}
          </div>

          {/* Right: go to full page */}
          <a
            href={`/concern/${concern.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold
                       text-blue-600 hover:text-blue-800 transition"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            View Full Page
          </a>
        </div>

      </DialogContent>
    </Dialog>
  );
}