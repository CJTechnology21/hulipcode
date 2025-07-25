import React, { useEffect, useRef, useState } from "react";
import { AiOutlineEdit } from "react-icons/ai";
import { MdClose, MdOutlineArrowForwardIos } from "react-icons/md";
import { FiUpload } from "react-icons/fi";
import { FaRupeeSign, FaUniversity } from "react-icons/fa";

import Input from "../../../components/Input";
import DropDown from "../../../components/DropDown";
import Button from "../../../components/Button";
import OpeningBalanceModal from "./OpenBalanceModal";
import BankDetailsModal from "./BankDetailsModal";
import AddressModal from "./AddressModal"; // ✅ Importing Address Modal

const countryOptions = [
  { name: "IN", code: "+91" },
  { name: "USA", code: "+1" },
  { name: "AU", code: "+61" },
];

export default function AddPartyModal({ isOpen, onClose, onSave }) {
  const modalRef = useRef();
  const [selectedCountry, setSelectedCountry] = useState(countryOptions[0]);

  const [isOpeningBalanceOpen, setOpeningBalanceOpen] = useState(false);
  const [isBankingModal, setBankingModal] = useState(false);
  const [isAddressModalOpen, setAddressModalOpen] = useState(false); // ✅ New state

  // Close main modal when clicking outside (but not when child modals are open)
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target) &&
        !isOpeningBalanceOpen &&
        !isBankingModal &&
        !isAddressModalOpen
      ) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [
    isOpen,
    onClose,
    isOpeningBalanceOpen,
    isBankingModal,
    isAddressModalOpen,
  ]);

  useEffect(() => {
    if (!isOpen) {
      setOpeningBalanceOpen(false);
      setBankingModal(false);
      setAddressModalOpen(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex">
        <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm" />

        <div
          ref={modalRef}
          className="relative ml-auto w-full max-w-lg h-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out animate-slide-in-right overflow-y-auto"
        >
          <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
            <div className="flex items-center gap-2">
              <button onClick={onClose}>
                <MdClose className="text-xl" />
              </button>
              <h2 className="text-lg font-semibold">Add Party</h2>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="text" color="gray" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button
                color="red"
                size="sm"
                variant="custom"
                className="bg-red-600 hover:bg-red-700 cursor-pointer text-white"
                onClick={onSave}
              >
                Save
              </Button>
            </div>
          </div>

          <div className="h-1 w-full bg-red-500" />

          <div className="p-4 space-y-4">
            <label htmlFor="partyname" className="text-gray-500 font-bold">
              Party Name
            </label>
            <Input
              name="partyName"
              placeholder="Party Name"
              label="Party Name"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <div className="flex gap-2">
                <DropDown
                  name="country"
                  value={selectedCountry.name}
                  options={countryOptions.map((c) => c.name)}
                  onChange={(val) =>
                    setSelectedCountry(
                      countryOptions.find((c) => c.name === val)
                    )
                  }
                  className="w-16"
                />
                <Input
                  className="flex-[2] border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                  placeholder="Enter Phone Number"
                />
              </div>
            </div>

            <Input name="email" placeholder="Email" label="Email" />

            <DropDown
              label="Type"
              name="type"
              value="Material Supplier"
              options={["Material Supplier", "Service Provider"]}
              onChange={() => {}}
            />

            <div
              onClick={() => setOpeningBalanceOpen(true)}
              className="flex justify-between items-center border rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-50 transition"
            >
              <span className="flex items-center gap-2 text-sm text-gray-700">
                <FaRupeeSign className="text-gray-600" />
                Opening Balance
              </span>
              <MdOutlineArrowForwardIos className="text-gray-500" />
            </div>

            <div
              onClick={() => setBankingModal(true)}
              className="flex justify-between items-center border rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-50 transition"
            >
              <span className="flex items-center gap-2 text-sm text-gray-700">
                <FaUniversity className="text-gray-600" />
                --NA--
              </span>
              <MdOutlineArrowForwardIos className="text-gray-500" />
            </div>

            <div
              onClick={() => setAddressModalOpen(true)}
              className="flex justify-between items-center border rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-50 transition"
            >
              <span className="text-sm text-gray-700">Your Address</span>
              <Button size="sm" variant="text" color="red">
                +Add
              </Button>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                PARTY ID
              </label>
              <div className="flex items-center justify-between border rounded-lg px-3 py-2">
                <span className="text-sm font-medium text-gray-800">5</span>
                <AiOutlineEdit
                  className="text-gray-600 cursor-pointer"
                  size={18}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                AADHAAR
              </label>
              <div className="flex gap-2 items-center">
                <Input
                  name="aadhaar"
                  placeholder="Aadhaar number"
                  className="flex-[5]"
                />
                <label className="cursor-pointer">
                  <input type="file" className="hidden" />
                  <FiUpload className="text-gray-600" size={20} />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PAN
              </label>
              <div className="flex gap-2 items-center">
                <Input
                  name="pan"
                  placeholder="PAN number"
                  className="flex-[5]"
                />
                <label className="cursor-pointer">
                  <input type="file" className="hidden" />
                  <FiUpload className="text-gray-600" size={20} />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <>
          <OpeningBalanceModal
            isOpen={isOpeningBalanceOpen}
            onClose={() => setOpeningBalanceOpen(false)}
            onSave={(data) => {
              console.log("Opening Balance Saved", data);
              setOpeningBalanceOpen(false);
            }}
          />

          <BankDetailsModal
            isOpen={isBankingModal}
            onClose={() => setBankingModal(false)}
            onSave={(data) => {
              console.log("Bank Details Saved", data);
              setBankingModal(false);
            }}
          />

          <AddressModal
            isOpen={isAddressModalOpen}
            onClose={() => setAddressModalOpen(false)}
            onSave={(data) => {
              console.log("Address Saved", data);
              setAddressModalOpen(false);
            }}
          />
        </>
      )}
    </>
  );
}

