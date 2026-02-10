import { COOKIE_NAME } from "@/lib/constants";
import { Description } from "@radix-ui/react-dialog";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {

    const { id } = await context.params
    const body = await req.json()

    const cookieStore = await cookies()
    const accessToken = cookieStore.get(COOKIE_NAME)?.value
    if (!accessToken) {
        return NextResponse.json({
            error: "Unauthorized"
        }, { status: 401 })
    }

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/category/${id}`, {
            method: "PATCH",
            body: JSON.stringify({
                name: body.name?.toString() || "",
                description: body.description?.toString() || ""
            }),
            headers: {
                "Content-Type" : "application/json",
                Authorization: `Bearer ${accessToken}`
            }
        })
        if (!res.ok) {
            const data = await res.json()
            return NextResponse.json({
                error: data.error || "Something went wrong."
            }, { status: data.status })
        }

        return NextResponse.json({
            message: "Successfully updated the category"
        })
    } catch (error) {
        if (process.env.NODE_ENV === "development") {
            console.log("Something went wrong", error)
        }
        return NextResponse.json({
            message: "Something went wrong upon deleting the category."
        })
    }
}