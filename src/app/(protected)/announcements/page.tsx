"use client"
import { fetcher } from "@/lib/swrFetcher";
import { notFound } from "next/navigation";
import { useState } from "react"
import { toast } from "sonner";
import useSWR from "swr";


export default function Page() {
    const [announcement, setAnnouncement] = useState(null)

    const { data, error, isLoading, mutate } = useSWR(
        `/api/announcements/`,
        fetcher,
    ); 

    if (isLoading) return <p>Loading...</p>;

    if (error) {
        toast.error("Failed to load announcements.");
        notFound()
    }

    return (
        <div className="p-8">
            <h2 className="text-3xl font-bold text-[#1F4251] mb-6">
                Announcements
            </h2>
            <p>Announcements page content goes here.</p>
        </div>
    )
}