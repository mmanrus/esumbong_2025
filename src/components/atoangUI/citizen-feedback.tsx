"use client";

const testimonials = [
  {
    id: 1,
    quote:
      "E-Sumbong made it incredibly easy to report the pothole on my street. Within weeks, it was fixed! Great responsiveness from the government.",
    name: "Maria Santos",
    title: "Community Resident",
  },
  {
    id: 2,
    quote:
      "As a community leader, I love how transparent the platform is. We can see exactly what actions are being taken on every report.",
    name: "Juan Dela Cruz",
    title: "Barangay Coordinator",
  },
  {
    id: 3,
    quote:
      "Finally, a platform where our voices are heard! I submitted three concerns and all of them are being addressed. This is real change.",
    name: "Rosa Reyes",
    title: "Active Citizen",
  },
];

export default function CitizenFeedback() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Citizens Are Saying
          </h2>
          <p className="text-lg text-gray-600">
            Join thousands of active citizens making a real difference in their
            communities
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-8 shadow-md hover:shadow-lg transition border-l-4 border-teal-700"
            >
              {/* Quote Mark */}
              <div className="text-yellow-400 text-4xl mb-4">"</div>

              {/* Quote */}
              <p className="text-gray-800 mb-6 italic leading-relaxed">
                {testimonial.quote}
              </p>

              {/* Author */}
              <div className="pt-6 border-t border-teal-200">
                <p className="font-semibold text-gray-900">
                  {testimonial.name}
                </p>
                <p className="text-teal-700 text-sm">{testimonial.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
