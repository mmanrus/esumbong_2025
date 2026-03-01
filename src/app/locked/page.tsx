"use client";

import { useEffect, useState } from "react";
import { notFound, useRouter } from "next/navigation";
import { ShieldAlert, Clock, Mail, AlertTriangle, LogOut } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import AccountLockedLoading from "./loading";
import { toast } from "sonner";
import { logout } from "@/action/auth";

// ─── Types ────────────────────────────────────────────────────────────────────
interface AccountLockedPageProps {
  secondsRemaining: number; // seconds from backend
  unlockTime: string; // ISO string from backend
  email?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatCountdown(seconds: number): { h: string; m: string; s: string } {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return {
    h: String(h).padStart(2, "0"),
    m: String(m).padStart(2, "0"),
    s: String(s).padStart(2, "0"),
  };
}

function formatUnlockTime(isoString: string): string {
  return new Date(isoString).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
async function getRemainingTime(): Promise<AccountLockedPageProps | undefined> {
  try {
    const res = await fetch("/api/getRemainingTime", { method: "GET" });
    if (!res.ok) {
      toast.error("Failed to fetch remaining time");
      return;
    }
    const data = await res.json();
    if (data.alreadyExpired) {
      await logout();
      toast.info("Lock Expired.")
      return;
    }
    return data
  } catch {
    return;
  }
}
// ─── Component ────────────────────────────────────────────────────────────────

export default function AccountLockedPage() {
  const router = useRouter();

  // ✅ All hooks at the top — no conditional hook calls
  const [data, setData] = useState<AccountLockedPageProps | undefined>(
    undefined,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);
  const [hasExpired, setHasExpired] = useState(false);
  const [notFoundState, setNotFoundState] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const result = await getRemainingTime();
        if (!result) {
          setNotFoundState(true);
          return;
        }
        setData(result);
        setTimeLeft(Math.max(0, result.secondsRemaining));
        setHasExpired(result.secondsRemaining <= 0);
      } finally {
        setIsLoading(false); // ✅ always runs
      }
    };

