//dal.js
import { cookies } from "next/headers";
import { decrypt } from "@/lib/sessions";
import { cache } from "react";

import { COOKIE_NAME } from "@/lib/constants";

export const verifySession = cache(async () => {
  try {
    const cookie = (await cookies()).get(COOKIE_NAME)?.value;
    if (!cookie) {
      return { isAuth: false };
    }

    const session = await decrypt(cookie);

    if (!session?.userId) {
      return { isAuth: false };
    }

    return { isAuth: true, access: session?.access, userId: session?.userId };
  } catch (err) {
    console.error("Failed verifying cookie:", err);
    return null
  }
});

export const getUser = async () => {
  const session = await verifySession();

  if (!session?.isAuth) return null;

  const cookieStore = await cookies()
  const accessToken = cookieStore.get(COOKIE_NAME)?.value

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/me`, {
    method: "GET",
    credentials: "include",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("Failed to fetch user", res.status);
    return null;
  }

  return await res.json();
};

