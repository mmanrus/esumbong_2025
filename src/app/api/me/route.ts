export const dynamic = "force-dynamic";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const url = process.env.NEXT_PUBLIC_BACKEND_URL;
if (!url) throw new Error("Backend URL is not defined in environment variables.");
export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    return NextResponse.json({ user: null }, { status: 401 }); // ✅
  }

  try {
    const res = await fetch(`${url}/api/users/me`, {
      method: "GET",
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
    console.error("Error in /api/me:", error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
