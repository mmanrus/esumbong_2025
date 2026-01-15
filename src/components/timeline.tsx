import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ConcernUpdates, useConcern } from "@/contexts/concernContext";
type TimelineProps = {
  updates: ConcernUpdates[];
};

export default function Timeline({ updates }: TimelineProps) {
  const renderIcon = (status: string, index: number) => {
    if (status === "approved" || status === "resolved")
      return <Check className="h-4 w-4 text-white bg-green-600 rounded-full" />;
    if (status === "rejected")
      return <X className="h-4 w-4 text-white bg-destructive rounded-full" />;
    return index + 1;
  };

  return (
    <div className="max-w-[--breakpoint-sm] mx-auto py-2 md:py-6 px-2">
      <div className="relative ml-6">
        <div className="absolute left-0 inset-y-0 border-l-2 border-muted-foreground" />
        {updates && updates.length > 0 ? (
          updates.map((_update, index) => (
            <div key={index} className="relative pl-10 pb-10 last:pb-0">
              <div
                className={cn(
                  "absolute left-px -translate-x-1/2 h-7 w-7 border-2 border-muted-foreground/40 flex items-center justify-center rounded-full bg-accent ring-8 ring-background",
                  {
                    "bg-green-600 border-primary text-primary-foreground":
                      _update.status === "approved",
                    "bg-destructive border-primary text-destructive-foreground":
                      _update.status === "rejected",
                    "bg-accent border-muted-foreground text-muted-foreground":
                      _update.status !== "approved" &&
                      _update.status !== "rejected",
                  }
                )}
              >
                {renderIcon(_update.status, index)}
              </div>
              <div className="pt-1 space-y-2">
                <h3 className="text-m font-semibold tracking-[-0.01em]">
                  {new Date(_update.createdAt).toLocaleDateString()} -{" "}
                  {_update.status.charAt(0).toUpperCase() +
                    _update.status.slice(1)}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {_update.updateMessage}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p>No updates available.</p>
        )}
      </div>
    </div>
  );
}
