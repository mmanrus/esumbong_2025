"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/action/auth";

export default function PendingPage() {
  const router = useRouter();
  const [dots, setDots] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setDots((d) => (d + 1) % 4), 600);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const dotStr = ".".repeat(dots);

  const steps = [
    {
      num: "✓",
      style: "bg-green-100 text-green-700",
      label: "Document Submitted",
      desc: "Your ID was uploaded and received.",
    },
    {
      num: "⟳",
      style: "bg-yellow-100 text-yellow-700",
      label: "Admin Review",
      desc: "Being reviewed by the Cogon Pardo team.",
    },
    {
      num: "3",
      style: "bg-stone-100 text-stone-400",
      label: "Verification Complete",
      desc: "You'll be notified once approved.",
    },
  ];

  return (
    <div className="min-h-svh w-full flex items-center justify-center bg-stone-100 px-4 py-10 relative overflow-hidden">
      {/* Decorative background rings */}
      <div className="pointer-events-none absolute rounded-full border border-black/5 w-[500px] h-[500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      <div className="pointer-events-none absolute rounded-full border border-black/5 w-[800px] h-[800px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      <div className="pointer-events-none absolute rounded-full border border-black/5 w-[1100px] h-[1100px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      <div
        className={`relative z-10 bg-white border border-stone-200 rounded-2xl shadow-lg w-full max-w-md px-6 py-10 sm:px-10 transition-all duration-700 ease-out
          ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
      >
        {/* Animated icon */}
        <div className="relative w-20 h-20 mx-auto mb-8">
          {/* Spinning ring */}
          <svg
            className="absolute inset-0 w-full h-full animate-spin animation-duration-[8s]"
            viewBox="0 0 80 80"
          >
            <circle
              cx="40"
              cy="40"
              r="38"
              fill="none"
              stroke="#e7e5e4"
              strokeWidth="2"
              strokeDasharray="200 40"
              strokeLinecap="round"
            />
          </svg>
          {/* Inner icon circle */}
          <div className="absolute inset-2.5 rounded-full bg-white border border-stone-200 flex items-center justify-center text-2xl shadow-sm">
            🪪
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-center text-3xl sm:text-4xl font-serif font-semibold text-stone-900 leading-tight mb-3">
          Under <span className="italic text-amber-600">Review</span>
        </h1>
        <p className="text-center text-stone-500 text-sm font-light leading-relaxed mb-6">
          Your ID has been submitted successfully. Our admin team will review
          your document and verify your residency.
        </p>

        {/* Live status badge */}
        <div className="flex items-center justify-center gap-2 w-fit mx-auto px-4 py-2 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium tracking-wide mb-7">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          Awaiting admin review{dotStr}
        </div>

        {/* Steps */}
        <div className="flex flex-col gap-3 mb-8">
          {steps.map((step, i) => (
            <div
              key={i}
              className="flex items-start gap-4 p-4 rounded-xl border border-stone-100 bg-stone-50 hover:border-amber-300 transition-colors"
            >
              <div
                className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${step.style}`}
              >
                {step.num}
              </div>
              <div>
                <p className="text-sm font-medium text-stone-800">
                  {step.label}
                </p>
                <p className="text-xs text-stone-400 font-light mt-0.5">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-linear-to-r from-transparent via-stone-200 to-transparent mb-6" />

        {/* CTAs */}
        <div className="flex flex-col items-center gap-3">
          <form action={logout} className="w-full">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-stone-900 text-stone-100 text-sm font-medium tracking-wide hover:bg-stone-800 active:scale-[0.98] transition-all"
            >
              Go to Home
            </button>
          </form>

          <button
            onClick={() => router.push("/verify")}
            className="text-xs text-stone-400 underline underline-offset-4 hover:text-stone-700 transition-colors bg-transparent border-none cursor-pointer"
          >
            Re-submit a different document
          </button>
        </div>

        {/* Divider */}
        <div className="h-px bg-linear-to-r from-transparent via-stone-200 to-transparent my-6" />

        {/* Note */}
        <p className="text-center text-xs text-stone-400 font-light leading-relaxed">
          Verification typically takes{" "}
          <span className="text-stone-600 font-medium">1–2 business days</span>.
          You will receive a notification once your identity has been confirmed.
        </p>
      </div>
    </div>
  );
}
