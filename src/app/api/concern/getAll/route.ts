export const dynamic = "force-dynamic";
import { COOKIE_NAME } from "@/lib/constants";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
    const {searchParams} = new URL(request.url)
    const search =  searchParams.get("search") || ""
    const status = searchParams.get("status") || ""
    const archived = searchParams.get("archived") || ""
    const recent = searchParams.get("recent") || ""
    
    const validation = searchParams.get("validation") || ""
    try {

        const cookieStore = await cookies()
        const accessToken = cookieStore.get(COOKIE_NAME)?.value
        if (!accessToken) {
            return NextResponse.json({
                error: "Unauthorized"
            })
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/concern?search=${encodeURIComponent(search)}&status=${encodeURIComponent(status)}&archived=${encodeURIComponent(archived)}&validation=${encodeURIComponent(validation)}&recent=${encodeURIComponent(recent)}`, {
            method: "GET",
            credentials: "include",
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        const data = await res.json()

        if (!res.ok) {
            console.error("Error data", data)
            return NextResponse.json({ error: data.error })
        }

        return NextResponse.json({
            data: data.data,
        })
    } catch (error) {
        console.error("Error submitting concern:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
} 