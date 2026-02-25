export const dynamic = "force-dynamic";
import { COOKIE_NAME } from "@/lib/constants";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("official") || ""

    try {

        const cookieStore = await cookies()
        const accessToken = cookieStore.get(COOKIE_NAME)?.value
        if (!accessToken) {
            return NextResponse.json({
                error: "Unauthorized"
            })
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/concern/stats?official=${encodeURIComponent(search)}`, {
            method: "GET",
            credentials: "include",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            }
        })
        const data = await res.json()

        if (!res.ok) {
            if (process.env.NODE_ENV === "development") console.error("Error data getting stats", data)
            return NextResponse.json({ error: data.error }, {status: data.status})
        }
        if (process.env.NODE_ENV === "development") console.log("Stats data", data)

        return NextResponse.json({
            stats: data,
        }, { status: 200 })
    } catch (error) {
        if (process.env.NODE_ENV === "development") console.error("Error getting concern stats:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
} 