import React from "react";
import left_image from "../Admin/images/home_left.png";
import right_image from "../Admin/images/home_right.png";
import microsoft from "../Admin/images/Microsoft.png";
import airbnb from "../Admin/images/Airbnb.png";
import bissel from "../Admin/images/Bissell.png";

function HeroSection() {
  return (
    <div>
      {/* Hero Section */}
      <div className="flex items-center justify-center px-4 py-12">
        <div
          className="max-w-7xl w-full flex flex-col md:flex-row items-center justify-between rounded-xl shadow-lg p-8 gap-8"
          style={{ backgroundColor: "rgba(242, 247, 241, 1)" }}
        >
          {/* Left Image Stack */}
          <div className="hidden md:block">
            <img
              src={left_image}
              alt="Left"
              width={178}
              height={502}
              className="rounded-xl object-cover"
            />
          </div>

          {/* Center Content */}
          <div className="flex-1 text-center flex flex-col items-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 max-w-2xl">
              Simplifying Construction with Expert Architects
            </h1>
            <p className="text-gray-600 mb-10 max-w-xl">
              We help you find certified architects, streamline the building process, and manage the entire project by acting as a reliable mediator between you and your architect.
            </p>
            <div className="flex justify-center gap-4 mb-6">
              <button className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition">
                Find an Architect
              </button>
              <button className="border border-blue-600 text-blue-600 px-5 py-2 rounded-lg font-medium hover:bg-blue-50 transition">
                How We Work
              </button>
            </div>
            <div className="flex items-center justify-center gap-6 text-gray-400 text-sm mt-2">
              <span>Trusted by</span>
              <img src={microsoft} alt="Microsoft" width={80} />
              <img src={airbnb} alt="Airbnb" width={60} />
              <img src={bissel} alt="Bissell" width={60} />
            </div>
          </div>

          {/* Right Image Stack */}
          <div className="hidden md:block">
            <img
              src={right_image}
              alt="Right"
              width={178}
              height={502}
              className="rounded-xl object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
