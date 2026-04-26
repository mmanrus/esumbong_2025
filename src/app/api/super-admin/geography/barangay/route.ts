import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
// POST /api/super-admin/geography/barangay
// Body: { name: string, municipalityId: number }
export async function POST(request: NextRequest) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;
    if (!accessToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/geography/barangay`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}

// DELETE /api/super-admin/geography/barangay?id=123
export async function DELETE(request: NextRequest,) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;
    if (!accessToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "Barangay ID is required." }, { status: 400 });

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/geography/barangay/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (res.status === 204) return new NextResponse(null, { status: 204 });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}
