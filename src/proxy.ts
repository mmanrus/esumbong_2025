import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/sessions";
import { COOKIE_NAME } from "@/lib/constants";
import { jwtVerify } from "jose";

// ─── JWT secret for verifying access_token ────────────────────────────────────
// Must match the same secret your backend uses to sign access tokens.
// We use jose (not jsonwebtoken) because middleware runs on the Edge Runtime
// which doesn't support Node.js built-in crypto modules.
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined");
const jwtSecretKey = new TextEncoder().encode(JWT_SECRET);

// Dashboard routes
const dashboardRoutes = {
  admin: "/admin",
  resident: "/resident",
  official: "/officials",
  superAdmin: "/super-admin",
};

// Public pages (login/landing)
const publicPages = ["/", "/login", "/register", "/about", "/contact", "/forgot-password"];

// ─── Helper: verify access_token JWT ─────────────────────────────────────────
// Returns the payload if valid, null if expired or tampered.
async function verifyAccessToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, jwtSecretKey);
    return payload; // { userId, type, isVerified, iat, exp }
  } catch {
    return null; // expired or invalid
  }
}

// ─── Helper: is the token expiring within the next 2 minutes? ────────────────
// We refresh proactively so API calls in the current page load never get a 401.
function isExpiringSoon(exp: number): boolean {
  const nowSeconds = Math.floor(Date.now() / 1000);
  return exp - nowSeconds < 60 * 2; // less than 2 minutes left
}

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // ─── TOKEN REFRESH BLOCK ───────────────────────────────────────────────────
  // Runs BEFORE session/route checks so the access_token is always fresh.
  // Your session cookie (COOKIE_NAME) handles route protection below —
  // this block only manages the access_token / refresh_token pair used
  // as Bearer tokens in backend API calls.

  const accessToken = req.cookies.get("access_token")?.value;
  const refreshToken = req.cookies.get("refresh_token")?.value;

  if (refreshToken) {

    if (!accessToken) {
      // access_token cookie is gone (expired) → attempt refresh immediately
      const refreshRes = await fetch(new URL("/api/auth/refresh", req.url), {
        method: "POST",
        // Forward cookies so the /api/auth/refresh route can read refresh_token
        headers: { cookie: req.headers.get("cookie") ?? "" },
      });

      if (!refreshRes.ok) {
        // Refresh token itself is expired/invalid → full logout
        const response = NextResponse.redirect(new URL("/login", req.url));
        response.cookies.delete("access_token");
        response.cookies.delete("refresh_token");
        response.cookies.delete(COOKIE_NAME);
        return response;
      }

      // Pass the new Set-Cookie header through so the browser gets the fresh
      // access_token cookie on this very response
      const response = NextResponse.next();
      refreshRes.headers.forEach((value, key) => {
        if (key.toLowerCase() === "set-cookie") {
          response.headers.append("Set-Cookie", value);
        }
      });
      return response
    } else {
      // access_token exists — check if it's still valid
      const payload = await verifyAccessToken(accessToken);

      if (!payload) {
        // Token present but expired/tampered → refresh
        const refreshRes = await fetch(new URL("/api/auth/refresh", req.url), {
          method: "POST",
          headers: { cookie: req.headers.get("cookie") ?? "" },
        });

        if (!refreshRes.ok) {
          // Both tokens dead → force logout
          const response = NextResponse.redirect(new URL("/login", req.url));
          response.cookies.delete("access_token");
          response.cookies.delete("refresh_token");
          response.cookies.delete(COOKIE_NAME);
          return response;
        }

        // Attach new cookie and continue
        const response = NextResponse.next();
        refreshRes.headers.forEach((value, key) => {
          if (key.toLowerCase() === "set-cookie") {
            response.headers.append("Set-Cookie", value);
          }
        });
        return response

      } else if (payload.exp && isExpiringSoon(payload.exp)) {
        // Token still valid but expires in < 2 min → fire-and-forget background refresh.
        // The current request uses the still-valid token; the next request gets the new one.
        // fetch(new URL("/api/auth/refresh", req.url), {
        //   method: "POST",
        //   headers: { cookie: req.headers.get("cookie") ?? "" },
        // }).catch(() => {
        //   // Non-critical — token is still valid for up to 2 more minutes
        // });
      }
    }
  }
  // ─── END TOKEN REFRESH BLOCK ───────────────────────────────────────────────


  // ──────────────────────────────────────────────────────────────────────────
  // YOUR ORIGINAL MIDDLEWARE BELOW — completely unchanged
  // ──────────────────────────────────────────────────────────────────────────

  const cookie = req.cookies.get(COOKIE_NAME)?.value;
  const session = cookie ? await decrypt(cookie) : null;

  // ----- 1. Redirect not logged-in users to login page if they hit protected routes
  if (!session) {
    if (Object.values(dashboardRoutes).some((route) => path.startsWith(route)) || path.startsWith("/verify") || path.startsWith("/locked")) {
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }
    return NextResponse.next(); // allow public pages
  }

  // ----- 2. Prevent logged-in users from accessing login page
  if (publicPages.includes(path)) {
    switch (session.type) {
      case "admin":
        return NextResponse.redirect(new URL("/admin", req.nextUrl));
      case "resident":
        return NextResponse.redirect(new URL("/resident", req.nextUrl));
      case "barangay_official":
        return NextResponse.redirect(new URL("/officials", req.nextUrl));
      case "superAdmin":
        return NextResponse.redirect(new URL("/super-admin", req.nextUrl));
      default:
        // Locked users have no type — redirect them to /locked
        if (session.isLocked) {
          return NextResponse.redirect(new URL("/locked", req.nextUrl));
        }
    }
  }

  // check if locked
  if (session.isLocked && !path.startsWith("/locked")) {
    return NextResponse.redirect(new URL("/locked", req.nextUrl));
  }
  if (!session.isLocked && path.startsWith("/locked")) {
    switch (session.type) {
      case "admin": return NextResponse.redirect(new URL("/admin", req.nextUrl));
      case "resident": return NextResponse.redirect(new URL("/resident", req.nextUrl));
      case "barangay_official": return NextResponse.redirect(new URL("/officials", req.nextUrl));
    }
  }

  // ----- 3. Prevent users from accessing other dashboards
  if (session.type) {
    const userType = session.type;

    if (userType === "admin" && (path.startsWith("/resident") || path.startsWith("/officials") || path.startsWith("/verify"))) {
      return NextResponse.redirect(new URL("/admin", req.nextUrl));
    }

    if (session.type === "resident") {
      const isVerified = session.isVerified;
      if (process.env.NODE_ENV === "development") console.log("isVerified?", isVerified);

      if (!isVerified) {
        if (!path.startsWith("/verify")) {
          return NextResponse.redirect(new URL("/verify", req.nextUrl));
        }
        return NextResponse.next();
      } else {
        if (path.startsWith("/verify")) {
          return NextResponse.redirect(new URL("/resident", req.nextUrl));
        }
      }

      if (path.startsWith("/admin") || path.startsWith("/officials") || path.startsWith("/feedback")) {
        return NextResponse.redirect(new URL("/resident", req.nextUrl));
      }
    }

    if (userType === "barangay_official" && (path.startsWith("/admin") || path.startsWith("/resident") || path.startsWith("/verify"))) {
      return NextResponse.redirect(new URL("/officials", req.nextUrl));
    }
    if (userType === "superAdmin" && !path.startsWith("/super-admin")) {
      return NextResponse.redirect(new URL("/super-admin", req.nextUrl));
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
    "/feedback/:path",
    "/feedback",
    "/verify",
    "/verify/:path",
    "/locked",
    "/locked/:path",
    "/super-admin/:path*", 
  ],
};