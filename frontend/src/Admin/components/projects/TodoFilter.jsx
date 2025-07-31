import React, { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FiX, FiSearch } from "react-icons/fi";

const tabOptions = ["Assignee", "Due Date", "Project"];
const assignees = ["Alam Glass Ta 2 No Gali"];
const projects = ["Dr Manoj | 135 Naraina"];

export default function TodoFilter({ show, onClose, onApply }) {
  const [activeTab, setActiveTab] = useState("Assignee");
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [search, setSearch] = useState("");

  const toggleFilter = (item) => {
    setSelectedFilters((prev) =>
      prev.includes(item)
        ? prev.filter((f) => f !== item)
        : [...prev, item]
    );
  };

  const clearFilters = () => setSelectedFilters([]);

  const renderContent = () => {
    const data =
      activeTab === "Assignee"
        ? assignees
        : activeTab === "Project"
        ? projects
        : [];

    return (
      <>
        {activeTab !== "Due Date" && (
          <div className="p-3 border-b">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`${activeTab} Name`}
              className="w-full border px-3 py-1 rounded text-sm"
            />
          </div>
        )}

        <div className="p-3 space-y-2 max-h-60 overflow-y-auto">
          {activeTab === "Due Date" ? (
            <input
              type="date"
              className="border px-3 py-1 rounded text-sm w-full"
              onChange={(e) => toggleFilter(e.target.value)}
            />
          ) : (
            data
              .filter((item) =>
                item.toLowerCase().includes(search.toLowerCase())
              )
              .map((item) => (
                <label key={item} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedFilters.includes(item)}
                    onChange={() => toggleFilter(item)}
                  />
                  {item}
                </label>
              ))
          )}
        </div>
      </>
    );
  };

  return (
    <Transition appear show={show} as={Fragment}>
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
          <div className="flex items-start justify-center min-h-full pt-24 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-[500px] max-w-full transform overflow-hidden rounded bg-white text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b">
                  <h3 className="font-semibold text-sm flex items-center gap-2 text-red-600">
                    <FiSearch /> Filter
                  </h3>
                  <button onClick={onClose} className="text-gray-500 hover:text-black">
                    <FiX />
                  </button>
                </div>

                {/* Body */}
                <div className="flex">
                  {/* Tabs */}
                  <div className="w-1/3 border-r bg-gray-50">
                    {tabOptions.map((tab) => (
                      <div
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`cursor-pointer px-4 py-3 text-sm font-medium border-l-4 ${
                          activeTab === tab
                            ? "border-red-600 bg-white text-red-600"
                            : "border-transparent text-gray-600"
                        }`}
                      >
                        {tab}
                      </div>
                    ))}
                  </div>

                  {/* Filter Content */}
                  <div className="w-2/3">{renderContent()}</div>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center px-4 py-3 border-t text-sm">
                  <button
                    onClick={clearFilters}
                    className="text-red-600 hover:underline"
                  >
                    clear Filters{" "}
                    <span className="bg-red-600 text-white text-xs rounded-full px-2 py-0.5 ml-1">
                      {selectedFilters.length}
                    </span>
                  </button>
                  <button
                    onClick={() => onApply(selectedFilters)}
                    className="bg-red-600 text-white px-5 py-1.5 rounded"
                  >
                    Apply
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
