import React from "react";
import support from "../Admin/images/support.svg";
function HomeSupportBanner() {
  return (
    <div>
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="bg-blue-100 rounded-2xl flex flex-col sm:flex-row items-center justify-between px-6 py-6 sm:py-8 shadow-sm">
          {/* Text Content */}
          <div className="flex-1">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
              We support
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mt-1 mb-4">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry.
            </p>
            <button className="text-sm border border-blue-600 text-blue-600 px-4 py-1.5 rounded-full hover:bg-blue-50 transition">
              Learn more
            </button>
          </div>

          {/* Image */}
          <div className="mt-6 sm:mt-0 sm:ml-6 w-32 sm:w-40 shrink-0">
            <img
              src={support}
              alt="Support illustration"
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomeSupportBanner;
