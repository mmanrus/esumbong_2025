'use client'  

import ImageCarousel from '@/components/atoangUI/image-carousel'
import { CheckCircle2, Users, Lightbulb, Award } from 'lucide-react'

const values = [
  {
    icon: Users,
    title: 'Community-Centered',
    description:
      'We prioritize the voices and needs of our citizens in every decision we make.',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description:
      'We continuously improve our platform to better serve the community.',
  },
  {
    icon: Award,
    title: 'Accountability',
    description:
      'We ensure government officials remain transparent and responsive.',
  },
  {
    icon: CheckCircle2,
    title: 'Efficiency',
    description: 'We streamline concern resolution for faster community impact.',
  },
]

const milestones = [
  {
    number: '300+',
    label: 'Active Citizens',
  },
  {
    number: '250+',
    label: 'Issues Resolved',
  },
  {
    number: '98%',
    label: 'Resolution Rate',
  },
]

export default function About() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-background">
      {/* Hero Section with Carousel */}
      <ImageCarousel />

      {/* About Section */}
      <section className="py-16 md:py-24 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8 text-balance">
            About e-Sumbong
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
            The E-Sumbong Web-Based Concern and Feedback Management System is
            proudly developed to serve the residents and officials of Barangay
            Cogon Pardo, Cebu City. This system was created to modernize the
            barangay's concern-handling process by replacing manual reporting
            with a more organized, secure, and accessible online platform
            tailored to the needs of the Cogon Pardo community.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-teal-50">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-4 mb-6">
            <div className="w-1 bg-teal-600 rounded-full" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Our Mission
            </h2>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Our mission is to strengthen public service in Barangay Cogon Pardo
            by promoting transparency, accountability, and efficient
            communication between residents and barangay officials through a
            reliable web-based system.
          </p>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-16 md:py-24 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12">
            What We Do
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {[
              'Provide an easy-to-use platform for reporting community issues',
              'Enable real-time tracking of issue resolution progress',
              'Foster community engagement and collective action',
              'Promote transparency and accountability in local governance',
            ].map((item, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-400">
                    <CheckCircle2 className="h-5 w-5 text-teal-600" />
                  </div>
                </div>
                <p className="text-lg text-muted-foreground">{item}</p>
              </div>
            ))}
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <div
                  key={index}
                  className="p-6 rounded-lg border border-gray-200 hover:border-teal-400 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-yellow-400 rounded-lg flex-shrink-0">
                      <Icon className="h-6 w-6 text-teal-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-foreground mb-2">
                        {value.title}
                      </h3>
                      <p className="text-muted-foreground">{value.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-gradient-to-r from-teal-600 to-teal-700">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
            Our Impact
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-8 justify-items-center">
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className="text-center transform hover:scale-105 transition-transform duration-300"
              >
                <div className="text-4xl md:text-5xl font-bold text-yellow-400 mb-2">
                  {milestone.number}
                </div>
                <p className="text-white text-lg">{milestone.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-16 md:py-24 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="p-8 md:p-12 bg-teal-50 rounded-lg border-l-4 border-teal-600">
            <p className="text-xl md:text-2xl font-semibold text-teal-800 italic text-center">
              "Together, we can build stronger, more responsive communities
              where every voice matters."
            </p>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
            Our Vision
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            We envision a future where every citizen in Barangay Cogon Pardo has
            equal access to government services, transparent communication
            channels, and the power to influence local development. Through
            e-Sumbong, we aim to create a model community that demonstrates how
            technology and civic engagement can work together to solve problems
            and improve quality of life.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            By bridging the gap between residents and officials, we are building
            a more inclusive, responsive, and effective barangay government for
            everyone.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-gradient-to-r from-teal-600 to-teal-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Join Our Community
          </h2>
          <p className="text-white text-lg mb-8 max-w-2xl mx-auto">
            Be part of the movement to strengthen our barangay through
            transparency, accountability, and collective action.
          </p>
          <button className="inline-block bg-yellow-400 text-teal-600 font-bold py-3 px-8 rounded-lg hover:bg-yellow-300 transition-colors duration-300 text-lg">
            Get Started Now
          </button>
        </div>
      </section>
    </main>
  )
}
