"use server";

import { LoginFormSchema } from "@/defs/definitions";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { setSession } from "@/lib/sessions"; // uses jose

const BACKEND_URL = process.env.BACKEND_URL;
if (!BACKEND_URL) throw new Error("BACKEND_URL is not defined in environment variables")
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
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    return { message: "Login failed.", success: false };
  }
  const result = await res.json()
  const { user, access, refresh } = result;
  console.log("Login result:", result)
  // store access/refresh separately
  const cookieStore = await cookies();
  cookieStore.set("access_token", access, { httpOnly: true, secure: true });
  cookieStore.set("refresh_token", refresh, { httpOnly: true, secure: true });

  // store SMALL session cookie
  console.log("User type upon login:", user.user.type)
  await setSession({
    userId: user.user?.id,
    type: user.user?.type,
  });

  // redirect cleanly
  if (user.type === "admin") redirect("/admin");
  if (user.type === "resident") redirect("/resident");
  if (user.type === "barangay_official") redirect("/officials");

  redirect("/landingPage");
}


import { clearSession } from "@/lib/sessions";
  
export async function logout() {
  await clearSession();
  console.log("Logged out");
  redirect("/landingPage/auth?form=login");
}
