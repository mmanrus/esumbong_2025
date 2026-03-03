import { Button } from "@/components/ui/button";
import DialogAlert from "../alertDialog";
import { Eye, Info, Link } from "lucide-react";
import clsx from "clsx";
import { useState } from "react";
import ConcernDialog from "./concernDialog";
import { toast } from "sonner";
import { formatDate } from "@/lib/formatDate";

export type Concern = {
  id: number;
  title: string;
  validation: string;
  details: string;
  issuedAt: string;
  updatedAt: string;
  archivedOn: string;
  status: "approved" | "rejected" | "pending";
  user?: {
    fullname: string;
  };
  category?: {
    name: string;
  } | null;
  other?: string | null;
};

type Props = {
  concerns: Concern[] | null;
  onDelete: (concernId: any) => void;
};

export default function ViewConcernRows({ concerns, onDelete }: Props) {
  if (!concerns || concerns.length === 0) {
    return (
      <tr>
        <td colSpan={6} className="p-0">
          <div className="flex h-full min-h-[300px] md:min-h-[400px] items-center justify-center text-gray-500">
            No Concerns Found
          </div>
        </td>
      </tr>
    );
  }
  const [isLoading, setIsLoading] = useState(false);
  const handleValidation = async (
    status: "approved" | "rejected" | "pending",
    concernId: any,
  ) => {
    setIsLoading(true);

    const res = await fetch(`/api/concern/validate/${concernId}`, {
      credentials: "include",
      method: "PATCH",
      body: JSON.stringify({ validation: status }),
    });
    if (!res.ok) {
      toast.error("Error upon validation the concern");
      return;
    }
    toast.success(
      `Concern has been validated as ${
        status.charAt(0).toUpperCase() + status.slice(1)
      }`,
    );
    setIsLoading(false);
    return;
  };

  const [selectedConcern, setSelectedConcern] = useState<any | null>(null);
  const [newValidation, setNewvalidation] = useState<
    "approved" | "rejected" | "pending"
  >();
  return (
    <>
      {concerns.map((concern: Concern, index: number) => (
        <tr
          key={concern.id ?? index}
          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
        >
          <td className="px-3 sm:px-5 py-3 sm:py-4 text-sm font-medium text-foreground">
            <span className="inline-block bg-gray-100 px-2 py-1 rounded text-xs font-mono">
              #{concern.id}
            </span>
          </td>

          <td className="px-3 sm:px-5 py-3 sm:py-4 text-sm text-muted-foreground hidden md:table-cell">
            {concern.category?.name ?? concern.other ?? "N/A"}
          </td>

          <td className="px-3 sm:px-5 py-3 sm:py-4 text-xs sm:text-sm text-muted-foreground hidden md:table-cell">
            {formatDate(new Date(concern.issuedAt))}
          </td>

          <td className="px-3 sm:px-5 py-3 sm:py-4">
            <span
              className={clsx(
                concern.validation === "approved"
                  ? "bg-emerald-100 text-emerald-700"
                  : concern.validation === "pending"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-red-100 text-red-700",
                "inline-block px-2 py-1 rounded text-xs font-semibold",
              )}
            >
              {concern.validation.charAt(0).toUpperCase() +
                concern.validation.slice(1)}
            </span>
          </td>

          <td className="px-2 sm:px-5 py-3 sm:py-4 flex gap-1 flex-wrap">
            <Button
              onClick={() => setSelectedConcern(concern)}
              className="px-2 sm:px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs sm:text-sm h-8 sm:h-auto"
            >
              <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 inline" />
              <span className="hidden sm:inline">View</span>
            </Button>
            <DialogAlert
              trigger={
                <Button className="px-2 sm:px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded text-xs sm:text-sm h-8 sm:h-auto">
                  <span className="hidden sm:inline">Validate</span>
                  <span className="sm:hidden">Val</span>
                </Button>
              }
              Icon={Info}
              IconColor="blue-600"
              headMessage="Validate Concern as?"
            >
              <form
                className="flex flex-row gap-3 justify-center"
                onSubmit={async (e) => {
                  e.preventDefault(); // Prevent the form from reloading the page
                  if (!newValidation) {
                    toast.error("Please select a status to validate concern.");
                    return;
                  }
                  await handleValidation(newValidation, concern.id);
                }}
              >
                <Button
                  disabled={concern?.validation === "approved" || isLoading}
                  type="submit"
                  onClick={() => setNewvalidation("approved")}
                >
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  type="submit"
                  disabled={concern?.validation === "rejected" || isLoading}
                  onClick={() => setNewvalidation("rejected")}
                >
                  Reject
                </Button>
                <Button
                  variant="outline"
                  type="submit"
                  disabled={concern?.validation === "pending" || isLoading}
                  onClick={() => setNewvalidation("pending")}
                >
                  Pending
                </Button>
              </form>
            </DialogAlert>
          </td>
        </tr>
      ))}
      <ConcernDialog
        open={!!selectedConcern}
        concern={selectedConcern}
        onDelete={(id: number) => {
          onDelete(id); // call parent callback
          setSelectedConcern(null); // close modal
        }}
        onOpenChange={(open) => {
          if (!open) setSelectedConcern(null);
        }}
      />
    </>
  );
}
