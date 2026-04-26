export const dynamic = "force-dynamic";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || ""
    const archived = searchParams.get("archived") || ""
    const recent = searchParams.get("recent") || ""
    const spam = searchParams.get("spam") || ""
    const cursor = searchParams.get("cursor") || ""

    const validation = searchParams.get("validation") || ""
    try {

        const cookieStore = await cookies()
        const accessToken = cookieStore.get("access_token")?.value
        if (!accessToken) {
            return NextResponse.json({
                error: "Unauthorized"
            })
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/concern?search=${encodeURIComponent(search)}&status=${encodeURIComponent(status)}&archived=${encodeURIComponent(archived)}&validation=${encodeURIComponent(validation)}&recent=${encodeURIComponent(recent)}&spam=${encodeURIComponent(spam)}&cursor=${encodeURIComponent(cursor)}`, {
            method: "GET",
            credentials: "include",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json"
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

        if (process.env.NODE_ENV === "development") console.error("Error getting concern:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
} 
