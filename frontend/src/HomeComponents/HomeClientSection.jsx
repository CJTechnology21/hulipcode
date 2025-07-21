import React from "react";
import blue_shirt from "../Admin/images/blueshirt.png";

function HomeClientSection() {
  return (
    <section className="relative max-w-7xl mx-auto mb-16 px-4">
      <div className="relative bg-black text-white rounded-xl overflow-hidden">
        <img
          src={blue_shirt}
          alt="Client background"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />

        <div className="relative z-10 p-6 md:p-10 flex flex-col space-y-12">
          {/* Text Section */}
          <div className="max-w-3xl">
            <span className="bg-white text-gray-800 text-xs px-3 py-1 rounded-full font-medium">
              For Clients
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mt-6 leading-tight">
              We Simplify Construction
              <span className="block">By Connecting You to Experts</span>
            </h2>
            <p className="text-base sm:text-lg text-white/90 mt-4">
              As a construction company, we streamline your building journey by connecting you with certified architects.
              We not only help you find the right professional — we can also act as a mediator to manage the project end-to-end.
            </p>
          </div>

          {/* Cards Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {/* Card 1 */}
            <div className="bg-[#0077FF] hover:bg-blue-700 transition-colors text-white p-6 rounded-xl shadow-md cursor-pointer min-h-[180px]">
              <h3 className="text-xl font-bold mb-2">
                Discover Talented Architects
              </h3>
              <p className="text-sm mt-2">
                Access a curated pool of certified and trusted architectural professionals tailored to your project needs.
              </p>
              <p className="text-sm font-medium underline mt-4">
                Explore Talent →
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-[#0077FF] hover:bg-blue-700 transition-colors text-white p-6 rounded-xl shadow-md cursor-pointer min-h-[180px]">
              <h3 className="text-xl font-bold mb-2">
                Seamless Client–Architect Connection
              </h3>
              <p className="text-sm mt-2">
                We bridge the gap — bringing clients and architects together to collaborate, plan, and execute efficiently.
              </p>
              <p className="text-sm font-medium underline mt-4">
                Connect & Collaborate →
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-[#002144] hover:bg-[#002150] transition-colors text-white p-6 rounded-xl shadow-md cursor-pointer min-h-[180px]">
              <h3 className="text-xl font-bold mb-2 text-[#007AFF]">
                End-to-End Project Mediation
              </h3>
              <p className="text-sm mt-2">
                Let us manage the entire process — we stand as a neutral mediator ensuring quality, communication, and timely delivery.
              </p>
              <p className="text-sm font-medium underline mt-4">
                Learn About Mediation →
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomeClientSection;

