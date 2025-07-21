import React from "react";
import { FaFileAlt, FaBoxOpen, FaHeadphonesAlt } from "react-icons/fa";
import pink_shirt from "../Admin/images/pink_shirt.png";
import { useNavigate } from "react-router-dom";

function HomeLeft() {
  const navigate = useNavigate();
  return (
    <div>
      <section className="max-w-7xl mx-auto px-4 py-6 flex flex-col-reverse md:flex-row bg-[#0b1c38] text-white rounded-xl overflow-hidden mb-10">
        {/* Left Content */}
        <div className="flex-1 p-4 md:p-8 flex flex-col justify-center gap-4">
          <span className="text-sm font-medium">Welcome to Huelip</span>

          <h2 className="text-[28px] md:text-[38px] font-bold leading-tight">
            Connecting You With{" "}
            <span className="text-blue-400">Certified Architects</span>
            <br />
            <span className="text-blue-400">for Seamless Construction</span>
          </h2>

          <p className="text-sm text-white/80 max-w-xl">
            Huelip is a modern construction platform that bridges the gap
            between clients and certified architects. We simplify and streamline
            your building process from concept to completion.
          </p>

          <ul className="space-y-3 text-sm text-white/80">
            <li className="flex items-start gap-3">
              <FaFileAlt className="text-blue-400 mt-1 min-w-[16px]" />
              <span>
                Work with verified, experienced architects you can trust
              </span>
            </li>
            <li className="flex items-start gap-3">
              <FaBoxOpen className="text-blue-400 mt-1 min-w-[16px]" />
              <span>
                Manage your construction project with ease and transparency
              </span>
            </li>
            <li className="flex items-start gap-3">
              <FaHeadphonesAlt className="text-blue-400 mt-1 min-w-[16px]" />
              <span>
                Enjoy smooth communication between you and professionals
                throughout the journey
              </span>
            </li>
          </ul>


          <button className="mt-4 px-5 py-2 bg-white text-black text-sm rounded-full font-medium hover:bg-gray-200 w-fit"
          onClick={()=>navigate('listings')}>
            Learn More
          </button>

        </div>

        {/* Right Image */}
        <div className="md:w-1/2 w-full flex justify-center items-center mb-6 md:mb-0">
          <img
            src={pink_shirt}
            alt="Huelip visual"
            className="w-full max-w-[320px] md:max-w-[400px] h-auto object-cover"
          />
        </div>
      </section>
    </div>
  );
}

export default HomeLeft;
