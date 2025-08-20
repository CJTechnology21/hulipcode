import React, { useState } from "react";
import Button from "../../../../components/Button";
import Input from "../../../../components/Input";
import axios from "axios";

function PhotoModal({ isOpen, onClose, addPhoto }) {
  const [file, setFile] = useState(null);
  const [projectName, setProjectName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file to upload");
      return;
    }
    if (!projectName) {
      setError("Please enter a project name");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("projectName", projectName);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      addPhoto(res.data.url); // pass S3 URL to parent
      setFile(null);
      setProjectName("");
      onClose();
    } catch (err) {
      console.error("Upload error:", err);
      setError("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-80">
        <h3 className="font-semibold text-gray-800 mb-4">Add Project Photo</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="text"
            placeholder="Project Name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
          />
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="custom"
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="custom"
              type="submit"
              className={`px-4 py-2 rounded text-white ${
                loading ? "bg-gray-400" : "bg-red-500 hover:bg-red-600"
              }`}
              disabled={loading}
            >
              {loading ? "Uploading..." : "Add"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PhotoModal;

// import React, { useState } from "react";
// import Button from "../../../../components/Button";
// import Input from "../../../../components/Input";
// import axios from "axios";

// function PhotoModal({ isOpen, onClose, addPhoto }) {
//   const [file, setFile] = useState(null);
//   // eslint-disable-next-line
//   const [loading, setLoading] = useState(false);
//   // eslint-disable-next-line
//   const [error, setError] = useState("");
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!file) return;

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const res = await axios.post(
//         "http://localhost:5000/api/upload",
//         formData,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//         }
//       );

//       addPhoto(res.data.url); // pass S3 URL to parent
//       setFile(null);
//       onClose();
//     } catch (err) {
//       console.error("Upload error:", err);
//       alert("Upload failed");
//     }
//   };
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//       <div className="bg-white p-6 rounded-xl w-80">
//         <h3 className="font-semibold text-gray-800 mb-4">Add Project Photo</h3>
//         <form onSubmit={handleSubmit} className="space-y-3">
//           <Input
//             type="file"
//             accept="image/*"
//             onChange={(e) => setFile(e.target.files[0])}
//             required
//           />

//           {error && <p className="text-red-500 text-sm">{error}</p>}

//           <div className="flex justify-end gap-2 mt-4">
//             <Button
//               variant="custom"
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 bg-gray-300 rounded"
//               disabled={loading}
//             >
//               Cancel
//             </Button>
//             <Button
//               variant="custom"
//               type="submit"
//               className={`px-4 py-2 rounded text-white ${
//                 loading ? "bg-gray-400" : "bg-red-500 hover:bg-red-600"
//               }`}
//               disabled={loading}
//             >
//               {loading ? "Uploading..." : "Add"}
//             </Button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default PhotoModal;
