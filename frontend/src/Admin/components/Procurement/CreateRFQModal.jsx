import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { FaTimes, FaRegCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SearchBar from "../../../components/SearchBar";
import Button from "../../../components/Button";
import allProjects from "../projects/projectsData";
import { toast } from "react-toastify";

export default function CreateRFQModal({ open, onClose }) {
  const [searchText, setSearchText] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [date, setDate] = useState(new Date());
  const [taxType, setTaxType] = useState("item");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navigate = useNavigate();

  const filteredProjects = allProjects.filter((proj) =>
    proj.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSave = () => {
    if (!selectedProject) {
      alert("Please select a project first.");
      return;
    }

    navigate("/addmaterials", {
      state: {
        project: selectedProject,
        deliveryLocation: selectedProject?.location,
        date,
        taxType,
      },
    });

    toast.success("Project Selected Successfully");
    onClose(); // Close modal
  };

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          leave="ease-in duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              leave="ease-in duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">Create RFQ</h3>
                    <button
                      onClick={onClose}
                      className="text-gray-400 hover:text-gray-700"
                    >
                      <FaTimes />
                    </button>
                  </div>

                  {/* RFQ ID + Calendar */}
                  <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                    <span className="text-indigo-600 font-medium cursor-pointer hover:underline">
                      #12–16 ✎
                    </span>
                    <div className="relative w-fit">
                      <DatePicker
                        selected={date}
                        onChange={(dateObj) => setDate(dateObj)}
                        dateFormat="yyyy-MM-dd"
                        className="pl-3 pr-10 py-2 text-sm font-medium text-red-600 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        popperPlacement="bottom-end"
                      />
                      <FaRegCalendarAlt className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 pointer-events-none text-base" />
                    </div>
                  </div>

                  {/* Project Name Search */}
                  <div className="mb-4 relative">
                    <label className="text-xs font-semibold text-gray-500 mb-1 block">
                      PROJECT NAME <span className="text-red-500">*</span>
                    </label>
                    <SearchBar
                      value={
                        selectedProject ? selectedProject.name : searchText
                      }
                      onChange={(e) => {
                        setSearchText(e.target.value);
                        setSelectedProject(null);
                      }}
                      onFocus={() => setIsDropdownOpen(true)}
                      onBlur={() =>
                        setTimeout(() => setIsDropdownOpen(false), 100)
                      }
                      placeholder="Search project..."
                      className="pl-3 pr-10 py-2 text-sm font-medium text-gray-800 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                    {isDropdownOpen && (
                      <ul className="absolute z-50 mt-1 w-full max-h-60 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-md text-sm divide-y divide-gray-100">
                        {filteredProjects.length > 0 ? (
                          filteredProjects.map((proj) => (
                            <li
                              key={proj.id}
                              onMouseDown={() => {
                                setSelectedProject(proj);
                                setSearchText("");
                                setIsDropdownOpen(false);
                              }}
                              className="flex items-start gap-3 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                            >
                              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                                {proj.name
                                  .split(" ")
                                  .map((word) => word[0])
                                  .slice(0, 2)
                                  .join("")
                                  .toUpperCase()}
                              </div>
                              <div className="flex flex-col">
                                <p className="text-sm text-gray-800 font-medium">
                                  {proj.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {proj.client}{" "}
                                  <span className="text-gray-400">
                                    ({proj.location})
                                  </span>
                                </p>
                              </div>
                            </li>
                          ))
                        ) : (
                          <li className="px-3 py-2 text-gray-400 italic">
                            No projects found
                          </li>
                        )}
                      </ul>
                    )}
                  </div>

                  {/* Tax Type */}
                  <div className="mb-6">
                    <p className="font-medium text-sm mb-2">Select Tax Type:</p>
                    <div className="flex gap-6 text-sm">
                      <label className="flex items-center gap-1">
                        <input
                          type="radio"
                          name="tax"
                          checked={taxType === "item"}
                          onChange={() => setTaxType("item")}
                        />
                        Item Level Tax
                      </label>
                      <label className="flex items-center gap-1">
                        <input
                          type="radio"
                          name="tax"
                          checked={taxType === "bill"}
                          onChange={() => setTaxType("bill")}
                        />
                        Bill Level Tax
                      </label>
                    </div>
                  </div>

                  {/* Save Button */}
                  <Button
                    onClick={handleSave}
                    fullWidth
                    color="purple"
                    variant="custom"
                    className="bg-red-600 hover:bg-red-700 text-white py-2 text-sm font-semibold rounded-lg"
                  >
                    Save
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

// import { Dialog, Transition } from "@headlessui/react";
// import { Fragment, useState } from "react";
// import { FaTimes, FaRegCalendarAlt } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import SearchBar from "../../../components/SearchBar";
// import Button from "../../../components/Button";
// import allProjects from "../projects/projectsData";
// import { toast } from "react-toastify";

// export default function CreateRFQModal({ open, onClose }) {
//   const [searchText, setSearchText] = useState("");
//   const [selectedProject, setSelectedProject] = useState(null);
//   const [date, setDate] = useState(new Date());
//   const [taxType, setTaxType] = useState("item");
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//   const navigate = useNavigate();

//   const filteredProjects = allProjects.filter((proj) =>
//     proj.name.toLowerCase().includes(searchText.toLowerCase())
//   );

//   const handleSave = () => {
//     if (!selectedProject) {
//       alert("Please select a project first.");
//       return;
//     }

//     // Navigate to AddMaterialsScreen and pass data
//     navigate("/addmaterials", {
//       state: {
//         project: selectedProject,
//         deliveryLocation: selectedProject?.location,
//         date,
//         taxType,
//       },
//     });
//     toast.success("Project Selected Successfully");

//     onClose(); // Close modal
//   };

//   return (
//     <Transition appear show={open} as={Fragment}>
//       <Dialog as="div" className="relative z-50" onClose={onClose}>
//         {/* Overlay */}
//         <Transition.Child
//           as={Fragment}
//           enter="ease-out duration-300"
//           leave="ease-in duration-200"
//           enterFrom="opacity-0"
//           enterTo="opacity-100"
//           leaveFrom="opacity-100"
//           leaveTo="opacity-0"
//         >
//           <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" />
//         </Transition.Child>

//         <div className="fixed inset-0 overflow-y-auto">
//           <div className="flex min-h-full items-center justify-center p-4 text-center">
//             <Transition.Child
//               as={Fragment}
//               enter="ease-out duration-300"
//               leave="ease-in duration-200"
//               enterFrom="opacity-0 scale-95"
//               enterTo="opacity-100 scale-100"
//               leaveFrom="opacity-100 scale-100"
//               leaveTo="opacity-0 scale-95"
//             >
//               <Dialog.Panel className="w-full max-w-md transform rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
//                 <div className="p-6">
//                   {/* Header */}
//                   <div className="flex justify-between items-center mb-2">
//                     <h3 className="text-lg font-semibold">Create RFQ</h3>
//                     <button
//                       onClick={onClose}
//                       className="text-gray-400 hover:text-gray-700"
//                     >
//                       <FaTimes />
//                     </button>
//                   </div>

//                   {/* RFQ ID + Calendar */}
//                   <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
//                     <span className="text-indigo-600 font-medium cursor-pointer hover:underline">
//                       #12–16 ✎
//                     </span>
//                     <div className="relative w-fit">
//                       <DatePicker
//                         selected={date}
//                         onChange={(dateObj) => setDate(dateObj)}
//                         dateFormat="yyyy-MM-dd"
//                         className="pl-3 pr-10 py-2 text-sm font-medium text-red-600 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
//                         popperPlacement="bottom-end"
//                       />
//                       <FaRegCalendarAlt className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 pointer-events-none text-base" />
//                     </div>
//                   </div>

//                   {/* Project Name Search */}
//                   <div className="mb-4 relative">
//                     <label className="text-xs font-semibold text-gray-500 mb-1 block">
//                       PROJECT NAME <span className="text-red-500">*</span>
//                     </label>
//                     <SearchBar
//                       value={
//                         selectedProject ? selectedProject.name : searchText
//                       }
//                       onChange={(e) => {
//                         setSearchText(e.target.value);
//                         setSelectedProject(null);
//                       }}
//                       onFocus={() => setIsDropdownOpen(true)}
//                       onBlur={() =>
//                         setTimeout(() => setIsDropdownOpen(false), 100)
//                       }
//                       placeholder="Search project..."
//                       className="pl-3 pr-10 py-2 text-sm font-medium text-gray-800 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
//                     />
//                     {isDropdownOpen && (
//                       <ul className="absolute z-50 mt-1 w-full max-h-60 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-md text-sm divide-y divide-gray-100">
//                         {filteredProjects.length > 0 ? (
//                           filteredProjects.map((proj) => (
//                             <li
//                               key={proj.id}
//                               onMouseDown={() => {
//                                 setSelectedProject(proj);
//                                 setSearchText("");
//                                 setIsDropdownOpen(false);
//                               }}
//                               className="flex items-start gap-3 px-3 py-2 hover:bg-gray-100 cursor-pointer"
//                             >
//                               <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
//                                 {proj.name
//                                   .split(" ")
//                                   .map((word) => word[0])
//                                   .slice(0, 2)
//                                   .join("")
//                                   .toUpperCase()}
//                               </div>
//                               <div className="flex flex-col">
//                                 <p className="text-sm text-gray-800 font-medium">
//                                   {proj.name}
//                                 </p>
//                                 <p className="text-xs text-gray-500">
//                                   {proj.client}{" "}
//                                   <span className="text-gray-400">
//                                     ({proj.location})
//                                   </span>
//                                 </p>
//                               </div>
//                             </li>
//                           ))
//                         ) : (
//                           <li className="px-3 py-2 text-gray-400 italic">
//                             No projects found
//                           </li>
//                         )}
//                       </ul>
//                     )}
//                   </div>

//                   {/* Tax Type */}
//                   <div className="mb-6">
//                     <p className="font-medium text-sm mb-2">Select Tax Type:</p>
//                     <div className="flex gap-6 text-sm">
//                       <label className="flex items-center gap-1">
//                         <input
//                           type="radio"
//                           name="tax"
//                           checked={taxType === "item"}
//                           onChange={() => setTaxType("item")}
//                         />
//                         Item Level Tax
//                       </label>
//                       <label className="flex items-center gap-1">
//                         <input
//                           type="radio"
//                           name="tax"
//                           checked={taxType === "bill"}
//                           onChange={() => setTaxType("bill")}
//                         />
//                         Bill Level Tax
//                       </label>
//                     </div>
//                   </div>

//                   {/* Save Button */}
//                   <Button
//                     onClick={handleSave}
//                     fullWidth
//                     color="purple"
//                     variant="custom"
//                     className="bg-red-600 hover:bg-red-700 text-white py-2 text-sm font-semibold rounded-lg"
//                   >
//                     Save
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
