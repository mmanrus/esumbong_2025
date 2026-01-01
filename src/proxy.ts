import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/sessions";
import { COOKIE_NAME } from "@/lib/constants";


const publicRoutes = ["/landingPage"];
export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const isProtectedRoute =
    path.startsWith("/admin") ||
    path.startsWith("/resident") ||
    path.startsWith("/officials") ||
    path.startsWith("/concern");
  const cookie = req.cookies.get(COOKIE_NAME)?.value;
  const session = cookie ? await decrypt(cookie) : null;

  if (path === "/" && !session) {
    return NextResponse.redirect(new URL("/landingPage", req.nextUrl));
  }

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(
      new URL("/landingPage/auth?form=login", req.nextUrl)
    );
  }

  if (session) {
    if (path.startsWith("/admin") && session.type !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", req.nextUrl));
    }

    if (path.startsWith("/officials") && session.type !== "barangay_official") {
      return NextResponse.redirect(new URL("/unauthorized", req.nextUrl));
    }

    if (path.startsWith("/resident") && session.type !== "resident") {
      return NextResponse.redirect(new URL("/unauthorized", req.nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/landingPage/:path*",
    "/admin/:path*",
    "/resident/:path*",
    "/officials/:path*",
    "/concern/:path*",
  ],
};
