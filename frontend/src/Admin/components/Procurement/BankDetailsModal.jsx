import React, { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import { FaUniversity } from "react-icons/fa";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import { toast } from "react-toastify";
function BankDetailsModal({ isOpen, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState({
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",
    bankName: "",
    bankAddress: "",
    ibanNumber: "",
    upiNumber: "",
  });

  useEffect(() => {
    setFormData(
      initialData || {
        accountHolderName: "",
        accountNumber: "",
        ifscCode: "",
        bankName: "",
        bankAddress: "",
        ibanNumber: "",
        upiNumber: "",
      }
    );
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (!formData.accountNumber || !formData.ifscCode) {
      toast.error("Account Number and IFSC Code are required");
      return;
    }

    const payload = initialData?._id
      ? { ...formData, _id: initialData._id }
      : formData;

    onSave?.(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-end bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg h-full overflow-y-auto shadow-lg relative flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <button onClick={onClose}>
              <MdClose className="text-xl" />
            </button>
            <h2 className="text-lg font-semibold">
              {initialData ? "Edit Bank Account" : "Add New Account"}
            </h2>
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

        {/* Top border bar */}
        <div className="h-1 w-full bg-red-600" />

        {/* Body */}
        <div className="p-5 space-y-4 flex-1 overflow-y-auto">
          <div className="w-full flex justify-center">
            <FaUniversity className="text-4xl text-blue-600 mb-2" />
          </div>

          <Input
            label="Account Holder Name"
            name="accountHolderName"
            placeholder="Enter Account Holder Name"
            value={formData.accountHolderName}
            onChange={handleChange}
          />
          <Input
            label="Account Number"
            name="accountNumber"
            placeholder="Enter Account Number"
            value={formData.accountNumber}
            onChange={handleChange}
          />
          <Input
            label="IFSC Code"
            name="ifscCode"
            placeholder="Enter IFSC Code"
            value={formData.ifscCode}
            onChange={handleChange}
          />
          <Input
            label="Bank Name"
            name="bankName"
            placeholder="Enter Bank Name"
            value={formData.bankName}
            onChange={handleChange}
          />
          <Input
            label="Bank Address"
            name="bankAddress"
            placeholder="Enter Bank Address"
            value={formData.bankAddress}
            onChange={handleChange}
          />
          <Input
            label="IBAN Number"
            name="ibanNumber"
            placeholder="Enter IBAN Number"
            value={formData.ibanNumber}
            onChange={handleChange}
          />
          <Input
            label="UPI Number"
            name="upiNumber"
            placeholder="Enter UPI Number"
            value={formData.upiNumber}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
}

export default BankDetailsModal;