// import React, { useEffect, useRef, useState } from "react";
// import { AiOutlineEdit } from "react-icons/ai";
// import { MdClose, MdOutlineArrowForwardIos } from "react-icons/md";
// import { FiUpload } from "react-icons/fi";
// import { FaRupeeSign, FaUniversity } from "react-icons/fa";
// import Input from "../../../components/Input";
// import DropDown from "../../../components/DropDown";
// import Button from "../../../components/Button";
// import OpeningBalanceModal from "./OpenBalanceModal";
// import BankDetailsModal from "./BankDetailsModal";

// const countryOptions = [
//   { name: "IN", code: "+91" },
//   { name: "USA", code: "+1" },
//   { name: "AU", code: "+61" },
// ];

// export default function AddPartyModal({ isOpen, onClose, onSave }) {
//   const modalRef = useRef();
//   const [selectedCountry, setSelectedCountry] = useState(countryOptions[0]);
//   const [isOpeningBalanceOpen, setOpeningBalanceOpen] = useState(false);
//   const [isBankingModal, setBankingModal] = useState(false);

//   // Close modal when clicking outside, but not when child modals are open
//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (
//         modalRef.current &&
//         !modalRef.current.contains(event.target) &&
//         !isOpeningBalanceOpen &&
//         !isBankingModal
//       ) {
//         onClose();
//       }
//     }

//     if (isOpen) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [isOpen, onClose, isOpeningBalanceOpen, isBankingModal]);

//   // Reset child modals when AddPartyModal closes
//   useEffect(() => {
//     if (!isOpen) {
//       setOpeningBalanceOpen(false);
//       setBankingModal(false);
//     }
//   }, [isOpen]);

//   if (!isOpen) return null;

//   return (
//     <>
//       {/* AddPartyModal */}
//       <div className="fixed inset-0 z-50 flex">
//         <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm" />

//         <div
//           ref={modalRef}
//           className="relative ml-auto w-full max-w-lg h-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out animate-slide-in-right overflow-y-auto"
//         >
//           {/* Header */}
//           <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
//             <div className="flex items-center gap-2">
//               <button onClick={onClose}>
//                 <MdClose className="text-xl" />
//               </button>
//               <h2 className="text-lg font-semibold">Add Party</h2>
//             </div>
//             <div className="flex items-center gap-3">
//               <Button variant="text" color="gray" size="sm" onClick={onClose}>
//                 Cancel
//               </Button>
//               <Button color="red" size="sm" onClick={onSave}>
//                 Save
//               </Button>
//             </div>
//           </div>

