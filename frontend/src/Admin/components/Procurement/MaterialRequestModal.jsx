import { Dialog, Tab, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import ReqDetailsModal from "./ReqDetailsModal";

const TABS = ["Pending", "Approved", "Ordered", "Rejected"];
const LOCAL_STORAGE_KEY = "materialGroups";

const saveToLocalStorage = (data) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
};

const loadFromLocalStorage = () => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error("Error reading localStorage:", err);
    return [];
  }
};

export default function MaterialRequestModal({
  open,
  onClose,
  selectedMaterials = [],
  setSelectedMaterials = () => {},
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [dropdownIndex, setDropdownIndex] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupedItems, setGroupedItems] = useState({});

  const flattenMaterials = (materials) => {
    const flat = [];
    for (const group of materials) {
      if (group.items && group.project) {
        for (const item of group.items) {
          flat.push({
            ...item,
            projectName: group.project,
            status: item.status || "Pending",
          });
        }
      }
    }
    return flat;
  };

  useEffect(() => {
    let materialsToUse = selectedMaterials;

    if (!selectedMaterials || selectedMaterials.length === 0) {
      materialsToUse = loadFromLocalStorage();
      setSelectedMaterials(materialsToUse);
    }

    const flatMaterials = flattenMaterials(materialsToUse);

    const grouped = TABS.reduce((acc, status) => {
      acc[status] = flatMaterials.filter((item) => item.status === status);
      return acc;
    }, {});
    setGroupedItems(grouped);
  }, [selectedMaterials]);

  const handleStatusClick = (index) => {
    setDropdownIndex(index === dropdownIndex ? null : index);
  };

  const moveItemToStatus = (itemIndex, currentStatus, newStatus) => {
    const itemToMove = {
      ...groupedItems[currentStatus][itemIndex],
      status: newStatus,
    };

    const updated = { ...groupedItems };
    updated[currentStatus] = updated[currentStatus].filter(
      (_, idx) => idx !== itemIndex
    );
    updated[newStatus] = [...updated[newStatus], itemToMove];

    const updatedAll = Object.values(updated).flat();

    setGroupedItems(updated);
    setSelectedMaterials(updatedAll);

    const groupedByProject = updatedAll.reduce((acc, item) => {
      const project = item.projectName || "Unknown Project";
      if (!acc[project]) acc[project] = [];
      acc[project].push(item);
      return acc;
    }, {});

    const finalGroups = Object.entries(groupedByProject).map(
      ([project, items]) => ({
        project,
        items,
      })
    );

    saveToLocalStorage(finalGroups);
    setDropdownIndex(null);
  };

  return (
    <>
      <Transition show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="transition ease-out duration-300 transform"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in duration-200 transform"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-xl z-50 overflow-y-auto">
              <div className="flex items-center justify-between p-4 border-b">
                <Dialog.Title className="text-lg font-semibold text-gray-900">
                  MATERIAL REQUEST
                </Dialog.Title>
                <button
                  onClick={onClose}
                  className="text-2xl text-gray-500 hover:text-red-600"
                >
                  &times;
                </button>
              </div>

              <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
                <Tab.List className="flex space-x-2 p-3 border-b">
                  {TABS.map((tab) => (
                    <Tab
                      key={tab}
                      className={({ selected }) =>
                        `px-4 py-1.5 text-sm border rounded-md focus:outline-none ${
                          selected
                            ? "bg-red-600 text-white font-semibold"
                            : "border-gray-400 text-gray-700 hover:bg-gray-100"
                        }`
                      }
                    >
                      {tab}
                    </Tab>
                  ))}
                </Tab.List>

                <Tab.Panels className="px-4 py-3">
                  {TABS.map((tab) => (
                    <Tab.Panel key={tab}>
                      {groupedItems[tab]?.length ? (
                        Object.entries(
                          groupedItems[tab].reduce((acc, item) => {
                            const project = item.projectName || "Unknown Project";
                            if (!acc[project]) acc[project] = [];
                            acc[project].push(item);
                            return acc;
                          }, {})
                        ).map(([projectName, items], projectIndex) => (
                          <div key={projectIndex} className="mb-6">
                            <h3 className="text-red-600 font-semibold mb-2">
                              {projectName}
                            </h3>

                            <div className="space-y-3">
                              {items.map((item, i) => (
                                <div
                                  key={i}
                                  className="relative flex justify-between items-center bg-gray-100 p-3 rounded-lg hover:bg-gray-200 cursor-pointer"
                                >
                                  <div>
                                    <div className="text-sm font-medium text-gray-800">
                                      {item.name}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                      Qty: {item.quantity} {item.unit}
                                    </div>
                                  </div>

                                  <div className="relative text-right">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleStatusClick(i + projectIndex * 100);
                                      }}
                                      className="text-xs text-red-600 font-semibold hover:underline"
                                    >
                                      {item.status} ▼
                                    </button>

                                    {dropdownIndex === i + projectIndex * 100 && (
                                      <div className="absolute right-0 mt-1 bg-white border rounded-md shadow-lg z-50 w-40 text-left">
                                        {TABS.map((statusOpt) => (
                                          <button
                                            key={statusOpt}
                                            className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              moveItemToStatus(
                                                groupedItems[tab].indexOf(item),
                                                tab,
                                                statusOpt
                                              );
                                            }}
                                          >
                                            {statusOpt}
                                          </button>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>

                            {projectIndex !== Object.keys(groupedItems[tab]).length - 1 && (
                              <hr className="my-4 border-t border-gray-300" />
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-gray-400 py-10">
                          No {tab} Requests
                        </div>
                      )}
                    </Tab.Panel>
                  ))}
                </Tab.Panels>
              </Tab.Group>

              <div className="px-4 mt-4">
                <button
                  onClick={() => {
                    localStorage.removeItem(LOCAL_STORAGE_KEY);
                    setSelectedMaterials([]);
                    setGroupedItems({});
                  }}
                  className="text-xs text-red-500 hover:underline"
                >
                  Clear Saved Requests
                </button>
              </div>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>

      <ReqDetailsModal
        selectedGroup={selectedGroup}
        setSelectedGroup={setSelectedGroup}
        items={groupedItems}
        setItems={(updated) => {
          const allUpdated = Object.values(updated).flat();
          setGroupedItems(updated);
          setSelectedMaterials(allUpdated);

          const groupedByProject = allUpdated.reduce((acc, item) => {
            const project = item.projectName || "Unknown Project";
            if (!acc[project]) acc[project] = [];
            acc[project].push(item);
            return acc;
          }, {});

          const finalGroups = Object.entries(groupedByProject).map(
            ([project, items]) => ({
              project,
              items,
            })
          );

          saveToLocalStorage(finalGroups);
        }}
        TABS={TABS}
      />
    </>
  );
}


// import { Dialog, Tab, Transition } from "@headlessui/react";
// import { Fragment, useState, useEffect } from "react";
// import ReqDetailsModal from "./ReqDetailsModal";

// const TABS = ["Pending", "Approved", "Ordered", "Rejected"];
// const LOCAL_STORAGE_KEY = "materialGroups";

// const saveToLocalStorage = (data) => {
//   localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
// };

// const loadFromLocalStorage = () => {
//   try {
//     const data = localStorage.getItem(LOCAL_STORAGE_KEY);
//     return data ? JSON.parse(data) : [];
//   } catch (err) {
//     console.error("Error reading localStorage:", err);
//     return [];
//   }
// };

// export default function MaterialRequestModal({
//   open,
//   onClose,
//   selectedMaterials = [],
//   setSelectedMaterials = () => {},
// }) {
//   const [selectedIndex, setSelectedIndex] = useState(0);
//   const [dropdownIndex, setDropdownIndex] = useState(null);
//   const [selectedGroup, setSelectedGroup] = useState(null);
//   const [groupedItems, setGroupedItems] = useState({});

//   const flattenMaterials = (materials) => {
//     const flat = [];
//     for (const group of materials) {
//       if (group.items && group.project) {
//         for (const item of group.items) {
//           flat.push({
//             ...item,
//             projectName: group.project,
//             status: item.status || "Pending",
//           });
//         }
//       }
//     }
//     return flat;
//   };

//   useEffect(() => {
//     let materialsToUse = selectedMaterials;

//     if (!selectedMaterials || selectedMaterials.length === 0) {
//       materialsToUse = loadFromLocalStorage();
//       setSelectedMaterials(materialsToUse);
//     }

//     const flatMaterials = flattenMaterials(materialsToUse);

//     const grouped = TABS.reduce((acc, status) => {
//       acc[status] = flatMaterials.filter(
//         (item) => item.status === status
//       );
//       return acc;
//     }, {});
//     setGroupedItems(grouped);
//   }, [selectedMaterials]);

//   const handleStatusClick = (index) => {
//     setDropdownIndex(index === dropdownIndex ? null : index);
//   };

//   const moveItemToStatus = (itemIndex, currentStatus, newStatus) => {
//     const itemToMove = {
//       ...groupedItems[currentStatus][itemIndex],
//       status: newStatus,
//     };

//     const updated = { ...groupedItems };
//     updated[currentStatus] = updated[currentStatus].filter(
//       (_, idx) => idx !== itemIndex
//     );
//     updated[newStatus] = [...updated[newStatus], itemToMove];

//     const updatedAll = Object.values(updated).flat();

//     setGroupedItems(updated);
//     setSelectedMaterials(updatedAll);

//     const groupedByProject = updatedAll.reduce((acc, item) => {
//       const project = item.projectName || "Unknown Project";
//       if (!acc[project]) acc[project] = [];
//       acc[project].push(item);
//       return acc;
//     }, {});

//     const finalGroups = Object.entries(groupedByProject).map(
//       ([project, items]) => ({
//         project,
//         items,
//       })
//     );

//     saveToLocalStorage(finalGroups);
//     setDropdownIndex(null);
//   };

//   return (
//     <>
//       <Transition show={open} as={Fragment}>
//         <Dialog as="div" className="relative z-50" onClose={onClose}>
//           <Transition.Child
//             as={Fragment}
//             enter="transition ease-out duration-300 transform"
//             enterFrom="translate-x-full"
//             enterTo="translate-x-0"
//             leave="transition ease-in duration-200 transform"
//             leaveFrom="translate-x-0"
//             leaveTo="translate-x-full"
//           >
//             <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-xl z-50 overflow-y-auto">
//               <div className="flex items-center justify-between p-4 border-b">
//                 <Dialog.Title className="text-lg font-semibold text-gray-900">
//                   MATERIAL REQUEST
//                 </Dialog.Title>
//                 <button
//                   onClick={onClose}
//                   className="text-2xl text-gray-500 hover:text-red-600"
//                 >
//                   &times;
//                 </button>
//               </div>

//               <Tab.Group
//                 selectedIndex={selectedIndex}
//                 onChange={setSelectedIndex}
//               >
//                 <Tab.List className="flex space-x-2 p-3 border-b">
//                   {TABS.map((tab) => (
//                     <Tab
//                       key={tab}
//                       className={({ selected }) =>
//                         `px-4 py-1.5 text-sm border rounded-md focus:outline-none ${
//                           selected
//                             ? "bg-red-600 text-white font-semibold"
//                             : "border-gray-400 text-gray-700 hover:bg-gray-100"
//                         }`
//                       }
//                     >
//                       {tab}
//                     </Tab>
//                   ))}
//                 </Tab.List>

//                 <Tab.Panels className="px-4 py-3">
//                   {TABS.map((tab) => (
//                     <Tab.Panel key={tab}>
//                       {groupedItems[tab]?.length ? (
//                         <div className="space-y-3">
//                           {groupedItems[tab].map((item, i) => (
//                             <div
//                               key={i}
//                               className="relative flex justify-between items-center bg-gray-100 p-3 rounded-lg hover:bg-gray-200 cursor-pointer"
//                             >
//                               <div className="w-2/3">
//                                 <div className="text-sm font-medium text-gray-800">
//                                   {item.name}
//                                 </div>
//                                 <div className="text-xs text-gray-600">
//                                   Qty: {item.quantity} {item.unit}
//                                 </div>
//                                 <div className="text-xs text-blue-600 mt-1">
//                                   Project: {item.projectName}
//                                 </div>
//                               </div>

//                               <div className="relative w-1/3 text-right">
//                                 <button
//                                   onClick={(e) => {
//                                     e.stopPropagation();
//                                     handleStatusClick(i);
//                                   }}
//                                   className="text-xs text-red-600 font-semibold hover:underline"
//                                 >
//                                   {item.status} ▼
//                                 </button>
//                                 {dropdownIndex === i && (
//                                   <div className="absolute right-0 mt-1 bg-white border rounded-md shadow-lg z-50 w-40 text-left">
//                                     {TABS.map((statusOpt) => (
//                                       <button
//                                         key={statusOpt}
//                                         className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
//                                         onClick={(e) => {
//                                           e.stopPropagation();
//                                           moveItemToStatus(i, tab, statusOpt);
//                                         }}
//                                       >
//                                         {statusOpt}
//                                       </button>
//                                     ))}
//                                   </div>
//                                 )}
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       ) : (
//                         <div className="text-center text-gray-400 py-10">
//                           No {tab} Requests
//                         </div>
//                       )}
//                     </Tab.Panel>
//                   ))}
//                 </Tab.Panels>
//               </Tab.Group>

//               <div className="px-4 mt-4">
//                 <button
//                   onClick={() => {
//                     localStorage.removeItem(LOCAL_STORAGE_KEY);
//                     setSelectedMaterials([]);
//                     setGroupedItems({});
//                   }}
//                   className="text-xs text-red-500 hover:underline"
//                 >
//                   Clear Saved Requests
//                 </button>
//               </div>
//             </div>
//           </Transition.Child>
//         </Dialog>
//       </Transition>

//       <ReqDetailsModal
//         selectedGroup={selectedGroup}
//         setSelectedGroup={setSelectedGroup}
//         items={groupedItems}
//         setItems={(updated) => {
//           const allUpdated = Object.values(updated).flat();
//           setGroupedItems(updated);
//           setSelectedMaterials(allUpdated);

//           const groupedByProject = allUpdated.reduce((acc, item) => {
//             const project = item.projectName || "Unknown Project";
//             if (!acc[project]) acc[project] = [];
//             acc[project].push(item);
//             return acc;
//           }, {});

//           const finalGroups = Object.entries(groupedByProject).map(
//             ([project, items]) => ({
//               project,
//               items,
//             })
//           );

//           saveToLocalStorage(finalGroups);
//         }}
//         TABS={TABS}
//       />
//     </>
//   );
// }
