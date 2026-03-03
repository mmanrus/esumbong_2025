"use client";

export default function Header() {
  return (
    <header className="bg-gradient-to-b from-teal-700 to-teal-600 text-white py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center">
            <span className="text-teal-700 font-bold text-lg">E</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">e-Sumbong</h1>
        </div>
        <h2 className="text-2xl md:text-4xl font-bold text-yellow-400 mb-4">
          Your Voice, Our Action
        </h2>
        <p className="text-lg text-teal-100 max-w-2xl mx-auto">
          Where Every Concern in Cogon Pardo Matters, Every Report is Heard, and Every Issue Leads to Action.
        </p>
      </div>
    </header>
  );
}
