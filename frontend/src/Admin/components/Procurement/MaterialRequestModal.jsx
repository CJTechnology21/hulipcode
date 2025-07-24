import { Dialog, Tab, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import ReqDetailsModal from "./ReqDetailsModal"; // Add at top

const TABS = ["Pending", "Approved", "Ordered", "Rejected"];

const INITIAL_ITEMS = {
  Approved: [
    {
      date: "23 Jul",
      title: "16x8 Screw",
      location: "MR-1, Dr Manoj | 135 Naraina",
      stock: 0,
      quantity: 10,
      unit: "nos",
      status: "Approved",
      enteredBy: "Sawan",
    },
    {
      date: "23 Jul",
      title: "10MM TAIROD",
      location: "MR-1, Dr Manoj | 135 Naraina",
      stock: 0,
      quantity: 10,
      unit: "pcs",
      status: "Approved",
      enteredBy: "Sawan",
    },
    {
      date: "23 Jul",
      title: "18MM T PROFILE ANTI BRASS",
      location: "MR-1, Dr Manoj | 135 Naraina",
      stock: 0,
      quantity: 10,
      unit: "pcs",
      status: "Approved",
      enteredBy: "Sawan",
    },
  ],
  Pending: [],
  Ordered: [],
  Rejected: [],
};

export default function MaterialRequestModal({ open, onClose }) {
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [dropdownIndex, setDropdownIndex] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const handleStatusClick = (index) => {
    setDropdownIndex(index === dropdownIndex ? null : index);
  };

  const moveItemToStatus = (itemIndex, currentStatus, newStatus) => {
    const itemToMove = {
      ...items[currentStatus][itemIndex],
      status: newStatus,
    };

    const updated = { ...items };
    updated[currentStatus] = updated[currentStatus].filter(
      (_, idx) => idx !== itemIndex
    );
    updated[newStatus].push(itemToMove);

    setItems(updated);
    setDropdownIndex(null);
  };

  return (
    <>
      {/* Main Modal */}
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

              <Tab.Group
                selectedIndex={selectedIndex}
                onChange={setSelectedIndex}
              >
                <Tab.List className="flex space-x-2 p-3 border-b">
                  {TABS.map((tab) => (
                    <Tab
                      key={tab}
                      className={({ selected }) =>
                        `px-4 py-1.5 text-sm border rounded-md focus:outline-none
                      ${
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
                      {items[tab]?.length ? (
                        <div className="space-y-3">
                          {items[tab].map((item, i) => (
                            <div
                              key={i}
                              className="relative flex items-center justify-between bg-gray-50 p-3 rounded-lg shadow-sm cursor-pointer hover:bg-gray-100"
                              onClick={() => {
                                const groupItems = items[tab].filter(
                                  (it) => it.location === item.location
                                );
                                setSelectedGroup({
                                  location: item.location,
                                  date: item.date,
                                  enteredBy: item.enteredBy,
                                  status: item.status,
                                  items: groupItems,
                                });
                              }}
                            >
                              <div className="flex items-start gap-3 w-1/3">
                                <div className="bg-gray-200 text-center text-sm px-2 py-1 rounded-md min-w-[50px]">
                                  <div className="font-semibold">
                                    {item.date.split(" ")[0]}
                                  </div>
                                  <div className="text-xs">
                                    {item.date.split(" ")[1]}
                                  </div>
                                </div>
                                <div>
                                  <div className="font-medium text-sm">
                                    {item.title}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {item.location}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    In Stock: {item.stock} {item.unit}
                                  </div>
                                </div>
                              </div>

                              <div className="text-center w-1/4">
                                <div className="font-bold text-sm">
                                  {item.quantity}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {item.unit}
                                </div>
                              </div>

                              <div className="relative w-1/3 text-right">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStatusClick(i);
                                  }}
                                  className="text-red-600 text-xs font-semibold hover:underline"
                                >
                                  {item.status} ▼
                                </button>
                                {dropdownIndex === i && (
                                  <div className="absolute right-0 mt-1 bg-white border rounded-md shadow-lg z-50 w-40 text-left">
                                    {TABS.map((statusOpt) => (
                                      <button
                                        key={statusOpt}
                                        className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          moveItemToStatus(i, tab, statusOpt);
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
                      ) : (
                        <div className="text-center text-gray-400 py-10">
                          No {tab} Requests
                        </div>
                      )}
                    </Tab.Panel>
                  ))}
                </Tab.Panels>
              </Tab.Group>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>

      {/* Group Detail Modal */}
      <ReqDetailsModal
        selectedGroup={selectedGroup}
        setSelectedGroup={setSelectedGroup}
        items={items}
        setItems={setItems}
        TABS={TABS}
      />
    </>
  );
}
