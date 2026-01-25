import { COOKIE_NAME } from "@/lib/constants";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, context : { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const formData = await req.formData();
  const parsed = {
    fullname: formData.get("fullname") as string,
    email: formData.get("email") as string,
    contactNumber: formData.get("contactNumber") as string,
    password: formData.get("password") as string,
  }

  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get(COOKIE_NAME)?.value

    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" })
    }
    const res = await fetch(`${process.env.BACKEND_URL}/api/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(parsed),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      }
    })
    if (!res.ok) {
      const data = await res.json()
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
