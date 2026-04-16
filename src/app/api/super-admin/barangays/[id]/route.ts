// src/app/api/super-admin/barangays/[id]/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { COOKIE_NAME } from "@/lib/constants";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(COOKIE_NAME)?.value;
  if (!accessToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/super-admin/barangays/${params.id}/stats`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}