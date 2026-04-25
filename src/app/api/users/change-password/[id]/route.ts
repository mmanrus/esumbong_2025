import { COOKIE_NAME } from "@/lib/constants";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine(d => d.newPassword === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  if (!accessToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${id}/change-password`, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({ currentPassword: parsed.data.currentPassword, newPassword: parsed.data.newPassword }),
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
  });

  const data = await res.json();
  if (!res.ok) return NextResponse.json({ error: data.error }, { status: res.status });
  return NextResponse.json({ message: data.message }, { status: 200 });
}