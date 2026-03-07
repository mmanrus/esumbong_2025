'use client'

import { useState, useRef, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ThumbsUp, ChevronLeft, ChevronRight } from 'lucide-react'

const concerns = [
  {
    id: 1,
    title: 'Basura sa Kalsada - Street Garbage Accumulation',
    description: 'Excessive garbage piling up on the streets of Barangay Cogon Pardo near the market area. Foul odor and health hazard for residents.',
    category: 'Environment',
    status: 'resolved',
    dateSubmitted: '2026-01-10',
    actionTaken: 'Barangay cleanup drive conducted on January 20, 2026. Street sweepers assigned daily schedule starting January 25. Garbage bins installed at problem areas.',
    feedback: 'Salamat sa mabilis na aksyon! Ang kalye ay napakaganda na ngayon. Very clean environment now!',
    upvotes: 38,
  },
  {
    id: 2,
    title: 'Illegal Dumping at Barangay Waterway',
    description: 'Residents dumping construction materials and household waste near the creek affecting water quality and marine life.',
    category: 'Environment',
    status: 'in-progress',
    dateSubmitted: '2026-01-15',
    actionTaken: 'Started cleanup operations on January 28, 2026. Environmental monitoring team collecting water samples. Warning signs posted. Enforcement team conducting spot checks weekly.',
    feedback: '',
    upvotes: 25,
  },
  {
    id: 3,
    title: 'Mga Basag na Siko at Kalsada - Damaged Sidewalks and Roads',
    description: 'Multiple areas with broken sidewalks and potholes making it difficult for elderly residents and PWD individuals to move around safely.',
    category: 'Infrastructure',
    status: 'pending',
    dateSubmitted: '2026-02-01',
    actionTaken: '',
    feedback: '',
    upvotes: 42,
  },
  {
    id: 4,
    title: 'Putik at Baha sa Rainy Season - Flooding Issues',
    description: 'Poor drainage system causing severe flooding and muddy roads during heavy rains affecting commuters and vehicle damage.',
    category: 'Infrastructure',
    status: 'in-progress',
    dateSubmitted: '2026-01-20',
    actionTaken: 'Drainage assessment completed on February 10, 2026. Cleaning of drainage pipes started February 15. Underground pipes being evaluated for improvement.',
    feedback: '',
    upvotes: 31,
  },
  {
    id: 5,
    title: 'Stray Dogs and Animal Control',
    description: 'Increasing number of stray dogs in residential areas posing safety risks to children and spreading diseases.',
    category: 'Safety',
    status: 'pending',
    dateSubmitted: '2026-02-03',
    actionTaken: '',
    feedback: '',
    upvotes: 19,
  },
  {
    id: 6,
    title: 'Maayos na Ilaw sa Barangay - Streetlights Installation',
    description: 'Dark streets at night in residential areas making residents unsafe. Request for more LED streetlights to improve visibility.',
    category: 'Safety',
    status: 'resolved',
    dateSubmitted: '2025-12-15',
    actionTaken: 'Electrical contractor hired and work started January 5, 2026. 35 new LED streetlights installed throughout barangay. Project completed January 30, 2026 with 24-hour maintenance hotline.',
    feedback: 'Napakaganda! Ngayon ay mas ligtas mag-lakad sa gabi. The streets are so much brighter and safer now!',
    upvotes: 51,
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'resolved':
      return 'bg-green-100 text-green-800'
    case 'in-progress':
      return 'bg-blue-100 text-blue-800'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusLabel = (status: string) => {
  return status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')
}

const getLeftBorderColor = (status: string) => {
  switch (status) {
    case 'resolved':
      return 'border-l-green-500'
    case 'in-progress':
      return 'border-l-blue-500'
    case 'pending':
      return 'border-l-yellow-500'
    default:
      return 'border-l-gray-500'
  }
}

export default function TransparencyDashboard() {
  const [filter, setFilter] = useState('all')
  const [currentSlide, setCurrentSlide] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  const filteredConcerns =
    filter === 'all' ? concerns : concerns.filter((c) => c.status === filter)

  // Auto scroll carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % Math.max(filteredConcerns.length, 1))
    }, 5000)
    return () => clearInterval(timer)
  }, [filteredConcerns.length])

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + filteredConcerns.length) % Math.max(filteredConcerns.length, 1))
  }

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.max(filteredConcerns.length, 1))
  }

  const handleSwipe = (e: React.TouchEvent) => {
    const touchStart = e.touches[0].clientX
    const touchEnd = e.changedTouches[0].clientX
    
    if (touchStart - touchEnd > 50) {
      handleNextSlide()
    } else if (touchEnd - touchStart > 50) {
      handlePrevSlide()
    }
  }

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-teal-50 to-gray-50">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-teal-900 mb-4">Track Your Concerns Now</h2>
          <p className="text-lg text-gray-700">
            Monitor your reports, see actions taken, and join community conversations
          </p>
        </div>

        {/* Filter Section */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {['all', 'pending', 'in-progress', 'resolved'].map((status) => (
            <Button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-6 py-2 rounded-full font-medium transition ${
                filter === status
                  ? 'bg-yellow-400 text-teal-900 hover:bg-yellow-500'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-teal-700'
              }`}
            >
              {status === 'all' ? 'All' : getStatusLabel(status)}
            </Button>
          ))}
        </div>

        {/* Carousel View */}
        <div className="mb-16">
          <div 
            ref={carouselRef}
            onTouchEnd={handleSwipe}
            className="relative overflow-hidden rounded-xl"
          >
            {/* Carousel Track */}
            <div className="flex transition-transform duration-500 ease-out" 
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
              {filteredConcerns.map((concern) => (
            <div
              key={concern.id}
              className={`min-w-full bg-white shadow-lg hover:shadow-xl transition border-l-4 ${getLeftBorderColor(concern.status)} overflow-hidden`}
            >
              {/* Card Header */}
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{concern.title}</h3>
                    <p className="text-gray-600">{concern.description}</p>
                  </div>
                  <div className="flex gap-2 flex-wrap md:flex-col md:items-end">
                    <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-200">
                      {concern.category}
                    </Badge>
                    <Badge className={getStatusColor(concern.status)}>
                      {getStatusLabel(concern.status)}
                    </Badge>
                  </div>
                </div>

                <div className="text-sm text-gray-500 mb-6">
                  Submitted: {new Date(concern.dateSubmitted).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>

                {/* Action Taken - Only show for In Progress and Resolved */}
                {(concern.status === 'in-progress' || concern.status === 'resolved') && (
                  <div className="bg-teal-50 border-l-4 border-teal-700 p-4 rounded mb-6">
                    <h4 className="font-semibold text-teal-900 mb-2">Action Taken</h4>
                    <p className="text-teal-800">{concern.actionTaken}</p>
                  </div>
                )}

                {/* Pending Status Notice */}
                {concern.status === 'pending' && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 rounded mb-6">
                    <h4 className="font-semibold text-yellow-900 mb-2">Status</h4>
                    <p className="text-yellow-800">This concern is awaiting approval from the Barangay Official. Once approved, actions and feedback will be displayed here.</p>
                  </div>
                )}

                {/* Community Feedback - Only show for In Progress and Resolved */}
                {(concern.status === 'in-progress' || concern.status === 'resolved') && (
                  <div className="bg-green-50 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-green-900 mb-2">Community Feedback</h4>
                    <p className="text-green-800 mb-3">{concern.feedback}</p>
                    <button className="flex items-center gap-2 text-green-700 hover:text-green-900 font-medium transition">
                      <ThumbsUp size={18} />
                      <span>{concern.upvotes} people found this helpful</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
              ))}
            </div>

            {/* Previous Button */}
            <button
              onClick={handlePrevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-teal-700 p-2 rounded-full shadow-lg transition z-10"
              aria-label="Previous slide"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Next Button */}
            <button
              onClick={handleNextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-teal-700 p-2 rounded-full shadow-lg transition z-10"
              aria-label="Next slide"
            >
              <ChevronRight size={24} />
            </button>

            {/* Slide Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {filteredConcerns.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition ${
                    index === currentSlide ? 'bg-teal-700 w-6' : 'bg-white/60'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {filteredConcerns.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">No concerns found with the current filter.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
