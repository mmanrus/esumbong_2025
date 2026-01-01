"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [concern, setConcern] = useState<any>(null);
  const { id } = await params;
  useEffect(() => {
    fetchData()
  }, [id]);
  const fetchData = async () => {
    const res = await fetch(`/api/concern/${id}`);
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.message || "Something went wrong.");
    }
    setConcern(data.data);
  };
  return (
    <>
      <div>{concern?.title}</div>

      <div>{concern?.description}</div>
    </>
  );
}
