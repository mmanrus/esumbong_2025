export const dynamic = "force-dynamic";
import { cookies } from "next/headers";
import { COOKIE_NAME } from "@/lib/constants";
import { NextResponse } from "next/server";

const url = process.env.NEXT_PUBLIC_BACKEND_URL;
if (!url) throw new Error("Backend URL is not defined in environment variables.");

export async function GET() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get(COOKIE_NAME)?.value

  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const res = await fetch(`${url}/api/users/me`, {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      return NextResponse.json({ user: null }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ user: data });
  } catch (error) {
    console.error("Error getting data from api/me/route.ts:", error);
    return NextResponse.json(
      { user: null, error: "Error getting the UserData" },
      { status: 500 }
    );
  }
}
