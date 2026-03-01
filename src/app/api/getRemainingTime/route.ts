"use server"
import { getSession } from "@/lib/sessions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const session = await getSession()
        console.log("session", session)
        if (!session?.unlockTime) {
            return NextResponse.json({ error: "No lock data" }, { status: 404 });
        }

        const now = Date.now();
        const unlockTime = new Date(session.unlockTime as string).getTime();
        const secondsRemaining = Math.ceil((unlockTime - now) / 1000);

        // ✅ Already expired — tell the client immediately
        if (secondsRemaining <= 0) {
            return NextResponse.json({ alreadyExpired: true }, { status: 200 });
        }
        return NextResponse.json({
            secondsRemaining: session?.secondsRemaining,
            email: session?.email,
            unlockTime: session?.unlockTime
        });

    } catch (error) {
        if (process.env.NODE_ENV === "development") console.log("Error getting time remaining verification", error)
        return NextResponse.json({ error: "Error", }, { status: 500 })
    }
}