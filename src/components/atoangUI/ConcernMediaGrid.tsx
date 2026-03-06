"use client";
import { useState } from "react";
import { Badge } from "../ui/badge";
import MediaViewer from "./mediaViewer";

export default function ConcernMediaGrid({
  media,
}: {
  media: { id: number; url: string; isAI: boolean }[];
}) {
  if (!media || media.length === 0) return null;

  const MAX_VISIBLE = 5;
  const visibleMedia = media.slice(0, MAX_VISIBLE);
  const extraCount = media.length - MAX_VISIBLE;
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const openDialog = (index: number) => {
    setSelectedIndex(index);
    setOpen(true);
  };
  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pl-6">
        {visibleMedia.map((item, index) => {
          const isLast = index === MAX_VISIBLE - 1 && extraCount > 0;

          return (
            <div
              key={item.id}
              className="relative aspect-square rounded-lg overflow-hidden
              cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:scale-105
              bg-gray-100 border border-gray-200"
              onClick={() => openDialog(index)}
            >
              <img
                src={item.url}
                alt="Concern media"
                className="object-cover w-full h-full"
              />

              {/* AI badge if applicable */}
              {item.isAI && (
                <div className="absolute top-1 right-1">
                  <Badge variant="destructive" className="text-xs">
                    🤖 AI
                  </Badge>
                </div>
              )}

              {/* +N overlay */}
              {isLast && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-white text-2xl font-bold hover:bg-black/80 transition-colors">
                  +{extraCount}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/** Can you help me move this dialog to another component so I can reuse this in the time line? */}
      <MediaViewer
        media={media}
        open={open}
        setOpen={setOpen}
        startIndex={selectedIndex}
      />
    </>
  );
}
