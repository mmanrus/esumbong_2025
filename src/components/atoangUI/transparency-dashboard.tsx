'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ThumbsUp } from 'lucide-react'

const concerns = [
  {
    id: 1,
    title: 'Pothole on Main Street',
    description: 'Large pothole affecting traffic flow on Main Street near the town center. Reported by multiple residents.',
    category: 'Infrastructure',
    status: 'resolved',
    dateSubmitted: '2024-02-15',
    actionTaken: 'Road repair completed and tested on 2024-03-01. Street surface restored to safe condition.',
    feedback: 'Great response time! The road is much better now.',
    upvotes: 24,
  },
  {
    id: 2,
    title: 'Street Lighting Malfunction',
    description: 'Several street lights near the park are not functioning, creating safety concerns at night.',
    category: 'Safety',
    status: 'in-progress',
    dateSubmitted: '2024-02-20',
    actionTaken: 'Maintenance team scheduled for 2024-03-10. Parts ordered and expected arrival 2024-03-05.',
    feedback: 'Thanks for addressing this quickly!',
    upvotes: 18,
  },
  {
    id: 3,
    title: 'Park Cleanup Initiative',
    description: 'Community request to improve park maintenance and landscaping in central park area.',
    category: 'Environment',
    status: 'pending',
    dateSubmitted: '2024-02-25',
    actionTaken: 'Assigned to Parks Department for evaluation. Initial site visit scheduled.',
    feedback: 'Looking forward to seeing improvements!',
    upvotes: 31,
  },
  {
    id: 4,
    title: 'Traffic Signal Timing',
    description: 'Request to review traffic signal timing at intersection of Oak and 5th Avenue. Long wait times reported.',
    category: 'Infrastructure',
    status: 'in-progress',
    dateSubmitted: '2024-02-10',
    actionTaken: 'Traffic engineer analyzing signal patterns. Data collection in progress.',
    feedback: 'We are monitoring the situation closely.',
    upvotes: 15,
  },
  {
    id: 5,
    title: 'Public Library Extension',
    description: 'Proposal to extend library hours to serve evening and weekend commuters better.',
    category: 'Services',
    status: 'pending',
    dateSubmitted: '2024-02-18',
    actionTaken: 'Library board will review budget and staffing requirements.',
    feedback: 'This would be very helpful for working professionals.',
    upvotes: 42,
  },
  {
    id: 6,
    title: 'Water Quality Testing',
    description: 'Residents report concerns about water quality in the northwestern district.',
    category: 'Environment',
    status: 'resolved',
    dateSubmitted: '2024-01-20',
    actionTaken: 'Water quality tests completed on 2024-02-28. Results show normal parameters. Monthly monitoring established.',
    feedback: 'Glad the water is safe. Thanks for the testing!',
    upvotes: 9,
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

  const filteredConcerns =
    filter === 'all' ? concerns : concerns.filter((c) => c.status === filter)

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Transparency Dashboard</h2>
          <p className="text-lg text-gray-600">
            View submitted concerns, actions taken, and community feedback
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

        {/* Concerns Grid */}
        <div className="grid gap-6 md:gap-8">
          {filteredConcerns.map((concern) => (
            <div
              key={concern.id}
              className={`bg-white rounded-lg shadow-md hover:shadow-lg transition border-l-4 ${getLeftBorderColor(concern.status)} overflow-hidden`}
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

                {/* Action Taken */}
                <div className="bg-teal-50 border-l-4 border-teal-700 p-4 rounded mb-6">
                  <h4 className="font-semibold text-teal-900 mb-2">Action Taken</h4>
                  <p className="text-teal-800">{concern.actionTaken}</p>
                </div>

                {/* Community Feedback */}
                <div className="bg-green-50 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-green-900 mb-2">Community Feedback</h4>
                  <p className="text-green-800 mb-3">{concern.feedback}</p>
                  <button className="flex items-center gap-2 text-green-700 hover:text-green-900 font-medium transition">
                    <ThumbsUp size={18} />
                    <span>{concern.upvotes} people found this helpful</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredConcerns.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">No concerns found with the current filter.</p>
          </div>
        )}
      </div>
    </section>
  )
}
