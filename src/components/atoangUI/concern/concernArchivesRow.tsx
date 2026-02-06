import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { useState } from "react";
import ConcernDialog from "./concernDialog";
import { Concern } from "./concernRows";
import { formatDate } from "@/lib/formatDate";

type Props = {
  concerns: Concern[] | null;
  onDelete: (concernId: any) => void;
};

export default function ViewConcernArchivesRows({ concerns, onDelete }: Props) {
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

  const [selectedConcern, setSelectedConcern] = useState<any | null>(null);

  return (
    <>
      {concerns.map((concern: Concern, index: number) => (
        <tr
          key={concern.id ?? index}
          className="border-t hover:bg-muted/30 transition-colors"
        >
          <td className="px-5 py-4 text-sm font-medium text-foreground">
            C-{concern.id}
          </td>

          <td className="px-5 py-4 text-sm text-muted-foreground hidden md:table-cell">
            {concern.user?.fullname ?? "Unknown"}
          </td>

          <td className="px-5 py-4 text-sm text-muted-foreground hidden md:table-cell">
            {concern.category?.name ?? concern.other ?? "N/A"}
          </td>

          <td className="px-5 py-4 text-sm text-muted-foreground hidden md:table-cell">
            {formatDate(new Date(concern.archivedOn))}
          </td>

          <td className="px-5 py-4">
            <span
              className={clsx(
                concern.validation === "approved"
                  ? "bg-green-500 text-white"
                  : concern.validation === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-destructive text-white",
                "inline-block px-2 py-1 rounded   text-sm",
              )}
            >
              {concern.validation.charAt(0).toUpperCase() +
                concern.validation.slice(1)}
            </span>
          </td>

          <td className="px-5 py-4 flex gap-1">
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
