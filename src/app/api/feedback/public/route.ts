import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/feedback/public`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        next: { revalidate: 120 }, // 2-min cache — testimonials don't need real-time
      }
    )

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      return NextResponse.json(
        { error: data.error || "Failed to fetch feedbacks" },
        { status: res.status }
      )
    }

    const data = await res.json()
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error("Error fetching public feedbacks:", error)
    return NextResponse.json(
      { error: "An error occurred while fetching feedbacks." },
      { status: 500 }
    )
  }
}