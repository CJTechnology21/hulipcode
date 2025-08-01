
import React, { useState } from "react";
import { FiEdit2, FiPlus, FiSave } from "react-icons/fi";
import { FaRegWindowClose } from "react-icons/fa";

const mockData = [
  {
    id: 1,
    name: "Living Room",
    category: "Common",
    length: "15ft",
    breadth: "12ft",
    height: "9ft",
  },
  {
    id: 2,
    name: "Powder",
    category: "Common",
    length: "15ft",
    breadth: "12ft",
    height: "9ft",
  },
  {
    id: 3,
    name: "Bedroom",
    category: "Common",
    length: "15ft",
    breadth: "12ft",
    height: "9ft",
  },
  {
    id: 4,
    name: "Master Bedroom Toilet",
    category: "Toilet",
    length: "12ft",
    breadth: "6ft",
    height: "9ft",
  },
  {
    id: 5,
    name: "Powder",
    category: "Common",
    length: "15ft",
    breadth: "12ft",
    height: "9ft",
  },
  {
    id: 6,
    name: "Bedroom",
    category: "Common",
    length: "15ft",
    breadth: "12ft",
    height: "9ft",
  },
];

const ProjectSiteMeasurements = () => {
  const [expandedRow, setExpandedRow] = useState(null);
  const [space, setSpace] = useState({
    name: "Master Bedroom Toilet",
    category: "Toilet",
    length: 12,
    breadth: 6,
    height: 9,
  });

  return (
    <div className="w-full px-0 md:px-4 bg-white p-4 md:p-8 rounded-md shadow overflow-x-auto md:m-2">
      <table className="w-full border-collapse table-auto">
        <thead>
          <tr className="bg-gray-100 text-left text-sm font-semibold">
            <th className="p-2">S.no</th>
            <th className="p-2">Space Name</th>
            <th className="p-2">Category</th>
            <th className="p-2">Length</th>
            <th className="p-2">Breadth</th>
            <th className="p-2">Height</th>
            <th className="p-2">Opening Area</th>
            <th className="p-2">Perimeter</th>
            <th className="p-2">Floor Area</th>
            <th className="p-2">Wall Area</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {mockData.map((space, index) => (
            <React.Fragment key={space.id}>
              <tr
                className="cursor-pointer hover:bg-gray-50 border-b"
                onClick={() =>
                  setExpandedRow(expandedRow === index ? null : index)
                }
              >
                <td className="p-2">{space.id}</td>
                <td className="p-2">{space.name}</td>
                <td className="p-2">{space.category}</td>
                <td className="p-2">{space.length}</td>
                <td className="p-2">{space.breadth}</td>
                <td className="p-2">{space.height}</td>
                <td className="p-2">34 sqft</td>
                <td className="p-2">94 rft</td>
                <td className="p-2">180 sqft</td>
                <td className="p-2">470 sqft</td>
                <td className="p-2">
                  <FiEdit2 className="inline-block" />
                </td>
              </tr>

              {expandedRow === index && (
                <tr>
                  <td colSpan="11" className="bg-white py-6 px-6">
                    <div className="grid grid-cols-[1fr_1fr_1.5fr_1fr_0.8fr] gap-6 text-sm text-red-800 w-full">
                      {/* Column 1: Area Name and Category */}
                      <div className="space-y-4">
                        {[
                          { label: "Area Name", value: space.name },
                          { label: "Select Category", value: space.category },
                        ].map(({ label, value }, idx) => (
                          <div key={idx}>
                            <label className="font-bold block">{label}</label>
                            <div className="border p-2 rounded flex justify-between items-center">
                              <input
                                defaultValue={value}
                                className="bg-transparent outline-none font-semibold text-black flex-1"
                              />
                              <FiEdit2 className="text-red-600 cursor-pointer" />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Column 2: Area Dimensions */}
                      <div className="space-y-4">
                        <label className="font-bold block">
                          Enter Area Dimensions
                        </label>

                        {["Length", "Breadth", "Height"].map((dim, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <label className="font-bold min-w-[70px]">
                              {dim}
                            </label>
                            <div className="border p-2 rounded flex items-center gap-2 w-full max-w-[180px]">
                              <input
                                type="number"
                                value={space[dim.toLowerCase()]} // controlled input
                                onChange={(e) =>
                                  setSpace({
                                    ...space,
                                    [dim.toLowerCase()]: e.target.value,
                                  })
                                }
                                className="bg-transparent outline-none font-bold text-black w-full text-right"
                              />
                              <span className="text-gray-600 text-sm">ft</span>
                              <FiEdit2 className="text-red-600 cursor-pointer" />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Column 3: Door & Window Dimensions */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <label className="font-bold">
                            Door & Window Dimensions
                          </label>
                          <button className="bg-red-700 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                            <span className="text-lg font-bold">+</span> Add
                          </button>
                        </div>

                        {["Door 1", "Door 2", "Window"].map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center flex-wrap gap-2"
                          >
                            <span className="font-bold min-w-[60px]">
                              {item}
                            </span>

                            {/* Height */}
                            <div className="flex items-center border rounded px-2 py-1">
                              <span className="mr-1 text-sm">H</span>
                              <input
                                defaultValue="7"
                                className="w-10 text-center outline-none font-semibold text-black bg-transparent"
                              />
                              <span className="ml-1 text-gray-600 text-xs">
                                ft
                              </span>
                              <FiEdit2 className="ml-2 text-red-600 cursor-pointer" />
                            </div>

                            {/* Width */}
                            <div className="flex items-center border rounded px-2 py-1">
                              <span className="mr-1 text-sm">W</span>
                              <input
                                defaultValue="2.5"
                                className="w-10 text-center outline-none font-semibold text-black bg-transparent"
                              />
                              <span className="ml-1 text-gray-600 text-xs">
                                ft
                              </span>
                              <FiEdit2 className="ml-2 text-red-600 cursor-pointer" />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Column 4: Unit Selector and Calculated Values */}
                      <div className="space-y-4">
                        <div className="flex mt-2 ml-4">
                          <button className="bg-red-700 text-white text-xs px-3 py-1 rounded-l">
                            Feet
                          </button>
                          <button className="border text-xs px-3 py-1 rounded-r">
                            Unit
                          </button>
                        </div>
                        {[
                          { label: "Perimeter", value: "36 ft" },
                          { label: "Floor Area", value: "72 ft" },
                          { label: "Wall Area", value: "324 ft" },
                        ].map(({ label, value }, i) => (
                          <div key={i}>
                            <label className="font-bold block">{label}</label>
                            <div className="border p-2 rounded flex items-center gap-2">
                              <input
                                defaultValue={value}
                                className="bg-transparent outline-none font-bold text-black flex-1"
                              />
                              <FiEdit2 className="text-red-600 cursor-pointer" />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Column 5: Actions and Area Calculation */}
                      <div className="space-y-4">
                        <div className="flex">
                          <button className="border text-xs px-3 py-1 rounded-l">
                            Save
                          </button>
                          <button className="bg-red-700 text-white text-xs px-3 py-1 rounded-r">
                            Action
                          </button>
                        </div>

                        <div>
                          <label className="font-bold block mb-1">
                            Area Calculation
                          </label>
                          <div className="flex flex-col gap-2">
                            <button className="border rounded py-1 font-bold">
                              Automatic
                            </button>
                            <button className="bg-red-700 text-white rounded py-1 font-bold">
                              Custom
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectSiteMeasurements;
