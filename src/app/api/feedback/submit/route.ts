import { COOKIE_NAME } from "@/lib/constants";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";



export async function POST(req: NextRequest) {

    const body = await req.formData()
    const cookieStore = await cookies()
    const accessToken = cookieStore.get(COOKIE_NAME)?.value
    const raw = {
        title: body.get("title") as string,
        feedback: body.get("feedback") as string
    }
    console.log("raw", raw)
    if (!accessToken) {
        return NextResponse.json({
            error: "Unauthorized"
        }, { status: 401 })
    }
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/feedback`, {
            method: "POST",
            credentials: "include",
            body: JSON.stringify(raw),
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            }
        })
        if (!res.ok) {
            const errorData = await res.json()
            return NextResponse.json({
                error: errorData.error || "Failed to submit feedback"
            }, { status: res.status })
        }
        return NextResponse.json({
            message: "Successfully submitted feedback."
        })
    } catch (error) {
        if (process.env.NODE_ENV === "development") {
            console.error("Error submitting feedback:", error)

        }
        return NextResponse.json({
            error: "An internal server error occurred while submitting feedback"
        }, { status: 500 })
    }

}