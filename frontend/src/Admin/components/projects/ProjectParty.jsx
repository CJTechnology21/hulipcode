import React, { useState, useEffect } from "react";
import { FiDownload } from "react-icons/fi";
import { FaFilter } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Dialog } from "@headlessui/react";
import Button from "../../../components/Button";
import DropDown from "../../../components/DropDown";
import {
  fetchPartyByProject,
  createParty,
  updateParty,
  deleteParty,
} from "../../../services/partyServices";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ProjectParty({ projectId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [menuOpenIndex, setMenuOpenIndex] = useState(null);
  const [newParty, setNewParty] = useState({
    name: "",
    type: "",
    amount: "",
    paymentType: "",
  });
  const [editPartyId, setEditPartyId] = useState(null);

  // ✅ Load parties on mount
  useEffect(() => {
    const loadParties = async () => {
      setLoading(true);
      try {
        const data = await fetchPartyByProject(projectId);
        setParties(data);
      } catch (error) {
        toast.error("Failed to fetch parties");
        console.error("Failed to fetch parties:", error);
      } finally {
        setLoading(false);
      }
    };
    if (projectId) loadParties();
  }, [projectId]);

  // ✅ Totals
  const totalAdvancePaid = parties
    .filter((p) => p.paymentType === "AdvancePaid")
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const totalToPay = parties
    .filter((p) => p.paymentType === "ToPay")
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewParty((prev) => ({ ...prev, [name]: value }));
  };

  const closeModal = () => {
    setIsOpen(false);
    setIsEditMode(false);
    setEditPartyId(null);
    setNewParty({ name: "", type: "", amount: "", paymentType: "" });
  };

  const handleAddParty = async () => {
    try {
      if (!newParty.name || !newParty.type || !newParty.amount || !newParty.paymentType) {
        toast.warn("Please fill all fields");
        return;
      }

      if (isEditMode && editPartyId) {
        // ✅ Update existing party
        const updated = await updateParty(editPartyId, newParty);
        setParties((prev) =>
          prev.map((party) =>
            party._id === editPartyId ? { ...party, ...updated } : party
          )
        );
        toast.success("Party updated successfully");
      } else {
        // ✅ Create new party
        const created = await createParty({ ...newParty, projectId });
        setParties((prev) => [...prev, created]);
        toast.success("Party added successfully");
      }
      closeModal();
    } catch (error) {
      toast.error("Error saving party");
      console.error("Error saving party:", error);
    }
  };

  const handleEdit = (party) => {
    setIsEditMode(true);
    setEditPartyId(party._id);
    setNewParty({
      name: party.name,
      type: party.type,
      amount: party.amount,
      paymentType: party.paymentType,
    });
    setIsOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this party?")) {
      try {
        await deleteParty(id);
        setParties((prev) => prev.filter((party) => party._id !== id));
        toast.success("Party deleted successfully");
      } catch (error) {
        toast.error("Error deleting party");
        console.error("Error deleting party:", error);
      }
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-4 bg-gray-50 w-full">
      {/* Top Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Section: Search + Filter Icon */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search"
            className="px-4 py-2 border border-gray-300 rounded-md text-sm w-full md:w-60"
          />
          <button className="flex items-center text-red-600 hover:text-red-700">
            <FaFilter className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>

        {/* Right Section */}
        <div className="flex flex-wrap items-center gap-2 md:gap-4 w-full md:w-auto justify-start md:justify-end">
          <DropDown
            name="status"
            value=""
            label=""
            onChange={() => {}}
            options={["Active", "Inactive"]}
          />
          <button className="text-gray-600 text-xl hover:text-black">
            <FiDownload />
          </button>
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded-md text-sm min-w-[120px] text-center">
            <p className="font-medium">Advance Paid</p>
            <p className="font-bold">₹ {totalAdvancePaid}</p>
          </div>
          <div className="bg-red-100 text-red-800 px-4 py-2 rounded-md text-sm min-w-[120px] text-center">
            <p className="font-medium">To Pay</p>
            <p className="font-bold">₹ {totalToPay}</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="text-left px-4 py-2">S.No.</th>
              <th className="text-left px-4 py-2">Party Name</th>
              <th className="text-left px-4 py-2">Type</th>
              <th className="text-left px-4 py-2">Amount</th>
              <th className="text-left px-4 py-2">Payment Type</th>
              <th className="text-left px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : parties.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center text-gray-400 py-8">
                  No parties added yet
                </td>
              </tr>
            ) : (
              parties.map((party, index) => (
                <tr key={party._id} className="border-b">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{party.name}</td>
                  <td className="px-4 py-2">{party.type}</td>
                  <td className="px-4 py-2">₹ {party.amount}</td>
                  <td className="px-4 py-2 capitalize">{party.paymentType}</td>
                  <td className="px-4 py-2 relative">
                    <div className="relative inline-block text-left">
                      <button
                        onClick={() =>
                          setMenuOpenIndex(menuOpenIndex === index ? null : index)
                        }
                        className="p-2 rounded-full hover:bg-gray-100"
                      >
                        <BsThreeDotsVertical className="text-gray-600" />
                      </button>
                      {menuOpenIndex === index && (
                        <div className="absolute top-full right-0 mt-1 bg-white border shadow rounded-md w-28 z-20">
                          <button
                            onClick={() => {
                              handleEdit(party);
                              setMenuOpenIndex(null);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(party._id)}
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Party Button */}
      <div className="pt-4 flex justify-end">
        <Button
          onClick={() => setIsOpen(true)}
          color="blue"
          variant="custom"
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          + Add Party
        </Button>
      </div>

      {/* Modal */}
      <Dialog open={isOpen} onClose={closeModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/20" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md space-y-4 bg-white p-6 rounded-xl shadow-lg">
            <Dialog.Title className="text-lg font-bold">
              {isEditMode ? "Edit Party" : "Add Party"}
            </Dialog.Title>

            <div>
              <label className="block text-sm font-medium mb-1">Party Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter Party Name"
                value={newParty.name}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <DropDown
                name="type"
                value={newParty.type}
                onChange={handleChange}
                options={["Vendor", "Client", "Contractor", "Misc"]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Payment Type</label>
              <DropDown
                name="paymentType"
                value={newParty.paymentType}
                onChange={handleChange}
                options={["AdvancePaid", "ToPay"]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Amount</label>
              <input
                type="number"
                name="amount"
                placeholder="Enter Amount"
                value={newParty.amount}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm"
              />
            </div>

            <div className="flex flex-row justify-end gap-2 pt-2">
              <Button onClick={closeModal} variant="outlined" color="gray">
                Cancel
              </Button>
              <Button
                onClick={handleAddParty}
                variant="custom"
                className="bg-red-500 hover:bg-red-600 text-white cursor-pointer"
              >
                {isEditMode ? "Update" : "Save"}
              </Button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}

export default ProjectParty;

// import React, { useState, useEffect } from "react";
// import { FiDownload } from "react-icons/fi";
// import { FaFilter } from "react-icons/fa";
// import { BsThreeDotsVertical } from "react-icons/bs";
// import { Dialog } from "@headlessui/react";
// import Button from "../../../components/Button";
// import DropDown from "../../../components/DropDown";
// import {
//   fetchPartyByProject,
//   createParty,
//   updateParty,
//   deleteParty,
// } from "../../../services/partyServices";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// function ProjectParty({ projectId }) {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [parties, setParties] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [menuOpenIndex, setMenuOpenIndex] = useState(null);
//   const [newParty, setNewParty] = useState({
//     name: "",
//     type: "",
//     amount: "",
//     paymentType: "",
//   });
//   const [editPartyId, setEditPartyId] = useState(null);

//   // ✅ Load parties on mount
//   useEffect(() => {
//     const loadParties = async () => {
//       setLoading(true);
//       try {
//         const data = await fetchPartyByProject(projectId);
//         setParties(data);
//       } catch (error) {
//         toast.error("Failed to fetch parties");
//         console.error("Failed to fetch parties:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (projectId) loadParties();
//   }, [projectId]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setNewParty((prev) => ({ ...prev, [name]: value }));
//   };

//   const closeModal = () => {
//     setIsOpen(false);
//     setIsEditMode(false);
//     setEditPartyId(null);
//     setNewParty({ name: "", type: "", amount: "", paymentType: "" });
//   };

//   const handleAddParty = async () => {
//     try {
//       if (!newParty.name || !newParty.type || !newParty.amount || !newParty.paymentType) {
//         toast.warn("Please fill all fields");
//         return;
//       }

//       if (isEditMode && editPartyId) {
//         // ✅ Update existing party
//         const updated = await updateParty(editPartyId, newParty);
//         setParties((prev) =>
//           prev.map((party) =>
//             party._id === editPartyId ? { ...party, ...updated } : party
//           )
//         );
//         toast.success("Party updated successfully");
//       } else {
//         // ✅ Create new party
//         const created = await createParty({ ...newParty, projectId });
//         setParties((prev) => [...prev, created]);
//         toast.success("Party added successfully");
//       }
//       closeModal();
//     } catch (error) {
//       toast.error("Error saving party");
//       console.error("Error saving party:", error);
//     }
//   };

//   const handleEdit = (party) => {
//     setIsEditMode(true);
//     setEditPartyId(party._id);
//     setNewParty({
//       name: party.name,
//       type: party.type,
//       amount: party.amount,
//       paymentType: party.paymentType,
//     });
//     setIsOpen(true);
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this party?")) {
//       try {
//         await deleteParty(id);
//         setParties((prev) => prev.filter((party) => party._id !== id));
//         toast.success("Party deleted successfully");
//       } catch (error) {
//         toast.error("Error deleting party");
//         console.error("Error deleting party:", error);
//       }
//     }
//   };

//   return (
//     <div className="p-4 md:p-6 space-y-4 bg-gray-50 w-full">
//       {/* Top Actions */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//         {/* Left Section: Search + Filter Icon */}
//         <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
//           <input
//             type="text"
//             placeholder="Search"
//             className="px-4 py-2 border border-gray-300 rounded-md text-sm w-full md:w-60"
//           />
//           <button className="flex items-center text-red-600 hover:text-red-700">
//             <FaFilter className="w-4 h-4 md:w-5 md:h-5" />
//           </button>
//         </div>

//         {/* Right Section */}
//         <div className="flex flex-wrap items-center gap-2 md:gap-4 w-full md:w-auto justify-start md:justify-end">
//           <DropDown
//             name="status"
//             value=""
//             label=""
//             onChange={() => {}}
//             options={["Active", "Inactive"]}
//           />
//           <button className="text-gray-600 text-xl hover:text-black">
//             <FiDownload />
//           </button>
//           <div className="bg-green-100 text-green-800 px-4 py-2 rounded-md text-sm">
//             <p className="font-medium">Advance Paid</p>
//             <p className="font-bold">₹ 0</p>
//           </div>
//           <div className="bg-red-100 text-red-800 px-4 py-2 rounded-md text-sm">
//             <p className="font-medium">To Pay</p>
//             <p className="font-bold">₹ 0</p>
//           </div>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto bg-white rounded-xl shadow">
//         <table className="min-w-full text-sm text-gray-700">
//           <thead className="bg-gray-100 text-gray-600">
//             <tr>
//               <th className="text-left px-4 py-2">S.No.</th>
//               <th className="text-left px-4 py-2">Party Name</th>
//               <th className="text-left px-4 py-2">Type</th>
//               <th className="text-left px-4 py-2">Amount</th>
//               <th className="text-left px-4 py-2">Payment Type</th>
//               <th className="text-left px-4 py-2">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {loading ? (
//               <tr>
//                 <td colSpan="6" className="text-center py-6 text-gray-500">
//                   Loading...
//                 </td>
//               </tr>
//             ) : parties.length === 0 ? (
//               <tr>
//                 <td colSpan="6" className="text-center text-gray-400 py-8">
//                   No parties added yet
//                 </td>
//               </tr>
//             ) : (
//               parties.map((party, index) => (
//                 <tr key={party._id} className="border-b">
//                   <td className="px-4 py-2">{index + 1}</td>
//                   <td className="px-4 py-2">{party.name}</td>
//                   <td className="px-4 py-2">{party.type}</td>
//                   <td className="px-4 py-2">₹ {party.amount}</td>
//                   <td className="px-4 py-2 capitalize">{party.paymentType}</td>
//                   <td className="px-4 py-2 relative">
//                     <button
//                       onClick={() =>
//                         setMenuOpenIndex(menuOpenIndex === index ? null : index)
//                       }
//                       className="p-2 rounded-full hover:bg-gray-100"
//                     >
//                       <BsThreeDotsVertical className="text-gray-600" />
//                     </button>
//                     {menuOpenIndex === index && (
//                       <div className="absolute right-4 mt-2 bg-white border shadow rounded-md w-28 z-10">
//                         <button
//                           onClick={() => {
//                             handleEdit(party);
//                             setMenuOpenIndex(null);
//                           }}
//                           className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
//                         >
//                           Edit
//                         </button>
//                         <button
//                           onClick={() => handleDelete(party._id)}
//                           className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600"
//                         >
//                           Delete
//                         </button>
//                       </div>
//                     )}
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Add Party Button */}
//       <div className="pt-4 flex justify-end">
//         <Button
//           onClick={() => setIsOpen(true)}
//           color="blue"
//           variant="custom"
//           className="bg-red-600 hover:bg-red-700 text-white"
//         >
//           + Add Party
//         </Button>
//       </div>

//       {/* Modal */}
//       <Dialog open={isOpen} onClose={closeModal} className="relative z-50">
//         <div className="fixed inset-0 bg-black/20" aria-hidden="true" />
//         <div className="fixed inset-0 flex items-center justify-center p-4">
//           <Dialog.Panel className="w-full max-w-md space-y-4 bg-white p-6 rounded-xl shadow-lg">
//             <Dialog.Title className="text-lg font-bold">
//               {isEditMode ? "Edit Party" : "Add Party"}
//             </Dialog.Title>

//             <input
//               type="text"
//               name="name"
//               placeholder="Party Name"
//               value={newParty.name}
//               onChange={handleChange}
//               className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm"
//             />

//             <DropDown
//               name="type"
//               value={newParty.type}
//               label="Type"
//               onChange={handleChange}
//               options={["Vendor", "Client", "Contractor", "Misc"]}
//             />
//             <DropDown
//               name="paymentType"
//               value={newParty.paymentType}
//               label="Payment Type"
//               onChange={handleChange}
//               options={["AdvancePaid", "ToPay"]}
//             />
//             <input
//               type="number"
//               name="amount"
//               placeholder="Amount"
//               value={newParty.amount}
//               onChange={handleChange}
//               className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm"
//             />
//             <div className="flex flex-row justify-end gap-2 pt-2">
//               <Button onClick={closeModal} variant="outlined" color="gray">
//                 Cancel
//               </Button>
//               <Button
//                 onClick={handleAddParty}
//                 variant="custom"
//                 className="bg-red-500 hover:bg-red-600 text-white cursor-pointer"
//               >
//                 {isEditMode ? "Update" : "Save"}
//               </Button>
//             </div>
//           </Dialog.Panel>
//         </div>
//       </Dialog>
//     </div>
//   );
// }

// export default ProjectParty;







// // import React, { useState, useEffect } from "react";
// // import { FiDownload } from "react-icons/fi";
// // import { FaFilter } from "react-icons/fa";
// // import { Dialog } from "@headlessui/react";
// // import Button from "../../../components/Button";
// // import DropDown from "../../../components/DropDown";
// // import {
// //   fetchPartyByProject,
// //   createParty,
// // } from "../../../services/partyServices";

// // function ProjectParty({ projectId }) {
// //   const [isOpen, setIsOpen] = useState(false);
// //   const [parties, setParties] = useState([]);
// //   const [loading, setLoading] = useState(false);
// //   const [newParty, setNewParty] = useState({
// //     name: "",
// //     type: "",
// //     amount: "",
// //     paymentType: "",
// //   });

// //   // ✅ Load parties on mount
// //   useEffect(() => {
// //     const loadParties = async () => {
// //       setLoading(true);
// //       try {
// //         const data = await fetchPartyByProject(projectId);
// //         setParties(data);
// //       } catch (error) {
// //         console.error("Failed to fetch parties:", error);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };
// //     if (projectId) loadParties();
// //   }, [projectId]);

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setNewParty((prev) => ({ ...prev, [name]: value }));
// //   };

// //   const closeModal = () => {
// //     setIsOpen(false);
// //     setNewParty({ name: "", type: "", amount: "", paymentType: "" });
// //   };

// //   const handleAddParty = async () => {
// //     try {
// //       const created = await createParty({ ...newParty, projectId });
// //       setParties((prev) => [...prev, created]); 
// //       closeModal();
// //     } catch (error) {
// //       console.error("Error creating party:", error);
// //     }
// //   };

// //   return (
// //     <div className="p-4 md:p-6 space-y-4 bg-gray-50 w-full">
// //       {/* Top Actions */}
// //       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
// //         {/* Left Section: Search + Filter Icon */}
// //         <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
// //           <input
// //             type="text"
// //             placeholder="Search"
// //             className="px-4 py-2 border border-gray-300 rounded-md text-sm w-full md:w-60"
// //           />
// //           <button className="flex items-center text-red-600 hover:text-red-700">
// //             <FaFilter className="w-4 h-4 md:w-5 md:h-5" />
// //           </button>
// //         </div>

// //         {/* Right Section */}
// //         <div className="flex flex-wrap items-center gap-2 md:gap-4 w-full md:w-auto justify-start md:justify-end">
// //           <DropDown
// //             name="status"
// //             value=""
// //             label=""
// //             onChange={() => {}}
// //             options={["Active", "Inactive"]}
// //           />
// //           <button className="text-gray-600 text-xl hover:text-black">
// //             <FiDownload />
// //           </button>
// //           <div className="bg-green-100 text-green-800 px-4 py-2 rounded-md text-sm">
// //             <p className="font-medium">Advance Paid</p>
// //             <p className="font-bold">₹ 0</p>
// //           </div>
// //           <div className="bg-red-100 text-red-800 px-4 py-2 rounded-md text-sm">
// //             <p className="font-medium">To Pay</p>
// //             <p className="font-bold">₹ 0</p>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Table */}
// //       <div className="overflow-x-auto bg-white rounded-xl shadow">
// //         <table className="min-w-full text-sm text-gray-700">
// //           <thead className="bg-gray-100 text-gray-600">
// //             <tr>
// //               <th className="text-left px-4 py-2">S.No.</th>
// //               <th className="text-left px-4 py-2">Party Name</th>
// //               <th className="text-left px-4 py-2">Type</th>
// //               <th className="text-left px-4 py-2">Amount</th>
// //               <th className="text-left px-4 py-2">Payment Type</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {loading ? (
// //               <tr>
// //                 <td colSpan="5" className="text-center py-6 text-gray-500">
// //                   Loading...
// //                 </td>
// //               </tr>
// //             ) : parties.length === 0 ? (
// //               <tr>
// //                 <td colSpan="5" className="text-center text-gray-400 py-8">
// //                   No parties added yet
// //                 </td>
// //               </tr>
// //             ) : (
// //               parties.map((party, index) => (
// //                 <tr key={party._id} className="border-b">
// //                   <td className="px-4 py-2">{index + 1}</td>
// //                   <td className="px-4 py-2">{party.name}</td>
// //                   <td className="px-4 py-2">{party.type}</td>
// //                   <td className="px-4 py-2">₹ {party.amount}</td>
// //                   <td className="px-4 py-2 capitalize">{party.paymentType}</td>
// //                 </tr>
// //               ))
// //             )}
// //           </tbody>
// //         </table>
// //       </div>

// //       {/* Add Party Button */}
// //       <div className="pt-4 flex justify-end">
// //         <Button
// //           onClick={() => setIsOpen(true)}
// //           color="blue"
// //           variant="custom"
// //           className="bg-red-600 hover:bg-red-700 text-white"
// //         >
// //           + Add Party
// //         </Button>
// //       </div>

// //       {/* Modal */}
// //       <Dialog open={isOpen} onClose={closeModal} className="relative z-50">
// //         <div className="fixed inset-0 bg-black/20" aria-hidden="true" />
// //         <div className="fixed inset-0 flex items-center justify-center p-4">
// //           <Dialog.Panel className="w-full max-w-md space-y-4 bg-white p-6 rounded-xl shadow-lg">
// //             <Dialog.Title className="text-lg font-bold">Add Party</Dialog.Title>

// //             <input
// //               type="text"
// //               name="name"
// //               placeholder="Party Name"
// //               value={newParty.name}
// //               onChange={handleChange}
// //               className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm"
// //             />

// //             <DropDown
// //               name="type"
// //               value={newParty.type}
// //               label="Type"
// //               onChange={handleChange}
// //               options={["Vendor", "Client", "Contractor", "Misc"]}
// //             />
// //             <DropDown
// //               name="paymentType"
// //               value={newParty.paymentType}
// //               label="Payment Type"
// //               onChange={handleChange}
// //               options={["AdvancePaid", "ToPay"]}
// //             />
// //             <input
// //               type="number"
// //               name="amount"
// //               placeholder="Amount"
// //               value={newParty.amount}
// //               onChange={handleChange}
// //               className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm"
// //             />
// //             <div className="flex flex-row justify-end gap-2 pt-2">
// //               <Button onClick={closeModal} variant="outlined" color="gray">
// //                 Cancel
// //               </Button>
// //               <Button
// //                 onClick={handleAddParty}
// //                 variant="custom"
// //                 className="bg-red-500 hover:bg-red-600 text-white cursor-pointer"
// //               >
// //                 Save
// //               </Button>
// //             </div>
// //           </Dialog.Panel>
// //         </div>
// //       </Dialog>
// //     </div>
// //   );
// // }

// // export default ProjectParty;
