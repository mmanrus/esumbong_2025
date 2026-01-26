export const dynamic = "force-dynamic";
import { cookies } from "next/headers"
import { COOKIE_NAME } from "@/lib/constants"
import { NextResponse } from "next/server"

const url = process.env.BACKEND_URL

export async function GET() {
    try {
        const cookieStore = await cookies()
        const accessToken = cookieStore.get(COOKIE_NAME)?.value

        if (!accessToken) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const result = await fetch(`${url}/api/notification`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        })

        if (!result.ok) {
            return NextResponse.json(
                { error: "Failed to fetch Notification" },
                { status: result.status }
            )
        }
        const data = await result.json()

        return NextResponse.json(
            {
                message: "Notification fetched successfully",
                data: data.data
            },
            { status: 200 },
        )

    } catch (error) {
        console.log("Error getting notifications:", error)
        return NextResponse.json(
            { error: "Something went wrong upon getting your notifications" },
            { status: 500 }
        )
    }
}