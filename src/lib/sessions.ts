// lib/session.ts
import "server-only";
import { JWTPayload, SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { COOKIE_NAME } from "@/lib/constants";


const secret = process.env.SESSION_SECRET;
if (!secret) throw new Error("SESSION_SECRET is missing");
const key = new TextEncoder().encode(secret);


export async function encrypt(payload: JWTPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);
}

export async function decrypt(token: string) {
  try {
    const { payload } = await jwtVerify(token, key);

    return payload;
  } catch (err) {
    console.error("Invalid session token", err);
    return null;
  }
}

export async function setSession(payload: JWTPayload) {
  const cookie = await cookies(); // no await
  const token = await encrypt(payload);
  cookie.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSession() {
  const cookie = await cookies();
  cookie.delete(COOKIE_NAME);
  
  cookie.delete("access_token");
  cookie.delete("refresh_token");
}
