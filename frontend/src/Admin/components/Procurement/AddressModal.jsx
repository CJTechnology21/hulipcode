import React from "react";
import { MdClose } from "react-icons/md";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import DropDown from "../../../components/DropDown";

const countryOptions = [
  { name: "India" },
  { name: "USA" },
  { name: "UK" },
  { name: "Canada" },
  { name: "Australia" },
];

function AddressModal({ isOpen, onClose, onSave }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg h-full overflow-y-auto shadow-lg relative">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <Button onClick={onClose}>
              <MdClose className="text-xl" />
            </Button>
            <h2 className="text-lg font-semibold">Add Address</h2>
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

        {/* Top border bar */}
        <div className="h-1 w-full bg-red-600" />

        {/* Body */}
        <div className="p-5 space-y-5">
          {/* Address */}
          <h3 className="text-sm font-semibold text-gray-800">Address</h3>
          <Input label="Address" name="address" placeholder="Enter Address" />

          {/* GST */}
          <Input label="GST Number" name="gst" placeholder="Enter GST Number" />

          {/* Address Details */}
          <h3 className="text-sm font-semibold text-gray-800">
            Address Details
          </h3>
          <Input
            label="Address Line 1"
            name="addressLine1"
            placeholder="Enter Address Line 1"
          />
          <Input label="City" name="city" placeholder="Enter City" />
          <Input
            label="State / Province"
            name="state"
            placeholder="Enter State or Province"
          />
          <Input
            label="ZIP / Postal Code"
            name="zip"
            placeholder="Enter ZIP or Postal Code"
          />

          {/* Country Dropdown */}
          <div>
            <label
              htmlFor="country"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Country
            </label>
            <DropDown
              name="country"
              value={countryOptions[0].name}
              options={countryOptions.map((c) => c.name)}
              onChange={() => {}}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddressModal;

// import React from "react";
// import { MdClose } from "react-icons/md";
// import Button from "../../../components/Button";
// import Input from "../../../components/Input";
// import DropDown from "../../../components/DropDown";

// const countryOptions = [
//   { name: "India" },
//   { name: "USA" },
//   { name: "UK" },
//   { name: "Canada" },
//   { name: "Australia" },
// ];

//  function AddressModal({ isOpen, onClose, onSave }) {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-start justify-end bg-black bg-opacity-40 backdrop-blur-sm">
//       <div className="bg-white w-full max-w-lg h-full overflow-y-auto rounded-none shadow-lg relative">
//         {/* Header */}
//         <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
//           <div className="flex items-center gap-2">
//             <button onClick={onClose}>
//               <MdClose className="text-xl" />
//             </button>
//             <h2 className="text-lg font-semibold">Add Address</h2>
//           </div>
//           <Button size="sm" color="primary" onClick={onSave}>
//             Save
//           </Button>
//         </div>

//         {/* Top border bar */}
//         <div className="h-1 w-full bg-red-600" />

//         {/* Body */}
//         <div className="p-5 space-y-5">
//           {/* Address */}
//           <h3 className="text-sm font-semibold text-gray-800">Address</h3>
//           <Input label="Address" placeholder="Enter Address" />

//           {/* GST */}
//           <label className="text-sm font-semibold text-gray-800">GST</label>
//           <Input placeholder="Enter GST Number" />

//           {/* Address Details */}
//           <h3 className="text-sm font-semibold text-gray-800">Address Details</h3>
//           <Input label="Address Line 1" placeholder="Enter Address Line 1" />
//           <Input label="City" placeholder="Enter City" />
//           <Input label="State / Province" placeholder="Enter State or Province" />
//           <Input label="ZIP / Postal Code" placeholder="Enter ZIP or Postal Code" />

//           {/* Country Dropdown */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Country
//             </label>
//             <DropDown
//               name="country"
//               value={countryOptions[0].name}
//               options={countryOptions.map((c) => c.name)}
//               onChange={() => {}}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
// export default AddressModal;
