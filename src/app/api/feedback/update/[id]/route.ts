import { NextRequest, NextResponse } from "next/server";

import { COOKIE_NAME } from "@/lib/constants";
import { cookies } from "next/headers";


export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params
    const cookieStore = await cookies()
    const accessToken = cookieStore.get(COOKIE_NAME)?.value
    const raw = await req.json(); // <-- use json() instead of formData()
    const { title, feedback } = raw;
    console.log("raw", raw)
    if (!accessToken) {
        return NextResponse.json({
            error: "Unauthorized"
        }, { status: 401 })
    }
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/feedback/${id}`, {
            method: "PATCH",
            credentials: "include",
            body: JSON.stringify({ title, feedback }),
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            }
        })
        if (!res.ok) {
            const errorData = await res.json()
            return NextResponse.json({
                error: errorData.error || "Failed to update feedback"
            }, { status: res.status })
        }
        return NextResponse.json({
            message: "Successfully submitted feedback."
        })
    } catch (error) {
        if (process.env.NODE_ENV === "development") {
            console.error("Error updating feedback:", error)

        }
        return NextResponse.json({
            error: "An internal server error occurred while submitting feedback"
        }, { status: 500 })
    }

}