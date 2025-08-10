import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

export default function AddVendorModal({
  isOpen,
  onClose,
  vendorName,
  setVendorName,
  amount,
  setAmount,
  status,
  setStatus,
  handleAddVendor,
}) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <Dialog.Title className="text-lg font-bold mb-4">
              Add New Vendor / PO
            </Dialog.Title>

            <label className="block mb-2">Vendor Name</label>
            <input
              type="text"
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
              className="border rounded p-2 w-full mb-4"
            />

            <label className="block mb-2">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border rounded p-2 w-full mb-4"
            />

            <label className="block mb-2">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border rounded p-2 w-full mb-4"
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
            </select>

            <div className="flex justify-end gap-3">
              <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">
                Cancel
              </button>
              <button
                onClick={handleAddVendor}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Add
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
}
