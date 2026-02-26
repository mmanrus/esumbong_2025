import { NextRequest, NextResponse } from "next/server";
import { updateVerificationStatus } from "@/action/updateVerification";

export async function POST(req: NextRequest) {
  const { isVerified } = await req.json();
  try {
    await updateVerificationStatus(isVerified);

    return NextResponse.json({ success: true });

  } catch (error) {
    if (process.env.NODE_ENV === "development") console.log("Error updating verification", error)
      return NextResponse.json({ error :"Error", }, {status: 500})
  }
}