

import { COOKIE_NAME } from "@/lib/constants";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params

    const cookieStore = await cookies()
    const accessToken = cookieStore.get(COOKIE_NAME)?.value
    if (!accessToken) {
        return NextResponse.json({
            error: "Unauthorized"
        }, { status: 401 })
    }
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/feedback/${id}`, {
            method: "DELETE",
            credentials: "include",
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        if (!res.ok) {
            const errorData = await res.json()
            return NextResponse.json({
                error: errorData.error || "Failed to delete feedback"
            }, { status: res.status })
        }

        return NextResponse.json({
            message: "Success"
        })

    } catch (error) {
        if (process.env.NODE_ENV === "development") {
            console.error("Error fetching feedback:", error)
        }
        return NextResponse.json({
            error: `An internal server error occured while fetching feedback with id ${id}`
        }, { status: 500 })
    }
}