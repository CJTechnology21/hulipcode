import React, { useState, useEffect } from "react";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import { toast } from "react-toastify";
import { patchLead } from "../../../services/leadServices";
import { formatDateTime } from "../../../utils/dateFormatter";

export default function ReminderModal({
  reminderModalId,
  leadsData,
  onClose,
  refreshLeads,
}) {
  // Find the lead in the list by ID
  const lead = leadsData.find((l) => l._id === reminderModalId);

  const [reminderDate, setReminderDate] = useState("");
  const [reminderTime, setReminderTime] = useState("");
  const [loading, setLoading] = useState(false);

  // Initialize modal state only once when modal opens
  useEffect(() => {
    if (lead) {
      setReminderDate(lead.reminder?.date || "");
      setReminderTime(lead.reminder?.time || "");
    } else {
      setReminderDate("");
      setReminderTime("");
    }
  }, [reminderModalId]); // ✅ only runs when modal opens

  if (!reminderModalId) return null;

  const handleReminderSave = async () => {
    if (!reminderDate.trim() || !reminderTime.trim()) {
      toast.error("Please select both date and time");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        reminder: {
          date: reminderDate, // ✅ now will take newly entered value
          time: reminderTime, // ✅ now will take newly entered value
        },
      };

      console.log("🛠 DEBUG — Saving reminder");
      console.log("Lead ID:", reminderModalId);
      console.log("Payload:", payload);

      const res = await patchLead(reminderModalId, payload);

      console.log("API Response:", res);

      if (!res || res.error) {
        throw new Error(res?.error || "No response from API");
      }

      toast.success("Reminder saved successfully!");

      if (refreshLeads) {
        await refreshLeads();
      }

      onClose();
    } catch (error) {
      console.error("❌ ERROR saving reminder:", error);
      toast.error("Failed to save reminder");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-lg font-semibold mb-4">Set Reminder</h2>

        {/* Date Picker */}
        <div className="mb-3">
          <label className="block mb-1 text-sm font-medium">Date</label>
          <Input
            type="date"
            value={reminderDate}
            onChange={(e) => setReminderDate(e.target.value)}
          />
        </div>

        {/* Time Picker */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">Time</label>
          <Input
            type="time"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
          />
        </div>

        {/* Existing Reminder */}
        <div className="text-xs text-gray-600 mb-4">
          {lead?.reminder?.date ? (
            <div className="bg-gray-100 p-2 rounded text-sm">
              Existing Reminder:{" "}
              <span className="font-medium text-black">
                {formatDateTime({ date: lead.reminder.date }, null).split(" ")[0]}{" "}
                at {lead.reminder.time}
              </span>
            </div>
          ) : (
            "No previous reminder."
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <Button variant="custom" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleReminderSave}
            className="bg-red-600 text-white hover:bg-red-600"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// import React, { useState, useEffect } from "react";
// import Input from "../../../components/Input";
// import Button from "../../../components/Button";
// import { toast } from "react-toastify";
// import { patchLead } from "../../../services/leadServices";
// import { formatDateTime } from "../../../utils/dateFormatter";

// export default function ReminderModal({
//   reminderModalId,
//   leadsData,
//   onClose,
//   refreshLeads,
// }) {
//   // Find the lead in the list by ID
//   const lead = leadsData.find((l) => l._id === reminderModalId);

//   const [reminderDate, setReminderDate] = useState("");
//   const [reminderTime, setReminderTime] = useState("");
//   const [loading, setLoading] = useState(false);

//   // Load lead reminder when modal opens
// useEffect(() => {
//   if (lead) {
//     setReminderDate(lead.reminder?.date || "");
//     setReminderTime(lead.reminder?.time || "");
//   } else {
//     setReminderDate("");
//     setReminderTime("");
//   }
// }, [lead]);


//   if (!reminderModalId) return null;

//   const handleReminderSave = async () => {
//     if (!reminderDate.trim() || !reminderTime.trim()) {
//       toast.error("Please select both date and time");
//       return;
//     }

//     setLoading(true);
//     try {
//       const payload = {
//         reminder: {
//           date: reminderDate,
//           time: reminderTime,
//         },
//       };

//       console.log("🛠 DEBUG — Saving reminder");
//       console.log("Lead ID:", reminderModalId);
//       console.log("Payload:", payload);

//       const res = await patchLead(reminderModalId, payload);

//       console.log("API Response:", res);

//       if (!res || res.error) {
//         throw new Error(res?.error || "No response from API");
//       }

//       toast.success("Reminder saved successfully!");

//       if (refreshLeads) {
//         await refreshLeads();
//       }

//       onClose();
//     } catch (error) {
//       console.error("❌ ERROR saving reminder:", error);
//       toast.error("Failed to save reminder");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
//       <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
//         <h2 className="text-lg font-semibold mb-4">Set Reminder</h2>

//         {/* Date Picker */}
//         <div className="mb-3">
//           <label className="block mb-1 text-sm font-medium">Date</label>
//           <Input
//             type="date"
//             value={reminderDate}
//             onChange={(e) => setReminderDate(e.target.value)}
//           />
//         </div>

//         {/* Time Picker */}
//         <div className="mb-4">
//           <label className="block mb-1 text-sm font-medium">Time</label>
//           <Input
//             type="time"
//             value={reminderTime}
//             onChange={(e) => setReminderTime(e.target.value)}
//           />
//         </div>

//         {/* Existing Reminder */}
//         <div className="text-xs text-gray-600 mb-4">
//           {lead?.reminder?.date ? (
//             <div className="bg-gray-100 p-2 rounded text-sm">
//               Existing Reminder:{" "}
//               <span className="font-medium text-black">
//                 {formatDateTime({ date: lead.reminder.date }, null).split(" ")[0]}{" "}
//                 at {lead.reminder.time}
//               </span>
//             </div>
//           ) : (
//             "No previous reminder."
//           )}
//         </div>

//         {/* Buttons */}
//         <div className="flex justify-end gap-2">
//           <Button variant="custom" onClick={onClose} disabled={loading}>
//             Cancel
//           </Button>
//           <Button
//             onClick={handleReminderSave}
//             className="bg-red-600 text-white hover:bg-red-600"
//             disabled={loading}
//           >
//             {loading ? "Saving..." : "Save"}
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }
