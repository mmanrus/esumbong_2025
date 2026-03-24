// app/api/notification/[id]/route.ts
import { COOKIE_NAME } from "@/lib/constants"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

// PATCH /api/notification/[id]/read  → mark single as read
// DELETE /api/notification/[id]       → delete single
// DELETE /api/notification/all        → delete all (id = "all")

export async function PATCH(
  request: NextRequest,

  context: { params: Promise<{ id: string }> } // do NOT destructure here
) {
  const { id } = await context.params
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/notification/${id}/read`,
    { method: "PATCH", headers: { Authorization: `Bearer ${token}` } }
  )
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}

export async function DELETE(
  request: NextRequest,

  context: { params: Promise<{ id: string }> } // do NOT destructure here
) {
  const { id } = await context.params
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  // id = "all" → clear all
  const endpoint = id === "all"
    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/notification/all`
    : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/notification/${id}`

  const res = await fetch(endpoint, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}