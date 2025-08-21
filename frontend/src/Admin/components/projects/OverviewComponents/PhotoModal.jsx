import React, { useState } from "react";
import Button from "../../../../components/Button";
import Input from "../../../../components/Input";
import { toast } from "react-toastify";
import {
  generateUploadURL as apiGenerateUploadURL,
  addProjectPhoto as apiAddProjectPhoto,
} from "../../../../services/overViewServices";

function PhotoModal({ isOpen, onClose, addPhoto, projectId }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // Upload file to S3 via backend-generated signed URL
  const uploadToS3 = async (file) => {
    try {
      // 1️⃣ Generate signed URL from backend
      const { uploadUrl, url } = await apiGenerateUploadURL(file.name, file.type);
      console.log("DEBUG - Presigned URL:", uploadUrl);
      console.log("DEBUG - Final file URL:", url);

      // 2️⃣ Upload file to S3
      await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      return url; // Return public URL
    } catch (error) {
      console.error("DEBUG - S3 upload failed:", error);
      toast.error("Failed to upload file to S3");
      return null;
    }
  };

  // Handle upload & save to DB
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please select a file");
    if (!projectId) return toast.error("Project ID is missing");

    setLoading(true);

    try {
      const fileUrl = await uploadToS3(file);
      if (!fileUrl) return setLoading(false);

      // Save photo record in DB via backend
      const data = await apiAddProjectPhoto(projectId, fileUrl);
      console.log("DEBUG - Response from server:", data);

      if (data.photo) {
        addPhoto(fileUrl);
        toast.success("Photo added successfully!");
        onClose();
      } else {
        toast.error(data.error || "Failed to add photo");
      }
    } catch (error) {
      console.error("DEBUG - Upload error:", error);
      toast.error("An error occurred while uploading");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-80">
        <h3 className="font-semibold text-gray-800 mb-4">Add Project Photo</h3>
        <form onSubmit={handleUpload} className="space-y-3">
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
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
              {loading ? "Uploading..." : "Upload"}
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
// import { toast } from "react-toastify";

// function PhotoModal({ isOpen, onClose, addPhoto, projectId }) {
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);

//   if (!isOpen) return null;

//   // Upload file to S3 via backend-generated signed URL
//   const uploadToS3 = async (file) => {
//     try {
//       const { data } = await axios.post(
//         "http://localhost:5000/api/photo/generate-upload-url",
//         { fileName: file.name, fileType: file.type }
//       );

//       const { uploadUrl, url } = data;
//       console.log("DEBUG - Presigned URL:", uploadUrl);
//       console.log("DEBUG - Final file URL:", url);

//       // PUT file to S3
//       await axios.put(uploadUrl, file, { headers: { "Content-Type": file.type } });

//       return url; // return public URL
//     } catch (error) {
//       console.error("DEBUG - S3 upload failed:", error);
//       toast.error("Failed to upload file to S3");
//       return null;
//     }
//   };

//   // Handle upload & save to DB
//   const handleUpload = async (e) => {
//     e.preventDefault();
//     if (!file) return toast.error("Please select a file");
//     if (!projectId) return toast.error("Project ID is missing");

//     setLoading(true);

//     try {
//       const fileUrl = await uploadToS3(file);

//       if (!fileUrl) return setLoading(false);

//       const payload = { projectId: projectId.trim(), url: fileUrl.trim() };

//       const response = await fetch("http://localhost:5000/api/photo/add-photo", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const data = await response.json();
//       console.log("DEBUG - Response from server:", data);

//       if (response.ok && data.photo) {
//         addPhoto(fileUrl);
//         toast.success("Photo added successfully!");
//         onClose();
//       } else {
//         toast.error(data.error || "Failed to add photo");
//       }
//     } catch (error) {
//       console.error("DEBUG - Upload error:", error);
//       toast.error("An error occurred while uploading");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//       <div className="bg-white p-6 rounded-xl w-80">
//         <h3 className="font-semibold text-gray-800 mb-4">Add Project Photo</h3>
//         <form onSubmit={handleUpload} className="space-y-3">
//           <Input
//             type="file"
//             accept="image/*"
//             onChange={(e) => setFile(e.target.files[0])}
//             required
//           />
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
//               {loading ? "Uploading..." : "Upload"}
//             </Button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default PhotoModal;
