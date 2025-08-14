import React, { useState } from "react";
import Button from "../../../components/Button";
import { toast } from "react-toastify";
import { patchLead } from "../../../services/leadServices";

export default function UpdateLeadModal({
  showModal,
  modalData,
  setModalData,
  closeModal,
  refreshLeads,
}) {
  const [loading, setLoading] = useState(false);

  if (!showModal) return null;

  const handleSave = async () => {
    if (!modalData.text) {
      toast.error("Please enter update details");
      return;
    }

    setLoading(true);
    try {
      // ✅ Use _id instead of id
      await patchLead(modalData._id, { update: modalData.text });

      toast.success("Lead updated successfully!");
      refreshLeads && refreshLeads();

      setModalData((prev) => ({
        ...prev,
        updatedAt: new Date().toISOString(),
      }));

      closeModal();
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while updating");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-4 shadow-xl">
        {/* ✅ Use _id for display */}
        <h2 className="text-lg font-bold">Update Lead - {modalData._id}</h2>

        {/* Last Updated / Created Date */}
        <div className="text-gray-500 text-sm">
          {modalData.updatedAt || modalData.createdAt
            ? `Last Updated: ${new Date(
                modalData.updatedAt || modalData.createdAt
              ).toLocaleString()}`
            : "No date available"}
        </div>

        {/* Update Text Area */}
        <textarea
          rows={4}
          className="w-full p-2 border rounded"
          placeholder="Enter update details"
          value={modalData.text}
          onChange={(e) => setModalData({ ...modalData, text: e.target.value })}
        />

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <Button
            variant="custom"
            className="px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-100"
            onClick={closeModal}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="custom"
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// import React, { useState } from "react";
// import Button from "../../../components/Button";
// import axios from "axios";
// import { toast } from "react-toastify";

// export default function UpdateLeadModal({
//   showModal,
//   modalData,
//   setModalData,
//   closeModal,
//   refreshLeads,
// }) {
//   const [loading, setLoading] = useState(false);

//   if (!showModal) return null;

//   const handleSave = async () => {
//     if (!modalData.text) {
//       toast.error("Please enter update details");
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await axios.patch(`/api/leads/${modalData.id}`, {
//         update: modalData.text,
//       });

//       if (res.status === 200) {
//         toast.success("Lead updated successfully!");
//         refreshLeads && refreshLeads();

//         // Optionally update the modalData with updatedAt timestamp
//         setModalData((prev) => ({
//           ...prev,
//           updatedAt: new Date().toISOString(),
//         }));

//         closeModal();
//       } else {
//         toast.error("Failed to update lead");
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("An error occurred while updating");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
//       <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-4 shadow-xl">
//         <h2 className="text-lg font-bold">Update Lead - {modalData.id}</h2>

//         {/* Last Updated / Created Date */}
//         <div className="text-gray-500 text-sm">
//           {modalData.updatedAt
//             ? `Last Updated: ${new Date(modalData.updatedAt).toLocaleString()}`
//             : `Created: ${new Date(modalData.createdAt).toLocaleString()}`}
//         </div>

//         {/* Update Text Area */}
//         <textarea
//           rows={4}
//           className="w-full p-2 border rounded"
//           placeholder="Enter update details"
//           value={modalData.text}
//           onChange={(e) =>
//             setModalData({ ...modalData, text: e.target.value })
//           }
//         />

//         {/* Buttons */}
//         <div className="flex justify-end gap-2">
//           <Button
//             variant="custom"
//             className="px-4 py-2 bg-red-300 rounded hover:bg-red-400 text-white"
//             onClick={closeModal}
//             disabled={loading}
//           >
//             Cancel
//           </Button>
//           <Button
//             variant="custom"
//             className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
//             onClick={handleSave}
//             disabled={loading}
//           >
//             {loading ? "Saving..." : "Save"}
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }
// import React, { useState } from "react";
// import Input from "../../../components/Input";
// import Button from "../../../components/Button";
// import axios from "axios";
// import { toast } from "react-toastify";

// export default function UpdateLeadModal({
//   showModal,
//   modalData,
//   setModalData,
//   closeModal,
//   refreshLeads,
// }) {
//   const [loading, setLoading] = useState(false);

//   if (!showModal) return null;

//   const handleSave = async () => {
//     if (!modalData.text || !modalData.datetime) {
//       toast.error("Please fill out all fields");
//       return;
//     }

//     // Split datetime into date & time
//     const [date, time] = modalData.datetime.split("T");

//     if (!date || !time) {
//       toast.error("Invalid date/time format");
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await axios.patch(`/api/leads/${modalData.id}`, {
//         update: modalData.text,
//         reminder: {
//           date,
//           time,
//         },
//       });

//       if (res.status === 200) {
//         toast.success("Lead updated successfully!");
//         refreshLeads && refreshLeads();
//         closeModal();
//       } else {
//         toast.error("Failed to update lead");
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("An error occurred while updating");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
//       <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-4 shadow-xl">
//         <h2 className="text-lg font-bold">Update Lead - {modalData.id}</h2>

//         {/* Update Text Area */}
//         <textarea
//           rows={4}
//           className="w-full p-2 border rounded"
//           placeholder="Enter update details"
//           value={modalData.text}
//           onChange={(e) =>
//             setModalData({ ...modalData, text: e.target.value })
//           }
//         />

//         {/* Date & Time Picker */}
//         <Input
//           type="datetime-local"
//           className="w-full p-2 border rounded"
//           value={modalData.datetime}
//           onChange={(e) =>
//             setModalData({ ...modalData, datetime: e.target.value })
//           }
//         />

//         {/* Buttons */}
//         <div className="flex justify-end gap-2">
//           <Button
//             variant="custom"
//             className="px-4 py-2 bg-red-300 rounded hover:bg-red-400 text-white"
//             onClick={closeModal}
//             disabled={loading}
//           >
//             Cancel
//           </Button>
//           <Button
//             variant="custom"
//             className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
//             onClick={handleSave}
//             disabled={loading}
//           >
//             {loading ? "Saving..." : "Save"}
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }
