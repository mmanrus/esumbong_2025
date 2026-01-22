"use client";
import Image from "next/image";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useState } from "react";

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
      <div className="grid grid-cols-3 gap-2 mt-2">
        {visibleMedia.map((item, index) => {
          const isLast = index === MAX_VISIBLE - 1 && extraCount > 0;

          return (
            <div
              key={item.id}
              className="relative aspect-square rounded overflow-hidden
              cursor-pointer hover:opacity-80 transition-opacity
              "
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
        <DialogContent className="p-0 max-w-none! max-h-none! bg-transparent border-0 lg:w-[70%] lg:h-[80%]!">
          <VisuallyHidden>
            <DialogTitle>Images Concern</DialogTitle>
          </VisuallyHidden>
          <Carousel
            key={selectedIndex}
            opts={{ loop: true, startIndex: selectedIndex }}
            className="w-fit h-full"
          >
            <CarouselContent className="w-fit h-full!">
              {" "}
              {media.map((item: any, index: number) => (
                <CarouselItem key={item.id} className="w-full h-full">
                  <img
                    key={index}
                    src={item.url}
                    alt={`Concern media ${index + 1}`}
                    className="rounded-lg object-contain h-full"
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
