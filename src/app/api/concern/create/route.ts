export const dynamic = "force-dynamic";
import { ConcernFormSchema } from "@/defs/concern";
import { COOKIE_NAME } from "@/lib/constants";
import { decrypt } from "@/lib/sessions";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL;
if (!BACKEND_URL) throw new Error("BACKEND_URL is not defined");

export async function POST(request: NextRequest) {
  try {
    const body = await request.formData();

    const cookieStore = await cookies();
    const accessToken = cookieStore.get(COOKIE_NAME)?.value;
    if (!accessToken) {
      return NextResponse.json(
        { error: "No session cookie found" },
        { status: 401 }
      );
    }

    await decrypt(accessToken);

    // ✅ FIX 1: read + convert boolean
    const needsValue = body.get("needsBarangayAssistance");
    if (needsValue === null) {
      return NextResponse.json(
        { error: "Missing needsBarangayAssistance field" },
        { status: 400 }
      );
    }
    const needsBarangayAssistance = needsValue === "true";

    const raw = {
      title: body.get("title") as string,
      needsBarangayAssistance,
      details: body.get("details") as string,
      categoryId: body.get("categoryId") as string,
      other: (body.get("other") as string | null) ?? "",
      files: body.getAll("files") as File[],
    };

    const parsed = {
      ...raw,
      categoryId: raw.categoryId ? raw.categoryId : undefined,
    };

    const validation = ConcernFormSchema.safeParse(parsed);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid form data", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    // Prepare Node FormData
    const forward = new FormData();
    forward.append("title", raw.title);
    forward.append("details", raw.details);
    forward.append("categoryId", raw.categoryId ?? "");
    forward.append("other", raw.other ?? "");

    // ✅ FIX 2: forward boolean
    forward.append(
      "needsBarangayAssistance",
      String(needsBarangayAssistance)
    );

    for (const f of raw.files) {
      const blob = new Blob([await f.arrayBuffer()], { type: f.type });
      forward.append("files", blob, f.name);
    }

    const res = await fetch(`${BACKEND_URL}/api/concern`, {
      method: "POST",
      body: forward,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    } as any);

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json(
        { error: "Failed to submit concern", details: errorText },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(
      { message: "Concern submitted successfully", data },
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
