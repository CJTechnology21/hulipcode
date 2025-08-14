import React from "react";
import { FaEye, FaEdit, FaTrash, FaFileDownload } from "react-icons/fa";
import Button from "../../../components/Button"; // adjust to your button path
import { useNavigate } from "react-router-dom";

const LeadMenuModal = ({
  lead,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onDownloadPDF,
  position = { top: 0, left: 0 }, // position from parent
}) => {
  const navigate = useNavigate();

  if (!isOpen || !lead) return null;

  return (
    <div
      className="absolute bg-white rounded-lg shadow-lg w-48 border border-gray-200 z-50"
      style={{
        top: position.top,
        left: position.left,
      }}
    >
      <div className="py-1">
        <Button
          variant="custom"
          onClick={() => {
            navigate("/leadinfo", { state: { lead } });
            onClose();
          }}
          className="flex items-center w-full px-3 py-2 hover:bg-blue-50 gap-2 text-sm text-blue-600"
        >
          <FaEye className="text-blue-500" />
          <span>View</span>
        </Button>

        <Button
          variant="custom"
          onClick={() => {
            onEdit(lead);
            onClose();
          }}
          className="flex items-center w-full px-3 py-2 hover:bg-gray-50 gap-2 text-sm"
        >
          <FaEdit className="text-gray-500" />
          <span>Edit</span>
        </Button>

        <Button
          variant="custom"
          onClick={() => {
            onDelete(lead.id);
            onClose();
          }}
          className="flex items-center w-full px-3 py-2 hover:bg-red-50 gap-2 text-sm text-red-600"
        >
          <FaTrash />
          <span>Delete</span>
        </Button>

        <Button
          variant="custom"
          onClick={() => {
            onDownloadPDF(lead.id);
            onClose();
          }}
          className="flex items-center w-full px-3 py-2 hover:bg-gray-50 gap-2 text-sm"
        >
          <FaFileDownload className="text-gray-500" />
          <span>Download</span>
        </Button>
      </div>
    </div>
  );
};

export default LeadMenuModal;

// import React from "react";
// import { FaEye, FaEdit, FaTrash, FaFileDownload } from "react-icons/fa";
// import  Button  from "../../../components/Button"; // adjust to your button path
// import { useNavigate } from "react-router-dom";

// const LeadMenuModal = ({
//   lead,
//   isOpen,
//   onClose,
//   onEdit,
//   onDelete,
//   onDownloadPDF,
// }) => {
//   const navigate = useNavigate();

//   if (!isOpen || !lead) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
//       <div className="bg-white rounded-lg shadow-lg w-80 overflow-hidden">
//         {/* Header */}
//         <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
//           <h3 className="text-lg font-semibold text-gray-800">
//             Actions for {lead.name}
//           </h3>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600 text-xl"
//           >
//             &times;
//           </button>
//         </div>

//         {/* Menu Items */}
//         <div className="divide-y divide-gray-200">
//           <Button
//             variant="custom"
//             onClick={() => {
//               navigate("/leadinfo", { state: { lead } });
//               onClose();
//             }}
//             className="flex items-center w-full px-4 py-3 hover:bg-blue-50 gap-2 text-blue-600 font-medium"
//           >
//             <FaEye className="text-blue-500" />
//             <span>View</span>
//           </Button>

//           <Button
//             variant="custom"
//             onClick={() => {
//               onEdit(lead);
//               onClose();
//             }}
//             className="flex items-center w-full px-4 py-3 hover:bg-gray-50 gap-2"
//           >
//             <FaEdit className="text-gray-500" />
//             <span>Edit</span>
//           </Button>

//           <Button
//             variant="custom"
//             onClick={() => {
//               onDelete(lead.id);
//               onClose();
//             }}
//             className="flex items-center w-full px-4 py-3 hover:bg-red-50 gap-2 text-red-600"
//           >
//             <FaTrash />
//             <span>Delete</span>
//           </Button>

//           <Button
//             variant="custom"
//             onClick={() => {
//               onDownloadPDF(lead.id);
//               onClose();
//             }}
//             className="flex items-center w-full px-4 py-3 hover:bg-gray-50 gap-2"
//           >
//             <FaFileDownload className="text-gray-500" />
//             <span>Download PDF</span>
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LeadMenuModal;
