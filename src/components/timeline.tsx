"use client";

import {
  Check,
  X,
  Activity,
  Clock,
  Paperclip,
  Image,
  Video,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ConcernUpdates } from "@/contexts/concernContext";
import { formatDate } from "@/lib/formatDate";
import { Badge } from "./ui/badge";
import { useState } from "react";
import MediaViewer from "./atoangUI/mediaViewer";

type TimelineProps = {
  updates: ConcernUpdates[];
  createdAt: string;
};

export default function Timeline({ updates, createdAt }: TimelineProps) {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerMedia, setViewerMedia] = useState<any[]>([]);
  const [startIndex, setStartIndex] = useState(0);

  const renderIcon = (status: string) => {
    if (status === "approved" || status === "resolved")
      return <Check className="h-4 w-4 text-white bg-green-600 rounded-full" />;

    if (status === "pending")
      return (
        <Clock className="h-4 w-4 text-white bg-yellow-600 rounded-full" />
      );

    if (status === "inProgress")
      return (
        <Activity className="h-4 w-4 text-white bg-blue-600 rounded-full" />
      );

    if (status === "rejected")
      return <X className="h-4 w-4 text-white bg-destructive rounded-full" />;

    return null;
  };
  const openViewer = (media: any[], index: number) => {
    setViewerMedia(media);
    setStartIndex(index);
    setViewerOpen(true);
  };

  return (
    <>
      <div className="max-w-[--breakpoint-sm] mx-auto py-2 md:py-6 px-2">
        <div className="relative ml-6">
          {/* vertical line */}
          <div className="absolute left-0 inset-y-0 border-l-2 border-muted-foreground" />

          {/* Submitted */}
          <div className="relative pl-10 pb-10">
            <div className="absolute left-px -translate-x-1/2 h-7 w-7 flex items-center justify-center rounded-full bg-yellow-600 ring-8 ring-background">
              <Clock className="h-4 w-4 text-white" />
            </div>

            <div className="pt-1 space-y-2">
              <h3 className="text-m font-semibold tracking-[-0.01em]">
                {createdAt ? formatDate(new Date(createdAt)) : "Unknown date"} -
                Submitted
              </h3>

              <p className="text-muted-foreground text-sm">
                The concern was submitted and is awaiting review.
              </p>
            </div>
          </div>

          {/* Updates */}
          {updates?.map((update, index) => (
            <div key={index} className="relative pl-10 pb-10 last:pb-0">
              <div
                className={cn(
                  "absolute left-px -translate-x-1/2 h-7 w-7 border-2 border-muted-foreground/40 flex items-center justify-center rounded-full bg-accent ring-8 ring-background",
                  {
                    "bg-green-600 text-white": update.status === "approved",
                    "bg-blue-600 text-white": update.status === "inProgress",
                    "bg-red-600 text-white": update.status === "rejected",
                    "bg-yellow-600 text-white": update.status === "pending",
                  },
                )}
              >
                {renderIcon(update.status)}
              </div>

              <div className="pt-1 space-y-2">
                <h3 className="text-m font-semibold tracking-[-0.01em]">
                  {formatDate(new Date(update.createdAt))} -{" "}
                  {update.status.charAt(0).toUpperCase() +
                    update.status.slice(1)}
                </h3>

                <p className="text-muted-foreground text-sm">
                  {update.updateMessage}
                </p>

                {/* MEDIA BADGES */}
                {/* MEDIA BADGES */}
                {update.media && update.media.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {update.media.map((file: any, mediaIndex: number) => {
                      // Truncate filename to ~15 chars
                      const truncatedName =
                        file.name && file.name.length > 15
                          ? file.name.slice(0, 12) + "..."
                          : (file.name ?? `Attachment ${mediaIndex + 1}`);

                      const isPreviewable =
                        file.type === "photo"
                          ? true
                          : file.type === "video"
                            ? true
                            : false;

                      return isPreviewable ? (
                        <Badge
                          key={file.id}
                          variant="secondary"
                          className="cursor-pointer rounded-full px-2 hover:border-black-600/20 flex items-center gap-1 hover:bg-muted transition"
                          onClick={() => openViewer(update.media, mediaIndex)}
                        >
                          {file.type?.startsWith("photo") ? (
                            <Image className="h-3 w-3" />
                          ) : file.type?.startsWith("video") ? (
                            <Video className="h-3 w-3" />
                          ) : (
                            <Image className="h-3 w-3" />
                          )}
                          {truncatedName}
                        </Badge>
                      ) : (
                        <a
                          key={file.id}
                          href={file.url}
                          download={file.name}
                          target="_blank"
                          className="badge badge-secondary rounded-full px-2 hover:border-black-600/20 flex items-center gap-1 hover:bg-muted transition"
                        >
                          <Paperclip className="h-3 w-3" />
                          {truncatedName}
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MEDIA VIEWER */}
      <MediaViewer
        media={viewerMedia}
        open={viewerOpen}
        setOpen={setViewerOpen}
        startIndex={startIndex}
      />
    </>
  );
}
