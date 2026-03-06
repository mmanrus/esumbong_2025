import { useState, useRef } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogTitle, DialogContent } from "../ui/dialog";
import { useConcern } from "@/contexts/concernContext";
import { toast } from "sonner";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { X } from "lucide-react";
import { uploadFiles } from "@/lib/uploadthing";

export default function ValidationModal({
  open,
  setOpen,
  mutate,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
  mutate: () => void;
}) {
  const { concern, concernId } = useConcern();
  const [isLoading, setLoading] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");
  const [status, setStatus] = useState<
    "approved" | "rejected" | "pending" | null
  >(null);

  const [files, setFiles] = useState<File[]>([]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const newFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const updated = prev.filter((_, i) => i !== index);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      return updated;
    });
  };

  const handleValidation = async () => {
    if (!status) {
      toast.error("Please select a status.");
      return;
    }
    let metaData: any[] = [];
    setLoading(true);
    if (files.length > 0) {
      try {
        const uploaded = await uploadFiles("documentUploader", {
          files,
        });

        if (!uploaded?.length) throw new Error("Upload failed");

        const mediaData =
          uploaded?.map((file) => {
            return {
              url: file.ufsUrl.toString(),
              name: file.name,
              size: file.size,
              type: file.type,
            };
          }) ?? [];

        metaData = mediaData;
        // reset UI
      } catch (err) {
        setLoading(false);
        toast.error("Upload failed");
        return;
      }
    }

    const res = await fetch(`/api/concern/validate/${concernId}`, {
      method: "PATCH",
      credentials: "include",
      body: JSON.stringify({
        validation: status,
        updateMessage: updateMessage,
        media: metaData,
      }),
    });

    setFiles([]);
    if (!res.ok) {
      setLoading(false);
      toast.error("Error upon validating");
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

        <div className="flex flex-col gap-4">
          <div>
            <Label>Message</Label>
            <Textarea
              className="mt-3"
              placeholder="Message the resident."
              value={updateMessage}
              onChange={(e) => setUpdateMessage(e.target.value)}
            />
          </div>

          {/* File Upload */}
          <div>
            <Label>Attach Files</Label>

            <div className="mt-3 flex items-center gap-3">
              <Input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFiles}
                id="file-upload"
              />

              <Label
                htmlFor="file-upload"
                className="cursor-pointer rounded-md border px-4 py-2 hover:bg-muted"
              >
                Choose Files
              </Label>

              {files.length > 0 && (
                <span className="text-sm text-muted-foreground">
                  {files.length} file{files.length > 1 ? "s" : ""} selected
                </span>
              )}
            </div>
          </div>

          {/* File Preview */}
          {files.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {files.map((file, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="flex items-center gap-2 px-3 py-1"
                >
                  <span className="truncate max-w-[120px]">{file.name}</span>

                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="ml-1 rounded-full p-1 hover:bg-black/10 cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {/* Status Selection */}
          <div>
            <Label>Select Status</Label>
            <div className="flex gap-3 mt-3">
              <Badge
                onClick={() => setStatus("approved")}
                className={`cursor-pointer px-4 py-2 ${
                  status === "approved"
                    ? "bg-green-600 text-white shadow-lg"
                    : "bg-green-600/10 text-dark border-green-600"
                }`}
              >
                Approve
              </Badge>

              <Badge
                onClick={() => setStatus("rejected")}
                className={`cursor-pointer px-4 py-2 ${
                  status === "rejected"
                    ? "bg-red-600 text-white shadow-lg"
                    : "bg-red-600/10 text-dark border-red-600"
                }`}
              >
                Reject
              </Badge>

              <Badge
                onClick={() => setStatus("pending")}
                className={`cursor-pointer px-4 py-2 ${
                  status === "pending"
                    ? "bg-yellow-500 text-white shadow-lg"
                    : "bg-yellow-500/10 text-dark border-yellow-500"
                }`}
              >
                Pending
              </Badge>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleValidation}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Submitting..." : "Submit Validation"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
