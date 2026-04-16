// app/api/auth/refresh/route.ts
//
// This is the Next.js proxy for the backend refresh endpoint.
// The frontend middleware calls THIS route (not the backend directly)
// so the new access_token can be written into HttpOnly cookies server-side.

import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function POST(request: NextRequest) {
    const cookieStore = await cookies();

    // Read the refresh token from the HttpOnly cookie
    // (the browser can't read HttpOnly cookies — only server code can)
    const refreshToken = cookieStore.get("refresh_token")?.value;

    if (!refreshToken) {
        // No refresh token → user needs to log in again
        return NextResponse.json({ error: "No refresh token" }, { status: 401 });
    }

    try {
        // Ask the backend to validate the refresh token and issue a new access token
        const res = await fetch(`${BACKEND_URL}/api/users/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
        });

        if (!res.ok) {
            // Refresh token is invalid/expired — force logout
            cookieStore.delete("access_token");
            cookieStore.delete("refresh_token");
            return NextResponse.json({ error: "Refresh failed" }, { status: 401 });
        }

        const { access } = await res.json();

        // Write the new access token back into the HttpOnly cookie
        // Same settings as your original login sets it
        cookieStore.set("access_token", access, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            // 15 minutes — matches the JWT expiry
            maxAge: 60 * 15,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Refresh route error:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}