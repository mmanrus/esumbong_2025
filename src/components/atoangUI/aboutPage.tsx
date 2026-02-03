"use client"
import { motion } from 'framer-motion';

function AboutPage() {
  return (
    <>

      <div className="min-h-screen bg-linear-to-b from-gray-50 to-white pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">About e-Sumbong</h1>
            
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="text-xl leading-relaxed mb-6">
                e-Sumbong is a civic engagement platform designed to bridge the gap between citizens and their local government.
              </p>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Our Mission</h2>
              <p className="leading-relaxed mb-6">
                We believe in empowering communities through transparent communication and efficient problem-solving. 
                Our platform enables citizens to report issues, track their resolution, and engage with their local government in meaningful ways.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What We Do</h2>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <span className="text-teal-600 font-bold mr-2">•</span>
                  <span>Provide an easy-to-use platform for reporting community issues</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 font-bold mr-2">•</span>
                  <span>Enable real-time tracking of issue resolution progress</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 font-bold mr-2">•</span>
                  <span>Foster community engagement and collective action</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 font-bold mr-2">•</span>
                  <span>Promote transparency and accountability in local governance</span>
                </li>
              </ul>

              <div className="bg-teal-50 border-l-4 border-teal-600 p-6 mt-8 rounded-r-lg">
                <p className="text-lg italic text-teal-900">
                  "Together, we can build stronger, more responsive communities where every voice matters."
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default AboutPage;