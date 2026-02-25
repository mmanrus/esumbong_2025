// app/actions/updateVerification.ts
"use server";

import { setSession, getSession } from "@/lib/sessions";


export async function updateVerificationStatus(isVerified: boolean) {
    const session = await getSession();

    if (!session) return;
    if (process.env.NODE_ENV === "development") console.log("Setting user to verified", isVerified)
    await setSession({
        userId: session.userId,
        type: session.type,
        isVerified,
    });
}