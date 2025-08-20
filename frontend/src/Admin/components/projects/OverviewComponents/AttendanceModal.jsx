import React, { useState } from "react";
import Input from "../../../../components/Input";
import Button from "../../../../components/Button";

function AttendanceModal({ isOpen, onClose, addAttendance }) {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("Full Day");

  const handleSubmit = (e) => {
    e.preventDefault();
    addAttendance({ name, date, status }); // pass all three values
    setName("");
    setDate("");
    setStatus("Full Day");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-96">
        <h3 className="font-semibold text-gray-800 mb-4">Mark Attendance</h3>
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
            >
              Cancel
            </Button>
            <Button
              variant="custom"
              type="submit"
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
            >
              Add
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

// function AttendanceModal({ isOpen, onClose, addAttendance }) {
//   const [name, setName] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     addAttendance(name);
//     setName("");
//     onClose();
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//       <div className="bg-white p-6 rounded-xl w-80">
//         <h3 className="font-semibold text-gray-800 mb-4">Mark Attendance</h3>
//         <form onSubmit={handleSubmit} className="space-y-3">
//           <Input
//             type="text"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             placeholder="Labour Name"
//             className="w-full border p-2 rounded"
//             required
//           />
//           <div className="flex justify-end gap-2 mt-4">
//             <Button
//               variant="custom"
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 bg-gray-300 rounded"
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
