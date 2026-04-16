// src/app/api/super-admin/admins/[id]/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { COOKIE_NAME } from "@/lib/constants";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(COOKIE_NAME)?.value;
  if (!accessToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(request.url);
  const action = url.searchParams.get("action"); // "reassign" | "deactivate"
  const body = action === "reassign" ? await request.json() : undefined;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/super-admin/admins/${params.id}/${action}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
      ...(body ? { body: JSON.stringify(body) } : {}),
    }
  );

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}