
import { COOKIE_NAME } from "@/lib/constants";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const url = process.env.NEXT_PUBLIC_BACKEND_URL;

// GET /api/hotline?barangayId=1
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const barangayId = searchParams.get("barangayId");

    if (!barangayId) {
      return NextResponse.json({ error: "barangayId is required" }, { status: 400 });
    }

    const result = await fetch(`${url}/api/hotline?barangayId=${barangayId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!result.ok) {
      return NextResponse.json({ error: "Failed to fetch hotlines" }, { status: result.status });
    }

    const data = await result.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error("Error fetching hotlines:", error);
    return NextResponse.json({ error: "Something went wrong fetching hotlines" }, { status: 500 });
  }
}

// POST /api/hotline
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(COOKIE_NAME)?.value;

    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await fetch(`${url}/api/hotline`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        label: body.label,
        number: body.number,
        icon: body.icon,
        bgColor: body.bgColor,
        borderColor: body.borderColor,
        textColor: body.textColor,
        iconBg: body.iconBg,
      }),
    });

    if (!result.ok) {
      return NextResponse.json({ error: "Failed to create hotline" }, { status: result.status });
    }

    const data = await result.json();
    return NextResponse.json(data, { status: 201 });

  } catch (error) {
    console.error("Error creating hotline:", error);
    return NextResponse.json({ error: "Something went wrong creating hotline" }, { status: 500 });
  }
}