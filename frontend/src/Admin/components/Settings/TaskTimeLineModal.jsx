import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function TaskTimelineModal({ isOpen, onClose, task }) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md bg-white rounded-lg p-6 relative shadow-xl">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>

            <Dialog.Title className="text-lg font-bold mb-4">
              Timeline for: {task.title}
            </Dialog.Title>

            <ol className="relative border-l border-gray-300 pl-4 space-y-4">
              {task.history.map((item, idx) => (
                <li key={idx} className="ml-2">
                  <div className="absolute w-3 h-3 bg-blue-600 rounded-full -left-1.5 border border-white"></div>
                  <time className="block text-xs text-gray-500 mb-1">
                    {item.date}
                  </time>
                  <p className="text-sm font-medium">{item.status}</p>
                </li>
              ))}
            </ol>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
}
