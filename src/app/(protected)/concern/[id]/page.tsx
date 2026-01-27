"use client";
import TakeActionModal from "@/components/atoangUI/action";
import ValidationModal from "@/components/atoangUI/validationModal";
import Timeline from "@/components/timeline";
import { Button } from "@/components/ui/button";

import useSWR from "swr";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/authContext";
import { useConcern } from "@/contexts/concernContext";
import clsx from "clsx";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { fetcher } from "@/lib/swrFetcher";
import Image from "next/image";
import ConcernMediaGrid from "@/components/atoangUI/ConcernMediaGrid";

export default function Page() {
  const { user } = useAuth();
  const [openValidation, setOpenValidation] = useState(false);
  const {
    setConcern,
    concern,
    setConcernId,
    setConcernUpdates,
    concernUpdates,
  } = useConcern();
  const [openAction, setOpenAction] = useState(false);

  const { id } = useParams<{ id: string }>();

  const { data, error, isLoading, mutate } = useSWR(
    id ? `/api/concern/${id}` : null,
    fetcher
  );

  useEffect(() => {
    if (!data) return;
    setConcern(data.data);
    setConcernUpdates(data.updates.data);
    setConcernId(id);
  }, [data, id]);

  if (isLoading) return <p>Loading...</p>;
  if (error) {
    toast.error("Failed to load concern data.");
    notFound();
  }
  const MAX_VISIBLE = 5;

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/concern/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const { error } = await res.json();
        toast.error(error);
      }
      const { message } = await res.json();
      toast.success(message);
    } catch (error) {
      toast.error("Something went wrong");
      return;
    }
  };
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{concern?.title}</CardTitle>

          <CardAction>
            <Button
              disabled={user?.type !== "barangay_official"}
              className={clsx(
                "w-full",
                concern?.validation === "approved"
                  ? "bg-green-500 hover:bg-green-600"
                  : concern?.validation === "pending"
                  ? "bg-yellow-500 hover:bg-yellow-600"
                  : "bg-red-500 hover:bg-red-600"
              )}
              onClick={() => setOpenValidation(true)}
            >
              {concern?.validation === "approved"
                ? "Approved"
                : concern?.validation === "pending"
                ? "Pending"
                : "Rejected"}
            </Button>
          </CardAction>
          <CardDescription className="flex flex-col gap-1">
            <span>Submitted by: {concern?.user?.fullname}</span>
            <span>Email: {concern?.user?.email}</span>
            <span>Contact Number: {concern?.user?.contactNumber}</span>
            <span>Needs barangay assistance: {concern?.needsBarangayAssistance ? "Yes" : "No"}</span>
            <span>
              date issued:{" "}
              {concern?.issuedAt
                ? new Date(concern?.issuedAt).toLocaleString()
                : "N/A"}
            </span>
          </CardDescription>
          <CardContent>
            <span>{concern?.details}</span>
            <div className="flex flex-row gap-3">
              {user?.type === "barangay_official" && (
                <Button onClick={() => setOpenAction(true)}>Take Action</Button>
              )}
              {user?.type === "resident" && user?.id === concern?.userId && (
                <>
                  <Button onClick={() => handleDelete(id)}>
                    Delete Concern
                  </Button>
                  <Button>Update Concern</Button>
                </>
              )}
            </div>
            <ConcernMediaGrid media={concern?.media} />

          </CardContent>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Concern updates:</CardTitle>
        </CardHeader>
        <CardContent>
          {concernUpdates ? (
            <Timeline updates={concernUpdates} />
          ) : (
            <p>Loading updates...</p>
          )}
        </CardContent>
      </Card>
      <ValidationModal open={openValidation} setOpen={setOpenValidation} />
      {/**<TakeActionModal open={openAction} setOpen={setOpenAction} />*/}
    </>
  );
}
