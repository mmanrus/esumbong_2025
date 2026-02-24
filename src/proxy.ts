import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/sessions";
import { COOKIE_NAME } from "@/lib/constants";

// Dashboard routes
const dashboardRoutes = {
  admin: "/admin",
  resident: "/resident",
  official: "/officials",
};

// Public pages (login/landing)
const publicPages = ["/", "/login", "/register", "/about", "/contact", "/forgot-password"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const cookie = req.cookies.get(COOKIE_NAME)?.value;
  const session = cookie ? await decrypt(cookie) : null;


  // ----- 1. Redirect not logged-in users to login page if they hit protected routes
  if (!session) {
    if (Object.values(dashboardRoutes).some((route) => path.startsWith(route))) {
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }
    return NextResponse.next(); // allow public pages
  }

  // ----- 2. Prevent logged-in users from accessing login page
  if (publicPages.includes(path)) {
    // redirect based on session type
    switch (session.type) {
      case "admin":
        return NextResponse.redirect(new URL("/admin", req.nextUrl));
      case "resident":
        return NextResponse.redirect(new URL("/resident", req.nextUrl));
      case "barangay_official":
        return NextResponse.redirect(new URL("/officials", req.nextUrl));
    }
  }

  // ----- 3. Prevent users from accessing other dashboards
  if (session.type) {
    const userType = session.type;
    const isVerified = session.isVerified;
    if (userType === "admin" && (path.startsWith("/resident") || path.startsWith("/officials"))) {
      return NextResponse.redirect(new URL("/admin", req.nextUrl));
    }

    if (userType === "resident" && !isVerified) {
      return NextResponse.redirect(new URL("/verified", req.nextUrl));
    }
    if (userType === "resident" && (path.startsWith("/admin") || path.startsWith("/officials"))) {
      return NextResponse.redirect(new URL("/resident", req.nextUrl));
    }
    if (userType === "barangay_official" && (path.startsWith("/admin") || path.startsWith("/resident"))) {
      return NextResponse.redirect(new URL("/officials", req.nextUrl));
    }
  }

  // ----- 4. Allow access to correct pages
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/about/:path*",
    "/contact/:path*",
    "/forgot-password",
    "/admin/:path*",
    "/resident/:path*",
    "/officials/:path*",
    "/verify/:path"
  ],
};