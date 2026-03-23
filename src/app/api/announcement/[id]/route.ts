
import { NextRequest, NextResponse } from "next/server"

export async function GET(
    request: NextRequest, // must be NextRequest
    context: { params: Promise<{ id: string}> } // do NOT destructure here
) {
    const { id } =  await context.params; // destructure inside function body

  try {
  

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/announcements/${id}`,
      {
        method: "GET",
      }
    )

    if (!res.ok) {
      const data = await res.json()
      return NextResponse.json(
        { error: data.error || "Failed to fetch announcement" },
        { status: res.status }
      )
    }

    const data = await res.json()
    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    console.error(`Error fetching announcement ${id}:`, error)
    return NextResponse.json(
      { error: "An error occurred while fetching the announcement." },
      { status: 500 }
    )
  }
}