import React, { useEffect, useRef, useState } from "react";
import { MdClose, MdOutlineArrowForwardIos } from "react-icons/md";
import { FiUpload } from "react-icons/fi";
import { FaRupeeSign, FaUniversity } from "react-icons/fa";
import { toast } from "react-toastify";

import Input from "../../../components/Input";
import DropDown from "../../../components/DropDown";
import Button from "../../../components/Button";
import OpeningBalanceModal from "./OpenBalanceModal";
import BankDetailsModal from "./BankDetailsModal";
import AddressModal from "./AddressModal";
import { generateUploadURL } from "../../../services/overViewServices";
import {
  createUser,
  addBankDetail,
  addAddress,
  uploadDocument,
} from "../../../services/userServices";

const countryOptions = [
  { name: "IN", code: "+91" },
  { name: "USA", code: "+1" },
  { name: "AU", code: "+61" },
];

export default function AddPartyModal({ isOpen, onClose }) {
  const modalRef = useRef();
  const [selectedCountry, setSelectedCountry] = useState(countryOptions[0]);
  const [partyName, setPartyName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Material Supplier");
  const [aadhaarFile, setAadhaarFile] = useState(null);
  const [panFile, setPanFile] = useState(null);

  const [openingBalance, setOpeningBalance] = useState(null);
  const [bankDetails, setBankDetails] = useState([]);
  const [addresses, setAddresses] = useState([]);

  const [isOpeningBalanceOpen, setOpeningBalanceOpen] = useState(false);
  const [isBankingModal, setBankingModal] = useState(false);
  const [isAddressModalOpen, setAddressModalOpen] = useState(false);

  // Handle click outside
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
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [
    isOpen,
    onClose,
    isOpeningBalanceOpen,
    isBankingModal,
    isAddressModalOpen,
  ]);

  // Reset form on close
  useEffect(() => {
    if (!isOpen) {
      setOpeningBalanceOpen(false);
      setBankingModal(false);
      setAddressModalOpen(false);
      setPartyName("");
      setPhoneNumber("");
      setEmail("");
      setAadhaarFile(null);
      setPanFile(null);
      setOpeningBalance(null);
      setBankDetails([]);
      setAddresses([]);
    }
  }, [isOpen]);

  // File upload helper
  const handleFileUpload = async (file) => {
    if (!file) return null;
    try {
      const { uploadUrl, url } = await generateUploadURL(file.name, file.type);
      await fetch(uploadUrl, { method: "PUT", body: file });
      return url;
    } catch (err) {
      toast.error("File upload failed");
      return null;
    }
  };

  // Save handlers for child modals
  const handleBankSave = (formData) => {
    setBankDetails((prev) => [...prev, formData]);
  };

  const handleAddressSave = (formData) => {
    setAddresses((prev) => [...prev, formData]);
  };

  const handleOpeningBalanceSave = (data) => {
    setOpeningBalance(data);
    toast.success("Opening balance saved");
  };

  // Main save flow
  const handleSave = async () => {
    // 1️⃣ Basic frontend validation
    if (!partyName || !email || !phoneNumber || !role) {
      toast.error("Please fill all required fields");
      console.log("Validation failed:", {
        partyName,
        email,
        phoneNumber,
        role,
      });
      return;
    }

    toast.info("Creating user...");

    try {
      //  Prepare payload for backend
      const payload = {
        name: partyName,
        email,
        phoneNumber: phoneNumber.replace(/\D/g, ""),
        role,
        password: "123456",
      };
      if (openingBalance) payload.openingBalance = openingBalance;
      if (bankDetails.length) payload.bankDetails = bankDetails;
      if (addresses.length) payload.addresses = addresses;

      //  Debug: log payload before sending
      console.log("Payload being sent to backend:", payload);

      // 3️ Call createUser API
      const res = await createUser(payload);

      //  Debug: log response from backend
      console.log("Backend response:", res);

      const userId = res.user._id;
      console.log("Created User ID:", userId);

      // 4️⃣ Upload Aadhaar & PAN if files selected
      if (aadhaarFile) {
        const aadhaarUrl = await handleFileUpload(aadhaarFile);
        console.log("Aadhaar uploaded URL:", aadhaarUrl);
        if (aadhaarUrl) await uploadDocument(userId, "aadhaar", aadhaarUrl);
      }
      if (panFile) {
        const panUrl = await handleFileUpload(panFile);
        console.log("PAN uploaded URL:", panUrl);
        if (panUrl) await uploadDocument(userId, "pan", panUrl);
      }

      // 5️⃣ Save addresses
      for (const addr of addresses) {
        console.log("Saving address:", addr);
        await addAddress(userId, addr);
      }

      //  Save bank details
      for (const bank of bankDetails) {
        console.log("Saving bank detail:", bank);
        await addBankDetail(userId, bank);
      }

      toast.success("User created successfully with all details");
      onClose();
    } catch (err) {
      console.error("Error creating user:", err);

      if (err.response) {
        // Axios error from server
        console.error("Status:", err.response.status);
        console.error("Data:", err.response.data);
        toast.error(err.response.data?.message || "Failed to create user");
      } else if (err.request) {
        // Request made but no response received
        console.error("No response received:", err.request);
        toast.error("No response from server");
      } else {
        // Something else
        console.error("Error message:", err.message);
        toast.error(err.message || "Failed to create user");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex">
        <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm" />
        <div
          ref={modalRef}
          className="relative ml-auto w-full max-w-lg h-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out animate-slide-in-right overflow-y-auto"
        >
          {/* Header */}
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
                onClick={handleSave}
              >
                Save
              </Button>
            </div>
          </div>

          <div className="h-1 w-full bg-red-500" />

          {/* Body */}
          <div className="p-4 space-y-4">
            <Input
              name="partyName"
              label="Party Name"
              placeholder="Party Name"
              value={partyName}
              onChange={(e) => setPartyName(e.target.value)}
            />

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <div className="flex gap-2 items-center">
                <DropDown
                  name="country"
                  value={selectedCountry.name}
                  options={countryOptions.map((c) => c.name)}
                  onChange={(val) =>
                    setSelectedCountry(
                      countryOptions.find((c) => c.name === val)
                    )
                  }
                  className="flex-[0.5] min-w-[3rem]"
                />
                <Input
                  className="flex-[2] border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                  placeholder="Enter Phone Number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
            </div>

            <Input
              name="email"
              label="Email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <DropDown
              label="Type"
              name="type"
              value={role}
              options={["Material Supplier", "Service Provider"]}
              onChange={(val) => setRole(val)}
            />

            {/* Opening Balance */}
            <div
              onClick={() => setOpeningBalanceOpen(true)}
              className="flex justify-between items-center border rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-50 transition"
            >
              <span className="flex items-center gap-2 text-sm text-gray-700">
                <FaRupeeSign className="text-gray-600" />
                {openingBalance
                  ? `${openingBalance.mode} ₹${openingBalance.amount}`
                  : "Opening Balance"}
              </span>
              <MdOutlineArrowForwardIos className="text-gray-500" />
            </div>

            {/* Bank Details */}
            <div
              onClick={() => setBankingModal(true)}
              className="flex justify-between items-center border rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-50 transition"
            >
              <span className="flex items-center gap-2 text-sm text-gray-700">
                <FaUniversity className="text-gray-600" />
                {bankDetails.length > 0
                  ? `${bankDetails.length} Added`
                  : "--NA--"}
              </span>
              <MdOutlineArrowForwardIos className="text-gray-500" />
            </div>

            {/* Address */}
            <div
              onClick={() => setAddressModalOpen(true)}
              className="flex justify-between items-center border rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-50 transition"
            >
              <span className="text-sm text-gray-700">
                {addresses.length > 0
                  ? `${addresses.length} Addresses`
                  : "Your Address"}
              </span>
              <Button size="sm" variant="text" color="red">
                +Add
              </Button>
            </div>

            {/* Aadhaar */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                AADHAAR
              </label>
              <div className="flex gap-2 items-center">
                <Input name="aadhaar" placeholder="Aadhaar number" />
                <label className="cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => setAadhaarFile(e.target.files[0])}
                  />
                  <FiUpload className="text-gray-600" size={20} />
                </label>
              </div>
            </div>

            {/* PAN */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PAN
              </label>
              <div className="flex gap-2 items-center">
                <Input name="pan" placeholder="PAN number" />
                <label className="cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => setPanFile(e.target.files[0])}
                  />
                  <FiUpload className="text-gray-600" size={20} />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Child Modals */}
      {isOpen && (
        <>
          <OpeningBalanceModal
            isOpen={isOpeningBalanceOpen}
            onClose={() => setOpeningBalanceOpen(false)}
            onSave={handleOpeningBalanceSave}
          />
          <BankDetailsModal
            isOpen={isBankingModal}
            onClose={() => setBankingModal(false)}
            onSave={handleBankSave}
          />
          <AddressModal
            isOpen={isAddressModalOpen}
            onClose={() => setAddressModalOpen(false)}
            onSave={handleAddressSave}
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
// import AddressModal from "./AddressModal";

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
//   const [isAddressModalOpen, setAddressModalOpen] = useState(false);

//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (
//         modalRef.current &&
//         !modalRef.current.contains(event.target) &&
//         !isOpeningBalanceOpen &&
//         !isBankingModal &&
//         !isAddressModalOpen
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
//   }, [
//     isOpen,
//     onClose,
//     isOpeningBalanceOpen,
//     isBankingModal,
//     isAddressModalOpen,
//   ]);

//   useEffect(() => {
//     if (!isOpen) {
//       setOpeningBalanceOpen(false);
//       setBankingModal(false);
//       setAddressModalOpen(false);
//     }
//   }, [isOpen]);

//   if (!isOpen) return null;

//   return (
//     <>
//       <div className="fixed inset-0 z-50 flex">
//         <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm" />

//         <div
//           ref={modalRef}
//           className="relative ml-auto w-full max-w-lg h-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out animate-slide-in-right overflow-y-auto"
//         >
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
//               <Button
//                 color="red"
//                 size="sm"
//                 variant="custom"
//                 className="bg-red-600 hover:bg-red-700 cursor-pointer text-white"
//                 onClick={onSave}
//               >
//                 Save
//               </Button>
//             </div>
//           </div>

//           <div className="h-1 w-full bg-red-500" />

//           <div className="p-4 space-y-4">
//             <label htmlFor="partyname" className="text-gray-500 font-bold">
//               Party Name
//             </label>
//             <Input
//               name="partyName"
//               placeholder="Party Name"
//               label="Party Name"
//             />
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Phone
//               </label>
//               <div className="flex gap-2 items-center">
//                 <DropDown
//                   name="country"
//                   value={selectedCountry.name}
//                   options={countryOptions.map((c) => c.name)}
//                   onChange={(val) =>
//                     setSelectedCountry(
//                       countryOptions.find((c) => c.name === val)
//                     )
//                   }
//                   className="flex-[0.5] min-w-[3rem]" // smaller than input
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

//             <div
//               onClick={() => setBankingModal(true)}
//               className="flex justify-between items-center border rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-50 transition"
//             >
//               <span className="flex items-center gap-2 text-sm text-gray-700">
//                 <FaUniversity className="text-gray-600" />
//                 --NA--
//               </span>
//               <MdOutlineArrowForwardIos className="text-gray-500" />
//             </div>

//             <div
//               onClick={() => setAddressModalOpen(true)}
//               className="flex justify-between items-center border rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-50 transition"
//             >
//               <span className="text-sm text-gray-700">Your Address</span>
//               <Button size="sm" variant="text" color="red">
//                 +Add
//               </Button>
//             </div>

//             <div>
//               <label className="block text-xs font-medium text-gray-500 mb-1">
//                 PARTY ID
//               </label>
//               <div className="flex items-center justify-between border rounded-lg px-3 py-2">
//                 <span className="text-sm font-medium text-gray-800">5</span>
//                 <AiOutlineEdit
//                   className="text-gray-600 cursor-pointer"
//                   size={18}
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 AADHAAR
//               </label>
//               <div className="flex gap-2 items-center">
//                 <Input
//                   name="aadhaar"
//                   placeholder="Aadhaar number"
//                   className="flex-[5]"
//                 />
//                 <label className="cursor-pointer">
//                   <input type="file" className="hidden" />
//                   <FiUpload className="text-gray-600" size={20} />
//                 </label>
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 PAN
//               </label>
//               <div className="flex gap-2 items-center">
//                 <Input
//                   name="pan"
//                   placeholder="PAN number"
//                   className="flex-[5]"
//                 />
//                 <label className="cursor-pointer">
//                   <input type="file" className="hidden" />
//                   <FiUpload className="text-gray-600" size={20} />
//                 </label>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

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

//           <AddressModal
//             isOpen={isAddressModalOpen}
//             onClose={() => setAddressModalOpen(false)}
//             onSave={(data) => {
//               console.log("Address Saved", data);
//               setAddressModalOpen(false);
//             }}
//           />
//         </>
//       )}
//     </>
//   );
// }
