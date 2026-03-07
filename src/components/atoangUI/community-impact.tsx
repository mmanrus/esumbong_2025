"use client";

export default function CommunityImpact() {
  return (
    <section className="py-16 px-4 md:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-balance">
            Community in Action
          </h2>
          <p className="text-xl text-gray-600">
            Real citizens, real impact. See how E-Sumbong empowers communities
            to create meaningful change.
          </p>
        </div>

        {/* Image Grid */}
        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          {/* Community Gathering */}
          <div className="flex flex-col">
            <div className="relative overflow-hidden rounded-lg shadow-lg h-80 md:h-96">
              <img
                src="/community-gathering.jpg"
                alt="Large community barangay assembly with government officials and citizens"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="mt-4 bg-gray-50 p-6 rounded-lg">
              <h3 className="text-2xl font-bold text-teal-700 mb-2">
                Barangay Assembly
              </h3>
              <p className="text-gray-700">
                Community leaders and citizens come together to discuss local
                issues, share concerns, and collectively work toward solutions
                that benefit everyone.
              </p>
            </div>
          </div>

          {/* Outdoor Activity */}
          <div className="flex flex-col">
            <div className="relative overflow-hidden rounded-lg shadow-lg h-80 md:h-96">
              <img
                src="/community-activity.jpg"
                alt="Community members participating in outdoor civic engagement activity"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="mt-4 bg-gray-50 p-6 rounded-lg">
              <h3 className="text-2xl font-bold text-teal-700 mb-2">
                Grassroots Action
              </h3>
              <p className="text-gray-700">
                From community cleanups to local initiatives, citizens take
                direct action to improve their neighborhoods and create lasting
                positive change.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
          {[
            { number: "5000+", label: "Active Citizens" },
            { number: "250+", label: "Issues Resolved" },
            { number: "40+", label: "Communities" },
            { number: "98%", label: "Satisfaction" },
          ].map((stat, index) => (
            <div key={index} className="text-center p-6 bg-teal-50 rounded-lg">
              <p className="text-3xl md:text-4xl font-bold text-teal-700 mb-2">
                {stat.number}
              </p>
              <p className="text-gray-700 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
