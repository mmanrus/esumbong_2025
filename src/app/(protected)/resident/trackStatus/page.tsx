
import { UserConcernRows } from "@/components/atoangUI/concern/userConcernRows";

export default function Page() {
  return (
    <>
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-md md:text-3xl font-bold text-foreground mb-2">Track Status</h1>
          <p className="text-sm text-muted-foreground md:text-base">
            Monitor the progress of your submitted concerns in real-time
          </p>
        </div>

        <div className="grid gap-4">
          <UserConcernRows />
        </div>
      </div>
    </>
  );
}
