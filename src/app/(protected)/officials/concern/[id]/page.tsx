"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Page() {
  const [concern, setConcern] = useState<any>(null);
  const { id } = useParams<{id: string}>()
  useEffect(() => {
    if(!id) return
    fetchData()
  }, [id]);
  const fetchData = async () => {
    const res = await fetch(`/api/concern/${id}`,{
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.message || "Something went wrong.");
    }
    setConcern(data.data);
  };
  return (
    <>
    <span>Hello world</span>
      <div>{concern?.title}</div>

      <div>{concern?.details}</div>
    </>
  );
}
