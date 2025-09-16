// import { Dialog, Tab, Transition } from "@headlessui/react";
// import { Fragment, useState, useEffect } from "react";
// import ReqDetailsModal from "./ReqDetailsModal";
// import Button from "../../../components/Button";
// import { FaTimes } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import {
//   getMaterialsOfRFQ,
//   updateMaterialInRFQ,
// } from "../../../services/rfqServices";

// const TABS = ["Pending", "Approved", "Ordered", "Rejected"];

// function MaterialRequestModal({
//   open,
//   onClose,
//   rfqId,                    // ✅ pass RFQ id
//   selectedMaterials = [],
//   setSelectedMaterials = () => {},
// }) {
//   const [selectedIndex, setSelectedIndex] = useState(0);
//   const [dropdownIndex, setDropdownIndex] = useState(null);
//   const [selectedGroup, setSelectedGroup] = useState(null);
//   const [groupedItems, setGroupedItems] = useState({});
//   const navigate = useNavigate();

//   // flatten + group
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

//   const buildGroupedItems = (flatMaterials) => {
//     return TABS.reduce((acc, status) => {
//       acc[status] = flatMaterials.filter((item) => item.status === status);
//       return acc;
//     }, {});
//   };

//   // ✅ Load from backend instead of localStorage
//   useEffect(() => {
//     if (!rfqId) return;
//     const fetchMaterials = async () => {
//       try {
//         const res = await getMaterialsOfRFQ(rfqId);
//         // res.data = [{project:'Project X', items:[...]}, ...]
//         const flat = flattenMaterials(res);
//         setSelectedMaterials(flat); // keep parent in sync
//         setGroupedItems(buildGroupedItems(flat));
//       } catch (err) {
//         console.error("Error fetching RFQ materials:", err);
//       }
//     };
//     fetchMaterials();
//   }, [rfqId, open]); // reload when modal opens

//   const handleStatusClick = (index) => {
//     setDropdownIndex(index === dropdownIndex ? null : index);
//   };

//   // ✅ Optimistic update
//   const moveItemToStatus = async (itemIndex, currentStatus, newStatus) => {
//     const itemToMove = {
//       ...groupedItems[currentStatus][itemIndex],
//       status: newStatus,
//     };

//     // optimistic UI update
//     const updated = { ...groupedItems };
//     updated[currentStatus] = updated[currentStatus].filter(
//       (_, idx) => idx !== itemIndex
//     );
//     updated[newStatus] = [...updated[newStatus], itemToMove];
//     setGroupedItems(updated);
//     setSelectedMaterials(Object.values(updated).flat());
//     setDropdownIndex(null);

//     // call API to persist
//     try {
//       await updateMaterialInRFQ(rfqId, itemToMove._id, { status: newStatus });
//     } catch (err) {
//       console.error("Failed to update material status:", err);
//       // revert UI on error
//       const reverted = { ...groupedItems };
//       setGroupedItems(reverted);
//     }
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
//               <div className="flex items-center justify-between p-4 border-b border-red-500">
//                 <Dialog.Title className="text-lg font-semibold text-gray-900">
//                   MATERIAL REQUEST
//                 </Dialog.Title>
//                 <Button
//                   variant="custom"
//                   onClick={onClose}
//                   className="text-4xl text-gray-500 hover:text-red-600"
//                 >
//                   <FaTimes />
//                 </Button>
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
//                         Object.entries(
//                           groupedItems[tab].reduce((acc, item) => {
//                             const project =
//                               item.projectName || "Unknown Project";
//                             if (!acc[project]) acc[project] = [];
//                             acc[project].push(item);
//                             return acc;
//                           }, {})
//                         ).map(([projectName, items], projectIndex) => (
//                           <div key={projectIndex} className="mb-6">
//                             <h3 className="text-red-600 font-semibold mb-2">
//                               {projectName}
//                             </h3>

//                             <div className="space-y-3">
//                               {items.map((item, i) => (
//                                 <div
//                                   key={i}
//                                   className="relative flex justify-between items-center bg-gray-100 p-3 rounded-lg hover:bg-gray-200 cursor-pointer"
//                                 >
//                                   <div>
//                                     <div className="text-sm font-medium text-gray-800">
//                                       {item.name}
//                                     </div>
//                                     <div className="text-xs text-gray-600">
//                                       Qty: {item.quantity} {item.unit}
//                                     </div>
//                                   </div>

//                                   <div className="relative text-right">
//                                     <button
//                                       onClick={(e) => {
//                                         e.stopPropagation();
//                                         handleStatusClick(
//                                           i + projectIndex * 100
//                                         );
//                                       }}
//                                       className="text-xs text-red-600 font-semibold hover:underline"
//                                     >
//                                       {item.status} ▼
//                                     </button>

//                                     {dropdownIndex ===
//                                       i + projectIndex * 100 && (
//                                       <div className="absolute right-0 mt-1 bg-white border rounded-md shadow-lg z-50 w-40 text-left">
//                                         {TABS.map((statusOpt) => (
//                                           <button
//                                             key={statusOpt}
//                                             className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
//                                             onClick={(e) => {
//                                               e.stopPropagation();
//                                               moveItemToStatus(
//                                                 groupedItems[tab].indexOf(item),
//                                                 tab,
//                                                 statusOpt
//                                               );
//                                             }}
//                                           >
//                                             {statusOpt}
//                                           </button>
//                                         ))}
//                                       </div>
//                                     )}
//                                   </div>
//                                 </div>
//                               ))}
//                             </div>