    fetchData();
  }, []);

  // Countdown ticker
  useEffect(() => {
    if (hasExpired || isLoading) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setHasExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [hasExpired, isLoading]);
  useEffect(() => {
    if (!hasExpired) return;

    const handleExpiry = async () => {
      await logout(); // clears session and redirects to /login
    };

    handleExpiry();
  }, [hasExpired]);
  // ✅ Early returns AFTER all hooks
  if (isLoading) return <AccountLockedLoading />;
  if (notFoundState) return notFound();
  if (!data) return null;

  const { h, m, s } = formatCountdown(timeLeft);
  const progress =
    data.secondsRemaining > 0
      ? ((data.secondsRemaining - timeLeft) / data.secondsRemaining) * 100
      : 100;

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center px-4 py-8 sm:py-4 relative overflow-hidden">
      {/* Background decorative rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full border border-white/5 absolute" />
        <div className="w-[800px] h-[800px] rounded-full border border-white/3 absolute" />
        <div className="w-[400px] h-[400px] rounded-full border border-white/[0.07] absolute" />
      </div>

      {/* Glow blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#417e98]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-5 sm:p-8 shadow-2xl">
          {/* Header icon */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative mb-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#417e98]/20 border border-[#417e98]/40 flex items-center justify-center">
                <ShieldAlert className="w-7 h-7 sm:w-9 sm:h-9 text-primary" />
              </div>
              {/* Pulse ring */}
              <span className="absolute inset-0 rounded-full border-2 border-[#417e98]/30 animate-ping" />
            </div>

            <Badge
              variant="outline"
              className="border-red-400/40 text-red-300 bg-red-400/10 text-xs tracking-widest uppercase px-3 py-1"
            >
              Account Locked
            </Badge>
          </div>

          {/* Title & message */}
          <div className="text-center mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-primary mb-2 tracking-tight">
              Too Many Failed Attempts
            </h1>
            <p className="text-primary text-sm leading-relaxed">
              Your account has been temporarily locked due to multiple incorrect
              login attempts. Please wait for the timer to expire before trying
              again.
            </p>
          </div>

          <Separator className="bg-primary/2 mb-6" />

          {/* Countdown */}
          {!hasExpired ? (
            <div className="mb-6">
              <div className="flex items-center gap-1.5 justify-center mb-3">
                <Clock className="w-3.5 h-3.5 text-[#417e98]" />
                <span className="text-primary text-xs uppercase tracking-widest font-medium">
                  Time Remaining
                </span>
              </div>

              {/* Digit blocks */}
              <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                {/* Hours — only show if > 0 */}
                {parseInt(h) > 0 && (
                  <>
                    <div className="flex flex-col items-center">
                      <div className="bg-[#417e98]/20 border border-[#417e98]/30 rounded-xl px-3 py-2 sm:px-4 sm:py-3 min-w-[52px] sm:min-w-16 text-center">
                        <span className="text-3xl sm:text-4xl font-mono font-bold text-primary tabular-nums">
                          {h}
                        </span>
                      </div>
                      <span className="text-primary text-[10px] mt-1 uppercase tracking-widest">
                        hrs
                      </span>
                    </div>
                    <span className="text-primary text-2xl sm:text-3xl font-mono pb-4">
                      :
                    </span>
                  </>
                )}

                {/* Minutes */}
                <div className="flex flex-col items-center">
                  <div className="bg-[#417e98]/20 border border-[#417e98]/30 rounded-xl px-3 py-2 sm:px-4 sm:py-3 min-w-[52px] sm:min-w-16 text-center">
                    <span className="text-3xl sm:text-4xl font-mono font-bold text-white tabular-nums">
                      {m}
                    </span>
                  </div>
                  <span className="text-primary text-[10px] mt-1 uppercase tracking-widest">
                    min
                  </span>
                </div>

                <span className="text-primary text-2xl sm:text-3xl font-mono pb-4">
                  :
                </span>

                {/* Seconds */}
                <div className="flex flex-col items-center">
                  <div className="bg-[#417e98]/20 border border-[#417e98]/30 rounded-xl px-3 py-2 sm:px-4 sm:py-3 min-w-[52px] sm:min-w-[64px] text-center">
                    <span className="text-3xl sm:text-4xl font-mono font-bold text-[#6bbcdb] tabular-nums">
                      {s}
                    </span>
                  </div>
                  <span className="text-primary text-[10px] mt-1 uppercase tracking-widest">
                    sec
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-5 h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#417e98] to-[#6bbcdb] rounded-full transition-all duration-1000"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            /* Expired state */
            <div className="mb-6 text-center py-4">
              <p className="text-primary font-semibold text-sm">
                ✓ Lock expired — you may try again.
              </p>
            </div>
          )}

          {/* Unlock time */}
          {!hasExpired && (
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-[#417e98]/20 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-[#417e98]" />
              </div>
              <div>
                <p className="text-primary text-[10px] uppercase tracking-widest">
                  Unlocks at
                </p>
                <p className="text-primary text-sm font-medium">
                  {formatUnlockTime(data.unlockTime)}
                </p>
              </div>
            </div>
          )}

          {/* Warning note */}
          <div className="bg-amber-400/10 border border-amber-400/20 rounded-xl px-4 py-3 flex gap-3 mb-6">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-amber-500 text-xs leading-relaxed">
              Repeated failed attempts will increase your lockout duration. If
              you forgot your password, please contact your administrator.
            </p>
          </div>

          <Separator className="bg-primary/2 mb-6" />

          {/* Actions */}
          <div className="flex flex-col gap-3">
            {hasExpired && (
              <Button
                onClick={() => router.push("/login")}
                className="w-full bg-[#417e98] hover:bg-[#4f93b0] text-white font-semibold py-5 rounded-xl transition-all duration-200"
              >
                Try Logging In Again
              </Button>
            )}
            <Button
              variant="outline"
              onClick={async () => {
                await logout();
              }}
              className="w-full border-red-400/20 bg-red-400/5 hover:bg-red-400/10 hover:border-red-400/40 text-red-400/70 hover:text-red-400 py-5 rounded-xl transition-all duration-200 gap-2"
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/contact-admin")}
              className="w-full border-white/10 bg-white/5 hover:bg-[#417e98]/20 hover:border-[#417e98]/50 text-primary hover:text-white py-5 rounded-xl transition-all duration-200 gap-2"
            >
              <Mail className="w-4 h-4" />
              Contact Administrator
            </Button>
          </div>

          {/* Footer note */}
          {data.email && (
            <p className="text-center text-primary/40 text-xs mt-5 break-all">
              Locked account:{" "}
              <span className="text-primary font-mono">{data.email}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
