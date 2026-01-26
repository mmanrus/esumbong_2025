import { COOKIE_NAME } from "@/lib/constants";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
    const {searchParams} = new URL(request.url)
    const search =  searchParams.get("search") || ""
    const status = searchParams.get("status") || ""
    const archived = searchParams.get("archived") || ""
    
    const validation = searchParams.get("validation") || ""
    try {

        const cookieStore = await cookies()
        const accessToken = cookieStore.get(COOKIE_NAME)?.value
        if (!accessToken) {
            return NextResponse.json({
                error: "Unauthorized"
            })
        }

        const res = await fetch(`${process.env.BACKEND_URL}/api/users?search=${encodeURIComponent(search)}&status=${encodeURIComponent(status)}&archived=${encodeURIComponent(archived)}&validation={${encodeURIComponent(validation)}}`, {
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

        return NextResponse.json(data)
    } catch (error) {
        console.error("Error submitting concern:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
} 