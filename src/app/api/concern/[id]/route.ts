import { COOKIE_NAME } from "@/lib/constants";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const { id } = await params;
    try {

        const cookieStore = await cookies()
        const accessToken = cookieStore.get(COOKIE_NAME)?.value

        if (!accessToken) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const res = await fetch(`${process.env.BACKEND_URL}/api/concern/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        })

        const data = await res.json()
        if (!res.ok) {
            return NextResponse.json({
                message: data.message || "Failed to fetch concern", status: res.status
            })

        }
        console.log("Fetched concern data:", data)
        return NextResponse.json({
            message: "Concern fetched successfully",
            data: data.data,
            status: res.status
        })
    } catch (error) {
        console.error("Error fetching concern:", error)
        return NextResponse.json({
            message: "Error fetching concern",
            error: (error as Error).message
        })
    }
}
