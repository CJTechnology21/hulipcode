import React, { useRef, useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import Button from "../../../components/Button";
export default function OpeningBalanceModal({ isOpen, onClose, onSave }) {
  const modalRef = useRef();
  const [mode, setMode] = useState("pay"); // 'pay' or 'receive'
  const [amount, setAmount] = useState("");

  useEffect(() => {
    function handleClickOutside(e) {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    }
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm" />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative ml-auto w-full max-w-lg h-full bg-white shadow-xl overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <button onClick={onClose}>
              <MdClose className="text-xl" />
            </button>
            <h2 className="text-lg font-semibold">OPENING BALANCE</h2>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="text" color="gray" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              color="red"
              variant="custom"
              className="bg-red-600 hover:bg-red-700 curser-pointer text-white"
              size="sm"
              onClick={() => onSave({ mode, amount })}
            >
              Save
            </Button>
          </div>
        </div>

        <div className="h-1 w-full bg-red-600" />

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Mode Selector */}
          <div className="flex gap-4">
            <button
              onClick={() => setMode("pay")}
              className={`w-1/2 py-3 border rounded-lg flex items-center justify-center gap-2 ${
                mode === "pay"
                  ? "bg-red-100 border-red-600 text-red-600 font-medium"
                  : "border-gray-300 text-gray-600"
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full border-4 ${
                  mode === "pay" ? "border-red-600 bg-white" : "border-gray-400"
                }`}
              />
              Party will pay
            </button>

            <button
              onClick={() => setMode("receive")}
              className={`w-1/2 py-3 border rounded-lg flex items-center justify-center gap-2 ${
                mode === "receive"
                  ? "bg-red-100 border-red-600 text-red-600 font-medium"
                  : "border-gray-300 text-gray-600"
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full border-4 ${
                  mode === "receive"
                    ? "border-red-600 bg-white"
                    : "border-gray-400"
                }`}
              />
              Party will receive
            </button>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              AMOUNT (₹)*
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter amount"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
