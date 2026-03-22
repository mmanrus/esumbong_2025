import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/concern/public/sample`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        // No auth header — public endpoint
        next: { revalidate: 60 }, // cache for 60s, landing page data is not real-time
      }
    )

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      return NextResponse.json(
        { error: data.error || "Failed to fetch concerns" },
        { status: res.status }
      )
    }

    const data = await res.json()
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error("Error fetching public sample concerns:", error)
    return NextResponse.json(
      { error: "An error occurred while fetching concerns." },
      { status: 500 }
    )
  }
}