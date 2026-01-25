export const dynamic = "force-dynamic";
import { COOKIE_NAME } from "@/lib/constants";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL;

export async function POST(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const body = await request.formData();
    const { id } = await context.params
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(COOKIE_NAME)?.value;
    if (!accessToken) {
        return NextResponse.json(
            { error: "No session cookie found" },
            { status: 401 }
        );
    }
    try {
        const raw = {
            date: body.get("date") as string,
            startTime: body.get("startTime") as string,
            endTime: body.get("endTime") as string,
            residentId: body.get("residentId") as string,
            files: body.getAll("files") as File[],
        };

        const forward = new FormData();
        forward.append("date", raw.date);
        forward.append("startTime", raw.startTime);
        forward.append("endTime", raw.endTime);
        forward.append("residentId", raw.residentId);

        for (const f of raw.files) {
            const blob = new Blob([await f.arrayBuffer()], { type: f.type });
            forward.append("files", blob, f.name);
        }

        const res = await fetch(`${BACKEND_URL}/api/summon/${id}`, {
            method: "POST",
            body: forward,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        } as any);

        if (!res.ok) {
            const data = await res.json();
            return NextResponse.json(
                { error: data.error, message: data.message },
                { status: res.status }
            );
        }

        const data = await res.json();
        return NextResponse.json(
            { message: "Resident has been summmoned successfully", data },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error submitting concern:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }




}