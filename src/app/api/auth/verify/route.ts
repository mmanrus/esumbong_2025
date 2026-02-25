import { COOKIE_NAME } from "@/lib/constants";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {

    const body = await req.json()
    const cookieStore = await cookies()
    const accessToken = cookieStore.get(COOKIE_NAME)?.value
    if (!accessToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/verification`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body),
            credentials: "include"
        })

        if (!res.ok) {
            const text = await res.text()

            if (process.env.NODE_ENV === "development") console.error("Backend error response:", text);

            return NextResponse.json(
                { error: "Backend verification failed." },
                { status: res.status }
            );
        }

        return NextResponse.json({
            message: "Successfully Sent",
            status: 200
        })
    } catch (error) {
        if (process.env.NODE_ENV === "development") console.log("Error upon senidng your id:", error)
        return NextResponse.json({
            error: "Error sending id validation.",
            status: 500
        })
    }
}