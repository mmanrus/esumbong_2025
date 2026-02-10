import { COOKIE_NAME } from "@/lib/constants";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params
    const cookieStore = await cookies()
    const accessToken = cookieStore.get(COOKIE_NAME)?.value
    if (!accessToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/category/${id}`,
            {
                method: "DELETE",
                credentials: "include",
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )
        if (!res.ok) {
            const data = await res.json()
            return NextResponse.json({
                error: data.error || "Something went wrong"
            }, { status: data.status })
        }
        const data = await res.json()
        return NextResponse.json({ message: data.message })
    } catch (error) {
        if (process.env.NODE_ENV === "development") {
            console.error("Error upon deleting category", error)
        }
        return NextResponse.json({
            error: "Unexpected internal error has occured while deleting the category"
        }, { status: 500 })
    }
}