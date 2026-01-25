"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
export const Logo = ({ className, ...props }: { className: string }) => {
  return (
    <Image
      src="/esumbong.png"
      alt="logo"
      height={10}
      width={10}
      className={cn("h-7 w-7", className)}
      {...props}
    />
  );
};
