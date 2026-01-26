import { COOKIE_NAME } from "@/lib/constants";
export const dynamic = "force-dynamic";

import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL;
if (!BACKEND_URL) throw new Error("BACKEND_URL is not defined");

export async function POST(request: NextRequest) {
    console.log("POST /api/resident/concern hit"); // <-- top of function
    try {
        const body = await request.formData();

        /* ───────────── Auth ───────────── */
        const cookieStore = await cookies();
        const accessToken = cookieStore.get(COOKIE_NAME)?.value;

        if (!accessToken) {
            return NextResponse.json(
                { error: "No session cookie found" },
                { status: 401 },
            );
        }

        const needsValue = body.get("needsBarangayAssistance");
        if (needsValue === null) {
            return NextResponse.json(
                { error: "Missing needsBarangayAssistance field" },
                { status: 400 },
            );
        }

        const needsBarangayAssistance = needsValue === "true";

        const mediaRaw = body.get("metaData");
        const media = mediaRaw
            ? JSON.parse(mediaRaw as string)
            : [];

        const raw = {
            title: body.get("title") as string,
            details: body.get("details") as string,
            categoryId: (body.get("categoryId") as string) || undefined,
            other: (body.get("other") as string) || "",
            needsBarangayAssistance,
            media: media, // ✅ metadata only
        };
     
        const res = await fetch(`${BACKEND_URL}/api/concern`, {
            method: "POST",
            credentials: "include",
            body: JSON.stringify(raw),
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            },

        });

        if (!res.ok) {
            const errorText = await res.text();
            return NextResponse.json(
                { error: "Failed to submit concern", details: errorText },
                { status: res.status },
            );
        }

        const data = await res.json();

        return NextResponse.json(
            { message: "Concern submitted successfully", data },
            { status: 200 },
        );
    } catch (error) {
        console.error("Error submitting concern:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
