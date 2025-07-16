import React from "react";
import { FaStar, FaAward } from "react-icons/fa";
import yellow_cartoon from "../Admin/images/yellow_cartoon.png";
function HomeFeatures() {
  return (
    <div>
      <section className="max-w-7xl mx-auto px-4 mb-16">
        <div className="relative bg-[#f2f7f4] rounded-xl p-6 lg:p-10 flex flex-col lg:flex-row items-stretch justify-between gap-10 overflow-hidden">
          {/* Left Section */}
          <div className="flex-1 space-y-6 z-10 min-h-[340px]">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
              Lorem Ipsum is simply dummy text.
            </h2>
            <ul className="space-y-4 text-sm text-gray-700">
              {[1, 2, 3].map((i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-lg mt-1 text-gray-800">
                    <FaStar />
                  </span>
                  <div>
                    <p className="font-semibold text-gray-900">Lorem Ipsum</p>
                    <p className="text-gray-600">
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry.
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Center Illustration */}
          <div className="hidden lg:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0">
            <img
              src={yellow_cartoon}
              alt="Illustration"
              className="w-64 h-[340px] object-contain"
            />
          </div>

          {/* Right Blue Card */}
          <div className="flex-1 bg-[#0077ff] text-white rounded-xl p-6 lg:p-8 z-10 flex flex-col justify-center lg:ml-[250px]">
            <h3 className="text-lg font-bold leading-snug">
              Lorem Ipsum is simply dummy text of the printing.
            </h3>
            <p className="text-sm opacity-90 mt-1">
              Lorem Ipsum is simply dummy text.
            </p>

            {/* Rating */}
            <div className="mt-6 flex items-center gap-3">
              <div className="bg-white p-2 rounded-full shadow">
                <FaStar className="text-yellow-400 w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-bold">4.9/5</p>
                <p className="text-xs opacity-90">
                  Lorem Ipsum is simply dummy text.
                </p>
              </div>
            </div>

            {/* Award */}
            <div className="mt-4 flex items-center gap-3">
              <div className="bg-white p-2 rounded-full shadow">
                <FaAward className="text-blue-600 w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-bold">Award winner</p>
                <p className="text-xs opacity-90">
                  Lorem Ipsum is simply dummy text.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomeFeatures;
