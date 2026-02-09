import { NextRequest, NextResponse } from "next/server";

const BITMIND_KEY = process.env.BITMIND_API_KEY!;
if (!BITMIND_KEY) throw new Error("Missing BitMind API key");

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const files = formData.getAll("files") as File[];

  for (const file of files) {
    if (file.type.startsWith("image/")) {
      console.log("Start detecting")
      const allowed = await detectImage(file);
      if (!allowed) {
        return NextResponse.json(
          {
            ok: false,
            allowed: false,
            message: "AI-generated image detected.",
          },
          { status: 400 }
        );

      }
    }

    if (file.type.startsWith("video/")) {
      const allowed = await detectVideo(file);
      if (!allowed) {
        return NextResponse.json(
          {
            ok: false,
            allowed: false,
            message: "AI-generated video detected.",
          },
          { status: 400 }
        );

      }
    }
  }

  return NextResponse.json({
    ok: true,
    allowed: true,
  });

}

async function detectImage(file: File): Promise<boolean> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = buffer.toString("base64");
  const mime = file.type;
  console.log("Hello world")
  const res = await fetch(
    "https://api.bitmind.ai/oracle/v1/34/detect-image",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${BITMIND_KEY}`,
        "Content-Type": "application/json",
        "x-bitmind-application": "oracle-api",
      },
      body: JSON.stringify({
        image: `data:${mime};base64,${base64}`,
        rich: false,
      }),
    }
  );

  if (!res.ok) {
    console.error("BitMind image error:", await res.text());
    return false; // fail-closed
  }

  const data = await res.json();

  // IMPORTANT: correct casing
  return data.isAI === false;
}
async function detectVideo(file: File): Promise<boolean> {
  const fd = new FormData();
  fd.append("video", file);
  fd.append("rich", "false");

  const res = await fetch(
    "https://api.bitmind.ai/oracle/v1/34/detect-video",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${BITMIND_KEY}`,
        "x-bitmind-application": "oracle-api",
      },
      body: fd, // DO NOT set Content-Type
    }
  );

  if (!res.ok) {
    console.error("BitMind video error:", await res.text());
    return false;
  }

  const data = await res.json();
  return data.isAI === false;
}
