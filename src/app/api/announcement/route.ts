import { COOKIE_NAME } from "@/lib/constants";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    try {
        const body = await request.formData();

        const cookieStore = await cookies()
        const accessToken = cookieStore.get(COOKIE_NAME)?.value
        if (!accessToken) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        const raw = {
            title: body.get("title") as string,
            content: body.get("announcement") as string,
        };

        const res = await fetch(`${process.env.BACKEND_URL}/api/announcements`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json", //
            },
            body: JSON.stringify(raw)
        })
        if (!res.ok) {
            const data = await res.json()
            return NextResponse.json({ error: data.error || "Failed to add announcement" }, { status: res.status })
        }

        return NextResponse.json({ message: "Announcement added successfully" }, { status: 200 })
    } catch (error) {
        return NextResponse.json(
            { error: "An error occurred while processing the request." },
            { status: 500 }
        );
    }

}