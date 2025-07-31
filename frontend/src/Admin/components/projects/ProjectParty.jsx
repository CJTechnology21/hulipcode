import React, { useState } from 'react';
import { FiDownload } from 'react-icons/fi';
import { FaFilter } from 'react-icons/fa';
import { Dialog } from '@headlessui/react';
import Button from '../../../components/Button'; 
import DropDown from '../../../components/DropDown'; 

function ProjectParty() {
  const [isOpen, setIsOpen] = useState(false);
  const [newParty, setNewParty] = useState({
    name: '',
    type: '',
    amount: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewParty((prev) => ({ ...prev, [name]: value }));
  };

  const closeModal = () => {
    setIsOpen(false);
    setNewParty({ name: '', type: '', amount: '' });
  };

  const handleAddParty = () => {
    // handle party addition logic
    console.log('Added party:', newParty);
    closeModal();
  };

  return (
    <div className="p-4 md:p-6 space-y-4 bg-gray-50 w-full">
      {/* Top Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left Section: Filter + Search */}
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search"
            className="px-4 py-2 border border-gray-300 rounded-md text-sm w-60"
          />
          <button className="flex items-center text-sm text-red-600 gap-1 hover:underline">
            <FaFilter />
            Filter
          </button>
        </div>

        {/* Right Section */}
        <div className="flex items-center flex-wrap gap-4">
          <DropDown
            name="status"
            value=""
            label=""
            onChange={() => {}}
            options={['Active', 'Inactive']}
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
      <div className="overflow-auto bg-white rounded-xl shadow">
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
      <div className="pt-4">
        <Button onClick={() => setIsOpen(true)} color="blue" variant="custom" className='bg-red-600 hover:bg-red-700 text-white'>
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
              options={['Vendor', 'Client', 'Contractor']}
            />

            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={newParty.amount}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm"
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button onClick={closeModal} variant="outlined" color="gray">
                Cancel
              </Button>
              <Button onClick={handleAddParty} color="blue">
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

// import React from 'react';
// import { FiDownload } from 'react-icons/fi';
// import { FaFilter } from 'react-icons/fa';

// function ProjectParty() {
//   return (
//     <div className="p-4 md:p-6 space-y-4 bg-gray-50 w-full">
//       {/* Top Actions */}
//       <div className="flex flex-wrap items-center justify-between gap-4">
//         {/* Left Section: Filter + Search */}
//         <div className="flex items-center gap-3">
//           {/* Search Input */}
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="Search"
//               className="px-4 py-2 border border-gray-300 rounded-md text-sm w-60"
//             />
//           </div>

//           {/* Filter Icon */}
//           <button className="flex items-center text-sm text-indigo-600 gap-1 hover:underline">
//             <FaFilter />
//             Filter
//           </button>
//         </div>

//         {/* Right Section: Status, Download, Cards */}
//         <div className="flex items-center flex-wrap gap-4">
//           {/* Active Dropdown */}
//           <select className="border border-gray-300 text-sm rounded px-3 py-2">
//             <option>Active</option>
//             <option>Inactive</option>
//           </select>

//           {/* Download Icon */}
//           <button className="text-gray-600 text-xl hover:text-black">
//             <FiDownload />
//           </button>

//           {/* Advance Paid */}
//           <div className="bg-green-100 text-green-800 px-4 py-2 rounded-md text-sm">
//             <p className="font-medium">Advance Paid</p>
//             <p className="font-bold">₹ 0</p>
//           </div>

//           {/* To Pay */}
//           <div className="bg-red-100 text-red-800 px-4 py-2 rounded-md text-sm">
//             <p className="font-medium">To Pay</p>
//             <p className="font-bold">₹ 0</p>
//           </div>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="overflow-auto bg-white rounded-xl shadow">
//         <table className="min-w-full text-sm text-gray-700">
//           <thead className="bg-gray-100 text-gray-600">
//             <tr>
//               <th className="text-left px-4 py-2">S.No.</th>
//               <th className="text-left px-4 py-2">Party Name</th>
//               <th className="text-left px-4 py-2">Type</th>
//               <th className="text-left px-4 py-2">Amount</th>
//             </tr>
//           </thead>
//           <tbody>
//             <tr>
//               <td colSpan="4" className="text-center text-gray-400 py-8">
//                 No parties added yet
//               </td>
//             </tr>
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// export default ProjectParty;
