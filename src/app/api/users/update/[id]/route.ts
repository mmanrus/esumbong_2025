import { COOKIE_NAME } from "@/lib/constants";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const updateProfileSchema = z.object({
  fullname: z.string().min(2),
  email: z.string().email(),
  phone: z.string(),
  address: z.string().optional(),
  barangay: z.string().optional(),
});

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const body = await req.json()

  try {
    if (process.env.NODE_ENV === "development") console.log("Updating")
    const parsed = updateProfileSchema.parse(body);
    const cookieStore = await cookies()
    const accessToken = cookieStore.get(COOKIE_NAME)?.value

    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" })
    }
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${id}`, {
      method: "PATCH",
      credentials: "include",
      body: JSON.stringify(parsed),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      }
    })
    if (!res.ok) {
      const data = await res.json()
      if (process.env.NODE_ENV === "development") console.log(data)
      return NextResponse.json(
        { error: data.error },
        { status: res.status }
      )
    }
    const data = await res.json()
    return NextResponse.json(
      { message: data.message },
      { status: res.status }
    )
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
