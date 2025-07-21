import React, { useState, Fragment } from "react";
import {
  FaMapMarkerAlt,
  FaRulerCombined,
  FaMoneyBillWave,
} from "react-icons/fa";
import Button from "./Button";
import { Dialog, Transition } from "@headlessui/react";

function ArchitectCard({ architect }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="bg-white rounded-3xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-gray-200 transition-transform hover:scale-105 duration-300 max-w-md w-full mx-auto min-h-[450px] flex flex-col">
        <div className="overflow-hidden rounded-t-3xl">
          <img
            src={architect.image}
            alt={architect.name}
            className="w-full h-52 object-cover"
          />
        </div>
        <div className="p-5 space-y-3 flex-1">
          <h2 className="text-xl font-semibold text-[#0b1c38]">
            {architect.name}
          </h2>

          <div className="flex items-center text-sm text-gray-600 gap-2">
            <FaMapMarkerAlt className="text-blue-500" />
            {architect.location}
          </div>
          <div className="flex items-center text-sm text-gray-600 gap-2">
            <FaRulerCombined className="text-blue-500" />
            {architect.experience}
          </div>
          <div className="flex items-center text-sm text-gray-600 gap-2">
            <FaMoneyBillWave className="text-blue-500" />
            {architect.charges}
          </div>

          <Button
            className="mt-4 w-full rounded-full bg-blue-500 text-white hover:bg-blue-600 transition"
            onClick={() => setIsOpen(true)}
          >
            View Profile
          </Button>
        </div>
      </div>

      {/* Headless UI Dialog */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-30" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    {architect.name}'s Profile
                  </Dialog.Title>
                  <div className="mt-2 space-y-2 text-sm text-gray-700">
                    <p><strong>Location:</strong> {architect.location}</p>
                    <p><strong>Experience:</strong> {architect.experience}</p>
                    <p><strong>Charges:</strong> {architect.charges}</p>
                  </div>

                  <div className="mt-4">
                    <Button
                      className="w-full bg-blue-500 text-white hover:bg-blue-600 rounded-full"
                      onClick={() => setIsOpen(false)}
                    >
                      Close
                    </Button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

export default ArchitectCard;

