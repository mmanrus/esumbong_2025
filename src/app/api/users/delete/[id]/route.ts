import { COOKIE_NAME } from "@/lib/constants"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params

    try {
        const cookieStore = await cookies()
        const accessToken = cookieStore.get(COOKIE_NAME)?.value

        if (!accessToken) {
            return NextResponse.json({ error: "Unauthorized" })
        }
        const res = await fetch(`${process.env.BACKEND_URL}/api/users/${id}`, {
            method: "DELETE",
            credentials: "include",
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        if (!res.ok) {
            const data = await res.json()
            return NextResponse.json(
                { error: data.error },
                { status: res.status }
            )
        }
        const data = await res.json()
        return NextResponse.json(
            { message: data.message },
            { status: res.status }
        )
    } catch (error) {
        console.error("Error deleting profile:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}