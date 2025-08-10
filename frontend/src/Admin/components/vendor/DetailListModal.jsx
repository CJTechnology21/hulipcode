import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

export default function DetailListModal({ isOpen, onClose, title, data }) {
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
          <Dialog.Panel className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <Dialog.Title className="text-lg font-bold mb-4">{title}</Dialog.Title>

            {data.length === 0 ? (
              <p className="text-gray-500">No records found.</p>
            ) : (
              <ul>
                {data.map((po) => (
                  <li key={po.id} className="border-b py-2">
                    {po.vendor} - ₹{po.amount.toLocaleString()} - {po.status}
                  </li>
                ))}
              </ul>
            )}

            <div className="flex justify-end mt-4">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
}
