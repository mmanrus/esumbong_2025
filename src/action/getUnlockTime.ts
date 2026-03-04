// app/actions/updateVerification.ts
"use server";

import { getSession } from "@/lib/sessions";


export async function getUnlockTime() {
    const session = await getSession();

    if (!session) return;
    if (process.env.NODE_ENV === "development") console.log("Getting unlockTime", session)

    return {
        secondsRemaining: session?.secondsRemaining,
        email: session?.email,
        unlockTime: session?.unlockTime
    }
}