//                             {tab === "Approved" && (
//                               <div className="mt-4 text-right">
//                                 <Button
//                                   variant="primary"
//                                   className="bg-red-600 text-white text-sm px-4 py-2 rounded hover:bg-red-700"
//                                   onClick={() => {
//                                     const approvedItems = items.filter(
//                                       (item) => item.status === "Approved"
//                                     );

//                                     if (approvedItems.length === 0) {
//                                       alert(
//                                         "No approved materials to request for this project."
//                                       );
//                                       return;
//                                     }

//                                     navigate("/addmaterials", {
//                                       state: {
//                                         project: projectName,
//                                         materials: approvedItems,
//                                       },
//                                     });
//                                   }}
//                                 >
//                                   Place Request
//                                 </Button>
//                               </div>
//                             )}
//                           </div>
//                         ))
//                       ) : (
//                         <div className="text-center text-gray-400 py-10">
//                           No {tab} Requests
//                         </div>
//                       )}
//                     </Tab.Panel>
//                   ))}
//                 </Tab.Panels>
//               </Tab.Group>
//             </div>
//           </Transition.Child>
//         </Dialog>
//       </Transition>

//       <ReqDetailsModal
//         selectedGroup={selectedGroup}
//         setSelectedGroup={setSelectedGroup}
//         items={groupedItems}
//         setItems={(updated) => {
//           setGroupedItems(updated);
//           setSelectedMaterials(Object.values(updated).flat());
//         }}
//         TABS={TABS}
//       />
//     </>
//   );
// }
// export default MaterialRequestModal;

import { Dialog, Tab, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import ReqDetailsModal from "./ReqDetailsModal";
import Button from "../../../components/Button";
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

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

function MaterialRequestModal({
  open,
  onClose,
  selectedMaterials = [],
  setSelectedMaterials = () => {},
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [dropdownIndex, setDropdownIndex] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupedItems, setGroupedItems] = useState({});
  const navigate = useNavigate();

  // Flatten materials by project into one list
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

  // Build groupedItems from selectedMaterials
  const buildGroupedItems = (materials) => {
    const flatMaterials = flattenMaterials(materials);
    return TABS.reduce((acc, status) => {
      acc[status] = flatMaterials.filter((item) => item.status === status);
      return acc;
    }, {});
  };

  useEffect(() => {
    let materialsToUse = selectedMaterials;
    if (!materialsToUse || materialsToUse.length === 0) {
      materialsToUse = loadFromLocalStorage();
      setSelectedMaterials(materialsToUse);
    }
    setGroupedItems(buildGroupedItems(materialsToUse));
  }, [selectedMaterials]);

  const handleStatusClick = (index) => {
    setDropdownIndex(index === dropdownIndex ? null : index);
  };

  const moveItemToStatus = (itemIndex, currentStatus, newStatus) => {
    const itemToMove = {
      ...groupedItems[currentStatus][itemIndex],
      status: newStatus,
    };

    // Update groupedItems state instantly
    const updated = { ...groupedItems };
    updated[currentStatus] = updated[currentStatus].filter(
      (_, idx) => idx !== itemIndex
    );
    updated[newStatus] = [...updated[newStatus], itemToMove];
    setGroupedItems(updated);

    // Update parent state so UI stays in sync
    const updatedAll = Object.values(updated).flat();
    setSelectedMaterials(updatedAll);

    // Save to localStorage
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
              <div className="flex items-center justify-between p-4 border-b border-red-500">
                <Dialog.Title className="text-lg font-semibold text-gray-900">
                  MATERIAL REQUEST
                </Dialog.Title>
                <Button
                  variant="custom"
                  onClick={onClose}
                  className="text-4xl text-gray-500 hover:text-red-600"
                >
                  <FaTimes />
                </Button>
              </div>

              <Tab.Group
                selectedIndex={selectedIndex}
                onChange={setSelectedIndex}
              >
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
                            const project =
                              item.projectName || "Unknown Project";
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
                                        handleStatusClick(
                                          i + projectIndex * 100
                                        );
                                      }}
                                      className="text-xs text-red-600 font-semibold hover:underline"
                                    >
                                      {item.status} ▼
                                    </button>

                                    {dropdownIndex ===
                                      i + projectIndex * 100 && (
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

                            {tab === "Approved" && (
                              <div className="mt-4 text-right">
                                <Button
                                  variant="primary"
                                  className="bg-red-600 text-white text-sm px-4 py-2 rounded hover:bg-red-700"
                                  onClick={() => {
                                    const approvedItems = items.filter(
                                      (item) => item.status === "Approved"
                                    );

                                    if (approvedItems.length === 0) {
                                      alert(
                                        "No approved materials to request for this project."
                                      );
                                      return;
                                    }

                                    navigate("/addmaterials", {
                                      state: {
                                        project: projectName,
                                        materials: approvedItems,
                                      },
                                    });
                                  }}
                                >
                                  Place Request
                                </Button>
                              </div>
                            )}

                            {projectIndex !==
                              Object.keys(groupedItems[tab]).length - 1 && (
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
export default MaterialRequestModal;
