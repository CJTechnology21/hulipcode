import React, { useState } from "react";
import TwoDLayouts from "./TwoDLayouts";
import ThreeDRenders from "./ThreeDRenders";

function ProjectsDesign() {
  const [activeTab, setActiveTab] = useState("2d");

  return (
    <div className="p-4 md:p-6 bg-white w-full min-h-[85vh] rounded-md m-4">
      {/* Tabs */}
      <div className="flex items-center gap-6 border-b-2 border-gray-200 mb-4 font-bold text-[15px]">
        <span
          onClick={() => setActiveTab("2d")}
          className={`pb-2 cursor-pointer ${
            activeTab === "2d"
              ? "border-b-[3px] border-red-600 text-red-600"
              : "text-gray-500"
          }`}
        >
          2D Floor Layouts
        </span>
        <span
          onClick={() => setActiveTab("3d")}
          className={`pb-2 cursor-pointer ${
            activeTab === "3d"
              ? "border-b-[3px] border-red-600 text-red-600"
              : "text-gray-500"
          }`}
        >
          3D Renders
        </span>
      </div>

      {activeTab === "2d" ? <TwoDLayouts /> : <ThreeDRenders />}
    </div>
  );
}
export default   ProjectsDesign;