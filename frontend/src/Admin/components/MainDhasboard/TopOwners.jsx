import React from "react";
import { FaUserCircle } from "react-icons/fa"; // Profile icon

const owners = [
  { name: "Amit", email: "amit@example.com" },
  { name: "Sara", email: "sara@example.com" },
  { name: "Lee", email: "lee@example.com" },
  { name: "Raj", email: "raj@example.com" },
  { name: "Nina", email: "nina@example.com" },
  { name: "John", email: "john@example.com" },
];

const TopOwners = () => (
  <div className="bg-white p-4 rounded shadow h-full w-full">
    <h3 className="text-lg font-semibold mb-4 font-fredoka">Top Owners</h3>
    <ul className="space-y-3">
      {owners.map((owner, index) => (
        <li
          key={index}
          className="flex items-center justify-between  p-3 rounded font-fredoka"
        >
          {/* Left: Profile icon and info */}
          <div className="flex items-center gap-3">
            <FaUserCircle className="text-3xl text-gray-400" />
            <div>
              <p className="font-semibold text-gray-800 font-fredoka">{owner.name}</p>
              <p className="text-sm text-gray-500 font-fredoka">{owner.email}</p>
            </div>
          </div>

          {/* Right: Revenue and menu */}
          <div className="flex items-center gap-4">
            <button className="text-gray-400 hover:text-gray-600 text-xl font-bold">
              ⋮
            </button>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

export default TopOwners;
