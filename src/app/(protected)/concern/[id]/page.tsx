"use client";
import ConcernIdPage from "@/components/atoangUI/concernIdPage";
import { useParams } from "next/navigation";

export default function Page() {
  const { id } = useParams<{ id: string }>();
  return <ConcernIdPage id={id} />;
}
