import React from 'react'

import ecom_home from "../images/ecom_home.jpg";

function Hero() {
  return (
   <section className="w-full font-[Poppins]">
        <div className="relative w-full">
          {/* Background image */}
          <img
            src={ecom_home}
            alt="Hero background"
            className="w-full h-[500px] object-cover"
          />

          {/* Floating white card */}
          <div className="hidden md:block absolute top-1/2 right-4 md:right-24 -translate-y-1/2 bg-white rounded-xl shadow-md p-6 md:p-10 w-[90%] max-w-[650px] h-auto md:h-[380px]">
            <p className="text-xs tracking-widest text-gray-500 uppercase mb-3">
              New Arrival
            </p>
            <h1 className="text-[2rem] md:text-[2.5rem] font-bold text-[#0070f3] leading-snug mb-4">
              Discover Our <br /> New Collection
            </h1>
            <p className="text-sm md:text-base text-gray-700 mb-6 leading-relaxed">
              Explore our latest arrivals that bring comfort, elegance, and
              trendsetting design right to your doorstep. Style up your space
              with confidence.
            </p>
            <button className="bg-[#0070f3] text-white text-sm font-semibold px-6 py-3 rounded hover:bg-blue-700 transition">
              BUY NOW
            </button>
          </div>
        </div>
      </section>
  )
}

export default Hero