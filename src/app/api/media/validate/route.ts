import { NextRequest, NextResponse } from "next/server";

const BITMIND_KEY = process.env.BITMIND_API_KEY!;
if (!BITMIND_KEY) throw new Error("Missing BitMind API key");

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const files = formData.getAll("files") as File[];

  const results: {
    name: string;
    type: string;
    isAI: boolean;
  }[] = [];

  for (const file of files) {
    let isAI = false;

    if (file.type.startsWith("image/")) {
      const allowed = await detectImage(file);
      isAI = !allowed;
    }

    if (file.type.startsWith("video/")) {
      const allowed = await detectVideo(file);
      isAI = !allowed;
    }

    results.push({
      name: file.name,
      type: file.type,
      isAI,
    });
  }

  const hasAI = results.some((f) => f.isAI);

  return NextResponse.json({
    ok: true,
    allowed: !hasAI,
    files: results,
  });
}

async function detectImage(file: File): Promise<boolean> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = buffer.toString("base64");
  const mime = file.type;

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
    return true; // fail-safe: treat as AI
  }

  const data = await res.json();
  return data.isAI === true; // return directly
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
    return true;
  }

  const data = await res.json();
  return data.isAI === true;
}
