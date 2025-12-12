import { cookies } from "next/headers";
import { decrypt } from "@/lib/sessions";
import { COOKIE_NAME } from "@/lib/constants";
import { NextResponse } from "next/server";

const url = process.env.BACKEND_URL;
if (!url) throw new Error("Backend URL is not defined in environment variables.");

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME)?.value;

  const session = await decrypt(cookie || "");
  if (!session?.access) return NextResponse.json({ user: null }, { status: 401 });

  try {
    const res = await fetch(`${url}/users/me`, {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${session.access}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      return NextResponse.json({ user: null }, { status: res.status });
    }

    const data = await res.json();
    console.log("Data got from user getData", data);
    return NextResponse.json({ user: data });
  } catch (error) {
    console.error("Error getting data from api/me/route.ts:", error);
    return NextResponse.json(
      { user: null, error: "Error getting the UserData" },
      { status: 500 }
    );
  }
}
