
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    try {
        const body = await request.formData();

        const cookieStore = await cookies()
        const accessToken = cookieStore.get("access_token")?.value
        if (!accessToken) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const raw = {
            title: body.get("title") as string,
            content: body.get("announcement") as string,
            notifyResidents: body.get("notifyResidents") === "true",
            notifyOfficials: body.get("notifyOfficials") === "true",
        };
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/announcements`, {
            method: "POST",
            body: JSON.stringify(raw),
            credentials: "include",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            },
        })
        if (!res.ok) {
            const data = await res.json()
            return NextResponse.json({ error: data.error || "Failed to add announcement" }, { status: res.status })
        }

        return NextResponse.json({ message: "Announcement added successfully" }, { status: 200 })
    } catch (error) {
        return NextResponse.json(
            { error: "An error occurred while processing the request." },
            { status: 500 }
        );
    }

}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const cursor = searchParams.get("cursor") || ""

    try {

        // Build query params — use & not ? for subsequent params
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/announcements/residents?$cursor=${encodeURIComponent(cursor)}`,
            {
                method: "GET",
            }
        )

        if (!res.ok) {
            const data = await res.json()
            return NextResponse.json(
                { error: data.error || "Failed to fetch announcements" },
                { status: res.status }
            )
        }

        const data = await res.json()
        return NextResponse.json(
            {
                data: data.data,
                nextCursor: data.nextCursor ?? null,
                hasNextPage: data.hasNextPage ?? false,
            },
            { status: 200 }
        )
    } catch (error) {
        console.error("Error fetching announcements:", error)
        return NextResponse.json(
            { error: "An error occurred while processing the request." },
            { status: 500 }
        )
    }
}
