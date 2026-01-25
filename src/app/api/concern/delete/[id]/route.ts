import { COOKIE_NAME } from "@/lib/constants"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"


export async function DELETE({ params }: { params: { id: string } }) {
    const { id } =  params

    try {
        const cookieStore = await cookies()
        const accessToken = cookieStore.get(COOKIE_NAME)?.value
        if (!accessToken) {
            return NextResponse.json({
                error: "Unauthorize"
            })
        }
        const res = await fetch(`${process.env.BACKEND_URL}/api/concern/${id}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )
        if (!res.ok) {
            const { error } = await res.json()
            return NextResponse.json({
                error
            })
        }
        const { message } = await res.json()
        return NextResponse.json({
            message
        })
    } catch (error) {
        console.error("Error upon deleting the Concern", error)
        return NextResponse.json({
            error: "An internal error has occured while deleting the concern"
        })
    }
}