import React, { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Input from "../../../components/Input";
import Button from "../../../components/Button";

export default function ReturnItemsModal({ isOpen, onClose, po, onUpdate }) {
  const [selectedItem, setSelectedItem] = useState("");
  const [qty, setQty] = useState("");
  const [reason, setReason] = useState("");

  if (!po) return null;

  const items = po.items || [];
  const returns = po.returns || [];

  const handleAddReturn = () => {
    if (!selectedItem || !qty) return;

    const itemData = items.find((i) => i.name === selectedItem);
    if (!itemData) return;

    if (Number(qty) > itemData.qty) {
      alert(`You cannot return more than ${itemData.qty} units of ${itemData.name}.`);
      return;
    }

    const updatedPO = {
      ...po,
      returns: [
        ...returns,
        {
          name: selectedItem,
          qty: Number(qty),
          reason,
          date: new Date().toISOString().split("T")[0],
        },
      ],
    };

    onUpdate(updatedPO);
    setSelectedItem("");
    setQty("");
    setReason("");
  };

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
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all">
                <Dialog.Title className="text-lg font-bold mb-4">
                  Returned Items - {po.vendor || "-"}
                </Dialog.Title>

                {/* Existing Returns */}
                {returns.length > 0 ? (
                  <div className="mb-4 border rounded p-2 bg-gray-50">
                    {returns.map((r, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between border-b last:border-b-0 py-1 text-sm"
                      >
                        <span>{r.name || "-"} (x{r.qty || 0})</span>
                        <span className="text-gray-500">{r.reason || "—"}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 mb-4">No returned items logged yet.</p>
                )}

                {/* Add New Return */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Select Item</label>
                    <select
                      className="w-full border rounded px-3 py-2 text-sm"
                      value={selectedItem}
                      onChange={(e) => setSelectedItem(e.target.value)}
                    >
                      <option value="">-- Select --</option>
                      {items.map((item, idx) => (
                        <option key={idx} value={item.name}>
                          {item.name} (Ordered: {item.qty || 0})
                        </option>
                      ))}
                    </select>
                  </div>

                  <Input
                    name="qty"
                    type="number"
                    placeholder="Quantity to return"
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                  />
                  <Input
                    name="reason"
                    placeholder="Reason for return"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />

                  <Button
                    variant="custom"
                    className="bg-red-500 hover:bg-red-600 text-white cursor-pointer"
                    fullWidth
                    onClick={handleAddReturn}
                  >
                    Add Returned Item
                  </Button>
                </div>

                <div className="mt-4 text-right">
                  <Button variant="outlined" color="gray" onClick={onClose}>
                    Close
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

// import React, { useState } from "react";
// import { Dialog, Transition } from "@headlessui/react";
// import { Fragment } from "react";
// import Input from "../../../components/Input";
// import Button from "../../../components/Button";

// export default function ReturnItemsModal({ isOpen, onClose, po, onUpdate }) {
//   const [selectedItem, setSelectedItem] = useState("");
//   const [qty, setQty] = useState("");
//   const [reason, setReason] = useState("");

//   if (!po) return null;

//   const handleAddReturn = () => {
//     if (!selectedItem || !qty) return;

//     const itemData = po.items.find((i) => i.name === selectedItem);
//     if (!itemData) return;

//     if (Number(qty) > itemData.qty) {
//       alert(`You cannot return more than ${itemData.qty} units of ${itemData.name}.`);
//       return;
//     }

//     const updatedPO = {
//       ...po,
//       returns: [
//         ...(po.returns || []),
//         {
//           name: selectedItem,
//           qty: Number(qty),
//           reason,
//           date: new Date().toISOString().split("T")[0],
//         },
//       ],
//     };
//     onUpdate(updatedPO);
//     setSelectedItem("");
//     setQty("");
//     setReason("");
//   };

//   return (
//     <Transition appear show={isOpen} as={Fragment}>
//       <Dialog as="div" className="relative z-50" onClose={onClose}>
//         {/* Overlay */}
//         <Transition.Child
//           as={Fragment}
//           enter="ease-out duration-200"
//           enterFrom="opacity-0"
//           enterTo="opacity-100"
//           leave="ease-in duration-150"
//           leaveFrom="opacity-100"
//           leaveTo="opacity-0"
//         >
//           <div className="fixed inset-0 bg-black/30" />
//         </Transition.Child>

//         <div className="fixed inset-0 overflow-y-auto">
//           <div className="flex min-h-full items-center justify-center p-4">
//             <Transition.Child
//               as={Fragment}
//               enter="ease-out duration-200"
//               enterFrom="opacity-0 scale-95"
//               enterTo="opacity-100 scale-100"
//               leave="ease-in duration-150"
//               leaveFrom="opacity-100 scale-100"
//               leaveTo="opacity-0 scale-95"
//             >
//               <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all">
//                 <Dialog.Title className="text-lg font-bold mb-4">
//                   Returned Items - {po.vendor}
//                 </Dialog.Title>

//                 {/* Existing Returns */}
//                 {po.returns && po.returns.length > 0 ? (
//                   <div className="mb-4 border rounded p-2 bg-gray-50">
//                     {po.returns.map((r, idx) => (
//                       <div
//                         key={idx}
//                         className="flex justify-between border-b last:border-b-0 py-1 text-sm"
//                       >
//                         <span>{r.name} (x{r.qty})</span>
//                         <span className="text-gray-500">{r.reason || "—"}</span>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <p className="text-sm text-gray-500 mb-4">No returned items logged yet.</p>
//                 )}

//                 {/* Add New Return */}
//                 <div className="space-y-3">
//                   <div>
//                     <label className="block text-sm font-medium mb-1">Select Item</label>
//                     <select
//                       className="w-full border rounded px-3 py-2 text-sm"
//                       value={selectedItem}
//                       onChange={(e) => setSelectedItem(e.target.value)}
//                     >
//                       <option value="">-- Select --</option>
//                       {po.items.map((item, idx) => (
//                         <option key={idx} value={item.name}>
//                           {item.name} (Ordered: {item.qty})
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   <Input
//                     name="qty"
//                     type="number"
//                     placeholder="Quantity to return"
//                     value={qty}
//                     onChange={(e) => setQty(e.target.value)}
//                   />
//                   <Input
//                     name="reason"
//                     placeholder="Reason for return"
//                     value={reason}
//                     onChange={(e) => setReason(e.target.value)}
//                   />

//                   <Button
//                     variant="custom"
//                     className="bg-red-500 hover:bg-red-600 text-white cursor-pointer"
//                     fullWidth
//                     onClick={handleAddReturn}
//                   >
//                     Add Returned Item
//                   </Button>
//                 </div>

//                 <div className="mt-4 text-right">
//                   <Button variant="outlined" color="gray" onClick={onClose}>
//                     Close
//                   </Button>
//                 </div>
//               </Dialog.Panel>
//             </Transition.Child>
//           </div>
//         </div>
//       </Dialog>
//     </Transition>
//   );
// }