import { COOKIE_NAME } from "@/lib/constants"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

const url = process.env.BACKEND_URL

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const cookieStore = await cookies()
        const accessToken = cookieStore.get(COOKIE_NAME)?.value
        console.log("Access token in category create route:", accessToken)
        
        console.log("Category create items:", body)
        if (!accessToken) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const result = await fetch(`${url}/api/category`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                name: body.name,
                description: body.description,
            }),
        })

        if (!result.ok) {
            return NextResponse.json(
                { error: "Failed to create category" },
                { status: result.status }
            )
        }

        return NextResponse.json(
            { message: "Category created successfully" },
            { status: 200 }
        )

    } catch (error) {
        console.log("Error creating category:", error)
        return NextResponse.json(
            { error: "Something went wrong upon creating category" },
            { status: 500 }
        )
    }
}
