import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const raw = await req.json();
  const { title, feedback, star } = raw;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/feedback/${id}`,
      {
        method: "PATCH",
        credentials: "include",
        body: JSON.stringify({ title, feedback, star }),
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json(
        { error: errorData.error || "Failed to update feedback" },
        { status: res.status }
      );
    }

    return NextResponse.json({ message: "Successfully updated feedback." });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error updating feedback:", error);
    }
    return NextResponse.json(
      { error: "An internal server error occurred while updating feedback" },
      { status: 500 }
    );
  }
}