// app/api/notification/me/route.ts
import { COOKIE_NAME } from "@/lib/constants"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const cursor = searchParams.get("cursor") || ""
    const take = searchParams.get("take") || "20"

    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_NAME)?.value
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const params = new URLSearchParams()
    if (cursor) params.set("cursor", cursor)
    params.set("take", take)

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/notification/me?${params}`,
        { headers: { Authorization: `Bearer ${token}` } }
    )
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
}


// app/api/notification/read-all/route.ts

export async function PATCH(request: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/notification/read-all`,
    { method: "PATCH", headers: { Authorization: `Bearer ${token}` } }
  )
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}