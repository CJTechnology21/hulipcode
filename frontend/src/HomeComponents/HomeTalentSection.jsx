import React from 'react'
import girl from "../Admin/images/girl.png";
function HomeTalentSection() {
  return (
    <div>
         <section className="max-w-7xl mx-auto px-4 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden bg-white shadow-lg">
          {/* Left - Image */}
          <div className="h-64 md:h-auto">
            <img
              src={girl}
              alt="Person working"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right - Content */}
          <div className="bg-[#001e3c] text-white flex flex-col justify-between px-6 sm:px-8 py-8">
            {/* Top Content */}
            <div>
              <p className="text-base sm:text-lg lg:text-xl font-medium mb-2 mt-10">
                For Talent
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#3fb5ff] leading-snug mt-10">
                Find a great <br /> worker
              </h2>
              <p className="mt-3 text-sm sm:text-base lg:text-lg text-white/80 max-w-md">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry.
              </p>
            </div>

            {/* Feature Row */}
            <div className="mt-10 sm:mt-12 md:mt-16 border-t border-white/30 pt-5 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm lg:text-base">
              <p>Find opportunities for every stage of your freelance career</p>
              <p>Control when, where, and how you work</p>
              <p>Explore different ways to earn</p>
            </div>

            {/* CTA */}
            <div className="mt-6">
              <button className="bg-white text-[#001e3c] text-sm lg:text-base px-5 py-2 rounded-full font-semibold hover:bg-gray-100 transition">
                Find Opportunities
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomeTalentSection