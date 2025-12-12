import { COOKIE_NAME } from "@/lib/constants";
import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";



const url = process.env.BACKEND_URL
if (!url) {
    throw new Error("Backend Url is not defined in environment variables.")
}


export async function GET(request: NextRequest) {
    try {
        const cookieStore = await cookies()
        const accessToken = cookieStore.get(COOKIE_NAME)?.value
        const res = await fetch(`${url}/api/category`, {
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