import { COOKIE_NAME } from "@/lib/constants"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const sidebar = searchParams.get("sidebar") || ""
  const search = searchParams.get("search") || ""
  const cursor = searchParams.get("cursor") || ""

  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("access_token")?.value
    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Build query params — use & not ? for subsequent params
    const params = new URLSearchParams()
    if (sidebar) params.set("sidebar", sidebar)
    if (search) params.set("search", search)
    if (cursor) params.set("cursor", cursor)

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/announcements?${params.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    if (!res.ok) {
      const data = await res.json()
      return NextResponse.json(
        { error: data.error || "Failed to fetch announcements" },
        { status: res.status }
      )
    }

    const data = await res.json()
    return NextResponse.json(
      {
        data: data.data,
        nextCursor: data.nextCursor ?? null,
        hasNextPage: data.hasNextPage ?? false,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error fetching announcements:", error)
    return NextResponse.json(
      { error: "An error occurred while processing the request." },
      { status: 500 }
    )
  }
}
