import React from "react";
import blue_shirt from "../Admin/images/blueshirt.png";
function HomeClientSection() {
  return (
    <div>
      {" "}
      <section className="relative max-w-7xl mx-auto mb-16 px-4">
        <div className="relative bg-black text-white rounded-xl overflow-hidden h-auto lg:h-[600px]">
          <img
            src={blue_shirt}
            alt="Client background"
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />

          <div className="relative z-10 p-6 md:p-10 flex flex-col justify-between h-full">
            {/* Text Section */}
            <div className="max-w-3xl">
              <span className="bg-white text-gray-800 text-xs px-3 py-1 rounded-full font-medium">
                For Clients
              </span>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mt-6 leading-tight">
                Lorem Ipsum is <span className="block">simply</span>
              </h2>
              <p className="text-base sm:text-lg text-white/90 mt-4">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry.
              </p>
            </div>

            {/* Cards Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 lg:mt-32 w-full">
              <div className="bg-[#0077FF] hover:bg-blue-700 transition-colors text-white p-6 rounded-xl shadow-md cursor-pointer min-h-[180px]">
                <h3 className="text-xl font-bold mb-2">
                  Lorem Ipsum is simply dummy
                  <div>
                    <h3>simply dummy text.</h3>
                  </div>
                </h3>
                <p className="text-sm font-medium underline mt-4">
                  Talent Marketplace™ →
                </p>
              </div>
              <div className="bg-[#0077FF] hover:bg-blue-700 transition-colors text-white p-6 rounded-xl shadow-md cursor-pointer min-h-[180px]">
                <h3 className="text-xl font-bold mb-2">
                  Lorem Ipsum is simply dummy
                  <div>
                    <h3>simply dummy text.</h3>
                  </div>
                </h3>
                <p className="text-sm font-medium underline mt-4">
                  Project Catalog™ →
                </p>
              </div>
              <div className="bg-[#002144] hover:bg-[#002150] transition-colors text-white p-6 rounded-xl shadow-md cursor-pointer min-h-[180px]">
                <h3 className="text-xl font-bold mb-2 text-[#007AFF]">
                  Lorem Ipsum is simply dummy
                  <div>
                    <h3>simply dummy text.</h3>
                  </div>
                </h3>
                <p className="text-sm font-medium underline mt-4">
                  Talent Scout™ →
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomeClientSection;
