"use server";

import { LoginFormSchema } from "@/defs/definitions";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { setSession } from "@/lib/sessions"; // uses jose

const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
if (!NEXT_PUBLIC_BACKEND_URL) throw new Error("BACKEND_URL is not defined in environment variables")
const APP_URL = process.env.NEXT_PUBLIC_APP_URL;
if (!APP_URL) throw new Error("NEXT_PUBLIC_APP_URL is not defined in environment variables")


export async function login(prevState: any, formData: FormData) {
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid input.",
      success: false,
    };
  }

  const { email, password } = validatedFields.data;

  const res = await fetch(`${APP_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    ...(process.env.NODE_ENV === "production" ? { credentials: "include" } : {}),
    body: JSON.stringify({ email, password }),
  });
  const result = await res.json();

  if (res.status === 423) {
    await setSession({
      isLocked: true,
      email: result.email,
      unlockTime:
        result.unlockTime ||
        new Date(Date.now() + result.secondsRemaining * 1000).toISOString(),
      secondsRemaining: result.secondsRemaining,
    });
    return {
      isLocked: true,
      message: "Your account has been locked.",
      success: false,
    };
  }

  if (!res.ok) {
    return {
      message: result.message || "Invalid email or password",
      success: false,
    };
  }

  const backendPayload = result.user ?? result;
  const authPayload = backendPayload.user ?? backendPayload;
  const accessToken = backendPayload.access;
  const refreshToken = backendPayload.refresh;

  // store access/refresh separately
  const cookieStore = await cookies();
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    path: "/",
  } as const;
  if (accessToken) {
    cookieStore.set("access_token", accessToken, cookieOptions);
  }
  if (refreshToken) {
    cookieStore.set("refresh_token", refreshToken, cookieOptions);
  }

  // store SMALL session cookie
  await setSession({
    userId: authPayload?.id,
    type: authPayload?.type,
    dailyPostCount: authPayload?.dailyPostCount,
    isVerified: authPayload?.isVerified,
  });

  return {
    message: "Login successful.",
    success: true,
    user: authPayload,
  };
}


import { clearSession } from "@/lib/sessions";

export async function logout() {
  await clearSession();
  redirect("/login");
}
