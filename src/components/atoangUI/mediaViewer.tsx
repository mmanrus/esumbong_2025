"use client";

import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
} from "../ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { X } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

type Media = {
  id: number;
  url: string;
  isAI: boolean;
};

type MediaViewerProps = {
  media: Media[];
  open: boolean;
  setOpen: (value: boolean) => void;
  startIndex?: number;
};

export default function MediaViewer({
  media,
  open,
  setOpen,
  startIndex = 0,
}: MediaViewerProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        showCloseButton={false}
        className="p-0 bg-black/90 flex justify-center items-center border-0 w-[95vw] max-w-6xl h-[80vh] max-h-screen"
      >
        <VisuallyHidden>
          <DialogTitle>Media Viewer</DialogTitle>
        </VisuallyHidden>

        <DialogClose asChild>
          <Button className="absolute z-50 top-4 right-4 bg-white/20 hover:bg-white/30 text-white border-0 rounded-full p-2">
            <X className="w-6 h-6" />
          </Button>
        </DialogClose>

        <Carousel
          key={startIndex}
          opts={{ loop: true, startIndex }}
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
                    alt={`Media ${index + 1}`}
                    className="max-h-full max-w-full object-contain"
                  />

                  {item.isAI && (
                    <Badge
                      className="absolute bottom-4 left-4 text-xs font-semibold"
                      variant="destructive"
                    >
                      🤖 AI Generated
                    </Badge>
                  )}

                  <span className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded text-xs">
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
  );
}