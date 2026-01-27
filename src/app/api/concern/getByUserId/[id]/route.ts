import { COOKIE_NAME } from "@/lib/constants";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params

    const cookieStore = await cookies()
    const accessToken = cookieStore.get(COOKIE_NAME)?.value
    if (!accessToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/concern/user/${id}`,
            {
                method: "GET",
                credentials: "include",
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )
        if (!res.ok) {
            const { error } = await res.json()
            return NextResponse.json({ error }, { status: 404 })
        }
        const { data } = await res.json()
        return NextResponse.json({ data })
    } catch (error) {
        if (process.env.NODE_ENV === "development") {
            console.error("Error upon getting user concerns")
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}