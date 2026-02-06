


export const dynamic = "force-dynamic";

import { COOKIE_NAME } from "@/lib/constants";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
) {
    const cookieStore = await cookies(); // synchronous
    const accessToken = cookieStore.get(COOKIE_NAME)?.value;

    if (!accessToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
        console.log("Fetching concern history with access token:", accessToken, "from backend URL:", backendUrl);
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/concern/history`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!res.ok) {
            const data = await res.json();
            return NextResponse.json({ error: data.error || "Failed to fetch announcement" }, { status: res.status });
        }
        console.log("Successfully fetched concern history");
        const data = await res.json();
        console.log("Concern history data:", data);
        return NextResponse.json({ data }, { status: 200 });
    } catch (error) {
        console.error("Error fetching announcement:" + error);
        return NextResponse.json({ error: "An error occurred while processing the request." }, { status: 500 });
    }
}
