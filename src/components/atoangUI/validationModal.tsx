import { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogTitle, DialogContent } from "../ui/dialog";
import { useConcern } from "@/contexts/concernContext";
import { toast } from "sonner";

export default function ValidationModal({
  open,
  setOpen,
  mutate
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
  mutate: ()=> void
}) {
  
  const { concern, concernId } = useConcern();
  const [isLoading, setLoading] = useState(false)
  const handleValidation = async (
    status: "approved" | "rejected" | "pending" | null, 
  ) => {
    setLoading(true)
    const res = await fetch(`/api/concern/validate/${concernId}`, {
      method: "PATCH",
      credentials: "include",
      body: JSON.stringify({ validation: status }),
    });
    if (!res.ok) {
      setLoading(false)
      toast.error("Error uppon validating")
      return
    }
    setLoading(false)
    setOpen(false)
    mutate()
    toast.success("Successfully validated.")
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogTitle>Validate Concern as</DialogTitle>
        <form
          className="flex flex-row gap-3 justify-center"
          
        >
          <Button
            disabled={concern?.validation === "approved" || isLoading}
            type="submit"
            onClick={() => handleValidation("approved")}
          >
            Approve
          </Button>
          <Button
            variant="destructive"
            type="submit"
            disabled={concern?.validation === "rejected" || isLoading}
            onClick={() => handleValidation("rejected")}
          >
            Reject
          </Button>
          <Button
            variant="outline"
            type="submit"
            disabled={concern?.validation === "pending" || isLoading}
            onClick={() => handleValidation("pending")}
          >
            Pending
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
