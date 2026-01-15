import { COOKIE_NAME } from "@/lib/constants";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
    const body = await request.body

    try {

        const cookieStore = await cookies()
        const accessToken = cookieStore.get(COOKIE_NAME)?.value
        if (!accessToken) {
            return NextResponse.json({
                error: "Unauthorized"
            })
        }

        const res = await fetch(`${process.env.BACKEND_URL}/api/concern/`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        const data = await res.json()

        if (!res.ok) {
            console.error("Error data", data)
            return NextResponse.json({ error: data.error })
        }
        console.log("All",data)

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