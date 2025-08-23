import React, { useState } from "react";
import { FiDownload } from "react-icons/fi";
import { FaFilter } from "react-icons/fa";
import { Dialog } from "@headlessui/react";
import Button from "../../../components/Button";
import DropDown from "../../../components/DropDown";

function ProjectParty({ projectId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [newParty, setNewParty] = useState({
    name: "",
    type: "",
    amount: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewParty((prev) => ({ ...prev, [name]: value }));
  };

  const closeModal = () => {
    setIsOpen(false);
    setNewParty({ name: "", type: "", amount: "" });
  };

  const handleAddParty = () => {
    console.log("Added party:", newParty);
    closeModal();
  };

  return (
    <div className="p-4 md:p-6 space-y-4 bg-gray-50 w-full">
      {/* Top Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Section: Search + Filter Icon */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search"
            className="px-4 py-2 border border-gray-300 rounded-md text-sm w-full md:w-60"
          />
          <button className="flex items-center text-red-600 hover:text-red-700">
            <FaFilter className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>

        {/* Right Section */}
        <div className="flex flex-wrap items-center gap-2 md:gap-4 w-full md:w-auto justify-start md:justify-end">
          <DropDown
            name="status"
            value=""
            label=""
            onChange={() => {}}
            options={["Active", "Inactive"]}
          />
          <button className="text-gray-600 text-xl hover:text-black">
            <FiDownload />
          </button>
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded-md text-sm">
            <p className="font-medium">Advance Paid</p>
            <p className="font-bold">₹ 0</p>
          </div>
          <div className="bg-red-100 text-red-800 px-4 py-2 rounded-md text-sm">
            <p className="font-medium">To Pay</p>
            <p className="font-bold">₹ 0</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="text-left px-4 py-2">S.No.</th>
              <th className="text-left px-4 py-2">Party Name</th>
              <th className="text-left px-4 py-2">Type</th>
              <th className="text-left px-4 py-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="4" className="text-center text-gray-400 py-8">
                No parties added yet
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Add Party Button */}
      <div className="pt-4 flex justify-end">
        <Button
          onClick={() => setIsOpen(true)}
          color="blue"
          variant="custom"
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          + Add Party
        </Button>
      </div>

      {/* Modal */}
      <Dialog open={isOpen} onClose={closeModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/20" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md space-y-4 bg-white p-6 rounded-xl shadow-lg">
            <Dialog.Title className="text-lg font-bold">Add Party</Dialog.Title>

            <input
              type="text"
              name="name"
              placeholder="Party Name"
              value={newParty.name}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm"
            />

            <DropDown
              name="type"
              value={newParty.type}
              label="Type"
              onChange={handleChange}
              options={["Vendor", "Client", "Contractor","Miss"]}
            />

            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={newParty.amount}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm"
            />

            <div className="flex flex-row justify-end gap-2 pt-2">
              <Button onClick={closeModal} variant="outlined" color="gray">
                Cancel
              </Button>
              <Button
                onClick={handleAddParty}
                variant="custom"
                className="bg-red-500 hover:bg-red-600 text-white cursor-pointer"
              >
                Save
              </Button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}

export default ProjectParty;
