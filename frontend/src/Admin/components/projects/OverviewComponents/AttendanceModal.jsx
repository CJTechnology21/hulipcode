import React, { useState } from "react";
import Input from "../../../../components/Input";
import Button from "../../../../components/Button";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createAttendance } from "../../../../services/overViewServices";

function AttendanceModal({ isOpen, onClose, addAttendance, projectId }) {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("Full Day");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = { name, date, status, projectId };
      const res = await createAttendance(payload);
      toast.success("Attendance added successfully!");
      if (addAttendance) addAttendance(res.data);

      setName("");
      setDate("");
      setStatus("Full Day");
      onClose();
    } catch (error) {
      // console.error("Error adding attendance:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to add attendance");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-96">
        <h3 className="font-semibold text-gray-800 mb-4">
          Mark Attendance 
        </h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Labour Name"
            className="w-full border p-2 rounded"
            required
          />
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="Full Day">Full Day</option>
            <option value="Half Day">Half Day</option>
          </select>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="custom"
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-400 text-gray-700 rounded hover:bg-gray-100"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="custom"
              type="submit"
              className={`px-4 py-2 rounded text-white ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600"
              }`}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AttendanceModal;

// import React, { useState } from "react";
// import Input from "../../../../components/Input";
// import Button from "../../../../components/Button";

// function AttendanceModal({ isOpen, onClose, addAttendance,projectId }) {
//   const [name, setName] = useState("");
//   const [date, setDate] = useState("");
//   const [status, setStatus] = useState("Full Day");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     addAttendance({ name, date, status }); 
//     setName("");
//     setDate("");
//     setStatus("Full Day");
//     onClose();
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//       <div className="bg-white p-6 rounded-xl w-96">
//         <h3 className="font-semibold text-gray-800 mb-4">Mark Attendance </h3>
//         <form onSubmit={handleSubmit} className="space-y-3">
//           <Input
//             type="text"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             placeholder="Labour Name"
//             className="w-full border p-2 rounded"
//             required
//           />
//           <Input
//             type="date"
//             value={date}
//             onChange={(e) => setDate(e.target.value)}
//             className="w-full border p-2 rounded"
//             required
//           />
//           <select
//             value={status}
//             onChange={(e) => setStatus(e.target.value)}
//             className="w-full border p-2 rounded"
//           >
//             <option value="Full Day">Full Day</option>
//             <option value="Half Day">Half Day</option>
//           </select>
//           <div className="flex justify-end gap-2 mt-4">
//             <Button
//               variant="custom"
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 border border-gray-400 text-gray-700 rounded hover:bg-gray-100"
//             >
//               Cancel
//             </Button>
//             <Button
//               variant="custom"
//               type="submit"
//               className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
//             >
//               Add
//             </Button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default AttendanceModal;
