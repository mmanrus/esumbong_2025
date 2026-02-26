"use client";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { useConcern } from "@/contexts/concernContext";
import { useState } from "react";

export function ResolveConcern({
  open,
  setOpen,
  mutate,
}: {
  open: boolean;
  mutate: () => void;
  setOpen: (bool: boolean) => void;
}) {
  const { concern, concernId } = useConcern();
  const [isLoading, setLoading] = useState(false);
  const handleValidation = async (status: "resolved" | "unresolved" | null) => {
    setLoading(true);
    const res = await fetch(`/api/concern/validate/${concernId}?type=resolve`, {
      method: "PATCH",
      credentials: "include",
      body: JSON.stringify({ validation: status }),
    });
    if (!res.ok) {
      setLoading(false);
      toast.error("Error uppon validating");
      return;
    }
    setLoading(false);
    setOpen(false);
    mutate();
    toast.success("Successfully validated.");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogTitle>Validate Concern as</DialogTitle>
        <form className="flex flex-row gap-3 justify-center">
          <Button
            disabled={concern?.validation === "resolved" || isLoading}
            type="submit"
            onClick={() => handleValidation("resolved")}
          >
            Resolve
          </Button>
          <Button
            variant="destructive"
            type="submit"
            disabled={concern?.validation === "unresolved" || isLoading}
            onClick={() => handleValidation("unresolved")}
          >
            Unresolve
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
