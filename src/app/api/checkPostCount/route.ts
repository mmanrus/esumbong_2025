import { COOKIE_NAME } from "@/lib/constants";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {

    const cookieStore = await cookies()
    const accessToken = cookieStore.get(COOKIE_NAME)?.value

    if (!accessToken) {
        return NextResponse.json({
            error: "Not Authorized"
        }, { status: 401 })
    }
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/checkPostCount`, {
            method: 'GET',
            credentials: "include",
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        const data = await res.json()

        if (process.env.NODE_ENV === "development") console.log("Response data.", data)
        if (!res.ok) {

            return NextResponse.json({
                error: data.error,
                isAllowed: data.isAllowed ?? false
            }, { status: res.status })
        }

        return NextResponse.json({
            message: data.message,
            isSpam: data.isSpam,
            isAllowed: data.isAllowed
        }, { status: res.status })
    } catch (error) {
        if (process.env.NODE_ENV === "development") console.log(error)
        return NextResponse.json({ error: "An Internal Server error." }, { status: 500 })
    }
}