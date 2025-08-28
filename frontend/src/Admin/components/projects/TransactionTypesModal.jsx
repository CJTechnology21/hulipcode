import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Button from "../../../components/Button";

export default function TransactionTypesModal({ isOpen, onClose, onSelect }) {
  const sections = [
    {
      title: "Payment",
      buttons: [
        { label: "+ Payment In", color: "green" },
        { label: "+ Payment Out", color: "red" },
        { label: "+ Debit Note", color: "blue" },
        { label: "+ Credit Note", color: "blue" },
        { label: "+ Party to Party Payment", color: "blue", fullWidth: true }
      ]
    },
    {
      title: "Sales",
      buttons: [
        { label: "+ Sales Invoice", color: "blue" },
        { label: "+ Material Sales", color: "blue" }
      ]
    },
    {
      title: "Expense",
      buttons: [
        { label: "+ Material Purchase", color: "blue" },
        { label: "+ Material Return", color: "blue" },
        { label: "+ Material Transfer", color: "blue" },
        { label: "+ Sub Con Bill", color: "blue" },
        { label: "+ Other Expense", color: "blue", fullWidth: true }
      ]
    },
    {
      title: "My Account",
      buttons: [
        { label: "+ I Paid", color: "red" },
        { label: "+ I Received", color: "green" }
      ]
    }
  ];

  const handleClick = (label) => {
    const type = label.replace("+ ", ""); // strip the "+" prefix
    onSelect(type);
    onClose();
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Overlay */}
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-linear duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40" />
        </Transition.Child>

        {/* Drawer Panel */}
        <div className="fixed inset-0 flex justify-end">
          <Transition.Child
            as={Fragment}
            enter="transform transition ease-in-out duration-300"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transform transition ease-in-out duration-300"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel
              className="relative bg-white shadow-xl h-full p-6"
              style={{ width: "400px" }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <Dialog.Title className="text-lg font-semibold text-gray-900">
                  Select Transaction Type
                </Dialog.Title>
                <button
                  onClick={onClose}
                  className="rounded-md p-1 text-gray-500 hover:bg-gray-100"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Sections */}
              <div className="space-y-6">
                {sections.map((section, idx) => (
                  <div key={idx}>
                    <h4 className="text-sm font-medium text-gray-400 mb-3">
                      {section.title}
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      {section.buttons.map((btn, i) => (
                        <div
                          key={i}
                          className={btn.fullWidth ? "col-span-2" : ""}
                        >
                          <Button
                            color={btn.color}
                            fullWidth
                            variant="filled"
                            size="md"
                            onClick={() => handleClick(btn.label)}
                            className="bg-gray-100 hover:bg-gray-200"
                          >
                            {btn.label}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}

// import { Fragment } from "react";
// import { Dialog, Transition } from "@headlessui/react";
// import { XMarkIcon } from "@heroicons/react/24/outline";
// import Button from "../../../components/Button";

// export default function TransactionTypesModal({ isOpen, onClose }) {
//   const sections = [
//     {
//       title: "Payment",
//       buttons: [
//         { label: "+ Payment In", color: "green" },
//         { label: "+ Payment Out", color: "red" },
//         { label: "+ Debit Note", color: "blue" },
//         { label: "+ Credit Note", color: "blue" },
//         { label: "+ Party to Party Payment", color: "blue", fullWidth: true }
//       ]
//     },
//     {
//       title: "Sales",
//       buttons: [
//         { label: "+ Sales Invoice", color: "blue" },
//         { label: "+ Material Sales", color: "blue" }
//       ]
//     },
//     {
//       title: "Expense",
//       buttons: [
//         { label: "+ Material Purchase", color: "blue" },
//         { label: "+ Material Return", color: "blue" },
//         { label: "+ Material Transfer", color: "blue" },
//         { label: "+ Sub Con Bill", color: "blue" },
//         { label: "+ Other Expense", color: "blue", fullWidth: true }
//       ]
//     },
//     {
//       title: "My Account",
//       buttons: [
//         { label: "+ I Paid", color: "red" },
//         { label: "+ I Received", color: "green" }
//       ]
//     }
//   ];

//   return (
//     <Transition show={isOpen} as={Fragment}>
//       <Dialog as="div" className="relative z-50" onClose={onClose}>
//         {/* Overlay */}
//         <Transition.Child
//           as={Fragment}
//           enter="transition-opacity ease-linear duration-200"
//           enterFrom="opacity-0"
//           enterTo="opacity-100"
//           leave="transition-opacity ease-linear duration-200"
//           leaveFrom="opacity-100"
//           leaveTo="opacity-0"
//         >
//           <div className="fixed inset-0 bg-black/40" />
//         </Transition.Child>

//         {/* Drawer Panel */}
//         <div className="fixed inset-0 flex justify-end">
//           <Transition.Child
//             as={Fragment}
//             enter="transform transition ease-in-out duration-300"
//             enterFrom="translate-x-full"
//             enterTo="translate-x-0"
//             leave="transform transition ease-in-out duration-300"
//             leaveFrom="translate-x-0"
//             leaveTo="translate-x-full"
//           >
//             <Dialog.Panel
//               className="relative bg-white shadow-xl h-full p-6"
//               style={{ width: "400px" }}
//             >
//               {/* Header */}
//               <div className="flex items-center justify-between mb-4">
//                 <Dialog.Title className="text-lg font-semibold text-gray-900">
//                   Select Transaction Type
//                 </Dialog.Title>
//                 <button
//                   onClick={onClose}
//                   className="rounded-md p-1 text-gray-500 hover:bg-gray-100"
//                 >
//                   <XMarkIcon className="h-5 w-5" />
//                 </button>
//               </div>

//               {/* Sections */}
//               <div className="space-y-6">
//                 {sections.map((section, idx) => (
//                   <div key={idx}>
//                     <h4 className="text-sm font-medium text-gray-400 mb-3">
//                       {section.title}
//                     </h4>
//                     <div className="grid grid-cols-2 gap-3">
//                       {section.buttons.map((btn, i) => (
//                         <div
//                           key={i}
//                           className={btn.fullWidth ? "col-span-2" : ""}
//                         >
//                           <Button
//                             color={btn.color}
//                             fullWidth
//                             variant="filled"
//                             size="md"
//                             onClick={() => console.log(`Clicked ${btn.label}`)}
//                             className="bg-gray-100 hover:bg-gray-200"
//                           >
//                             {btn.label}
//                           </Button>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </Dialog.Panel>
//           </Transition.Child>
//         </div>
//       </Dialog>
//     </Transition>
//   );
// }
