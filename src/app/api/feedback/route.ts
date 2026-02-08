import { COOKIE_NAME } from "@/lib/constants"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"


export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const me = searchParams.get("me") || ""

    const cookieStore = await cookies()
    const accessToken = cookieStore.get(COOKIE_NAME)?.value

    if (!accessToken) {
        return NextResponse.json({
            error: "Unauthorized"
        }, {
            status: 401
        })
    }
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/feedback?me=${me ? encodeURIComponent(me) : "false"}`,
            {
                method: "GET",
                credentials: "include",
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
        if (!res.ok) {
            const errorData = await res.json()
            return NextResponse.json({
                error: errorData.error || "Failed to fetch feedback"
            }, { status: res.status})
        }
        const data = await res.json()
        if (process.env.NODE_ENV === "development") {
            console.log("Fetched feedback data:", data)
        }
        return NextResponse.json({
            data: data
        })
    } catch (error) {
        if (process.env.NODE_ENV === "development") {
            console.error("Error fetching feedback:", error)
        }
        return NextResponse.json({
            error: "An internal server error occurred while fetching feedback"
        }, {
            status: 500
        })
    }

}