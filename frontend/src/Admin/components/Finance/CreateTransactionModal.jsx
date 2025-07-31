import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Button from "../../../components/Button";

const CreateTransactionModal = ({ open, onClose }) => {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0 translate-y-2"
          enterTo="opacity-100 translate-y-0"
          leave="ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-2"
        >
          <div className="fixed inset-0 bg-black bg-opacity-0" />
        </Transition.Child>

        {/* Relative wrapper allows positioning near the button */}
        <div className="fixed bottom-20 right-6 z-50">
          {" "}
          {/* Adjust position here */}
          <Transition.Child
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="bg-white rounded-xl shadow-xl p-6 w-72">
              <div>
                <p className="text-sm font-semibold text-gray-500 mb-2">
                  Payment
                </p>
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    className="w-full bg-red-100 text-red-700 hover:bg-red-200 mb-4 font-medium px-4"
                  >
                    + Debit Note
                  </Button>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-500 mb-2">
                  Expense
                </p>
                <div className="space-y-2 ">
                  <div className="flex justify-center">
                    <Button
                      variant="outline"
                      className="w-full bg-red-100 text-red-700 hover:bg-red-200 font-medium"
                    >
                      + Material Purchase
                    </Button>
                  </div>
                  <div className="flex justify-center">
                    <Button
                      variant="outline"
                      className="w-full bg-red-100 text-red-700 hover:bg-red-200 font-medium"
                    >
                      + Material Return
                    </Button>
                  </div>
                  <div className="flex justify-center">
                    <Button
                      variant="outline"
                      className="w-full bg-red-100 text-red-700 hover:bg-red-200 font-medium"
                    >
                      + Other Expense
                    </Button>
                  </div>
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default CreateTransactionModal;
