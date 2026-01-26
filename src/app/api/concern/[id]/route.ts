export const dynamic = "force-dynamic";

import { COOKIE_NAME } from "@/lib/constants";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest, // must be NextRequest
    context: { params: Promise<{ id: string}> } // do NOT destructure here
) {
    const { id } =  await context.params; // destructure inside function body

    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get(COOKIE_NAME)?.value;

        if (!accessToken) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const [res, resUpdates] = await Promise.all([
            fetch(`${process.env.BACKEND_URL}/api/concern/${id}`, {
                method: "GET",
                credentials: "include",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }),
            fetch(`${process.env.BACKEND_URL}/api/concern/updates/${id}`, {
                method: "GET",
                credentials: "include",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }),
        ]);

        if (!res.ok || !resUpdates.ok) {
            return NextResponse.json(
                { message: "Failed to fetch concern or updates" },
                { status: 500 }
            );
        }

        const data = await res.json();
        const updates = await resUpdates.json();
        console.log(updates)
        console.log(data.data)
        return NextResponse.json({
            message: "Concern fetched successfully",
            data: data.data,
            updates,
        });
    } catch (error) {
        return NextResponse.json(
            {
                message: "Error fetching concern",
                error: (error as Error).message,
            },
            { status: 500 }
        );
    }
}
