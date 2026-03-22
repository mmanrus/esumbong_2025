import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/stats/public`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        next: { revalidate: 300 }, // cache 5 mins — stats don't need to be real-time
      }
    )

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      return NextResponse.json(
        { error: data.error || "Failed to fetch stats" },
        { status: res.status }
      )
    }

    const data = await res.json()
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error("Error fetching public stats:", error)
    return NextResponse.json(
      { error: "An error occurred while fetching stats." },
      { status: 500 }
    )
  }
}