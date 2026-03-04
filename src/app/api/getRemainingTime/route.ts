import { getSession } from "@/lib/sessions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const session = await getSession();

        // No session or no unlock info → treat as 404
        if (!session?.unlockTime) {
            return NextResponse.json({ error: "No lock data" }, { status: 404 });
        }

        const now = Date.now();
        const unlockTimeMs = new Date(session.unlockTime as string).getTime();
        const secondsRemaining = Math.ceil((unlockTimeMs - now) / 1000);

        // Already expired
        if (secondsRemaining <= 0) {
            return NextResponse.json({ alreadyExpired: true }, { status: 200 });
        }

        // Return full lock info
        return NextResponse.json({
            secondsRemaining,
            email: session.email,
            unlockTime: session.unlockTime,
        });
    } catch (error) {
        if (process.env.NODE_ENV === "development") {
            console.error("Error fetching remaining lock time:", error);
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}