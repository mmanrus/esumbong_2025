import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import { FaArchive } from "react-icons/fa";
import { MdUnarchive } from "react-icons/md";
import { toast } from "sonner";
export default function ConcernDialog({
  open,
  onOpenChange,
  concern,
  onDelete,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: (concernId: any) => void;
  concern: any;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const handleArchive = async (concernId: any) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/concern/archive/${concernId}`, {
        credentials: "include",
        method: "PATCH",
      });
      if (!res.ok) {
        const { error } = await res.json();
        toast.error(error ? error : "Error upon archiving");
        setIsLoading(false);
        return;
      }
      const { message } = await res.json();
      onDelete(concern?.id);
      toast.success(message);
      setIsLoading(false);
      return;
    } finally {
      setIsLoading(false);
    }
  };
  const deleteConcern = async (concernId: any) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/concern/delete/${concernId}`, {
        credentials: "include",
        method: "DELETE",
      });
      if (!res.ok) {
        const { error } = await res.json();
        toast.error(error ? error : "Error upon archiving");
        setIsLoading(false);
        return;
      }
      const { message } = await res.json();
      toast.success(message);

      onDelete(concern?.id); // remove from parent state
      setIsLoading(false);
      return;
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col">
        <DialogHeader className="flex flex-row gap-3 items-center">
          <DialogTitle>Actions</DialogTitle>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                disabled={isLoading}
                onClick={() => handleArchive(concern?.id)}
              >
                {concern?.isArchived === true ? <FaArchive /> : <MdUnarchive />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>
                {concern?.isArchived === true
                  ? "Unarchive Concern"
                  : "Archive Concern"}
              </p>
            </TooltipContent>
            {concern?.isArchived === true && (
              <Button onClick={() => deleteConcern(concern?.id)}>
                Delete Concern
              </Button>
            )}
          </Tooltip>
          <a
            href={`/concern/${concern?.id}`}
            className="text-blue-600 hover:text-blue-800 underline underline-offset-2 transition"
          >
            Go to
          </a>
        </DialogHeader>
        <span>{concern?.title}</span>
        <span>{concern?.details}</span>
      </DialogContent>
    </Dialog>
  );
}
