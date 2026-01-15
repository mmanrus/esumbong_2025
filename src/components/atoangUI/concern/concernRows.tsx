import { Button } from "@/components/ui/button";
import DialogAlert from "../alertDialog";
import { Info, Link } from "lucide-react";
import clsx from "clsx";

export type Concern = {
  id: number;
  validation: string;
  issuedAt: string;
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
};

export default function ViewConcernRows({ concerns }: Props) {
  if (!concerns || concerns.length === 0) {
    return (
      <tr>
        <td colSpan={6} className="text-center py-6 text-gray-500">
          No Concerns Found
        </td>
      </tr>
    );
  }

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
            {new Date(concern.issuedAt).toLocaleDateString()}
          </td>

          <td className="px-4 py-3">
            <span className={clsx(concern.validation === "approved"? "bg-green-500 text-white": concern.validation==="pending"? "bg-yellow-100 text-yellow-800": "bg-destructive text-white" ,"inline-block px-2 py-1 rounded   text-sm")}>
              {concern.validation.charAt(0).toUpperCase() + concern.validation.slice(1)}
            </span>
          </td>

          <td className="px-4 py-3 flex gap-1">
            <a href={`/concern/${concern.id}`}>
              <Button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">
                View
              </Button>
            </a>
            <DialogAlert
              trigger={
                <Button className="px-3 py-1 bg-amber-500 text-white rounded text-sm">
                  Validate
                </Button>
              }
              Icon={Info}
              IconColor="blue-600"
              message="Do you want to mark this data as Validated?"
              headMessage=""
            />
          </td>
        </tr>
      ))}
    </>
  );
}
