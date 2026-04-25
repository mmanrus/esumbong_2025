export const dynamic = "force-dynamic";
import { COOKIE_NAME } from "@/lib/constants";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const url = process.env.NEXT_PUBLIC_BACKEND_URL;

// PATCH /api/hotline/:id
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(COOKIE_NAME)?.value;

    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await fetch(`${url}/api/hotline/${params.id}`, {
      method: "PATCH",
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
      return NextResponse.json({ error: "Failed to update hotline" }, { status: result.status });
    }

    const data = await result.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error("Error updating hotline:", error);
    return NextResponse.json({ error: "Something went wrong updating hotline" }, { status: 500 });
  }
}

// DELETE /api/hotline/:id
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(COOKIE_NAME)?.value;

    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await fetch(`${url}/api/hotline/${params.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!result.ok) {
      return NextResponse.json({ error: "Failed to delete hotline" }, { status: result.status });
    }

    return NextResponse.json({ message: "Hotline deleted successfully" }, { status: 200 });

  } catch (error) {
    console.error("Error deleting hotline:", error);
    return NextResponse.json({ error: "Something went wrong deleting hotline" }, { status: 500 });
  }
}