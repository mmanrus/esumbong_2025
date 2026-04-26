


export const dynamic = "force-dynamic";

import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
) {
    const { searchParams } = new URL(request.url)
    const cursor = searchParams.get("cursor") || ""
    const cookieStore = await cookies(); // synchronous
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/concern/history?cursor=${encodeURIComponent(cursor)}`, {
            credentials: "include",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            },
        });

        if (!res.ok) {
            const data = await res.json();
            return NextResponse.json({ error: data.error || "Failed to fetch announcement" }, { status: res.status });
        }
        const data = await res.json();
        if (process.env.NODE_ENV === "development") console.log("Concern history data:", data);
        console.log(data)
        return NextResponse.json({
            data: data.data,
            nextCursor: data.nextCursor,
            hasNextPage: data.hasNextPage,
        })
    } catch (error) {
        if (process.env.NODE_ENV === "development") console.error("Error fetching announcement:" + error);
        return NextResponse.json({ error: "An error occurred while processing the request." }, { status: 500 });
    }
}

