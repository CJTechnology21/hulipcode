
import React from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { MdOutlinePlayLesson } from "react-icons/md";

function AiHome() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row font-fredoka bg-white">
      {/* Left Sidebar */}
      <div className="w-full md:w-[440px] border-r border-gray-200 px-5 py-6 space-y-6">
        {/* Upload Section */}
        <div className="space-y-1">
          <p className="text-sm font-semibold text-gray-800">Upload image <span className="text-orange-500">*</span></p>
          <div className="border-2 border-dashed border-gray-300 p-6 rounded-md text-center bg-gray-50">
            <FaCloudUploadAlt className="mx-auto text-3xl text-orange-500" />
            <p className="mt-3 text-sm text-gray-600">Click to upload or drag and drop your image here</p>
            <div className="border-t my-3" />
            <p className="text-xs text-gray-500">Use one of our sample images</p>
          </div>
        </div>

        {/* Tabs */}
        {/* Tabs */}
<div className="flex space-x-6 border-b border-gray-300 text-sm font-semibold">
  {["Custom", "Style Fusion", "Auto Style", "Enhance"].map((tab, index) => (
    <button
      key={tab}
      className={`pb-2 border-b-2 transition-all duration-200 ${
        index === 0
          ? "text-orange-500 border-orange-500"
          : "text-gray-900 border-transparent hover:text-orange-500 hover:border-orange-500"
      }`}
    >
      {tab}
    </button>
  ))}
</div>


        {/* Learn section */}
        <div className="flex items-center bg-orange-50 text-sm text-gray-800 rounded-md p-3 border border-orange-100">
          <MdOutlinePlayLesson className="text-lg text-orange-500 mr-2" />
          <span>Learn to Use Custom Design Requests</span>
        </div>

        {/* Input Type */}
        <div>
          <p className="text-sm font-semibold text-gray-800 mb-1">Input Type</p>
          <select className="w-full border border-gray-300 rounded-md p-2 text-sm text-gray-600">
            <option>--- Select a Type ---</option>
          </select>
        </div>

        {/* Custom Design Request */}
        <div>
          <p className="text-sm font-semibold text-gray-800 mb-1">Custom Design Request <span className="text-orange-500">*</span></p>
          <textarea
            className="w-full border border-gray-300 rounded-md p-3 text-sm text-gray-600"
            rows={3}
            placeholder="A modern kitchen with navy blue cabinets, marble countertops, oak vinyl plank flooring, gold accents, pendant lights..."
          ></textarea>
        </div>

        {/* AI Creativity */}
        <div className="space-y-1">
          <p className="text-sm font-semibold text-gray-800">AI Creativity <span className="text-orange-500">*</span></p>
          <input
            type="range"
            min="0"
            max="100"
            defaultValue="20"
            className="w-full accent-orange-500"
          />
          <div className="flex justify-between text-xs text-gray-600">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>
      </div>

      {/* Right Preview Area */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white text-center">
        <div>
          <div className="text-5xl mb-3 text-gray-500">
            <svg
              className="w-10 h-10 mx-auto mb-4"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M19 21H5a2 2 0 01-2-2V5c0-1.103.897-2 2-2h6l2 2h6a2 2 0 012 2v12a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-800">Generated renders will appear here.</h2>
          <p className="text-sm text-gray-600 mt-2">
            Ready to bring your vision to life? Get started on the left to create your own custom renders.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AiHome;
// import React from 'react'

// function AiHome() {
//   return (
//     <div>AiHome</div>
//   )
// }

// export default AiHome