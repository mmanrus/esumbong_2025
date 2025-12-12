//dal.js
import { cookies } from "next/headers";
import { decrypt } from "@/lib/sessions";
import { cache } from "react";
import { redirect } from "next/navigation";

import { COOKIE_NAME } from "@/lib/constants";
const backendUrl = process.env.BACKEND_URL;

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

    return { isAuth: true, access: session?.access, useId: session?.userId };
  } catch (err) {
    console.error("Failed verifying cookie:", err);
    console.error("Failed verifying cookie:", err);
    throw new Error("Failed to get session");
  }
});

import { fetchWithRefresh } from "@/lib/fetchWithRefresh";

export const getUser = async () => {
  const session = await verifySession(); // get the current access token
  if (!session.isAuth) {
    return null; // 👈 return instead of throwing
  }
  const res = await fetchWithRefresh(`${backendUrl}users/me`, {
    method: "GET",
    credentials: "include",
    headers: {
      Authorization: `Bearer ${session.access}`, // or from session
    },
  });

  if (!res?.ok) throw new Error("Failed to fetch user");

  return await res.json();
};
