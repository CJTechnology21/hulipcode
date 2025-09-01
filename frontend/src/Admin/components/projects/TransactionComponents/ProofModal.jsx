import React from "react";
import { IoMdDownload } from "react-icons/io";
import { format } from "date-fns"; 
import { toast } from "react-toastify"; // import toastify
import 'react-toastify/dist/ReactToastify.css';

function ProofModal({ isOpen, proof, onClose }) {
  if (!isOpen || !proof) return null;

  const uploadedAt = proof.uploadedAt
    ? format(new Date(proof.uploadedAt), "PPPpp")
    : "Unknown";

  const handleDownload = async () => {
    try {
      toast.info("Downloading file...", { autoClose: 2000 });

      const response = await fetch(proof.fileUrl);
      if (!response.ok) throw new Error("Network response was not ok");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", proof.fileUrl.split("/").pop());
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("File downloaded successfully!", { autoClose: 3000 });
    } catch (err) {
      console.error("Download failed:", err);
      toast.error("Download failed. Please try again.", { autoClose: 3000 });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-300 px-6 py-3 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">Proof Document</h2>
          <div className="flex items-center space-x-4">
            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="text-gray-600 hover:text-gray-900 text-xl"
              title="Download Proof"
            >
              <IoMdDownload />
            </button>

            {/* Close Button */}
            <button
              className="text-gray-600 hover:text-gray-900 text-2xl font-bold"
              onClick={onClose}
            >
              &times;
            </button>
          </div>
        </div>

        {/* Timestamp */}
        <div className="px-6 py-2 text-sm text-gray-500 border-b border-gray-200">
          Uploaded at: {uploadedAt}
        </div>

        {/* Content */}
        <div className="p-6 flex justify-center items-center overflow-auto max-h-[70vh]">
          {proof.fileType === "pdf" || proof.fileUrl.endsWith(".pdf") ? (
            <iframe
              src={proof.fileUrl}
              className="w-full h-[70vh] rounded-md border border-gray-200"
              title="Proof"
            ></iframe>
          ) : (
            <img
              src={proof.fileUrl}
              alt="Proof"
              className="max-h-[70vh] w-auto rounded-md shadow-md"
            />
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-gray-300 px-6 py-3 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProofModal;

// import React from "react";
// import { IoMdDownload } from "react-icons/io";
// import { format } from "date-fns"; 
// function ProofModal({ isOpen, proof, onClose }) {
//   if (!isOpen || !proof) return null;

//   // Format timestamp nicely, fallback to unknown
//   const uploadedAt = proof.uploadedAt
//     ? format(new Date(proof.uploadedAt), "PPPpp") // e.g., Sep 1, 2025, 3:45 PM
//     : "Unknown";
//   const handleDownload = async () => {
//     try {
//       const response = await fetch(proof.fileUrl);
//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", proof.fileUrl.split("/").pop());
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       window.URL.revokeObjectURL(url);
//     } catch (err) {
//       console.error("Download failed:", err);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full relative overflow-hidden">
//         {/* Header */}
//         <div className="flex items-center justify-between border-b border-gray-300 px-6 py-3 bg-gray-50">
//           <h2 className="text-lg font-semibold text-gray-800">
//             Proof Document
//           </h2>
//           <div className="flex items-center space-x-4">
//             {/* Download Button */}
//             <button
//               onClick={handleDownload}
//               className="text-gray-600 hover:text-gray-900 text-xl"
//               title="Download Proof"
//             >
//               <IoMdDownload />
//             </button>

//             {/* Close Button */}
//             <button
//               className="text-gray-600 hover:text-gray-900 text-2xl font-bold"
//               onClick={onClose}
//             >
//               &times;
//             </button>
//           </div>
//         </div>

//         {/* Timestamp */}
//         <div className="px-6 py-2 text-sm text-gray-500 border-b border-gray-200">
//           Uploaded at: {uploadedAt}
//         </div>

//         {/* Content */}
//         <div className="p-6 flex justify-center items-center overflow-auto max-h-[70vh]">
//           {proof.fileType === "pdf" || proof.fileUrl.endsWith(".pdf") ? (
//             <iframe
//               src={proof.fileUrl}
//               className="w-full h-[70vh] rounded-md border border-gray-200"
//               title="Proof"
//             ></iframe>
//           ) : (
//             <img
//               src={proof.fileUrl}
//               alt="Proof"
//               className="max-h-[70vh] w-auto rounded-md shadow-md"
//             />
//           )}
//         </div>

//         {/* Footer */}
//         <div className="flex justify-end border-t border-gray-300 px-6 py-3 bg-gray-50">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ProofModal;

