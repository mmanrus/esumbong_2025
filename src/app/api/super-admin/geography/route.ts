// src/app/api/super-admin/geography/route.ts
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME } from "@/lib/constants";

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(COOKIE_NAME)?.value;
  if (!accessToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");           // "island-groups" | "regions" | etc.
  const islandGroupId = searchParams.get("islandGroupId");
  const regionId = searchParams.get("regionId");
  const provinceId = searchParams.get("provinceId");
  const municipalityId = searchParams.get("municipalityId");

  const params = new URLSearchParams();
  if (islandGroupId) params.set("islandGroupId", islandGroupId);
  if (regionId) params.set("regionId", regionId);
  if (provinceId) params.set("provinceId", provinceId);
  if (municipalityId) params.set("municipalityId", municipalityId);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/geography/${type}?${params.toString()}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}