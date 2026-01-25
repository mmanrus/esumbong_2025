export const dynamic = "force-dynamic";
import { SignupFormSchema} from "@/defs/definitions"
import { NextResponse } from "next/server"
const backendUrl = process.env.BaCKEND_URL;

if (!backendUrl) {
    throw new Error("BaCKEND_URL is not defined in environment variables.")
} 
export async function POST(request: Request) {

    const body = await request.json()
    const parseResult = SignupFormSchema.safeParse(body)
    if (!parseResult.success) {
        return NextResponse.json({
            message: "Invalid request data",
            errors: parseResult.error.format()
        })
    }

    try {
        const res = await fetch(`${backendUrl}/api/users/`, {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify(parseResult.data)

        })
        if (!res.ok) {
            const errorData = await res.json()
            return NextResponse.json({ message: errorData.message || "Failded to register user"}, { status: res.status})
        }
        const result = await res.json()
        return NextResponse.json({message: "Registered successfully", data: result}, { status: 201})
        
    } catch (error) {
        return NextResponse.json({ message: "Failed to register user"}, { status:500})
    }
}