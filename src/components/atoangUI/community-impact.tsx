"use client";

import { useEffect, useState } from "react";

type PublicStats = {
  totalResidents: number;
  totalConcerns: number;
  averageStar: number | null;
};

function formatNumber(n: number): string {
  if (n >= 1_000_000)
    return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M+";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K+";
  return n.toLocaleString("en-PH") + "+";
}

function formatStar(avg: number | null): string {
  if (avg === null) return "N/A";
  return `${avg.toFixed(1)} ★`;
}

export default function CommunityImpact() {
  const [stats, setStats] = useState<PublicStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/stats/public")
      .then((r) => {
        if (!r.ok) throw new Error("Failed");
        return r.json();
      })
      .then((data: PublicStats) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  const statItems = [
    {
      number: loading
        ? null
        : error
          ? "—"
          : formatNumber(stats?.totalResidents ?? 0),
      label: "Active Citizens",
    },
    {
      number: loading
        ? null
        : error
          ? "—"
          : formatNumber(stats?.totalConcerns ?? 0),
      label: "Concerns Filed",
    },
    // { number: "40+", label: "Communities" }, // omitted for now, don't delete
    {
      number: loading
        ? null
        : error
          ? "—"
          : formatStar(stats?.averageStar ?? null),
      label: "Avg. Rating",
    },
  ];

  return (
    <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 sm:mb-3">
            Community in Action
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-xl mx-auto">
            Real citizens, real impact. See how E-Sumbong empowers communities
            to create meaningful change.
          </p>
        </div>

        {/* Image Grid — 1 col mobile, 2 col sm+ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {[
            {
              src: "/community-gathering.jpg",
              alt: "Large community barangay assembly",
              title: "Barangay Assembly",
              desc: "Community leaders and citizens come together to discuss local issues, share concerns, and collectively work toward solutions.",
            },
            {
              src: "/community-activity.jpg",
              alt: "Community members in outdoor civic activity",
              title: "Grassroots Action",
              desc: "From community cleanups to local initiatives, citizens take direct action to improve their neighborhoods.",
            },
          ].map((item) => (
            <div key={item.title} className="flex flex-col">
              {/* aspect-[4/3] on mobile keeps image proportional without overflowing */}
              <div
                className="relative w-full overflow-hidden rounded-xl shadow-md
                              aspect-[4/3] sm:aspect-auto sm:h-60 md:h-72 lg:h-80"
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  className="absolute inset-0 w-full h-full object-cover
                             hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="mt-3 bg-gray-50 p-4 sm:p-5 rounded-xl">
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-teal-700 mb-1.5">
                  {item.title}
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats — always 3 columns, text scales down on mobile */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-6 mt-6 sm:mt-8 md:mt-10">
          {statItems.map((stat, index) => (
            <div
              key={index}
              className="text-center p-3 sm:p-4 md:p-6 bg-teal-50 rounded-xl border border-teal-100"
            >
              {stat.number === null ? (
                <>
                  <div className="h-6 sm:h-8 md:h-10 bg-teal-200 rounded w-14 sm:w-20 mx-auto mb-1.5 animate-pulse" />
                  <div className="h-3 sm:h-4 bg-teal-100 rounded w-12 sm:w-16 mx-auto animate-pulse" />
                </>
              ) : (
                <>
                  <p
                    className="text-lg sm:text-2xl md:text-4xl font-bold text-teal-700
                                mb-1 tabular-nums leading-tight"
                  >
                    {stat.number}
                  </p>
                  <p className="text-gray-600 font-medium text-[10px] sm:text-xs md:text-sm leading-tight">
                    {stat.label}
                  </p>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
