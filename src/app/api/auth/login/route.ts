
export const dynamic = "force-dynamic";
const url = process.env.NEXT_PUBLIC_BACKEND_URL;
if (!url) {
    throw new Error("Backend Url is not defined in environment variables.")
}

import { LoginFormSchema } from "@/defs/definitions"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
    const body = await request.json()
    const parseResult = LoginFormSchema.safeParse(body)
    if (!parseResult.success) {
        return NextResponse.json({
            message: "Invalid request data",

        }, { status: 400 })
    }
    try {
        const res = await fetch(`${url}/api/users/login`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(parseResult.data)
        })
        if (!res.ok) {
            const errorData = await res.json()
            return NextResponse.json({ message: errorData.message || "Failed to login" },
                { status: res.status }
            )
        }

        const result = await res.json()
        return NextResponse.json({ message: "Login successful", user: result }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: "Failed to Login user", }, { status: 500 })
    }
}