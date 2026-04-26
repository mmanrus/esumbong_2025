export const dynamic = "force-dynamic";
import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";



const url = process.env.NEXT_PUBLIC_BACKEND_URL
if (!url) {
    throw new Error("Backend Url is not defined in environment variables.")
}


export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || ""
    try {
        const cookieStore = await cookies()
        const accessToken = cookieStore.get("access_token")?.value
        const res = await fetch(`${url}/api/category?type=${encodeURIComponent(type)}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${accessToken}`
            }
        })

        if (!res.ok) {
            return NextResponse.json({ error: "Failed to fetch categories" }, { status: res.status })
        }

        const data = await res.json()
        return NextResponse.json({ categories: data }, { status: 200 })
    } catch (error) {
        console.error("Error fetching categories:", error)
        return NextResponse.json({ error: "Error fetching categories" }, { status: 500 })
    }
}
