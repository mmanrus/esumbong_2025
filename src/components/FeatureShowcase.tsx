"use client";

import {
  FileX,
  Clock,
  Users,
  ShieldCheck,
  BarChart3,
  MessageSquare,
  Smartphone,
  Zap,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

// Problems with current manual system
const problems = [
  {
    icon: FileX,
    title: "Lost Paper Forms",
    description: "Paper-based complaints get misplaced, creating gaps in records and frustrated residents",
    stat: "30% of complaints never tracked",
  },
  {
    icon: Clock,
    title: "Slow Response Times",
    description: "Manual processing delays action, leaving issues unresolved for weeks or months",
    stat: "Average 2-4 weeks to respond",
  },
  {
    icon: AlertCircle,
    title: "No Transparency",
    description: "Residents have no way to track their concerns, leading to repeated follow-ups and complaints",
    stat: "Residents visit 3-5 times for updates",
  },
  {
    icon: Users,
    title: "Communication Breakdown",
    description: "No organized way for officials to update residents or for residents to provide feedback",
    stat: "60% feel unheard by officials",
  },
];

// Solutions e-Sumbong provides
const solutions = [
  {
    icon: Smartphone,
    title: "24/7 Online Reporting",
    description: "Residents submit concerns anytime, anywhere through web or mobile—no need to visit the hall",
    benefit: "Save time for residents and officials",
    color: "teal",
  },
  {
    icon: ShieldCheck,
    title: "Verified User System",
    description: "AI-powered ID verification ensures only real residents submit concerns, preventing spam and fake reports",
    benefit: "Trust and authenticity guaranteed",
    color: "blue",
  },
  {
    icon: BarChart3,
    title: "Real-Time Tracking & Analytics",
    description: "Officials see all concerns in one dashboard with status tracking, priority tagging, and performance reports",
    benefit: "Better decision-making and accountability",
    color: "purple",
  },
  {
    icon: MessageSquare,
    title: "Direct Communication",
    description: "Officials can send updates, attach files, and resolve concerns with transparent message threads",
    benefit: "Build trust with your community",
    color: "green",
  },
  {
    icon: Zap,
    title: "Smart Spam Protection",
    description: "Rate limiting (10 posts/day) and AI detection prevent abuse while allowing genuine concerns",
    benefit: "Focus on real issues, not spam",
    color: "orange",
  },
  {
    icon: Users,
    title: "Multi-Barangay Management",
    description: "Super admins can manage multiple barangays, admins manage officials and residents—all in one system",
    benefit: "Perfect for municipalities",
    color: "indigo",
  },
];

const colorClasses = {
  teal: "bg-teal-100 text-teal-700",
  blue: "bg-blue-100 text-blue-700",
  purple: "bg-purple-100 text-purple-700",
  green: "bg-green-100 text-green-700",
  orange: "bg-orange-100 text-orange-700",
  indigo: "bg-indigo-100 text-indigo-700",
};

export default function FeaturesShowcase() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block bg-yellow-400 text-teal-700 text-sm font-bold px-4 py-1.5 rounded-full mb-4 tracking-wide uppercase">
            Why e-Sumbong?
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-teal-900 mb-4">
            From Chaos to Control
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Stop losing track of community concerns. Start building trust and transparency with a modern digital solution.
          </p>
        </div>

        {/* Problems Section */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-1 w-12 bg-red-500 rounded"></div>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
              The Old Way: Manual System Problems
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {problems.map((problem, index) => {
              const Icon = problem.icon;
              return (
                <div
                  key={index}
                  className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-red-100 rounded-lg flex-shrink-0">
                      <Icon className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg text-gray-900 mb-2">
                        {problem.title}
                      </h4>
                      <p className="text-gray-700 mb-3 text-sm leading-relaxed">
                        {problem.description}
                      </p>
                      <div className="inline-block bg-red-200 text-red-800 text-xs font-semibold px-3 py-1 rounded-full">
                        ⚠️ {problem.stat}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Solutions Section */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="h-1 w-12 bg-teal-600 rounded"></div>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
              The e-Sumbong Way: Smart Digital Solutions
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {solutions.map((solution, index) => {
              const Icon = solution.icon;
              return (
                <div
                  key={index}
                  className="bg-white border-2 border-gray-100 rounded-xl p-6 hover:border-teal-400 hover:shadow-xl transition-all duration-300 group"
                >
                  <div className={`inline-block p-3 rounded-lg mb-4 ${colorClasses[solution.color as keyof typeof colorClasses]}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h4 className="font-bold text-lg text-gray-900 mb-2">
                    {solution.title}
                  </h4>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {solution.description}
                  </p>
                  <div className="flex items-center gap-2 text-teal-700 text-sm font-semibold">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                    <span>{solution.benefit}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl p-8 md:p-12 text-center text-white">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Modernize Your Barangay?
          </h3>
          <p className="text-teal-100 text-lg mb-6 max-w-2xl mx-auto">
            Join progressive barangays across the Philippines using e-Sumbong to serve their communities better.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center gap-2 text-yellow-400">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-semibold">One-time payment</span>
            </div>
            <div className="flex items-center gap-2 text-yellow-400">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-semibold">Full training included</span>
            </div>
            <div className="flex items-center gap-2 text-yellow-400">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-semibold">Lifetime access</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}