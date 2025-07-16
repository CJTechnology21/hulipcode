
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

const Modal = ({ isOpen, onClose, children, title = "", size = "sm" }) => {
  const maxWidth = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl", // optional for wider modals
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
        onClose={onClose}
      >
        <Transition.Child
          as={Fragment}
          enter="transition ease-in-out duration-300"
          enterFrom="opacity-0 translate-y-10"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in-out duration-200"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-10"
        >
          <Dialog.Panel
            className={`w-full ${maxWidth[size]} bg-white rounded-3xl shadow-xl p-5 my-6 mx-4`}
          >
            <div className="flex justify-between items-center mb-3">
              <Dialog.Title className="text-lg font-extrabold text-gray-800">
                {title}
              </Dialog.Title>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-red-600 text-xl font-bold"
              >
                &times;
              </button>
            </div>
            <div>{children}</div>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition.Root>
  );
};

export default Modal;