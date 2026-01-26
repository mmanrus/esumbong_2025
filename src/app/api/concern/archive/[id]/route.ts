export const dynamic = "force-dynamic";
import { COOKIE_NAME } from "@/lib/constants"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"


export async function PATCH(
    request: NextRequest, // must be NextRequest
    context: { params: Promise<{ id: string }> } // do NOT destructure here
) {
    const { id } = await context.params; // destructure inside function body

    try {
        const cookieStore = await cookies()
        const accessToken = cookieStore.get(COOKIE_NAME)?.value
        if (!accessToken) {
            return NextResponse.json({
                error: "Unauthorized"
            })
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/concern/archive/${id}`, {
            method: "PATCH",
            credentials: "include",
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        if (!res.ok) {
            const { error } = await res.json()
            return NextResponse.json({
                error
            })
        }
        const { message } = await res.json()
        return NextResponse.json({
            message
        })

    } catch (error) {
        console.error("Error upon archiving concern:", error)

    }
}