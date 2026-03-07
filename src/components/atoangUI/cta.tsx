"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="bg-teal-700 text-white py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to Make a Difference?
        </h2>
        <p className="text-lg text-teal-100 mb-8 max-w-2xl mx-auto">
          Join thousands of active citizens who are already using E-Sumbong to
          improve their communities
        </p>

        <Button className="bg-yellow-400 text-teal-900 hover:bg-yellow-500 px-8 py-6 text-lg font-semibold rounded-full inline-flex items-center gap-2 transition">
          Get Started Now
          <ArrowRight size={20} />
        </Button>
      </div>
    </section>
  );
}
