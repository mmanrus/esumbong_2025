// api/users/getAll/route.ts
import { COOKIE_NAME } from "@/lib/constants";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""

    const type = searchParams.get("type") || ""
    const cursor = searchParams.get("cursor") || ""

    try {

        const cookieStore = await cookies()
        const accessToken = cookieStore.get(COOKIE_NAME)?.value
        if (!accessToken) {
            return NextResponse.json({
                error: "Unauthorized"
            })
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users?search=${encodeURIComponent(search)}&type=${encodeURIComponent(type)}&cursor=${encodeURIComponent(cursor)}`, {
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
        return NextResponse.json({
            data: data.data,
            nextCursor: data.nextCursor,
            hasNextPage: data.hasNextPage,
        })
    } catch (error) {
        if (process.env.NODE_ENV === "development") console.error("Error submitting concern:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
} 