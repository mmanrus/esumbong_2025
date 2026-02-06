
import { UserConcernRows } from "@/components/atoangUI/concern/userConcernRows";

export default function Page() {
  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Track Status</h1>
          <p className="text-muted-foreground mt-1">
            Monitor the progress of your submitted concerns
          </p>
        </div>

        <div className="grid gap-4">
          <UserConcernRows />
        </div>
      </div>
    </>
  );
}
