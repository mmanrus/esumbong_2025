// src/app/api/super-admin/dashboard/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { COOKIE_NAME } from "@/lib/constants";

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  if (!accessToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/super-admin/dashboard`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}