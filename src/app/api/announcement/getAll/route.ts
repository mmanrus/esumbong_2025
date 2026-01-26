export const dynamic = "force-dynamic";
import { COOKIE_NAME } from "@/lib/constants"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"


export async function GET(request: Request) {

    const { searchParams } = new URL(request.url)
    const sidbar = searchParams.get("sidebar") || ""
    const search = searchParams.get("search") || ""
    try {
        const cookieStore = await cookies()
        const accessToken = cookieStore.get(COOKIE_NAME)?.value
        if (!accessToken) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/announcements?sidbar=${encodeURIComponent(sidbar)}?search=${encodeURIComponent(search)}`, {
            method: "GET",
            credentials: "include",
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        if (!res.ok) {
            const data = await res.json()
            return NextResponse.json({ error: data.error || "Failed to fetch announcements" }, { status: res.status })
        }
        const data = await res.json()
        return NextResponse.json({ data: data }, { status: 200 })
    } catch (error) {
        console.error("Error fetching announcements:", error)
        return NextResponse.json(
            { error: "An error occurred while processing the request." },
            { status: 500 }
        );
    }
}