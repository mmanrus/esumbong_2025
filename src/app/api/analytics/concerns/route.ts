// app/api/analytics/concerns/route.ts
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const url = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;
    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const range = searchParams.get("range") ?? "30d";

    const result = await fetch(`${url}/api/analytics/concerns?range=${range}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!result.ok) {
        console.log("Analytics fetch failed:", await result.text());
      return NextResponse.json(
        { error: "Failed to fetch analytics" },
        { status: result.status }
      );
    }

    const data = await result.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Analytics proxy error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