//           <div className="h-1 w-full bg-red-500" />

//           <div className="p-4 space-y-4">
//             <label htmlFor="partyname" className="text-gray-500 font-bold">
//               Party Name
//             </label>
//             <Input name="partyName" placeholder="Party Name" label="Party Name" />

//             {/* Phone */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
//               <div className="flex gap-2">
//                 <DropDown
//                   name="country"
//                   value={selectedCountry.name}
//                   options={countryOptions.map((c) => c.name)}
//                   onChange={(val) =>
//                     setSelectedCountry(countryOptions.find((c) => c.name === val))
//                   }
//                   className="w-16"
//                 />
//                 <Input
//                   className="flex-[2] border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
//                   placeholder="Enter Phone Number"
//                 />
//               </div>
//             </div>

//             <Input name="email" placeholder="Email" label="Email" />

//             <DropDown
//               label="Type"
//               name="type"
//               value="Material Supplier"
//               options={["Material Supplier", "Service Provider"]}
//               onChange={() => {}}
//             />

//             {/* Opening Balance */}
//             <div
//               onClick={() => setOpeningBalanceOpen(true)}
//               className="flex justify-between items-center border rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-50 transition"
//             >
//               <span className="flex items-center gap-2 text-sm text-gray-700">
//                 <FaRupeeSign className="text-gray-600" />
//                 Opening Balance
//               </span>
//               <MdOutlineArrowForwardIos className="text-gray-500" />
//             </div>

//             {/* Bank Account */}
//             <div
//               className="flex justify-between items-center border rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-50 transition"
//               onClick={() => setBankingModal(true)}
//             >
//               <span className="flex items-center gap-2 text-sm text-gray-700">
//                 <FaUniversity className="text-gray-600" />
//                 --NA--
//               </span>
//               <MdOutlineArrowForwardIos className="text-gray-500" />
//             </div>

//             {/* Address */}
//             <div className="flex justify-between items-center border rounded-lg px-3 py-2">
//               <span className="text-sm text-gray-700">Your Address</span>
//               <Button size="sm" variant="text" color="red">
//                 +Add
//               </Button>
//             </div>

//             {/* Party ID */}
//             <div>
//               <label className="block text-xs font-medium text-gray-500 mb-1">PARTY ID</label>
//               <div className="flex items-center justify-between border rounded-lg px-3 py-2">
//                 <span className="text-sm font-medium text-gray-800">5</span>
//                 <AiOutlineEdit className="text-gray-600 cursor-pointer" size={18} />
//               </div>
//             </div>

//             {/* Aadhaar */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">AADHAAR</label>
//               <div className="flex gap-2 items-center">
//                 <Input name="aadhaar" placeholder="Aadhaar number" className="flex-[5]" />
//                 <label className="cursor-pointer">
//                   <input type="file" className="hidden" />
//                   <FiUpload className="text-gray-600" size={20} />
//                 </label>
//               </div>
//             </div>

//             {/* PAN */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">PAN</label>
//               <div className="flex gap-2 items-center">
//                 <Input name="pan" placeholder="PAN number" className="flex-[5]" />
//                 <label className="cursor-pointer">
//                   <input type="file" className="hidden" />
//                   <FiUpload className="text-gray-600" size={20} />
//                 </label>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Child modals */}
//       {isOpen && (
//         <>
//           <OpeningBalanceModal
//             isOpen={isOpeningBalanceOpen}
//             onClose={() => setOpeningBalanceOpen(false)}
//             onSave={(data) => {
//               console.log("Opening Balance Saved", data);
//               setOpeningBalanceOpen(false);
//             }}
//           />

//           <BankDetailsModal
//             isOpen={isBankingModal}
//             onClose={() => setBankingModal(false)}
//             onSave={(data) => {
//               console.log("Bank Details Saved", data);
//               setBankingModal(false);
//             }}
//           />
//         </>
//       )}
//     </>
//   );
// }
