import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { useState } from "react";
import ConcernDialog from "./concernDialog";

export type Concern = {
  id: number;
  validation: string;
  issuedAt: string;
  archivedOn: string;
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

export default function ViewConcernArchivesRows({ concerns, onDelete }: Props) {
  if (!concerns || concerns.length === 0) {
    return (
      <tr>
        <td colSpan={6} className="text-center py-6 text-gray-500">
          No Concerns Found
        </td>
      </tr>
    );
  }

  const [selectedConcern, setSelectedConcern] = useState<any | null>(null);

  return (
    <>
      {concerns.map((concern: Concern, index: number) => (
        <tr key={concern.id ?? index}>
          <td className="px-4 py-3">C-{concern.id}</td>

          <td className="px-4 py-3">{concern.user?.fullname ?? "Unknown"}</td>

          <td className="px-4 py-3">
            {concern.category?.name ?? concern.other ?? "N/A"}
          </td>

          <td className="px-4 py-3">
            {new Date(concern.archivedOn).toLocaleDateString()}
          </td>

          <td className="px-4 py-3">
            <span
              className={clsx(
                concern.validation === "approved"
                  ? "bg-green-500 text-white"
                  : concern.validation === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-destructive text-white",
                "inline-block px-2 py-1 rounded   text-sm"
              )}
            >
              {concern.validation.charAt(0).toUpperCase() +
                concern.validation.slice(1)}
            </span>
          </td>

          <td className="px-4 py-3 flex gap-1">
            <Button
              onClick={() => setSelectedConcern(concern)}
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
            >
              View
            </Button>
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
