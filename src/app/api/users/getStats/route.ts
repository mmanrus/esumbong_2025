import { COOKIE_NAME } from "@/lib/constants";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest) {

    const cookieStore = await cookies()
    const accessToken = cookieStore.get(COOKIE_NAME)?.value
    if (!accessToken) {
        return NextResponse.json({
            error: "Unauthorized"
        })
    }

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/getStats`, {
            method: "GET",
            credentials: "include",
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        const data = await res.json()

        if (!res.ok) {
            if (process.env.NODE_ENV === "development") console.error("Error data", data)
            return NextResponse.json({ error: data.error })
        }

        return NextResponse.json({stats: data.stats})
    } catch (error) {
        if (process.env.NODE_ENV === "development") console.error("Error submitting concern:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}