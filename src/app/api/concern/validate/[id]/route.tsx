export const dynamic = "force-dynamic";

import { COOKIE_NAME } from "@/lib/constants";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // destructure inside body
  try {
    const body = await request.json();
    const { validation } = body;
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(COOKIE_NAME)?.value;
    
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || ""
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/concern/validate/${id}?type=${encodeURIComponent(type)}`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ validation }),
      }
    );
    if (!res.ok) {
      return NextResponse.json({
        error: "Faield to validate concern",
      });
    }

    return NextResponse.json({
      message: "Concern validated successfully",
    });
  } catch (error) {
    console.error("Error validating concern:", error);
    return NextResponse.json({
      error: "Error upon validating concern",
    });
  }
}
