'use client'

export default function Header() {
  return (
    <header 
      className="relative text-white py-24 md:py-32 overflow-hidden"
      style={{
        backgroundImage: 'url(/barangay-hall.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-teal-900/85 via-teal-800/80 to-teal-700/75"></div>
      
      {/* Content */}
      <div className="relative max-w-4xl mx-auto px-4 md:px-6 text-center z-10">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-teal-900 font-bold text-lg">E</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold drop-shadow-lg">e-Sumbong</h1>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-yellow-400 mb-6 drop-shadow-lg">Your Voice, Our Action</h2>
        <p className="text-lg text-yellow-100 max-w-2xl mx-auto drop-shadow-md italic">
          Where Every Concern in Cogon Pardo Matters, Every Report is Heard, and Every Issue Leads to Action.
        </p>
      </div>
    </header>
  )
}
