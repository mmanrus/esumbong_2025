import { COOKIE_NAME } from "@/lib/constants";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { deleteUploadThingFile } from "@/lib/uploadthing-delete";

const schema = z.object({ profilePhoto: z.string().url() });

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await req.json();

  const parsed = schema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });

  const cookieStore = await cookies();
  const accessToken = cookieStore.get(COOKIE_NAME)?.value;
  if (!accessToken)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    // 1. Get the current photo URL before updating
    const userRes = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${id}/photo`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (userRes.ok) {
      const userData = await userRes.json();
      // 2. Delete old photo from UploadThing if it exists
      if (userData.profilePhoto) {
        await deleteUploadThingFile(userData.profilePhoto);
      }
    }

    // 3. Save new photo URL to DB
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${id}/photo`,
      {
        method: "PATCH",
        credentials: "include",
        body: JSON.stringify(parsed.data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await res.json();
    if (!res.ok)
      return NextResponse.json({ error: data.error }, { status: res.status });

    return NextResponse.json({ message: data.message, profilePhoto: data.profilePhoto }, { status: 200 });
  } catch (error) {
    console.error("Error updating profile photo:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}