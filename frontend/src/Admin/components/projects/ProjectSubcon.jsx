import React from "react";
import { MdConstruction } from "react-icons/md"; // React icon for placeholder worker
import { FaPlus } from "react-icons/fa";
import Button from "../../../components/Button";
function ProjectSubcon({ onCreate }) {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-120px)] w-full px-4 text-center">
      <div className="text-red-600 text-6xl mb-4">
        <MdConstruction />
      </div>
      <h2 className="text-lg font-semibold text-gray-700">
        No work order found
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Create a worker order so you can start using <br />
        <span className="font-medium">Sub-Contractor</span>
      </p>
      <Button
        variant="custom"
        onClick={onCreate}
        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md transition-all"
      >
        <FaPlus size={14} />
        Sub Con Work Order
      </Button>
    </div>
  );
}

export default ProjectSubcon;
