"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { Star } from "lucide-react";
import clsx from "clsx";

type PublicFeedback = {
  id: number;
  title: string;
  feedback: string;
  star: number | null;
  issuedAt: string;
  category: string | null;
  displayName: string;
  position: string;
};

const PAGE_SIZE = 3;
const AUTO_ADVANCE_MS = 5000;

function StarRow({ value }: { value: number | null }) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-0.5 mb-2">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={clsx(
            "w-3.5 h-3.5 sm:w-4 sm:h-4",
            s <= value
              ? "fill-yellow-400 text-yellow-400"
              : "fill-transparent text-gray-300",
          )}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

function CardSkeleton() {
  return (
    <div
      className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl p-5 sm:p-7
                    border-l-4 border-teal-200 animate-pulse space-y-3"
    >
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-3.5 h-3.5 bg-teal-200 rounded-full" />
        ))}
      </div>
      <div className="space-y-2">
        <div className="h-3.5 bg-teal-200 rounded w-full" />
        <div className="h-3.5 bg-teal-200 rounded w-5/6" />
        <div className="h-3.5 bg-teal-200 rounded w-4/6" />
      </div>
      <div className="pt-3 border-t border-teal-200 space-y-1">
        <div className="h-3.5 bg-teal-200 rounded w-24" />
        <div className="h-3 bg-teal-100 rounded w-28" />
      </div>
    </div>
  );
}

const slideVariants: Variants = {
  enter: (dir: number) => ({ x: dir > 0 ? 50 : -50, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
  exit: (dir: number) => ({
    x: dir > 0 ? -50 : 50,
    opacity: 0,
    transition: { duration: 0.25, ease: "easeIn" },
  }),
};

export default function CitizenFeedback() {
  const [feedbacks, setFeedbacks] = useState<PublicFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    fetch("/api/feedback/public")
      .then((r) => r.json())
      .then((data: unknown) => {
        const list: PublicFeedback[] = Array.isArray(data)
          ? (data as PublicFeedback[])
          : Array.isArray((data as any)?.data)
            ? (data as any).data
            : [];
        setFeedbacks(list);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const totalPages = Math.ceil(feedbacks.length / PAGE_SIZE);
  const currentItems = feedbacks.slice(
    page * PAGE_SIZE,
    page * PAGE_SIZE + PAGE_SIZE,
  );

  useEffect(() => {
    if (loading || paused || totalPages <= 1) return;
    timerRef.current = setInterval(() => {
      setDirection(1);
      setPage((p) => (p + 1) % totalPages);
    }, AUTO_ADVANCE_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [loading, paused, totalPages]);

  const goTo = (next: number) => {
    setDirection(next > page ? 1 : -1);
    setPage(next);
  };

  return (
    <section
      className="py-8 sm:py-12 md:py-16 bg-white overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
            What Citizens Are Saying
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto">
            Join thousands of active citizens making a real difference in their
            communities
          </p>
        </div>

        {/* Cards */}
        <div className="relative min-h-[200px]">
          {loading ? (
            // On mobile show 1 skeleton, sm+ show 3
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              <CardSkeleton />
              <div className="hidden sm:block">
                <CardSkeleton />
              </div>
              <div className="hidden lg:block">
                <CardSkeleton />
              </div>
            </div>
          ) : feedbacks.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm">
              No feedback available yet.
            </div>
          ) : (
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={page}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                // Mobile: 1 col. sm: 2 col. lg: 3 col
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
              >
                {currentItems.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: i * 0.07,
                      duration: 0.35,
                      ease: "easeOut",
                    }}
                    className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl
                               p-5 sm:p-6 shadow-md hover:shadow-lg transition-shadow
                               duration-300 border-l-4 border-teal-600 flex flex-col"
                  >
                    <StarRow value={item.star} />

                    <div className="text-yellow-400 text-4xl leading-none mb-1.5 font-serif select-none">
                      "
                    </div>

                    <p className="text-gray-800 italic leading-relaxed text-sm flex-1 mb-5 line-clamp-4">
                      {item.feedback}
                    </p>

                    <div className="pt-3 border-t border-teal-200">
                      <p className="font-semibold text-gray-900 text-sm">
                        {item.displayName}
                      </p>
                      <p className="text-teal-700 text-xs mt-0.5">
                        {item.category
                          ? `${item.position} · ${item.category}`
                          : item.position}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* Dots + progress */}
        {!loading && totalPages > 1 && (
          <div className="mt-7 sm:mt-8 flex flex-col items-center gap-3">
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Go to page ${i + 1}`}
                  className={clsx(
                    "rounded-full transition-all duration-300",
                    i === page
                      ? "bg-teal-600 w-5 h-2"
                      : "bg-teal-200 hover:bg-teal-400 w-2 h-2",
                  )}
                />
              ))}
            </div>

            {!paused && (
              <div className="w-24 h-0.5 bg-teal-100 rounded-full overflow-hidden">
                <motion.div
                  key={page}
                  className="h-full bg-teal-500 rounded-full origin-left"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{
                    duration: AUTO_ADVANCE_MS / 1000,
                    ease: "linear",
                  }}
                />
              </div>
            )}
            {paused && (
              <p className="text-xs text-gray-400">Auto-advance paused</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
