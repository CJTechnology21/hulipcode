import React from "react";
import { MdClose } from "react-icons/md";
import { FaUniversity } from "react-icons/fa";
import Button from "../../../components/Button";
import Input from "../../../components/Input";

function BankDetailsModal({ isOpen, onClose, onSave }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-end bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg h-full overflow-y-auto shadow-lg relative flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <button onClick={onClose}>
              <MdClose className="text-xl" />
            </button>
            <h2 className="text-lg font-semibold">Add New Account</h2>
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
        <div className="p-5 space-y-4 flex-1 overflow-y-auto">
          <div className="w-full flex justify-center">
            <FaUniversity className="text-4xl text-blue-600 mb-2" />
          </div>

          <Input
            label="Account Holder Name"
            placeholder="Enter Account Holder Name"
          />
          <Input label="Account Number" placeholder="Enter Account Number" />
          <Input label="IFSC Code" placeholder="Enter IFSC Code" />
          <Input label="Bank Name" placeholder="Enter Bank Name" />
          <Input label="Bank Address" placeholder="Enter Bank Address" />
          <Input label="IBAN Number" placeholder="Enter IBAN Number" />
          <Input label="UPI Number" placeholder="Enter UPI Number" />
        </div>
      </div>
    </div>
  );
}

export default BankDetailsModal;
