"use client";
import Image from "next/image";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "../ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

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
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton={false}
          className="p-0 bg-black/90 flex justify-center items-center border-0 w-[95vw] max-w-6xl h-[80vh] max-h-screen"
        >
          <VisuallyHidden>
            <DialogTitle>Images Concern</DialogTitle>
          </VisuallyHidden>
          <DialogClose asChild>
            <Button className="absolute z-50 top-4 right-4 bg-white/20 hover:bg-white/30 text-white border-0 rounded-full p-2">
              <X className="w-6 h-6" />
            </Button>
          </DialogClose>
          <Carousel
            key={selectedIndex}
            opts={{ loop: true, startIndex: selectedIndex }}
            className="w-full h-full flex justify-center items-center relative"
          >
            <CarouselContent className="h-full">
              {media.map((item, index) => (
                <CarouselItem
                  key={item.id}
                  className="flex flex-col items-center justify-center h-full"
                >
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img
                      src={item.url}
                      alt={`Concern media ${index + 1}`}
                      className="max-h-full max-w-full object-contain"
                    />

                    {item.isAI && (
                      <Badge
                        className="absolute bottom-4 left-4 text-xs font-semibold"
                        variant={"destructive"}
                      >
                        🤖 AI Generated
                      </Badge>
                    )}

                    <span className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded text-xs font-medium">
                      {index + 1} / {media.length}
                    </span>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4 bg-white/20 hover:bg-white/40 border-0 text-white" />
            <CarouselNext className="right-4 bg-white/20 hover:bg-white/40 border-0 text-white" />
          </Carousel>
        </DialogContent>
      </Dialog>
    </>
  );
}
