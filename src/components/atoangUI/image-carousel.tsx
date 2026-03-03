'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface CarouselSlide {
  image: string
  title: string
  description: string
}

const slides: CarouselSlide[] = [
  {
    image: '/community-court.jpg',
    title: 'Community Gatherings',
    description: 'Large-scale barangay assemblies where residents and officials unite to discuss community concerns and celebrate collective achievements.',
  },
  {
    image: '/forest-activity.jpg',
    title: 'Environmental Initiatives',
    description: 'Community-driven environmental and civic action projects that demonstrate the power of collective citizen engagement.',
  },
]

export default function ImageCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)

  useEffect(() => {
    if (!isAutoPlay) return

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [isAutoPlay])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlay(false)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
    setIsAutoPlay(false)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    setIsAutoPlay(false)
  }

  return (
    <section className="relative w-full bg-background overflow-hidden">
      <div className="relative h-96 md:h-[500px] lg:h-[600px] w-full group">
        {/* Slides */}
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
              sizes="100vw"
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            {/* Slide content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 text-white">
              <h2 className="text-3xl md:text-5xl font-bold mb-2 md:mb-4 text-balance">
                {slide.title}
              </h2>
              <p className="text-lg md:text-xl text-gray-100 max-w-2xl">
                {slide.description}
              </p>
            </div>
          </div>
        ))}

        {/* Previous button */}
        <button
          onClick={prevSlide}
          className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white p-2 md:p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 backdrop-blur-sm"
          aria-label="Previous slide"
        >
          <svg
            className="w-6 h-6 md:w-8 md:h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Next button */}
        <button
          onClick={nextSlide}
          className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white p-2 md:p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 backdrop-blur-sm"
          aria-label="Next slide"
        >
          <svg
            className="w-6 h-6 md:w-8 md:h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-yellow-400 w-8'
                : 'bg-white/50 hover:bg-white/75 w-3'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
