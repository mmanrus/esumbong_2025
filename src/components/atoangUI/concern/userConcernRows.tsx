import { useAuth } from "@/contexts/authContext";
import { fetcher } from "@/lib/swrFetcher";
import { notFound, redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";
import { Concern } from "./concernRows";
import { formatDate } from "@/lib/formatDate";
import { Button } from "@/components/ui/button";

export function UserConcernRows() {
  const { user } = useAuth();
  const { data, error, isLoading, mutate } = useSWR(
    `/api/concern/getByUserId/${user?.id}`,
    fetcher,
  );
  const [userConcerns, setUserConcerns] = useState<Concern[] | null>(null);
  useEffect(() => {
    if (!data) return;
    setUserConcerns(data.data);
  }, [data]);
  if (isLoading)
    return (
      <div className="flex justify-center items-center">
        <span>Loading</span>
      </div>
    );
  if (error) {
    toast.error("Failed to load concerns");
    notFound();
  }
  if (!Array.isArray(userConcerns) || userConcerns.length === 0) {
    <tr>
      <td colSpan={4} className="text-center py-6 text-gray-500">
        No Concerns Found
      </td>
    </tr>;
  }

  return (
    <>
      {userConcerns?.map((c: Concern, index: any) => (
        <tr key={index} className="border-t hover:bg-gray-50">
          <td className="px-6 py-3">{c.id}</td>
          <td className="px-6 py-3">{c.title}</td>
          <td className="px-6 py-3">{formatDate(new Date(c.issuedAt))}</td>
          <td className="px-6 py-3">{c.validation}</td>
          <td className="px-4 py-3 flex gap-1">
            <Button
              type="button"
              onClick={() => redirect(`/concern/${c.id}`)}
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
            >
              Go to
            </Button>
          </td>
        </tr>
      ))}
    </>
  );
}
