"use client";

// ─── AccountLockedLoading ─────────────────────────────────────────────────────
// Drop-in loading skeleton for the AccountLockedPage.
// Matches the same layout, card structure, colors, and spacing so the
// transition from loading → loaded feels seamless.
// Usage: export this as the default export from app/locked/loading.tsx
// ─────────────────────────────────────────────────────────────────────────────

export default function AccountLockedLoading() {
  return (
    <div className="min-h-screen bg-[#1F4251] flex items-center justify-center px-4 py-8 sm:py-4 relative overflow-hidden">

      {/* Background decorative rings — identical to the real page */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full border border-white/5 absolute" />
        <div className="w-[800px] h-[800px] rounded-full border border-white/[0.03] absolute" />
        <div className="w-[400px] h-[400px] rounded-full border border-white/[0.07] absolute" />
      </div>

      {/* Glow blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#417e98]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Card skeleton */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-5 sm:p-8 shadow-2xl">

          {/* Shield icon skeleton */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative mb-4">
              {/* Outer pulse rings */}
              <div className="absolute inset-0 rounded-full border-2 border-[#417e98]/20 animate-ping" />
              <div
                className="absolute inset-0 rounded-full border border-[#417e98]/10 animate-ping"
                style={{ animationDelay: "0.4s" }}
              />
              {/* Icon circle */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#417e98]/20 border border-[#417e98]/30 flex items-center justify-center">
                {/* Animated lock icon drawn with divs */}
                <svg
                  viewBox="0 0 36 36"
                  className="w-7 h-7 sm:w-9 sm:h-9"
                  fill="none"
                >
                  {/* Shield body — draws itself */}
                  <path
                    d="M18 3 L32 8 L32 20 C32 27 25 32 18 34 C11 32 4 27 4 20 L4 8 Z"
                    stroke="#417e98"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                    strokeDasharray="90"
                    strokeDashoffset="90"
                    className="animate-[draw_1.2s_ease-out_0.2s_forwards]"
                    style={{
                      animation: "draw 1.2s ease-out 0.2s forwards",
                    }}
                  />
                  {/* Lock body */}
                  <rect
                    x="12"
                    y="17"
                    width="12"
                    height="9"
                    rx="2"
                    stroke="#417e98"
                    strokeWidth="1.5"
                    strokeDasharray="42"
                    strokeDashoffset="42"
                    style={{
                      animation: "draw 0.6s ease-out 0.9s forwards",
                    }}
                  />
                  {/* Lock shackle */}
                  <path
                    d="M14 17 L14 14 C14 11.8 16 10 18 10 C20 10 22 11.8 22 14 L22 17"
                    stroke="#417e98"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeDasharray="20"
                    strokeDashoffset="20"
                    style={{
                      animation: "draw 0.5s ease-out 1.2s forwards",
                    }}
                  />
                  {/* Keyhole dot */}
                  <circle
                    cx="18"
                    cy="21.5"
                    r="1.5"
                    stroke="#417e98"
                    strokeWidth="1.5"
                    strokeDasharray="10"
                    strokeDashoffset="10"
                    style={{
                      animation: "draw 0.3s ease-out 1.5s forwards",
                    }}
                  />
                </svg>
              </div>
            </div>

            {/* Badge skeleton */}
            <div className="h-5 w-32 rounded-full bg-white/10 animate-pulse" />
          </div>

          {/* Title skeleton */}
          <div className="flex flex-col items-center gap-2 mb-6">
            <div className="h-6 w-56 sm:w-64 rounded-lg bg-white/10 animate-pulse" />
            <div className="h-3.5 w-full rounded-md bg-white/[0.06] animate-pulse" />
            <div className="h-3.5 w-4/5 rounded-md bg-white/[0.06] animate-pulse" />
          </div>

          {/* Separator */}
          <div className="h-px bg-white/10 mb-6" />

          {/* "Time Remaining" label */}
          <div className="flex items-center justify-center gap-1.5 mb-3">
            <div className="w-3.5 h-3.5 rounded-full bg-[#417e98]/40 animate-pulse" />
            <div className="h-3 w-28 rounded-md bg-white/[0.08] animate-pulse" />
          </div>

          {/* Countdown digit blocks skeleton */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-2">
            {/* MM block */}
            <div className="flex flex-col items-center gap-1">
              <div className="bg-[#417e98]/20 border border-[#417e98]/30 rounded-xl px-3 py-2 sm:px-4 sm:py-3 min-w-[52px] sm:min-w-[64px] flex items-center justify-center">
                <div className="h-8 sm:h-10 w-8 rounded bg-white/10 animate-pulse" />
              </div>
              <div className="h-2.5 w-6 rounded bg-white/[0.06] animate-pulse" />
            </div>

            <span className="text-white/20 text-2xl sm:text-3xl font-mono pb-4">:</span>

            {/* SS block */}
            <div className="flex flex-col items-center gap-1">
              <div className="bg-[#417e98]/20 border border-[#417e98]/30 rounded-xl px-3 py-2 sm:px-4 sm:py-3 min-w-[52px] sm:min-w-[64px] flex items-center justify-center">
                <div className="h-8 sm:h-10 w-8 rounded bg-[#417e98]/20 animate-pulse" />
              </div>
              <div className="h-2.5 w-6 rounded bg-white/[0.06] animate-pulse" />
            </div>
          </div>

          {/* Progress bar skeleton */}
          <div className="mt-5 mb-6 h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full w-0 bg-gradient-to-r from-[#417e98] to-[#6bbcdb] rounded-full animate-[shimmer_1.8s_ease-in-out_infinite]" />
          </div>

          {/* Unlock time card skeleton */}
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-[#417e98]/20 animate-pulse shrink-0" />
            <div className="flex flex-col gap-1.5 flex-1">
              <div className="h-2.5 w-16 rounded bg-white/10 animate-pulse" />
              <div className="h-4 w-40 rounded bg-white/[0.08] animate-pulse" />
            </div>
          </div>

          {/* Warning box skeleton */}
          <div className="bg-amber-400/10 border border-amber-400/20 rounded-xl px-4 py-3 flex gap-3 mb-6">
            <div className="w-4 h-4 rounded bg-amber-400/30 animate-pulse shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1.5 flex-1">
              <div className="h-3 w-full rounded bg-amber-400/10 animate-pulse" />
              <div className="h-3 w-3/4 rounded bg-amber-400/10 animate-pulse" />
            </div>
          </div>

          {/* Separator */}
          <div className="h-px bg-white/10 mb-6" />

          {/* Button skeleton */}
          <div className="flex flex-col gap-3">
            <div className="h-11 w-full rounded-xl bg-white/[0.06] border border-white/10 animate-pulse" />
          </div>

          {/* Email footer skeleton */}
          <div className="flex justify-center mt-5">
            <div className="h-3 w-48 rounded bg-white/[0.05] animate-pulse" />
          </div>
        </div>
      </div>

      {/* SVG draw animation keyframes injected inline */}
      <style>{`
        @keyframes draw {
          to { stroke-dashoffset: 0; }
        }
        @keyframes shimmer {
          0%   { width: 0%;   opacity: 1; }
          60%  { width: 100%; opacity: 1; }
          100% { width: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}