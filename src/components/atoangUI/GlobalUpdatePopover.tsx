"use client";

import { X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
type routeConfig = {
  type: "concern" | null;
};
export default function GlobalUpdatePopover({
  message,
  id,
  type,
  onClose,
}: {
  message: string;
  type: string;
  id: number;
  onClose: () => void;
}) {
  const router = useRouter();

  const routeConfig = type === "concern" ? "/concern/" : null;
  return (
    <div
      onClick={() => {
        if (!routeConfig) return;
        router.push(`/concern/${id}`);
      }}
      className="fixed bottom-4 right-4 z-50 w-[90%] sm:w-[400px] animate-in fade-in slide-in-from-top-5"
    >
      <Card className="p-4 shadow-xl border">
        <div className="flex justify-between items-start gap-4">
          <div className="text-sm">
            <p className="font-medium">New Update</p>
            <p className="text-muted-foreground">{message}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
