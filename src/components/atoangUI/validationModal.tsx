import { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogTitle, DialogContent } from "../ui/dialog";
import { useConcern } from "@/contexts/concernContext";

export default function ValidationModal({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
}) {
  
  const { concern, concernId } = useConcern();
  const handleValidation = async (
    status: "approved" | "rejected" | "pending" | null
  ) => {
    const res = await fetch(`/api/concern/validate/${concernId}`, {
      method: "PATCH",
      body: JSON.stringify({ validation: status }),
    });
  };
  const [newValidation, setNewvalidation] = useState<
    "approved" | "rejected" | "pending" | null
  >(null);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogTitle>Validate Concern as</DialogTitle>
        <form
          className="flex flex-row gap-3 justify-center"
          onSubmit={async (e) => {
            e.preventDefault(); // Prevent the form from reloading the page
            await handleValidation(newValidation);
          }}
        >
          <Button
            disabled={concern?.validation === "approved"}
            type="submit"
            onClick={() => setNewvalidation("approved")}
          >
            Approve
          </Button>
          <Button
            variant="destructive"
            type="submit"
            disabled={concern?.validation === "rejected"}
            onClick={() => setNewvalidation("rejected")}
          >
            Reject
          </Button>
          <Button
            variant="outline"
            type="submit"
            disabled={concern?.validation === "pending"}
            onClick={() => setNewvalidation("pending")}
          >
            Pending
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
