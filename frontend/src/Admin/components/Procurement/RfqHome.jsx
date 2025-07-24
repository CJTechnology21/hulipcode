import React, { useState } from "react";
import SearchBar from "../../../components/SearchBar";
import Button from "../../../components/Button";
import MaterialRequestModal from "./MaterialRequestModal";
import CreateRFQModal from "./CreateRFQModal";

export default function RfqHome() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRFQModalOpen, setIsRFQModalOpen] = useState(false);

  return (
    <>
      {/* Modal */}
      <MaterialRequestModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <CreateRFQModal
        open={isRFQModalOpen}
        onClose={() => setIsRFQModalOpen(false)}
      />

      {/* Main Content */}
      <div className="flex flex-col gap-4 p-2">
        {/* Top Bar */}
        <div className="flex justify-between items-center">
          <div className="w-72">
            <SearchBar
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search By RFQ Number"
            />
          </div>
          <div className="flex items-center gap-4">
            <Button
              color="black"
              variant="custom"
              className="text-sm font-medium text-gray-800 relative"
              onClick={() => setIsModalOpen(true)}
            >
              Open Material Request
              <span className="absolute -top-2 -right-3 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                3
              </span>
            </Button>
            <Button
              color="red"
              className="text-white bg-red-600 hover:bg-red-700 text-sm px-4 py-2 rounded-lg font-semibold"
              variant="custom"
              onClick={() => setIsRFQModalOpen(true)}
            >
              + New RFQ
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-md text-sm bg-white">
            <thead className="bg-gray-400 text-black">
              <tr>
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Suppliers</th>
                <th className="px-4 py-2 text-left">Bids</th>
                <th className="px-4 py-2 text-left">Created By</th>
                <th className="px-4 py-2 text-left">Delivery Location</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left"></th>
              </tr>
            </thead>
            <tbody>
              {/* Static row - replace with dynamic data later */}
              <tr className="border-t border-gray-200">
                <td className="px-4 py-2">#12-15</td>
                <td className="px-4 py-2">1</td>
                <td className="px-4 py-2">0</td>
                <td className="px-4 py-2">anshul</td>
                <td className="px-4 py-2">135 naraina vihar, Central Delhi</td>
                <td className="px-4 py-2">
                  <span className="bg-green-200 text-green-800 px-2 py-1 rounded-md text-xs font-medium">
                    Published
                  </span>
                </td>
                <td className="px-4 py-2 text-right">
                  <button className="text-gray-600 hover:text-gray-900">
                    ⋮
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
