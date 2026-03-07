'use client'

import { useState } from 'react'
import Header from '@/components/atoangUI/headers'

export default function EmergencyPage() {
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: 'Water Supply Maintenance',
      description: 'Scheduled water supply interruption on March 15-16 for main line repairs.',
      date: 'March 10, 2026',
      priority: 'high',
      icon: '💧',
    },
    {
      id: 2,
      title: 'Anti-Rabies Vaccination for Dogs and Cats',
      description: 'Free vaccination program at barangay health center. Bring your pets with identification. Date: March 18-20, 2026. Time: 8 AM - 4 PM.',
      date: 'March 12, 2026',
      priority: 'high',
      icon: '🐾',
    },
    {
      id: 3,
      title: 'Barangay Clean-Up Drive Schedule',
      description: 'Community-wide cleanup drive scheduled for March 22, 2026. Meet at barangay hall at 6 AM. Volunteers needed!',
      date: 'March 11, 2026',
      priority: 'medium',
      icon: '🧹',
    },
    {
      id: 4,
      title: 'Free Medical Check-Up for Residents',
      description: 'Mobile health clinic offering free medical consultations and basic tests. Every Saturday at barangay health center.',
      date: 'March 13, 2026',
      priority: 'medium',
      icon: '🏥',
    },
    {
      id: 5,
      title: 'Disaster Preparedness Seminar',
      description: 'Community training on disaster response and safety procedures. March 25, 2026 at 2 PM. Barangay training center. All residents welcome.',
      date: 'March 14, 2026',
      priority: 'medium',
      icon: '🚨',
    },
    {
      id: 6,
      title: 'Barangay Assembly Meeting',
      description: 'Monthly barangay assembly meeting. Agenda includes budget review and community concerns. March 28, 2026 at 6 PM. All residents invited.',
      date: 'March 15, 2026',
      priority: 'medium',
      icon: '📢',
    },
    {
      id: 7,
      title: 'Waste Segregation Awareness Campaign',
      description: 'Educational campaign on proper waste management and recycling. Distributed materials and live demonstrations daily at barangay office.',
      date: 'March 16, 2026',
      priority: 'low',
      icon: '♻️',
    },
    {
      id: 8,
      title: 'Road Repair Updates',
      description: 'Pothole repair works ongoing on Main Street. Please use alternate routes. Expected completion: March 20, 2026.',
      date: 'March 8, 2026',
      priority: 'medium',
      icon: '🚧',
    },
  ])

  const hotlines = [
    { name: 'Emergency Hotline', number: '911', available: '24/7' },
    { name: 'Barangay Office', number: '(555) 123-4567', available: '9 AM - 5 PM' },
    { name: 'Fire Department', number: '(555) 234-5678', available: '24/7' },
    { name: 'Police Station', number: '(555) 345-6789', available: '24/7' },
    { name: 'Medical Emergency', number: '(555) 456-7890', available: '24/7' },
    { name: 'Disaster Management', number: '(555) 567-8901', available: '24/7' },
  ]

  const handleDeleteAnnouncement = (id: number) => {
    setAnnouncements(announcements.filter((a) => a.id !== id))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-300'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300'
    }
  }

  return (
    <main>
      <Header />
      <section className="py-12 px-4 md:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          {/* Page Title */}
          <div className="mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">Emergency & Announcements</h1>
            <p className="text-xl text-gray-600">
              Stay informed with critical updates and emergency contact information for your community.
            </p>
          </div>

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Emergency Hotlines - Sidebar */}
            <div>
              <div className="bg-white rounded-lg shadow-lg p-8 sticky top-4">
                <h2 className="text-2xl font-bold text-teal-700 mb-6">Emergency Hotlines</h2>
                <div className="space-y-4">
                  {hotlines.map((hotline, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <p className="font-semibold text-gray-900">{hotline.name}</p>
                      <a
                        href={`tel:${hotline.number.replace(/\D/g, '')}`}
                        className="text-teal-600 font-bold text-lg hover:text-teal-800 transition"
                      >
                        {hotline.number}
                      </a>
                      <p className="text-sm text-gray-500 mt-1">{hotline.available}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Announcements - Main Content */}
            <div className="lg:col-span-2">
              {/* Announcements List */}
              <div className="space-y-6">
                {announcements.length === 0 ? (
                  <div className="bg-white rounded-lg shadow p-12 text-center">
                    <p className="text-gray-500 text-lg">No announcements at this time.</p>
                  </div>
                ) : (
                  announcements.map((announcement) => (
                    <div
                      key={announcement.id}
                      className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-teal-500 hover:shadow-xl transition"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">{announcement.icon}</span>
                            <h3 className="text-2xl font-bold text-gray-900">
                              {announcement.title}
                            </h3>
                          </div>
                          <p className="text-gray-700 mb-4">{announcement.description}</p>
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="text-sm text-gray-500">📅 {announcement.date}</span>
                            <span
                              className={`text-xs font-semibold px-3 py-1 rounded-full border ${getPriorityColor(
                                announcement.priority
                              )}`}
                            >
                              {announcement.priority.charAt(0).toUpperCase() +
                                announcement.priority.slice(1)}{' '}
                              Priority
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteAnnouncement(announcement.id)}
                          className="text-red-500 hover:text-red-700 font-bold text-lg transition"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
