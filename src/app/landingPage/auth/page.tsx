"use client";

import { useSearchParams } from "next/navigation";
import SignupForm from "@/components/atoangUI/auth/signup";

export const dynamic = "force-dynamic";
import LoginForm from "@/components/atoangUI/auth/login";
import { Suspense } from "react";
export default function AuthPage() {
  const searchParams = useSearchParams();
  const page = searchParams.get("form") || "login";
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full h-full grid lg:grid-cols-2 p-4">
          <div className="bg-muted hidden lg:block rounded-lg border" />
          {page === "sign-up" ? <SignupForm /> : <LoginForm />}
        </div>
      </div>
    </Suspense>
  );
}
