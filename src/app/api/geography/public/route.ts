// src/app/api/geography/public/route.ts
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/geography/${type}?${params}`,
        { next: { revalidate: 3600 } }   // cache 1 hour — geography rarely changes
    );

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}