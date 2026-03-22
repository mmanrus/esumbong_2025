import { NextRequest, NextResponse } from "next/server"

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params

    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/concern/public/${id}`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                // No auth header — public endpoint
            }
        )

        if (!res.ok) {
            const data = await res.json().catch(() => ({}))
            return NextResponse.json(
                { error: data.error || "Concern not found" },
                { status: res.status }
            )
        }

        const data = await res.json()
        return NextResponse.json(data, { status: 200 })
    } catch (error) {
        console.error(`Error fetching public concern ${id}:`, error)
        return NextResponse.json(
            { error: "An error occurred while fetching the concern." },
            { status: 500 }
        )
    }
}