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

export default function ConcernMediaGrid({
  media,
}: {
  media: { id: number; url: string }[];
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
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pl-6">
        {visibleMedia.map((item, index) => {
          const isLast = index === MAX_VISIBLE - 1 && extraCount > 0;

          return (
            <div
              key={item.id}
              className="relative aspect-square rounded overflow-hidden
              cursor-pointer hover:opacity-80 transition-opacity
              bg-muted border"
              onClick={() => openDialog(index)}
            >
              <img
                key={item.id}
                src={item.url}
                alt="Concern media"
                className="object-cover rounded shadow-md"
              />

              {/* +N overlay */}
              {isLast && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xl font-semibold">
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
          className="p-0 bg-transparent flex justify-center items-center border-0 w-[90vw] max-w-5xl h-[60vh]"
        >
          <VisuallyHidden>
            <DialogTitle>Images Concern</DialogTitle>
          </VisuallyHidden>
          <DialogClose asChild>
            <Button className="absolute z-100 top-[-110] right-4 text-white hover:opacity-70 transition">
              <X className="w-6 h-6 opacity-100" />
            </Button>
          </DialogClose>
          <Carousel
            key={selectedIndex}
            opts={{ loop: true, startIndex: selectedIndex }}
            className="w-full h-full flex justify-center items-center"
          >
            <CarouselContent className="h-full">
              {media.map((item, index) => (
                <CarouselItem
                  key={item.id}
                  className="flex items-center justify-center h-full"
                >
                  <img
                    src={item.url}
                    alt={`Concern media ${index + 1}`}
                    className="max-h-full max-w-full object-contain"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </DialogContent>
      </Dialog>
    </>
  );
}
