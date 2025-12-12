import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/sessions";
import { COOKIE_NAME } from "@/lib/constants";

const protectedRoutes = ["/admin", '/resident', '/officials'];
const publicRoutes = ["/landingPage"];
export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const cookie = req.cookies.get(COOKIE_NAME)?.value;
  const session = cookie ? await decrypt(cookie) : null;

  console.log("MIDDLEWARE path:", path);
  console.log("MIDDLEWARE cookie:", cookie);
  console.log("MIDDLEWARE session:", session);
  console.log("SESSION KEYS:", Object.keys(session || {}));

  if (path === "/" && !session) {
    return NextResponse.redirect(new URL("/landingPage", req.nextUrl));
  }
  if (protectedRoutes.includes(path) && !session) {
    return NextResponse.redirect(new URL("/landingPage/auth?form=login", req.nextUrl));
  }

  if (publicRoutes.includes(path) && session && session.type === "admin") {
    return NextResponse.redirect(new URL("/admin", req.nextUrl));
  }

  if (publicRoutes.includes(path) && session && session.type === "resident") {
    return NextResponse.redirect(new URL("/resident", req.nextUrl));
  }

  if (publicRoutes.includes(path) && session && session.type === "barangay_official") {
    return NextResponse.redirect(new URL("/officials", req.nextUrl));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/landingPage", "/officials/:path*", "/resident/:path*", "/admin/:path*"],
};
