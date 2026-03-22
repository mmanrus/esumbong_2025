"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CTA() {
  const router = useRouter();
  return (
    <section className="bg-teal-700 text-white py-12 sm:py-16 md:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
          Ready to Make a Difference?
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-teal-100 mb-6 sm:mb-8 max-w-xl mx-auto">
          Join thousands of active citizens who are already using E-Sumbong to
          improve their communities
        </p>
        <Button
          onClick={() => router.push("/register")}
          className="bg-yellow-400 text-teal-900 hover:bg-yellow-500
                     px-6 sm:px-8 py-4 sm:py-5 text-sm sm:text-base font-semibold
                     rounded-full inline-flex items-center gap-2 transition
                     active:scale-95"
        >
          Get Started Now
          <ArrowRight size={18} />
        </Button>
      </div>
    </section>
  );
}
