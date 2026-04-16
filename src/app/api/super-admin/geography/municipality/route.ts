import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { COOKIE_NAME } from "@/lib/constants";

export async function POST(request: Request) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(COOKIE_NAME)?.value;
    if (!accessToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/geography/municipality`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}